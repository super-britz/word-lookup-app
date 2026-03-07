import { fetchRequestHandler } from '@trpc/server/adapters/fetch'
import { appRouter, type WorkerEnv } from './router'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'content-type, authorization, x-trpc-source',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
}

export default {
  async fetch(request: Request, env: WorkerEnv): Promise<Response> {
    const url = new URL(request.url)

    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders })
    }

    if (url.pathname === '/' || url.pathname === '/health') {
      return new Response(
        JSON.stringify({
          ok: true,
          service: 'word-lookup-api',
          hasOpenRouterKey: Boolean(env.OPENROUTER_API_KEY),
          hasDeepSeekKey: Boolean(env.DEEPSEEK_API_KEY),
          hasOpenAIKey: Boolean(env.OPENAI_API_KEY),
        }),
        {
        headers: {
          'content-type': 'application/json',
          ...corsHeaders,
        },
      },
      )
    }

    if (url.pathname.startsWith('/trpc')) {
      const response = await fetchRequestHandler({
        endpoint: '/trpc',
        req: request,
        router: appRouter,
        createContext: () => ({ env }),
      })

      const headers = new Headers(response.headers)
      Object.entries(corsHeaders).forEach(([key, value]) => headers.set(key, value))

      return new Response(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers,
      })
    }

    return new Response('Not found', { status: 404, headers: corsHeaders })
  },
}
