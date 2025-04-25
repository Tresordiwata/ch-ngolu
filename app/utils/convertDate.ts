export function convertDate(dt: string) {
  const cleanedDate = dt.replace(/\[.*\]/, "");

  return new Date(cleanedDate);
}
