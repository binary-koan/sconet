export const getCssValue = (variable: string) =>
  getComputedStyle(document.body).getPropertyValue(variable)
