export function getStoredLikedIds() {
  try {
    const stored = localStorage.getItem("likedPostIds");
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    return error;
  }
}

export function persistLikedIds(ids) {
  localStorage.setItem("likedPostIds", JSON.stringify(ids));
}

export function getStoredBookmarkedIds() {
  try {
    const stored = localStorage.getItem("bookmarkedPostIds");
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    return error;
  }
}

export function persistBookmarkedIds(ids) {
  localStorage.setItem("bookmarkedPostIds", JSON.stringify(ids));
}
