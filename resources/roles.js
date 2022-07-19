const { runnAPI } = require("../lib/axios");

let allRoles = [];
const rolesById = {};

async function getAllRoles() {
  if (allRoles.length) return allRoles;
  const roles = await runnAPI.get("/roles").then(({ data }) => data);
  allRoles = roles;
  for (const role of roles) {
    rolesById[role.id] = role;
  }
  return allRoles;
}

async function getRoleById(role_id) {
  if (role_id in rolesById) {
    return rolesById[role_id];
  }
  const role = await runnAPI.get(`/roles/${role_id}`).then(({ data }) => data);
  rolesById[role.id] = role;
  return role;
}

module.exports = { getAllRoles, getRoleById };
