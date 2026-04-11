/*
  Castlexpert — panel administrativo (PostgreSQL en Supabase)

  Tablas:
  - admin_profiles: usuarios que ingresaron (Google o VIP/email vía Auth)
  - admin_vip_credentials: excepciones VIP (correo + password_hash bcrypt). Sin acceso desde anon/authenticated.
  - admin_login_audit: bitácora de intentos de acceso
  - apk_systems_master: catálogo maestro de APK/sistemas
  - apk_download_events: eventos de descarga
  - apk_system_user_registry: usuarios por sistema APK (sincronización futura)
  - apk_sync_audit: auditoría de eventos desde apps/API

  Importante:
  1) Crear en Supabase Auth (Authentication → Users) un usuario con correo castlexpertcr@gmail.com
     y contraseña castleX (misma que valida el backend contra admin_vip_credentials).
  2) Habilitar proveedor Google en Authentication → Providers.
*/

CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS WAdmin.admin_profiles (
  user_id uuid PRIMARY KEY REFERENCES auth.users (id) ON DELETE CASCADE,
  email text NOT NULL,
  display_name text NOT NULL DEFAULT '',
  login_method text NOT NULL CHECK (login_method IN ('google', 'vip')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS admin_profiles_email_idx ON WAdmin.admin_profiles (email);
CREATE INDEX IF NOT EXISTS admin_profiles_login_method_idx ON WAdmin.admin_profiles (login_method);

CREATE TABLE IF NOT EXISTS WAdmin.admin_vip_credentials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL UNIQUE,
  password_hash text NOT NULL,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS WAdmin.admin_login_audit (
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

CREATE INDEX IF NOT EXISTS admin_login_audit_created_idx ON WAdmin.admin_login_audit (created_at DESC);
CREATE INDEX IF NOT EXISTS admin_login_audit_email_idx ON WAdmin.admin_login_audit (email_attempt);

CREATE TABLE IF NOT EXISTS WAdmin.apk_systems_master (
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

CREATE TABLE IF NOT EXISTS WAdmin.apk_download_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  apk_system_id uuid NOT NULL REFERENCES WAdmin.apk_systems_master (id) ON DELETE CASCADE,
  admin_profile_user_id uuid REFERENCES WAdmin.admin_profiles (user_id) ON DELETE SET NULL,
  external_user_ref text,
  visitor_fingerprint text,
  ip_address text,
  user_agent text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS apk_download_events_system_idx ON WAdmin.apk_download_events (apk_system_id);
CREATE INDEX IF NOT EXISTS apk_download_events_created_idx ON WAdmin.apk_download_events (created_at DESC);

CREATE TABLE IF NOT EXISTS WAdmin.apk_system_user_registry (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  apk_system_id uuid NOT NULL REFERENCES WAdmin.apk_systems_master (id) ON DELETE CASCADE,
  external_user_id text NOT NULL,
  display_label text DEFAULT '',
  admin_profile_user_id uuid REFERENCES WAdmin.admin_profiles (user_id) ON DELETE SET NULL,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  first_seen_at timestamptz NOT NULL DEFAULT now(),
  last_seen_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (apk_system_id, external_user_id)
);

CREATE INDEX IF NOT EXISTS apk_system_user_registry_system_idx ON WAdmin.apk_system_user_registry (apk_system_id);

CREATE TABLE IF NOT EXISTS WAdmin.apk_sync_audit (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  apk_system_id uuid REFERENCES WAdmin.apk_systems_master (id) ON DELETE SET NULL,
  event_type text NOT NULL,
  payload jsonb NOT NULL DEFAULT '{}'::jsonb,
  source text NOT NULL DEFAULT 'app',
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS apk_sync_audit_created_idx ON WAdmin.apk_sync_audit (created_at DESC);
CREATE INDEX IF NOT EXISTS apk_sync_audit_system_idx ON WAdmin.apk_sync_audit (apk_system_id);

INSERT INTO WAdmin.admin_vip_credentials (email, password_hash, notes)
VALUES (
  'castlexpertcr@gmail.com',
  crypt('castleX', gen_salt('bf')),
  'Usuario VIP por defecto — crear el mismo usuario en Supabase Auth con esta contraseña'
)
ON CONFLICT (email) DO NOTHING;

CREATE OR REPLACE FUNCTION WAdmin.handle_admin_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  method text;
BEGIN
  IF COALESCE(NEW.raw_app_meta_data->'providers', '[]'::jsonb) ? 'google' THEN
    method := 'google';
  ELSE
    method := 'vip';
  END IF;

  INSERT INTO WAdmin.admin_profiles (user_id, email, display_name, login_method)
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
  EXECUTE PROCEDURE WAdmin.handle_admin_user();

ALTER TABLE WAdmin.admin_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE WAdmin.admin_vip_credentials ENABLE ROW LEVEL SECURITY;
ALTER TABLE WAdmin.admin_login_audit ENABLE ROW LEVEL SECURITY;
ALTER TABLE WAdmin.apk_systems_master ENABLE ROW LEVEL SECURITY;
ALTER TABLE WAdmin.apk_download_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE WAdmin.apk_system_user_registry ENABLE ROW LEVEL SECURITY;
ALTER TABLE WAdmin.apk_sync_audit ENABLE ROW LEVEL SECURITY;

CREATE POLICY "admin_profiles_select_authenticated"
  ON WAdmin.admin_profiles
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "admin_profiles_update_own"
  ON WAdmin.admin_profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "admin_login_audit_select_authenticated"
  ON WAdmin.admin_login_audit
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "admin_login_audit_insert_authenticated"
  ON WAdmin.admin_login_audit
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id IS NULL OR user_id = auth.uid());

CREATE POLICY "apk_systems_master_all_authenticated"
  ON WAdmin.apk_systems_master
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "apk_download_events_all_authenticated"
  ON WAdmin.apk_download_events
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "apk_system_user_registry_all_authenticated"
  ON WAdmin.apk_system_user_registry
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "apk_sync_audit_all_authenticated"
  ON WAdmin.apk_sync_audit
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE OR REPLACE FUNCTION WAdmin.list_admin_vip_directory()
RETURNS TABLE (id uuid, email text, notes text, created_at timestamptz)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT v.id, v.email, v.notes, v.created_at
  FROM WAdmin.admin_vip_credentials v;
$$;

GRANT EXECUTE ON FUNCTION WAdmin.list_admin_vip_directory() TO authenticated;
