import axios from "axios";

export function getComments(postId, page, limit) {
  return axios.get(
    `https://route-posts.routemisr.com/posts/${postId}/comments`,
    {
      params: { page: page, limit: limit },
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    },
  );
}

export function createComment(postId, content, imageFile) {
  const formData = new FormData();
  formData.append("content", content);

  if (imageFile) {
    formData.append("image", imageFile);
  }

  return axios.post(
    `https://route-posts.routemisr.com/posts/${postId}/comments`,
    formData,
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    },
  );
}

export function updateComment(postId, commentId, content, imageFile) {
  const formData = new FormData();
  formData.append("content", content);

  if (imageFile) {
    formData.append("image", imageFile);
  }

  return axios.put(
    `https://route-posts.routemisr.com/posts/${postId}/comments/${commentId}`,
    formData,
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    },
  );
}

export function deleteComment(postId, commentId) {
  return axios.delete(
    `https://route-posts.routemisr.com/posts/${postId}/comments/${commentId}`,
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    },
  );
}
