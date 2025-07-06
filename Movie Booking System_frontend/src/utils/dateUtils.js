export function formatReleaseDate(dateString) {
  const date = new Date(dateString);
  const day = date.getDate();

  // Get ordinal suffix for the day
  const getOrdinal = (n) => {
    if (n > 3 && n < 21) return "th";
    switch (n % 10) {
      case 1: return "st";
      case 2: return "nd";
      case 3: return "rd";
      default: return "th";
    }
  };

  const month = date.toLocaleString("default", { month: "long" });
  const year = date.getFullYear();

  return `${day}${getOrdinal(day)} ${month} ${year}`;
}