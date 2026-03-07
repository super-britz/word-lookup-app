export interface LookupWordInput {
  query: string
}

export interface LookupWordResult {
  id: string
  word: string
  phonetic: string
  translation: string
  definition: string
  etymology?: string
  examples: string[]
  source: 'mock' | 'openrouter' | 'deepseek' | 'openai'
}
