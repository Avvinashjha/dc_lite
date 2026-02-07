export function calculateReadingTime(text: string): string {
  const wordsPerMinute = 265;
  const words = text.trim().split(/\s+/).length;
  const minutes = Math.ceil(words / wordsPerMinute);
  return `${minutes} min read`;
}

export function getReadingMinutes(text: string): number {
  const wordsPerMinute = 265;
  const words = text.trim().split(/\s+/).length;
  return Math.ceil(words / wordsPerMinute);
}
