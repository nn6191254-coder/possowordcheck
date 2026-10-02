import { useEffect, useMemo, useState } from 'react'
import {
  Activity,
  ArrowRight,
  BadgeCheck,
  Check,
  Gauge,
  Lock,
  Shield,
  ShieldAlert,
  Sparkles,
  Star,
} from 'lucide-react'
import { analyzePassword } from './utils/passwordAnalyzer'
import { generateSecurePassword } from './utils/passwordGenerator'
import { PasswordInput } from './components/PasswordInput'
import { CircularStrengthMeter } from './components/CircularStrengthMeter'
import { PasswordRequirements } from './components/PasswordRequirements'
import { PasswordGenerator } from './components/PasswordGenerator'
import { SecurityTips } from './components/SecurityTips'

const tips = [
  'Use unique passwords for important accounts.',
  'Prefer long passwords or passphrases with unexpected words.',
  'Avoid names, birthdays and predictable information.',
  'Never reuse passwords across critical services.',
  'Use a reputable password manager.',
  'Enable multi-factor authentication wherever possible.',
  'Change compromised passwords immediately.',
  'Avoid sharing passwords over chat, email, or messaging apps.',
]

const adminProfile = {
  name: 'Naveen C',
  phone: '8431800592',
  email: 'nn6191254@gmail.com',
  location: 'Haverii',
}

function App() {
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [generatorValue, setGeneratorValue] = useState('')
  const [toast, setToast] = useState<string | null>(null)
  const [adminOpen, setAdminOpen] = useState(false)

  const analysis = useMemo(() => analyzePassword(password), [password])

  useEffect(() => {
    if (!toast) return
    const timer = window.setTimeout(() => setToast(null), 2200)
    return () => window.clearTimeout(timer)
  }, [toast])

  const handleCheckPassword = () => {
    if (!password) {
      setToast('Enter a password to check')
      return
    }

    setToast('Password checked')
  }

  const handleClearPassword = () => {
    setPassword('')
    setToast('Password cleared')
  }

  const handleGeneratePassword = () => {
    const generated = generateSecurePassword({
      length: 18,
      uppercase: true,
      lowercase: true,
      numbers: true,
      symbols: true,
    })

    setGeneratorValue(generated)
    setToast('New secure password generated')
  }

  const handleUseGeneratedPassword = () => {
    if (!generatorValue) return

    setPassword(generatorValue)
    setToast('Generated password is now checked')
  }

  const handleCopy = async (value: string) => {
    if (!value) return

    try {
      await navigator.clipboard.writeText(value)
      setToast('Password copied')
    } catch {
      setToast('Clipboard access unavailable')
    }
  }

  const handleOpenAdmin = () => {
    setAdminOpen(true)
  }

  const handleCloseAdmin = () => {
    setAdminOpen(false)
  }

  const cards = [
    {
      title: 'Length',
      value: `${analysis.length} characters`,
      status: analysis.length >= 16 ? 'Excellent' : analysis.length >= 12 ? 'Good' : analysis.length >= 8 ? 'Fair' : 'Too short',
      description: analysis.length >= 16 ? 'Strong length profile.' : 'Add more length for better resistance.',
    },
    {
      title: 'Character Variety',
      value: `${analysis.characterChecks.count} types present`,
      status: analysis.characterChecks.score >= 3 ? 'Good' : 'Needs improvement',
      description: analysis.characterChecks.score >= 3 ? 'A healthy mix of character classes.' : 'Include more uppercase, numbers, or symbols.',
    },
    {
      title: 'Pattern Detection',
      value: analysis.patternChecks.detected ? 'Patterns detected' : 'No obvious patterns',
      status: analysis.patternChecks.detected ? 'Watch for repeats' : 'Good',
      description: analysis.patternChecks.detected ? 'Reduce repeated or sequential patterns.' : 'The pattern profile looks clean.',
    },
    {
      title: 'Common Password Check',
      value: analysis.isCommonPassword ? 'Common password found' : 'Not found in common patterns',
      status: analysis.isCommonPassword ? 'Avoid' : 'Good',
      description: analysis.isCommonPassword ? 'This password is frequently used and easy to guess.' : 'This pattern is not commonly used.',
    },
    {
      title: 'Guessability',
      value: `~${analysis.guessLabel}`,
      status: analysis.guessLabel === 'Very high' ? 'Very high' : 'Moderate',
      description: analysis.guessLabel === 'Very high' ? 'This is harder to guess by common attacks.' : 'Try more unpredictability for stronger resistance.',
    },
    {
      title: 'Overall Strength',
      value: analysis.strengthLabel,
      status: `Score ${analysis.score}/100`,
      description: 'Estimate based on pattern resistance and common guessing strategies.',
    },
  ]

  const scorePercent = Math.min(100, Math.max(0, analysis.score))

  return (
    <div className="app-shell">
      {adminOpen ? (
        <div className="admin-page-shell">
          <div className="admin-page-card">
            <div className="admin-page-header">
              <div>
                <div className="admin-page-kicker">Admin Profile</div>
                <h2>Contact Details</h2>
              </div>
              <button type="button" className="admin-close-button" onClick={handleCloseAdmin}>Close</button>
            </div>

            <div className="admin-page-grid">
              <div className="admin-page-item">
                <span>Name</span>
                <strong>{adminProfile.name}</strong>
              </div>
              <div className="admin-page-item">
                <span>Phone</span>
                <strong>{adminProfile.phone}</strong>
              </div>
              <div className="admin-page-item">
                <span>Email</span>
                <strong>{adminProfile.email}</strong>
              </div>
              <div className="admin-page-item">
                <span>Location</span>
                <strong>{adminProfile.location}</strong>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <>
          <header className="topbar">
        <div className="brand-wrap">
          <div className="brand-mark">
            <Shield className="icon-small" />
          </div>
          <div>
            <div className="brand-name">SECURECHECK</div>
            <div className="brand-subtitle">Password Security Analyzer</div>
          </div>
        </div>

        <nav className="nav" aria-label="Main navigation">
          <a href="#checker">Checker</a>
          <a href="#generator">Generator</a>
          <a href="#tips">Security Tips</a>
        </nav>

        <div className="privacy-badge">
          <span className="dot" />
          LOCAL ANALYSIS
        </div>
      </header>

      <main className="page-shell">
        <section className="hero-panel">
          <div className="hero-copy">
            <div className="eyebrow-row">
              <span className="eyebrow-number">1.</span>
              <span className="eyebrow-text">PASSWORD STRENGTH CHECKER</span>
            </div>

            <h1>How Strong Is Your Password?</h1>
            <p className="hero-subtitle">
              Analyze your password instantly with advanced security checks. Your password stays on your device.
            </p>
          </div>

          <div className="hero-privacy-card">
            <div className="shield-icon">
              <Shield className="shield" />
            </div>
            <div className="privacy-meta">
              <div className="chip">Privacy First</div>
              <strong>Local only</strong>
            </div>
          </div>
        </section>

        <section className="content-grid" id="checker">
          <div className="left-stack">
            <PasswordInput
              value={password}
              onChange={setPassword}
              showPassword={showPassword}
              onToggleVisibility={() => setShowPassword((value) => !value)}
              onClear={handleClearPassword}
              onCheck={handleCheckPassword}
            />

            <div className="panel">
              <div className="panel-header">
                <div className="panel-title">Password Analysis</div>
              </div>

              <div className="analysis-grid">
                {cards.map((card) => (
                  <article key={card.title} className="metric-card">
                    <div className="metric-topline">
                      <span className="metric-title">{card.title}</span>
                      <span className="metric-status">{card.status}</span>
                    </div>
                    <div className="metric-value">{card.value}</div>
                    <p>{card.description}</p>
                  </article>
                ))}
              </div>
            </div>

            <div className="panel">
              <div className="panel-header">
                <div className="panel-title">How to Make It Stronger</div>
              </div>

              <div className="suggestions-list">
                {analysis.suggestions.length > 0 ? (
                  analysis.suggestions.map((suggestion) => (
                    <div key={suggestion} className="suggestion-item">
                      <ArrowRight className="small-icon" />
                      <span>{suggestion}</span>
                    </div>
                  ))
                ) : (
                  <div className="suggestion-item">
                    <BadgeCheck className="small-icon" />
                    <span>This password is already strong. Keep it unique and do not reuse it.</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <aside className="right-stack">
            <div className="panel circular-strength-panel">
              <div className="strength-header">
                <div>
                  <div className="strength-kicker">Password Strength</div>
                  <div className="strength-subtitle">Real-time security analysis</div>
                </div>
              </div>

              <CircularStrengthMeter
                score={scorePercent}
                strength={password ? analysis.strengthLabel : 'NO PASSWORD'}
                hasPassword={password.length > 0}
              />

              <p className="strength-summary">{analysis.description || 'Estimated strength based on password patterns and guessability.'}</p>

              <div className="strength-metric-grid">
                <div className="strength-metric-item">
                  <span>PASSWORD LENGTH</span>
                  <strong>{analysis.length} characters</strong>
                </div>
                <div className="strength-metric-item">
                  <span>GUESSABILITY</span>
                  <strong>{analysis.guessLabel}</strong>
                </div>
                <div className="strength-metric-item">
                  <span>PATTERNS</span>
                  <strong>{analysis.patternChecks.detected ? 'Patterns detected' : 'No obvious patterns'}</strong>
                </div>
              </div>
            </div>

            <PasswordRequirements checks={analysis.requirements} />

            <div className="panel privacy-card">
              <div className="panel-header narrow-header">
                <ShieldAlert className="tiny-icon" />
                <div className="panel-title">Your Privacy Matters</div>
              </div>

              <ul className="privacy-points">
                <li><Check className="check" /> Password analyzed locally</li>
                <li><Check className="check" /> No database</li>
                <li><Check className="check" /> No password tracking</li>
                <li><Check className="check" /> No external password API</li>
                <li><Check className="check" /> No password storage</li>
              </ul>

              <p className="privacy-note">Your password never leaves this browser.</p>
            </div>
          </aside>
        </section>

        <section className="panel generator-panel" id="generator">
          <div className="panel-header">
            <div className="panel-title">Password Generator</div>
          </div>
          <PasswordGenerator
            value={generatorValue}
            onValueChange={setGeneratorValue}
            onCopy={() => handleCopy(generatorValue)}
            onCheck={handleUseGeneratedPassword}
            onGenerate={handleGeneratePassword}
          />
        </section>

        <section className="panel explainer-panel">
          <div className="panel-header">
            <div className="panel-title">How Password Strength Is Measured</div>
          </div>

          <div className="explainer-grid">
            <div className="explainer-item">
              <Gauge className="tiny-icon" />
              <h3>Length</h3>
              <p>Longer passwords give attackers more possibilities to guess through.</p>
            </div>
            <div className="explainer-item">
              <Sparkles className="tiny-icon" />
              <h3>Unpredictability</h3>
              <p>Randomness and variation matter more than simple character rules.</p>
            </div>
            <div className="explainer-item">
              <Activity className="tiny-icon" />
              <h3>Pattern resistance</h3>
              <p>Repeated or predictable sequences are easier to brute-force.</p>
            </div>
            <div className="explainer-item">
              <Star className="tiny-icon" />
              <h3>Character diversity</h3>
              <p>Mixing uppercase, lowercase, numbers, and symbols increases complexity.</p>
            </div>
          </div>
        </section>

        <section className="panel tips-panel" id="tips">
          <div className="panel-header">
            <div className="panel-title">Password Security Best Practices</div>
          </div>
          <SecurityTips items={tips} />
        </section>
      </main>

      <footer className="site-footer">
        <div className="footer-brand">
          <div className="brand-mark small-brand-mark">
            <Lock className="icon-small" />
          </div>
          <div>
            <div className="brand-name">SecureCheck</div>
            <div className="brand-subtitle">Privacy-first password analysis.</div>
          </div>
        </div>

        <div className="footer-links">
          <a href="#checker">Password Checker</a>
          <a href="#generator">Generator</a>
          <a href="#tips">Security Tips</a>
          <a href="#checker">Privacy</a>
        </div>

        <button type="button" className="admin-button compact-admin-button" onClick={handleOpenAdmin}>Admin</button>
      </footer>

          {toast && <div className="toast">{toast}</div>}
        </>
      )}
    </div>
  )
}

export default App
