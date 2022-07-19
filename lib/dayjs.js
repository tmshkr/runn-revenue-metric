const dayjs = require("dayjs");
const isSameOrBefore = require("dayjs/plugin/isSameOrBefore");
const isSameOrAfter = require("dayjs/plugin/isSameOrAfter");
const quarterOfYear = require("dayjs/plugin/quarterOfYear");
const advancedFormat = require("dayjs/plugin/advancedFormat");
const weekOfYear = require("dayjs/plugin/weekOfYear");
dayjs.extend(weekOfYear);
dayjs.extend(advancedFormat);
dayjs.extend(isSameOrAfter);
dayjs.extend(quarterOfYear);
dayjs.extend(isSameOrBefore);

module.exports = dayjs;
