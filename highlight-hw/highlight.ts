export function highlightForbiddenWords(text: string, forbiddenWords: string[]): string {
  let result = text;
  for (const word of forbiddenWords) {
    if (word) {
      result = result.split(word).join(`<del>${word}</del>`);
    }
  }
  return result;
}
