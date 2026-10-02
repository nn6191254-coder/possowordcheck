import { ShieldCheck } from 'lucide-react'

export interface CircularStrengthMeterProps {
  score: number
  strength: string
  hasPassword: boolean
}

const radius = 100
const circumference = 2 * Math.PI * radius

const getStrengthColor = (strength: string) => {
  switch (strength.toUpperCase()) {
    case 'VERY WEAK':
      return '#f87171'
    case 'WEAK':
      return '#f59e0b'
    case 'FAIR':
      return '#fbbf24'
    case 'STRONG':
      return '#34d399'
    case 'VERY STRONG':
      return '#5eead4'
    default:
      return '#94a3b8'
  }
}

export function CircularStrengthMeter({ score, strength, hasPassword }: CircularStrengthMeterProps) {
  const safeScore = Math.max(0, Math.min(100, score))
  const displayScore = hasPassword ? Math.round(safeScore) : 0
  const displayStrength = hasPassword ? strength.toUpperCase() : 'NO PASSWORD'
  const strokeColor = getStrengthColor(displayStrength)
  const strokeDashoffset = circumference - (displayScore / 100) * circumference

  return (
    <div
      className="circular-meter-wrap"
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={displayScore}
      aria-label={`Password strength ${displayScore} out of 100`}
    >
      <svg
        className="circular-meter-svg"
        viewBox="0 0 240 240"
        aria-hidden="true"
      >
        <circle className="circular-meter-track" cx="120" cy="120" r={radius} />
        <circle
          className="circular-meter-progress"
          cx="120"
          cy="120"
          r={radius}
          stroke={strokeColor}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          transform="rotate(-90 120 120)"
          style={{
            color: strokeColor,
            filter: hasPassword ? 'drop-shadow(0 0 6px currentColor)' : 'none',
          }}
        />
      </svg>

      <div className="circular-meter-center">
        <div className="score-main">{displayScore}</div>
        <div className="score-divider">/100</div>
        <div className={`strength-inline-label ${hasPassword ? '' : 'neutral'}`}>
          <ShieldCheck className="strength-inline-icon" />
          <span>{displayStrength}</span>
        </div>
      </div>
    </div>
  )
}
