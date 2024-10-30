exports.formatDate = (dateString) => {
  const [day, month, year] = dateString.split("-");
  const date = new Date(`${year}-${month}-${day}`);
  const options = { day: "2-digit", month: "short", year: "numeric" };
  return date.toLocaleDateString("en-GB", options).replace(/ /g, "-");
};
