// Formatting date for input type="date" in productEdit.ejs. Since ISO string uses UTC
// it shows one day before the actual date for some timezones. 
// To prevent this, we can set hours to 3 so it will be the same day even in UTC.
export function formatDateForInput(date) {
  date.setHours(3, 0, 0, 0); // Set hours to 3 to avoid timezone issues
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}