export function getMyUserIdFromToken() {
  const token = localStorage.getItem("token");

  if (!token) {
    return null;
  }

  try {
    const payload = token.split(".")[1];
    const decoded = JSON.parse(atob(payload));
    return decoded.user;
  } catch (error) {
    return null;
  }
}
