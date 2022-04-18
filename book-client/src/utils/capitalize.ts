export function capitalize(value: string): string {
  const [firstLetter, ...rest] = value;
  return firstLetter.toUpperCase() + rest.join("");
}
