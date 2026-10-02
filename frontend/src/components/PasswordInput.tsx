import { Eye, EyeOff, Shield, Trash2 } from 'lucide-react'

interface PasswordInputProps {
  value: string
  onChange: (value: string) => void
  showPassword: boolean
  onToggleVisibility: () => void
  onClear: () => void
  onCheck: () => void
}

export function PasswordInput({
  value,
  onChange,
  showPassword,
  onToggleVisibility,
  onClear,
  onCheck,
}: PasswordInputProps) {
  return (
    <form
      className="panel"
      onSubmit={(event) => {
        event.preventDefault()
        onCheck()
      }}
    >
      <div className="panel-header">
        <div className="panel-title">Enter your password</div>
      </div>

      <div className="password-box" role="group" aria-label="Password analyzer input area">
        <Shield className="tiny-icon" aria-hidden="true" />

        <input
          type={showPassword ? 'text' : 'password'}
          className="password-input"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder="Enter a password to analyze..."
          aria-label="Password to analyze"
        />

        <button
          type="button"
          className="icon-button"
          onClick={onToggleVisibility}
          aria-label={showPassword ? 'Hide password' : 'Show password'}
        >
          {showPassword ? <EyeOff className="tiny-icon" /> : <Eye className="tiny-icon" />}
        </button>

        <button type="button" className="icon-button" onClick={onClear} aria-label="Clear password">
          <Trash2 className="tiny-icon" />
        </button>

        <button type="submit" className="primary-button" aria-label="Check the current password">
          <Shield className="tiny-icon" />
          Check Password
        </button>
      </div>

      <p className="privacy-note" style={{ marginTop: 14 }}>
        Your password is analyzed locally in your browser and is never stored or transmitted.
      </p>
    </form>
  )
}
