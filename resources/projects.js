const { runnAPI } = require("../lib/axios");

let allProjects = [];
const projectsById = {};

async function getAllProjects() {
  if (allProjects.length) return allProjects;
  const projects = await runnAPI.get("/projects").then(({ data }) => data);
  allProjects = projects;
  return allProjects;
}

async function getProjectById(project_id) {
  if (project_id in projectsById) {
    return projectsById[project_id];
  }

  const project = await runnAPI
    .get(`/projects/${project_id}?include_assignments=true`)
    .then(({ data }) => data);

  project.projectRatesByRoleId = project.project_rates.reduce((acc, curr) => {
    acc[curr.role_id] = curr;
    return acc;
  }, {});

  projectsById[project.id] = project;
  return project;
}

module.exports = { getAllProjects, getProjectById };
