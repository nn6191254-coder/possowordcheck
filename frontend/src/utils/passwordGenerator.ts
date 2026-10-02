export interface PasswordOptions {
  length?: number
  uppercase?: boolean
  lowercase?: boolean
  numbers?: boolean
  symbols?: boolean
  avoidAmbiguous?: boolean
  usePassphrase?: boolean
}

const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
const lowercase = 'abcdefghijklmnopqrstuvwxyz'
const numbers = '0123456789'
const symbols = '!@#$%^&*()-_=+[]{};:,.<>?'
const ambiguous = /[0OIl1|]/g

function getRandomInt(max: number): number {
  const values = new Uint32Array(1)
  const randomValue = globalThis.crypto.getRandomValues(values)[0]
  return randomValue % max
}

export function generateSecurePassword(options: PasswordOptions = {}): string {
  const {
    length = 16,
    uppercase: includeUppercase = true,
    lowercase: includeLowercase = true,
    numbers: includeNumbers = true,
    symbols: includeSymbols = true,
    avoidAmbiguous = true,
    usePassphrase = false,
  } = options

  if (usePassphrase) {
    const words = [
      'bright',
      'meadow',
      'copper',
      'dune',
      'forest',
      'harbor',
      'legacy',
      'signal',
      'storm',
      'planet',
      'river',
      'thunder',
      'silver',
      'summit',
      'ember',
      'lunar',
      'anchor',
    ]

    const selected = Array.from({ length: Math.max(3, Math.min(4, Math.ceil(length / 5))) }, () => {
      const index = getRandomInt(words.length)
      return words[index]
    })

    return selected.join('-')
  }

  let allowed = ''
  if (includeUppercase) allowed += uppercase
  if (includeLowercase) allowed += lowercase
  if (includeNumbers) allowed += numbers
  if (includeSymbols) allowed += symbols

  if (avoidAmbiguous) {
    allowed = allowed.replace(ambiguous, '')
  }

  if (!allowed) {
    throw new Error('At least one character set must be enabled.')
  }

  const passwordCharacters = Array.from({ length }, () => {
    const index = getRandomInt(allowed.length)
    return allowed[index]
  })

  return passwordCharacters.join('')
}

export const generatePassword = generateSecurePassword
