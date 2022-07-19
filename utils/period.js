const dayjs = require("../lib/dayjs");

function getPeriods(start_year, end_year, metrics, period) {
  const periods = {};
  const formatString = {
    month: "MMM YYYY",
    quarter: "[Q]Q YYYY",
    week: "[W]w YYYY",
  }[period];
  const start_date = `${start_year}-01-01`;
  const end_date = `${end_year}-12-31`;

  for (
    let d = dayjs(start_date);
    d.isSameOrBefore(end_date);
    d = d.add(1, period)
  ) {
    const key = d.format(formatString);
    periods[key] = {};
    for (const metric of metrics) {
      periods[key][metric] = 0;
    }
  }

  return { periods, formatString };
}

module.exports = { getPeriods };
