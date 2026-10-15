export const DEFAULT_OPENAI_MODEL = 'gpt-6-luna';

export function chatModel() {
  return process.env.OPENAI_MODEL?.trim() || DEFAULT_OPENAI_MODEL;
}

/** GPT-4 models reject reasoning_effort; GPT-6 Luna needs 'none' to allow temperature and Chat Completions tools. */
export function reasoningParams(model) {
  return /^gpt-4/i.test(model) ? {} : { reasoning_effort: 'none' };
}
