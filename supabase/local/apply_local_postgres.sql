/*
  LEGACY / REFERENCIA — El proyecto en producción usa SQLite vía WebAdministrativo/server.
  No ejecutar salvo que mantengas un Postgres aparte.

  Aplicar en PostgreSQL local (no es copia 1:1 de Supabase Cloud).
  - Crea roles anon / authenticated (como Supabase).
  - Esquema auth + tabla auth.users mínima (FKs y trigger del panel).
  - auth.uid() stub para políticas RLS.
  - Esquema "WAdmin" (debe coincidir con el que creaste; usa comillas).
  - Tablas públicas del sitio (visits, contact_messages).

  Uso (PowerShell):
    $env:PGPASSWORD='tu_password'
    psql -h localhost -p 5432 -U postgres -d postgres -v ON_ERROR_STOP=1 -f supabase/local/apply_local_postgres.sql

*/

CREATE EXTENSION IF NOT EXISTS pgcrypto;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'anon') THEN
    CREATE ROLE anon NOLOGIN;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'authenticated') THEN
    CREATE ROLE authenticated NOLOGIN;
  END IF;
END
$$;

CREATE SCHEMA IF NOT EXISTS auth;

CREATE TABLE IF NOT EXISTS auth.users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  instance_id uuid,
  email text,
  encrypted_password text,
  email_confirmed_at timestamptz,
  raw_app_meta_data jsonb NOT NULL DEFAULT '{}'::jsonb,
  raw_user_meta_data jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE OR REPLACE FUNCTION auth.uid()
RETURNS uuid
LANGUAGE sql
STABLE
AS $$
  SELECT COALESCE(
    NULLIF(current_setting('request.jwt.claim.sub', true), '')::uuid,
    NULL::uuid
  );
$$;

-- Sitio público (misma migración que en Supabase, esquema public)
CREATE TABLE IF NOT EXISTS public.visits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.contact_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  message text NOT NULL,
  created_at timestamptz DEFAULT now(),
  read boolean DEFAULT false
);

ALTER TABLE public.visits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can insert visits" ON public.visits;
DROP POLICY IF EXISTS "Anyone can view visit count" ON public.visits;
DROP POLICY IF EXISTS "Anyone can insert contact messages" ON public.contact_messages;
DROP POLICY IF EXISTS "Authenticated users can view contact messages" ON public.contact_messages;
DROP POLICY IF EXISTS "Authenticated users can update contact messages" ON public.contact_messages;

CREATE POLICY "Anyone can insert visits"
  ON public.visits FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "Anyone can view visit count"
  ON public.visits FOR SELECT TO anon USING (true);

CREATE POLICY "Anyone can insert contact messages"
  ON public.contact_messages FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "Authenticated users can view contact messages"
  ON public.contact_messages FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated users can update contact messages"
  ON public.contact_messages FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT SELECT, INSERT ON public.visits TO anon;
GRANT SELECT, INSERT ON public.contact_messages TO anon;
GRANT SELECT, UPDATE ON public.contact_messages TO authenticated;

-- Panel administrativo en "WAdmin"
CREATE TABLE IF NOT EXISTS "WAdmin".admin_profiles (
  user_id uuid PRIMARY KEY REFERENCES auth.users (id) ON DELETE CASCADE,
  email text NOT NULL,
  display_name text NOT NULL DEFAULT '',
  login_method text NOT NULL CHECK (login_method IN ('google', 'vip')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS admin_profiles_email_idx ON "WAdmin".admin_profiles (email);
CREATE INDEX IF NOT EXISTS admin_profiles_login_method_idx ON "WAdmin".admin_profiles (login_method);

CREATE TABLE IF NOT EXISTS "WAdmin".admin_vip_credentials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL UNIQUE,
  password_hash text NOT NULL,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS "WAdmin".admin_login_audit (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users (id) ON DELETE SET NULL,
  email_attempt text NOT NULL,
  login_method text NOT NULL CHECK (login_method IN ('google', 'vip', 'unknown')),
  success boolean NOT NULL DEFAULT false,
  ip_address text,
  user_agent text,
  detail text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS admin_login_audit_created_idx ON "WAdmin".admin_login_audit (created_at DESC);
CREATE INDEX IF NOT EXISTS admin_login_audit_email_idx ON "WAdmin".admin_login_audit (email_attempt);

CREATE TABLE IF NOT EXISTS "WAdmin".apk_systems_master (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  name text NOT NULL,
  description text DEFAULT '',
  version_label text DEFAULT '',
  download_url text,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS "WAdmin".apk_download_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  apk_system_id uuid NOT NULL REFERENCES "WAdmin".apk_systems_master (id) ON DELETE CASCADE,
  admin_profile_user_id uuid REFERENCES "WAdmin".admin_profiles (user_id) ON DELETE SET NULL,
  external_user_ref text,
  visitor_fingerprint text,
  ip_address text,
  user_agent text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS apk_download_events_system_idx ON "WAdmin".apk_download_events (apk_system_id);
CREATE INDEX IF NOT EXISTS apk_download_events_created_idx ON "WAdmin".apk_download_events (created_at DESC);

CREATE TABLE IF NOT EXISTS "WAdmin".apk_system_user_registry (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  apk_system_id uuid NOT NULL REFERENCES "WAdmin".apk_systems_master (id) ON DELETE CASCADE,
  external_user_id text NOT NULL,
  display_label text DEFAULT '',
  admin_profile_user_id uuid REFERENCES "WAdmin".admin_profiles (user_id) ON DELETE SET NULL,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  first_seen_at timestamptz NOT NULL DEFAULT now(),
  last_seen_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (apk_system_id, external_user_id)
);

CREATE INDEX IF NOT EXISTS apk_system_user_registry_system_idx ON "WAdmin".apk_system_user_registry (apk_system_id);

CREATE TABLE IF NOT EXISTS "WAdmin".apk_sync_audit (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  apk_system_id uuid REFERENCES "WAdmin".apk_systems_master (id) ON DELETE SET NULL,
  event_type text NOT NULL,
  payload jsonb NOT NULL DEFAULT '{}'::jsonb,
  source text NOT NULL DEFAULT 'app',
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS apk_sync_audit_created_idx ON "WAdmin".apk_sync_audit (created_at DESC);
CREATE INDEX IF NOT EXISTS apk_sync_audit_system_idx ON "WAdmin".apk_sync_audit (apk_system_id);

INSERT INTO "WAdmin".admin_vip_credentials (email, password_hash, notes)
VALUES (
  'castlexpertcr@gmail.com',
  crypt('castleX', gen_salt('bf'::text)),
  'Usuario VIP por defecto — en Supabase Auth debe existir el mismo usuario.'
)
ON CONFLICT (email) DO NOTHING;

CREATE OR REPLACE FUNCTION "WAdmin".handle_admin_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, "WAdmin"
AS $$
DECLARE
  method text;
BEGIN
  IF COALESCE(NEW.raw_app_meta_data->'providers', '[]'::jsonb) ? 'google' THEN
    method := 'google';
  ELSE
    method := 'vip';
  END IF;

  INSERT INTO "WAdmin".admin_profiles (user_id, email, display_name, login_method)
  VALUES (
    NEW.id,
    COALESCE(NEW.email, ''),
    COALESCE(
      NULLIF(TRIM(NEW.raw_user_meta_data->>'full_name'), ''),
      NULLIF(TRIM(NEW.raw_user_meta_data->>'name'), ''),
      split_part(COALESCE(NEW.email, ''), '@', 1)
    ),
    method
  )
  ON CONFLICT (user_id) DO UPDATE SET
    email = EXCLUDED.email,
    display_name = EXCLUDED.display_name,
    login_method = EXCLUDED.login_method,
    updated_at = now();

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_admin_profile ON auth.users;
CREATE TRIGGER on_auth_user_admin_profile
  AFTER INSERT OR UPDATE OF email, raw_user_meta_data, raw_app_meta_data ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION "WAdmin".handle_admin_user();

ALTER TABLE "WAdmin".admin_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE "WAdmin".admin_vip_credentials ENABLE ROW LEVEL SECURITY;
ALTER TABLE "WAdmin".admin_login_audit ENABLE ROW LEVEL SECURITY;
ALTER TABLE "WAdmin".apk_systems_master ENABLE ROW LEVEL SECURITY;
ALTER TABLE "WAdmin".apk_download_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE "WAdmin".apk_system_user_registry ENABLE ROW LEVEL SECURITY;
ALTER TABLE "WAdmin".apk_sync_audit ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS admin_profiles_select_authenticated ON "WAdmin".admin_profiles;
DROP POLICY IF EXISTS admin_profiles_update_own ON "WAdmin".admin_profiles;
DROP POLICY IF EXISTS admin_login_audit_select_authenticated ON "WAdmin".admin_login_audit;
DROP POLICY IF EXISTS admin_login_audit_insert_authenticated ON "WAdmin".admin_login_audit;
DROP POLICY IF EXISTS apk_systems_master_all_authenticated ON "WAdmin".apk_systems_master;
DROP POLICY IF EXISTS apk_download_events_all_authenticated ON "WAdmin".apk_download_events;
DROP POLICY IF EXISTS apk_system_user_registry_all_authenticated ON "WAdmin".apk_system_user_registry;
DROP POLICY IF EXISTS apk_sync_audit_all_authenticated ON "WAdmin".apk_sync_audit;

CREATE POLICY admin_profiles_select_authenticated
  ON "WAdmin".admin_profiles FOR SELECT TO authenticated USING (true);

CREATE POLICY admin_profiles_update_own
  ON "WAdmin".admin_profiles FOR UPDATE TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY admin_login_audit_select_authenticated
  ON "WAdmin".admin_login_audit FOR SELECT TO authenticated USING (true);

CREATE POLICY admin_login_audit_insert_authenticated
  ON "WAdmin".admin_login_audit FOR INSERT TO authenticated
  WITH CHECK (user_id IS NULL OR user_id = auth.uid());

CREATE POLICY apk_systems_master_all_authenticated
  ON "WAdmin".apk_systems_master FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY apk_download_events_all_authenticated
  ON "WAdmin".apk_download_events FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY apk_system_user_registry_all_authenticated
  ON "WAdmin".apk_system_user_registry FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY apk_sync_audit_all_authenticated
  ON "WAdmin".apk_sync_audit FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE OR REPLACE FUNCTION "WAdmin".list_admin_vip_directory()
RETURNS TABLE (id uuid, email text, notes text, created_at timestamptz)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public, "WAdmin"
AS $$
  SELECT v.id, v.email, v.notes, v.created_at
  FROM "WAdmin".admin_vip_credentials v;
$$;

GRANT EXECUTE ON FUNCTION "WAdmin".list_admin_vip_directory() TO authenticated;

GRANT USAGE ON SCHEMA "WAdmin" TO authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA "WAdmin" TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA "WAdmin" TO authenticated;
