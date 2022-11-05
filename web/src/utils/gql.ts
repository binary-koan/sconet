export const gql = (query: TemplateStringsArray, ...args: string[]) =>
  String.raw(query, ...args)
    .replace(/#.+\r?\n|\r/g, "")
    .replace(/\r?\n|\r/g, "")
    .replace(/\s{2,}/g, " ")
    .trim()
