export type OpenRouterMessage = {
  role: 'system' | 'user' | 'assistant' | 'tool';
  content: string | Array<Record<string, unknown>>;
  tool_call_id?: string;
};

export type OpenRouterTool = {
  type: 'function';
  function: {
    name: string;
    description?: string;
    parameters: Record<string, unknown>;
  };
};

export type OpenRouterToolCall = {
  function?: {
    name?: string;
    arguments?: string;
  };
};

export type OpenRouterChatResponse = {
  choices?: Array<{
    message?: {
      content?: unknown;
      tool_calls?: OpenRouterToolCall[];
    };
  }>;
};

function getOpenRouterKey(): string {
  const key = process.env.OPENROUTER_API_KEY;
  if (!key) throw new Error('Missing OPENROUTER_API_KEY');
  return key;
}

export function getFreeModel(envVar: string | undefined, fallback: string): string {
  const model = envVar || fallback;
  if (model !== 'openrouter/free' && !model.endsWith(':free')) {
    throw new Error(`Model must be free-only (openrouter/free or :free). Got: ${model}`);
  }
  return model;
}

export async function openRouterChat(input: {
  model: string;
  messages: OpenRouterMessage[];
  max_tokens?: number;
  temperature?: number;
  tools?: OpenRouterTool[];
  tool_choice?: 'auto' | 'none';
}): Promise<OpenRouterChatResponse> {
  const apiKey = getOpenRouterKey();

  const resp = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': 'https://localhost',
      'X-Title': 'platform-openrouter',
    },
    body: JSON.stringify(input),
  });

  const text = await resp.text();
  let json: unknown = null;
  try {
    json = JSON.parse(text);
  } catch {
    // no-op
  }

  if (!resp.ok) {
    throw new Error(`OpenRouter error ${resp.status}: ${text}`);
  }

  if (!json || typeof json !== 'object') {
    throw new Error('OpenRouter returned non-object response');
  }

  return json as OpenRouterChatResponse;
}

export function extractOpenRouterText(content: unknown): string {
  if (typeof content === 'string') return content;
  if (!Array.isArray(content)) return '';

  return content
    .map((part) => {
      if (!part || typeof part !== 'object') return '';
      const withText = part as { text?: unknown };
      return typeof withText.text === 'string' ? withText.text : '';
    })
    .join('\n')
    .trim();
}
