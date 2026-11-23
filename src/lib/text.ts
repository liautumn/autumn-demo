const PUNCTUATION = /^[，。！？、；：,.!?;:]+$/

export function splitRevealTokens(text: string, tokens?: string[]): string[] {
  if (tokens?.length) return tokens
  if (/\s/.test(text)) return text.split(/\s+/).filter(Boolean)

  const result: string[] = []
  for (const char of Array.from(text)) {
    if (PUNCTUATION.test(char) && result.length > 0) {
      result[result.length - 1] = (result[result.length - 1] ?? '') + char
    } else {
      result.push(char)
    }
  }
  return result
}
