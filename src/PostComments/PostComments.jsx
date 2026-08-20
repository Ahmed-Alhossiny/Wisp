import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import {
  getComments,
  createComment,
  updateComment,
  deleteComment,
} from "../Utils/commentsApi";
import { getMyUserIdFromToken } from "../Utils/auth";
import { showAlert } from "../Utils/showAlert";

export default function PostComments({ postId, myAvatar }) {
  const myUserId = getMyUserIdFromToken();

  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const [newContent, setNewContent] = useState("");
  const [newImageFile, setNewImageFile] = useState(null);
  const [newImagePreview, setNewImagePreview] = useState(null);
  const [posting, setPosting] = useState(false);
  const newImageInputRef = useRef(null);

  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editContent, setEditContent] = useState("");
  const [editImageFile, setEditImageFile] = useState(null);
  const [editImagePreview, setEditImagePreview] = useState(null);
  const [updating, setUpdating] = useState(false);
  const editImageInputRef = useRef(null);

  const COMMENTS_PER_PAGE = 10;

  function timeAgo(dateString) {
    const date = new Date(dateString);
    const now = new Date();

    const seconds = Math.floor((now - date) / 1000);

    if (seconds < 60) {
      return `${seconds}s`;
    }
    const minutes = Math.floor(seconds / 60);

    if (minutes < 60) {
      return `${minutes}m`;
    }
    const hours = Math.floor(minutes / 60);

    if (hours < 24) {
      return `${hours}h`;
    }
    const days = Math.floor(hours / 24);

    if (days < 30) {
      return `${days}d`;
    }
    const months = Math.floor(days / 30);

    if (months < 12) {
      return `${months}mo`;
    }
    const years = Math.floor(days / 365);

    return `${years}y`;
  }

  function GetCommentsList(pageNum) {
    if (pageNum === 1) {
      setLoading(true);
    } else {
      setLoadingMore(true);
    }

    getComments(postId, pageNum, COMMENTS_PER_PAGE)
      .then(function (response) {
        const newComments = response.data.data.comments;

        if (newComments.length < COMMENTS_PER_PAGE) {
          setHasMore(false);
        }

        if (pageNum === 1) {
          setComments(newComments);
        } else {
          setComments(function (prevComments) {
            const merged = [];

            for (let i = 0; i < prevComments.length; i++) {
              merged.push(prevComments[i]);
            }
            for (let i = 0; i < newComments.length; i++) {
              merged.push(newComments[i]);
            }

            return merged;
          });
        }
      })
      .finally(function () {
        setLoading(false);
        setLoadingMore(false);
      });
  }

  useEffect(
    function () {
      GetCommentsList(1);
    },
    [postId],
  );

  function handleLoadMore() {
    const nextPage = page + 1;
    setPage(nextPage);
    GetCommentsList(nextPage);
  }

  function handleNewImageChange(e) {
    const file = e.target.files[0];

    if (!file) {
      return;
    }

    setNewImageFile(file);
    setNewImagePreview(URL.createObjectURL(file));
  }

  function clearNewImage() {
    setNewImageFile(null);
    setNewImagePreview(null);

    if (newImageInputRef.current) {
      newImageInputRef.current.value = "";
    }
  }

  function handlePostComment() {
    if (newContent.trim() === "") {
      return;
    }

    setPosting(true);

    createComment(postId, newContent, newImageFile)
      .then(function (response) {
        const createdComment = response.data.data.comment;

        setComments(function (prevComments) {
          const updated = [createdComment];

          for (let i = 0; i < prevComments.length; i++) {
            updated.push(prevComments[i]);
          }

          return updated;
        });

        setNewContent("");
        clearNewImage();
      })
      .catch(function (error) {
        showAlert(
          "error",
          error.response?.data?.message || "Could not post comment",
        );
      })
      .finally(function () {
        setPosting(false);
      });
  }

  function startEditing(comment) {
    setEditingCommentId(comment._id);
    setEditContent(comment.content);
    setEditImageFile(null);
    setEditImagePreview(null);
  }

  function cancelEditing() {
    setEditingCommentId(null);
    setEditContent("");
    setEditImageFile(null);
    setEditImagePreview(null);

    if (editImageInputRef.current) {
      editImageInputRef.current.value = "";
    }
  }

  function handleEditImageChange(e) {
    const file = e.target.files[0];

    if (!file) {
      return;
    }

    setEditImageFile(file);
    setEditImagePreview(URL.createObjectURL(file));
  }

  function handleSaveEdit(commentId) {
    if (editContent.trim() === "") {
      return;
    }

    setUpdating(true);

    updateComment(postId, commentId, editContent, editImageFile)
      .then(function (response) {
        const updatedComment = response.data.data.comment;

        setComments(function (prevComments) {
          const updated = [];

          for (let i = 0; i < prevComments.length; i++) {
            if (prevComments[i]._id === commentId) {
              updated.push(updatedComment);
            } else {
              updated.push(prevComments[i]);
            }
          }

          return updated;
        });

        cancelEditing();
      })
      .catch(function (error) {
        showAlert(
          "error",
          error.response?.data?.message || "Could not update comment",
        );
      })
      .finally(function () {
        setUpdating(false);
      });
  }

  function handleDelete(commentId) {
    deleteComment(postId, commentId)
      .then(function (response) {
        setComments(function (prevComments) {
          const updated = [];

          for (let i = 0; i < prevComments.length; i++) {
            if (prevComments[i]._id !== commentId) {
              updated.push(prevComments[i]);
            }
          }

          return updated;
        });
      })
      .catch(function (error) {
        showAlert(
          "error",
          error.response?.data?.message || "Could not delete comment",
        );
      });
  }

  function confirmDelete(commentId) {
    Swal.fire({
      icon: "warning",
      title: "Delete this comment?",
      showCancelButton: true,
      confirmButtonText: "Delete",
      cancelButtonText: "Cancel",
      background: "#181818",
      color: "#ffffff",
      iconColor: "#ff4d4d",
      customClass: {
        popup: "swal-wisp-popup",
        title: "swal-wisp-title",
        confirmButton: "swal-wisp-confirm",
      },
    }).then(function (result) {
      if (result.isConfirmed) {
        handleDelete(commentId);
      }
    });
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-start gap-2.5">
        {myAvatar && (
          <img
            src={myAvatar}
            alt="Me"
            className="w-8 h-8 rounded-full object-cover shrink-0"
          />
        )}

        <div className="flex-1 flex flex-col gap-2">
          <textarea
            value={newContent}
            onChange={(e) => setNewContent(e.target.value)}
            placeholder="Write a comment..."
            rows={2}
            className="w-full bg-[#242622] p-3 rounded-[10px] text-white placeholder:text-white/40 placeholder:text-[13px] text-[13px] font-(family-name:--text-font) resize-none focus:border focus:border-(--secondary-color) focus:outline-none"
          ></textarea>

          {newImagePreview && (
            <div className="relative w-fit">
              <img
                src={newImagePreview}
                alt="Preview"
                className="w-20 h-20 rounded-lg object-cover"
              />
              <button
                onClick={clearNewImage}
                className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-black/80 flex items-center justify-center text-white/80 hover:text-red-400 cursor-pointer"
              >
                <i className="fa-solid fa-xmark text-[10px]"></i>
              </button>
            </div>
          )}

          <div className="flex items-center justify-between">
            <button
              onClick={() => newImageInputRef.current.click()}
              className="text-white/50 hover:text-(--secondary-color) transition-colors cursor-pointer"
            >
              <i className="fa-regular fa-image text-[16px]"></i>
            </button>

            <input
              ref={newImageInputRef}
              type="file"
              accept="image/*"
              onChange={handleNewImageChange}
              className="hidden"
            />

            <button
              onClick={handlePostComment}
              disabled={newContent.trim() === "" || posting}
              className="px-4 py-1.5 rounded-lg bg-(--secondary-color) text-(--main-color) font-semibold text-[12px] font-(family-name:--text-font) hover:bg-transparent hover:border hover:border-(--secondary-color) hover:text-(--secondary-color) transition-all duration-200 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-(--secondary-color) disabled:hover:text-(--main-color)"
            >
              {posting ? "Posting..." : "Post"}
            </button>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        {loading && (
          <p className="text-center text-white/50 text-[13px] py-4 font-(family-name:--text-font)">
            Loading comments...
          </p>
        )}

        {!loading && comments.length === 0 && (
          <p className="text-center text-white/50 text-[13px] py-4 font-(family-name:--text-font)">
            No comments yet
          </p>
        )}

        {comments.map(function (comment) {
          const isMine = comment.commentCreator?._id === myUserId;
          const isEditing = editingCommentId === comment._id;

          return (
            <div key={comment._id} className="flex items-start gap-2.5">
              <Link to={`/profile/${comment.commentCreator?._id}`}>
                <img
                  src={comment.commentCreator?.photo}
                  alt="Avatar"
                  className="w-8 h-8 rounded-full object-cover shrink-0"
                />
              </Link>

              <div className="flex-1 min-w-0">
                {!isEditing && (
                  <div className="bg-black/30 border border-white/10 rounded-xl px-3 py-2">
                    <div className="flex items-center justify-between gap-2">
                      <Link to={`/profile/${comment.commentCreator?._id}`}>
                        <p className="text-white font-semibold text-[13px] font-(family-name:--text-font)">
                          {comment.commentCreator?.username}
                        </p>
                      </Link>

                      {isMine && (
                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            onClick={() => startEditing(comment)}
                            className="text-white/40 hover:text-(--secondary-color) transition-colors cursor-pointer"
                          >
                            <i className="fa-solid fa-pen text-[11px]"></i>
                          </button>
                          <button
                            onClick={() => confirmDelete(comment._id)}
                            className="text-white/40 hover:text-red-400 transition-colors cursor-pointer"
                          >
                            <i className="fa-solid fa-trash text-[11px]"></i>
                          </button>
                        </div>
                      )}
                    </div>

                    <p className="text-white/80 text-[13px] font-(family-name:--text-font) mt-0.5">
                      {comment.content}
                    </p>

                    {comment.image && (
                      <img
                        src={comment.image}
                        alt="Comment"
                        className="w-24 h-24 rounded-lg object-cover mt-2"
                      />
                    )}
                  </div>
                )}

                {isEditing && (
                  <div className="flex flex-col gap-2">
                    <textarea
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      rows={2}
                      className="w-full bg-[#242622] p-2.5 rounded-[10px] text-white text-[13px] font-(family-name:--text-font) resize-none focus:border focus:border-(--secondary-color) focus:outline-none"
                    ></textarea>

                    {editImagePreview && (
                      <img
                        src={editImagePreview}
                        alt="Preview"
                        className="w-20 h-20 rounded-lg object-cover"
                      />
                    )}

                    <div className="flex items-center justify-between">
                      <button
                        onClick={() => editImageInputRef.current.click()}
                        className="text-white/50 hover:text-(--secondary-color) transition-colors cursor-pointer"
                      >
                        <i className="fa-regular fa-image text-[14px]"></i>
                      </button>

                      <input
                        ref={editImageInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleEditImageChange}
                        className="hidden"
                      />

                      <div className="flex items-center gap-2">
                        <button
                          onClick={cancelEditing}
                          className="px-3 py-1 rounded-lg text-white/60 text-[12px] font-(family-name:--text-font) hover:text-white transition-colors cursor-pointer"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => handleSaveEdit(comment._id)}
                          disabled={editContent.trim() === "" || updating}
                          className="px-3 py-1 rounded-lg bg-(--secondary-color) text-(--main-color) font-semibold text-[12px] font-(family-name:--text-font) cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                          {updating ? "Saving..." : "Save"}
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                <p className="text-white/30 text-[11px] font-(family-name:--text-font) mt-1 ml-1">
                  {timeAgo(comment.createdAt)}
                </p>
              </div>
            </div>
          );
        })}

        {hasMore && !loading && comments.length > 0 && (
          <button
            onClick={handleLoadMore}
            disabled={loadingMore}
            className="text-(--secondary-color) text-[13px] font-(family-name:--text-font) cursor-pointer hover:underline self-center disabled:opacity-50"
          >
            {loadingMore ? "Loading..." : "Load more comments"}
          </button>
        )}
      </div>
    </div>
  );
}
