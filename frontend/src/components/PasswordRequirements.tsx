import { Check, CircleAlert } from 'lucide-react'

interface Requirement {
  label: string
  passed: boolean
}

interface PasswordRequirementsProps {
  checks: Requirement[]
}

export function PasswordRequirements({ checks }: PasswordRequirementsProps) {
  return (
    <div className="panel">
      <div className="panel-header">
        <div className="panel-title">Requirements</div>
      </div>

      <div className="requirements-list">
        {checks.map((item) => (
          <div key={item.label} className={`requirement-item ${item.passed ? 'pass' : 'warn'}`}>
            {item.passed ? <Check className="check" /> : <CircleAlert className="check" />}
            <span>{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
