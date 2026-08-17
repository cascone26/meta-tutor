import { TriviaQuestion } from '../trivia-types'
import { GEOGRAPHY_QUESTIONS } from './geography'
import { HISTORY_QUESTIONS } from './history'
import { SCIENCE_QUESTIONS } from './science'
import { MOVIES_TV_QUESTIONS } from './movies-tv'
import { MUSIC_QUESTIONS } from './music'
import { SPORTS_QUESTIONS } from './sports'
import { LITERATURE_QUESTIONS } from './literature'
import { FOOD_DRINK_QUESTIONS } from './food-drink'
import { ART_QUESTIONS } from './art'
import { POP_CULTURE_QUESTIONS } from './pop-culture'
import { MYTHOLOGY_QUESTIONS } from './mythology'
import { PRESIDENTS_QUESTIONS } from './presidents'

export const QUESTION_BANK: TriviaQuestion[] = [
  ...GEOGRAPHY_QUESTIONS,
  ...HISTORY_QUESTIONS,
  ...SCIENCE_QUESTIONS,
  ...MOVIES_TV_QUESTIONS,
  ...MUSIC_QUESTIONS,
  ...SPORTS_QUESTIONS,
  ...LITERATURE_QUESTIONS,
  ...FOOD_DRINK_QUESTIONS,
  ...ART_QUESTIONS,
  ...POP_CULTURE_QUESTIONS,
  ...MYTHOLOGY_QUESTIONS,
  ...PRESIDENTS_QUESTIONS,
]

export function getFullQuestionBank(): TriviaQuestion[] {
  return [...QUESTION_BANK]
}

export function getQuestionsByCategory(category: string): TriviaQuestion[] {
  const bank = getFullQuestionBank()
  if (category === 'all') return bank
  return bank.filter(q => q.category === category)
}

export function getRandomQuestions(count: number, category: string = 'all', excludeIds: string[] = []): TriviaQuestion[] {
  const bank = getFullQuestionBank()
  let pool = category === 'all' ? [...bank] : bank.filter(q => q.category === category)
  pool = pool.filter(q => !excludeIds.includes(q.id))

  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]]
  }

  return pool.slice(0, count)
}

export function getCategoryCounts(): Record<string, { total: number; available: number }> {
  const bank = getFullQuestionBank()
  const counts: Record<string, { total: number; available: number }> = {}
  counts['all'] = { total: bank.length, available: bank.length }
  const categories = new Set(bank.map(q => q.category))
  categories.forEach(cat => {
    const catQuestions = bank.filter(q => q.category === cat)
    counts[cat] = { total: catQuestions.length, available: catQuestions.length }
  })
  return counts
}

export function shuffleArray<T>(arr: T[]): T[] {
  const shuffled = [...arr]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}
