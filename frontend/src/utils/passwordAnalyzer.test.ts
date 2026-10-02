import { describe, expect, it } from 'vitest'
import { analyzePassword } from './passwordAnalyzer'

describe('password analyzer', () => {
  it('returns a weak result for empty input', () => {
    const result = analyzePassword('')

    expect(result.score).toBe(0)
    expect(result.strengthLabel).toBe('Very Weak')
  })

  it('detects common passwords', () => {
    const result = analyzePassword('password')

    expect(result.isCommonPassword).toBe(true)
    expect(result.strengthLabel).toBe('Very Weak')
  })

  it('detects repeated characters', () => {
    const result = analyzePassword('aaaaaaaaaaaa')

    expect(result.patternChecks.detected).toBe(true)
  })

  it('scores long unpredictable passwords higher', () => {
    const result = analyzePassword('Correct-Horse-Battery-Staple-2026!')

    expect(result.score).toBeGreaterThan(60)
    expect(result.strengthLabel).not.toBe('Very Weak')
  })

  it('stores requirement checks for the UI', () => {
    const result = analyzePassword('Password123!')

    expect(result.requirements.some((item) => item.label === 'Contains number' && item.passed)).toBe(true)
    expect(result.requirements.some((item) => item.label === 'Contains special character' && item.passed)).toBe(true)
  })
})
