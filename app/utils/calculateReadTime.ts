const WORDS_PER_MINUTE_AVERAGE = 255;

export default (content: string) => {
  const words = content.trim().split(/\s+/).length;
  return Math.ceil(words / WORDS_PER_MINUTE_AVERAGE);
};
