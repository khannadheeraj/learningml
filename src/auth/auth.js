import jwt_decode from 'jwt-decode';

const isAuthenticated = () => {
  const loginData = JSON.parse(localStorage.getItem("userData"));
  return !!loginData;
};

const getUserDetails = () => {
  const userData = JSON.parse(localStorage.getItem("userData"));
  return userData;
};

const getCurrentUser = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  if (user) {
    const decodedToken = jwt_decode(user.token);
    if (decodedToken.exp * 1000 < Date.now()) {
      // localStorage.removeItem('user');
      // window.location.reload();
    }
    return decodedToken;
  }
  return null;
}

const logout = () => {
  localStorage.removeItem('userData');
  window.location.reload();
}

const getUserDetailsFromLocalStorage = () => {
  let userData = JSON.parse(localStorage.getItem('user'));
  if (userData === undefined || userData === null) {
    return null;
  }
  return userData?.userData;
}

const getPermission = (permissionData) => {
  let permissionList = getUserDetailsFromLocalStorage()?.permission;
  let permissions = permissionList;
  if (permissions == null || permissionData === '') {
    return true;
  }
  return permissions.includes(permissionData) || permissions.includes("ADMIN");
}

const setSessionData = (authResult, response) => {
  localStorage.setItem('userData', JSON.stringify(authResult));
};

const clearData = () => {
  localStorage.removeItem('userData');
}

export const auth_service = { isAuthenticated, logout, getUserDetails, getPermission, getUserDetailsFromLocalStorage, getCurrentUser, setSessionData, clearData };










