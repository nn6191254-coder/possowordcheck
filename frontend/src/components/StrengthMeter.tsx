interface StrengthMeterProps {
  percent: number
  strength: string
  score: number
  subtitle: string
}

const labelStyles = [
  'Very Weak',
  'Weak',
  'Fair',
  'Strong',
  'Very Strong',
]

export function StrengthMeter({ percent, strength, score, subtitle }: StrengthMeterProps) {
  const activeSegments = Math.round((percent / 100) * 5)

  return (
    <div className="panel strength-panel">
      <div className="score-header">
        <div>
          <div className="score-title">{score}</div>
          <div className="score-caption">Strength estimate</div>
        </div>
        <div className="score-status">{strength}</div>
      </div>

      <div className="meter-track" aria-label="Password meter">
        {Array.from({ length: 5 }).map((_, index) => {
          const isActive = index < activeSegments
          const className = [
            'meter-segment',
            isActive ? (score >= 3 ? 'active' : score >= 2 ? 'warn' : 'alert') : '',
          ].join(' ').trim()

          return <span key={index} className={className} aria-hidden="true" />
        })}
      </div>

      <div className="meter-note">
        {subtitle || 'Score is an estimate based on password patterns and resistance to common guessing strategies.'}
      </div>

      <div className="meter-note" style={{ marginTop: 12, fontWeight: 600 }}>
        {labelStyles[Math.min(labelStyles.length - 1, Math.round(percent / 25))]}
      </div>
    </div>
  )
}
