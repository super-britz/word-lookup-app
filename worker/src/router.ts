import { initTRPC } from '@trpc/server'
import { z } from 'zod'
import type { LookupWordResult } from '../../shared/word'

type AiProvider = 'openrouter' | 'deepseek' | 'openai'

export interface WorkerEnv {
  OPENROUTER_API_KEY?: string
  DEEPSEEK_API_KEY?: string
  OPENAI_API_KEY?: string
}

export interface WorkerContext {
  env: WorkerEnv
}

const t = initTRPC.context<WorkerContext>().create()

const buildMockResult = (query: string): LookupWordResult => ({
  id: `${query.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`,
  word: query,
  phonetic: '/ˈwɜːd/',
  translation: `“${query}” 的示例释义（未配置 AI Key，当前为演示数据）`,
  definition: `${query} is returned by the Cloudflare Worker mock dictionary response.`,
  etymology: `Generated locally for ${query}. Configure OPENROUTER_API_KEY, DEEPSEEK_API_KEY, or OPENAI_API_KEY to use a real model.`,
  examples: [
    `I searched for the word "${query}" from the Pages frontend.`,
    `This response is served by a Cloudflare Worker through tRPC.`,
    `You can replace this mock with DeepSeek or OpenAI by setting secrets.`,
  ],
  source: 'mock',
})

const callAiProvider = async (
  provider: AiProvider,
  apiKey: string,
  query: string,
): Promise<LookupWordResult | null> => {
  const endpoint =
    provider === 'openrouter'
      ? 'https://openrouter.ai/api/v1/chat/completions'
      : provider === 'deepseek'
      ? 'https://api.deepseek.com/chat/completions'
      : 'https://api.openai.com/v1/chat/completions'

  const model =
    provider === 'openrouter'
      ? 'deepseek/deepseek-chat'
      : provider === 'deepseek'
      ? 'deepseek-chat'
      : 'gpt-4o-mini'

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
      ...(provider === 'openrouter'
        ? {
            'HTTP-Referer': 'https://pages.liangsheng.life',
            'X-Title': 'word-lookup-app',
          }
        : {}),
    },
    body: JSON.stringify({
      model,
      temperature: 0.2,
      response_format: { type: 'json_object' },
      messages: [
        {
          role: 'system',
          content:
            'You are a dictionary assistant. Return strict JSON with keys: word, phonetic, translation, definition, etymology, examples. examples must be an array of 3 short strings.',
        },
        {
          role: 'user',
          content: `Explain the English word "${query}" in Chinese for a word lookup app.`,
        },
      ],
    }),
  })

  if (!response.ok) {
    throw new Error(`${provider} request failed with ${response.status}`)
  }

  const data = (await response.json()) as {
    choices?: Array<{ message?: { content?: string } }>
  }
  const content = data.choices?.[0]?.message?.content
  if (!content) {
    return null
  }

  const parsed = JSON.parse(content) as Partial<LookupWordResult>
  return {
    id: `${query.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`,
    word: parsed.word || query,
    phonetic: parsed.phonetic || '/ˈwɜːd/',
    translation: parsed.translation || `${query} 的释义`,
    definition: parsed.definition || `${query} definition`,
    etymology: parsed.etymology,
    examples:
      parsed.examples?.filter((item): item is string => typeof item === 'string').slice(0, 3) || [],
    source: provider,
  }
}

const lookupWord = async (env: WorkerEnv, query: string): Promise<LookupWordResult> => {
  try {
    if (env.OPENROUTER_API_KEY) {
      const result = await callAiProvider('openrouter', env.OPENROUTER_API_KEY, query)
      if (result) {
        return result
      }
    }

    if (env.DEEPSEEK_API_KEY) {
      const result = await callAiProvider('deepseek', env.DEEPSEEK_API_KEY, query)
      if (result) {
        return result
      }
    }

    if (env.OPENAI_API_KEY) {
      const result = await callAiProvider('openai', env.OPENAI_API_KEY, query)
      if (result) {
        return result
      }
    }
  } catch (error) {
    console.error('AI lookup failed', error)
  }

  return buildMockResult(query)
}

export const appRouter = t.router({
  healthcheck: t.procedure.query(() => ({
    ok: true,
    service: 'word-lookup-api',
    timestamp: new Date().toISOString(),
  })),
  word: t.router({
    lookup: t.procedure
      .input(
        z.object({
          query: z.string().trim().min(1).max(50),
        }),
      )
      .query(async ({ input, ctx }) => lookupWord(ctx.env, input.query)),
  }),
})

export type AppRouter = typeof appRouter
