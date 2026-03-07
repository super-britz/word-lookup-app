import type { LookupWordResult } from '../../shared/word'
import type { Word } from '../store/useAppStore'

export const toWord = (result: LookupWordResult): Word => ({
  id: result.id,
  word: result.word,
  phonetic: result.phonetic,
  translation: result.translation,
  definition: result.definition,
  etymology: result.etymology,
  examples: result.examples,
  addedAt: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
  reviewCount: 0,
  inVocabulary: false,
})
