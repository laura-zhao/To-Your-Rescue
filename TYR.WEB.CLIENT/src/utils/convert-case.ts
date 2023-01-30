// ========================
// Case Conversion Utilities
// Note: All case conversion functions require `toKebab` to work.
// ------------------------
export const toKebab = (str: string) =>
  str
    .split('')
    .map((letter, index) => {
      if (/[A-Z]/.test(letter)) {
        return ` ${letter.toLowerCase()}`
      }
      return letter
    })
    .join('')
    .trim()
    .replace(/[_\s]+/g, '-')

export const toCamel = (str: string) =>
  toKebab(str)
    .split('-')
    .map((word, index) => {
      if (index === 0) return word
      return word.slice(0, 1).toUpperCase() + word.slice(1).toLowerCase()
    })
    .join('')

export const toTitle = (str: string) =>
  toKebab(str)
    .split('-')
    .map((word) => {
      return word.slice(0, 1).toUpperCase() + word.slice(1)
    })
    .join(' ')

export const toSentence = (str: string) => {
  const interim = toKebab(str).replace(/-/g, ' ')
  return interim.slice(0, 1).toUpperCase() + interim.slice(1)
}
