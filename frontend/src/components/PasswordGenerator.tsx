import { Copy, ShieldCheck } from 'lucide-react'

interface PasswordGeneratorProps {
  value: string
  onValueChange: (value: string) => void
  onGenerate: () => void
  onCopy: () => void
  onCheck: () => void
}

export function PasswordGenerator({
  value,
  onValueChange,
  onGenerate,
  onCopy,
  onCheck,
}: PasswordGeneratorProps) {
  return (
    <div className="generator-grid">
      <div>
        <input
          className="generator-input"
          value={value}
          onChange={(event) => onValueChange(event.target.value)}
          placeholder="Enter or paste a password to analyze"
          aria-label="Password to analyze"
        />
      </div>

      <div className="generator-actions">
        <button type="button" className="primary-button" onClick={onGenerate}>
          <ShieldCheck className="tiny-icon" />
          Generate Password
        </button>
        <button type="button" className="secondary-button" onClick={onCopy}>
          <Copy className="tiny-icon" />
          Copy
        </button>
        <button type="button" className="secondary-button" onClick={onCheck}>
          Check This Password
        </button>
      </div>
    </div>
  )
}
