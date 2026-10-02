import { ZxcvbnFactory } from '@zxcvbn-ts/core'
import * as zxcvbnCommon from '@zxcvbn-ts/language-common'
import * as zxcvbnEn from '@zxcvbn-ts/language-en'

const zxcvbn = new ZxcvbnFactory({
  dictionary: {
    ...zxcvbnCommon.dictionary,
    ...zxcvbnEn.dictionary,
  },
  graphs: zxcvbnCommon.adjacencyGraphs,
  translations: zxcvbnEn.translations,
})

const scoreMap = [12, 30, 46, 74, 94]

export interface PasswordAnalysisResult {
  password: string
  score: number
  strengthLabel: string
  rawScore: number
  length: number
  entropy: number
  guesses: number
  guessLabel: string
  description: string
  suggestions: string[]
  isCommonPassword: boolean
  patternChecks: {
    detected: boolean
    message: string
  }
  characterChecks: {
    count: number
    score: number
  }
  requirements: Array<{ label: string; passed: boolean }>
}

export function getStrengthLabel(score: number): string {
  const labels = ['Very Weak', 'Weak', 'Fair', 'Strong', 'Very Strong']
  return labels[Math.min(score, labels.length - 1)]
}

function getRequirementChecks(password: string) {
  const lengthOk = password.length >= 8
  const recommendedLength = password.length >= 12
  const upper = /[A-Z]/.test(password)
  const lower = /[a-z]/.test(password)
  const number = /\d/.test(password)
  const special = /[^A-Za-z0-9]/.test(password)
  const noRepeats = !/(.)\1{2,}/.test(password)
  const noSequence = !/(?:012|123|234|345|456|567|678|789|abc|bcd|cde|def|efg|fgh|ghi|hij|ijk|jkl|klm|lmn|mno|nop|opq|pqr|qrs|rst|stu|tuv|uvw|vwx|wxy|xyz|qwerty|asdf|zxcvbn|password)/i.test(password)

  return [
    { label: 'At least 8 characters', passed: lengthOk },
    { label: 'At least 12 characters recommended', passed: recommendedLength },
    { label: 'Contains uppercase letter', passed: upper },
    { label: 'Contains lowercase letter', passed: lower },
    { label: 'Contains number', passed: number },
    { label: 'Contains special character', passed: special },
    { label: 'No excessive repetition', passed: noRepeats },
    { label: 'No obvious sequence', passed: noSequence },
    { label: 'Not a common password', passed: !/^(password|123456|123456789|qwerty|welcome|admin|letmein|monkey)$/i.test(password) },
  ]
}

export function analyzePassword(password: string): PasswordAnalysisResult {
  const trimmed = password.trim()

  if (!trimmed) {
    return {
      password,
      score: 0,
      strengthLabel: 'Very Weak',
      rawScore: 0,
      length: 0,
      entropy: 0,
      guesses: 0,
      guessLabel: 'Very low',
      description: 'No password entered',
      suggestions: ['Add a longer password with more unpredictability.'],
      isCommonPassword: false,
      patternChecks: {
        detected: false,
        message: 'No password provided.',
      },
      characterChecks: {
        count: 0,
        score: 0,
      },
      requirements: getRequirementChecks(''),
    }
  }

  const result = zxcvbn.check(trimmed)
  const rawScore = Math.min(result.score, 4)
  const score = Math.min(100, Math.max(0, scoreMap[rawScore]))

  const length = trimmed.length
  const hasUpper = /[A-Z]/.test(trimmed)
  const hasLower = /[a-z]/.test(trimmed)
  const hasNumber = /\d/.test(trimmed)
  const hasSymbol = /[^A-Za-z0-9]/.test(trimmed)
  const characterCount = [hasUpper, hasLower, hasNumber, hasSymbol].filter(Boolean).length

  const repeated = /(.)\1{2,}/.test(trimmed)
  const sequential = /(012|123|234|345|456|567|678|789|abc|bcd|cde|def|efg|fgh|ghi|hij|ijk|jkl|klm|lmn|mno|nop|opq|pqr|qrs|rst|stu|tuv|uvw|vwx|wxy|xyz|qwerty|asdf|zxcvbn)/i.test(trimmed)
  const isCommonPassword = /^(password|123456|123456789|qwerty|welcome|admin|letmein|monkey|dragon)$/i.test(trimmed)

  const patternDetected = repeated || sequential || Boolean(result.feedback?.warning)

  const entropy = Number.isFinite(result.guessesLog10) ? Math.round(3.3219 * result.guessesLog10) : Math.max(0, Math.round(length * 4))
  const guessLabel = entropy >= 90 ? 'Very high' : entropy >= 60 ? 'High' : entropy >= 40 ? 'Moderate' : 'Low'

  const suggestions = result.feedback?.suggestions?.length
    ? result.feedback.suggestions
    : [
        length < 12 ? 'Use a longer password with more unpredictability.' : 'Keep this password unique and avoid reusing it elsewhere.',
        repeated ? 'Avoid repeated characters and predictable patterns.' : 'Add one more unexpected word or symbol to improve strength.',
      ]

  return {
    password: trimmed,
    score,
    strengthLabel: getStrengthLabel(rawScore),
    rawScore,
    length,
    entropy,
    guesses: result.guesses,
    guessLabel,
    description:
      result.feedback?.warning ||
      'Score is an estimate based on password patterns and resistance to common guessing strategies.',
    suggestions,
    isCommonPassword,
    patternChecks: {
      detected: patternDetected,
      message: patternDetected ? 'Repeated or predictable patterns detected.' : 'No obvious patterns detected.',
    },
    characterChecks: {
      count: characterCount,
      score: characterCount,
    },
    requirements: getRequirementChecks(trimmed),
  }
}
