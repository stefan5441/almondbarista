export const convertTimestampToDate = (timestamp: number) => {
  const date = new Date(timestamp);
  const options: Intl.DateTimeFormatOptions = { day: "2-digit", month: "short", year: "numeric" };
  return Intl.DateTimeFormat("en-US", options).format(date);
};
