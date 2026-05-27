
const API_BASE_URL = process.env.REACT_APP_recommendServiceURL;

const ApiRoutes = {

  Auth: {
    AdminUserLogin: `${API_BASE_URL}/adminUser/login`,
  },

  // Dashboard: {
  //   Stats: `${BASE}/dashboard/stats`,
  // },
};

export { ApiRoutes };