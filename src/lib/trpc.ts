import { createTRPCProxyClient, httpBatchLink } from '@trpc/client'
import type { AppRouter } from '../../worker/src/router'

const apiBaseUrl = (import.meta.env.VITE_API_BASE_URL as string | undefined) || 'https://api.liangsheng.life'

export const trpc = createTRPCProxyClient<AppRouter>({
  links: [
    httpBatchLink({
      url: `${apiBaseUrl}/trpc`,
    }),
  ],
})
