import { CheckCircle2 } from 'lucide-react'

interface SecurityTipsProps {
  items: string[]
}

export function SecurityTips({ items }: SecurityTipsProps) {
  return (
    <ul className="tips-list">
      {items.map((item) => (
        <li key={item}>
          <CheckCircle2 className="tiny-icon" aria-hidden="true" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  )
}
