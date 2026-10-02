import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import { CircularStrengthMeter } from './CircularStrengthMeter'
import { analyzePassword } from '../utils/passwordAnalyzer'

const samplePasswords = [
  'abc',
  'abc123',
  'Aa123456!',
  'Correct-Horse-Battery-Staple-2026!LongUnique',
]

describe('circular strength meter', () => {
  it.each(samplePasswords)('renders aligned score-driven progress for %s', (password) => {
    const analysis = analyzePassword(password)
    const markup = renderToStaticMarkup(
      <CircularStrengthMeter
        score={analysis.score}
        strength={analysis.strengthLabel}
        hasPassword
      />,
    )
    const circles = [...markup.matchAll(/<circle\b[^>]*>/g)].map(([circle]) => circle)
    const progressCircle = circles.find((circle) => circle.includes('circular-meter-progress'))
    const circumference = 2 * Math.PI * 100
    const expectedOffset = circumference - (analysis.score / 100) * circumference

    expect([...markup.matchAll(/<svg\b[^>]*class="circular-meter-svg"/g)]).toHaveLength(1)
    expect(circles).toHaveLength(2)
    for (const circle of circles) {
      expect(circle).toContain('cx="120" cy="120" r="100"')
    }
    expect(progressCircle).toContain(`stroke-dasharray="${circumference}"`)
    expect(progressCircle).toContain(`stroke-dashoffset="${expectedOffset}"`)
    expect(progressCircle).toContain('transform="rotate(-90 120 120)"')
    expect(markup).toContain(`aria-valuenow="${analysis.score}"`)
    expect(markup).toContain(`>${analysis.score}</div>`)
  })
})