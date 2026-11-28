const searchWordsRegex = /\b(actor|actress|acting|guest)\b/i;

export const autoDetectShouldIncludeActor = (title: string) => {
  return searchWordsRegex.test(title);
};
