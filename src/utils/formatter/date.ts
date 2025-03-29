import moment from "moment";

export const formatDate = (date: Date) => {
  // take date in utc
  // return date in utc

  return moment(date.toString()).utc().format("YYYY-MM-DD");
};
