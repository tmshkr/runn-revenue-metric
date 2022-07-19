require("dotenv").config();
const _ = require("lodash");
const dayjs = require("./lib/dayjs");
const { getAllProjects, getProjectById } = require("./resources/projects");
const { getAllRoles, getRoleById } = require("./resources/roles");
const { getPeriods } = require("./utils/period");

async function getProjectRevenue(start_year, end_year) {
  const result = {};
  const metrics = ["projectRevenue"];
  const { periods, formatString } = getPeriods(
    start_year,
    end_year,
    metrics,
    "month"
  );

  // Fetch and cache resources
  const projects = await getAllProjects().then(async (projects) => {
    await Promise.all(projects.map(({ id }) => getProjectById(id)));
    return projects;
  });
  await getAllRoles();

  // Iterate through projects
  for (const { id } of projects) {
    const project = await getProjectById(id);
    result[id] = _.cloneDeep(periods);

    // Iterate through project's assignments
    for (const assignment of project.assignments) {
      if (!assignment.is_billable) continue;
      const {
        role_id,
        start_date,
        end_date,
        minutes_per_day,
        non_working_day,
      } = assignment;

      // Get rate from project_rates, or the role's standard_rate
      // if there is no project_rate for that role
      let rate;
      if (role_id in project.projectRatesByRoleId) {
        rate = Number(project.projectRatesByRoleId[role_id].rate_hourly);
      } else {
        const { standard_rate } = await getRoleById(role_id);
        rate = Number(standard_rate);
      }

      // Iterate through each day of the assignment to add revenue for that day
      for (
        let d = dayjs(start_date);
        d.isSameOrBefore(end_date);
        d = d.add(1, "day")
      ) {
        // Skip weekends unless assignment.non_working_day is true
        if ((d.day() > 0 && d.day() < 6) || non_working_day) {
          const period = d.format(formatString);
          const revenue = (minutes_per_day / 60) * rate;
          if (period in result[id]) {
            result[id][period].projectRevenue += revenue;
          }
        }
      }
    }
  }

  // Print results
  for (const { id, name } of projects) {
    console.log(`${id} - ${name}`);
    console.log(result[id]);
  }
}

getProjectRevenue(2022, 2022);
