import moment from "moment";

const getRangeOfDates = (dtS: String, dtE: String) => {
  const dates = [];
  let currentDate = moment(`${dtS}`).clone();

  while (currentDate.isSameOrBefore(moment(`${dtE}`))) {
    dates.push(currentDate.format("YYYY-MM-DD"));
    currentDate.add(1, "days"); // Ajouter un jour
  }
  // dates.unshift("Rubrique");

  return dates;
};

export default getRangeOfDates;
