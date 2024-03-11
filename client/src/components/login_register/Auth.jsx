import Cookies from 'js-cookie';

export const isAuthenticated = () => {
  const authToken = Cookies.get('authToken');
  const sessionID = Cookies.get('sessionID');

  return authToken && sessionID;
};

export const getUserIdFromToken = () => {
  const authToken = Cookies.get('authToken');
  try {
    const decodedToken = jwt.verify(authToken, process.env.JWT_SECRET);
    return decodedToken.userId;
  } catch (error) {
    console.error("Token decoding error:", error);
    return null;
  }
};
