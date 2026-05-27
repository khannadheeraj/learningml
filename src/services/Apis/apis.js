
const API_BASE_URL = process.env.REACT_APP_MY_COLLEGE_VISION_URL;

const ApiRoutes = {

    Auth: {
      AdminUserLogin: `${API_BASE_URL}/adminUser/login`,
    },

    // User: {
    //   GetProfile: `${BASE}/user/profile`,
    // },
    // Dashboard: {
    //   Stats: `${BASE}/dashboard/stats`,
    // },
  };

export { ApiRoutes };