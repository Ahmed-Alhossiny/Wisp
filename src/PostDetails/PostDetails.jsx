import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import ShareModal from "../ShareModal/ShareModal";
import { isIdInArray } from "../Utils/arrayHelpers";
import { showAlert } from "../Utils/showAlert";
import { getMyUserIdFromToken } from "../Utils/auth";
import {
  getStoredLikedIds,
  persistLikedIds,
  getStoredBookmarkedIds,
  persistBookmarkedIds,
} from "../Utils/postInteractions";
import SharedPostPreview from "../SharedPostPreview/SharedPostPreview";
import PostComments from "../PostComments/PostComments";
import PostFormModal from "../PostFormModal/PostFormModal";
import Swal from "sweetalert2";

export default function PostDetails() {
  const { postId } = useParams();
  const navigate = useNavigate();
  const myUserId = getMyUserIdFromToken();

  const [profile, setProfile] = useState(false);
  const [asideOpen, setAsideOpen] = useState(false);
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);

  const [showOptionsMenu, setShowOptionsMenu] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const optionsMenuRef = useRef(null);

  function GetMyProfileData() {
    axios
      .get("https://route-posts.routemisr.com/users/profile-data", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then(function (response) {
        const profileData = response.data.data.user;
        setProfile(profileData);
      });
  }

  useEffect(() => {
    GetMyProfileData();
  }, []);

  function Logout() {
    localStorage.removeItem("token");
  }

  function timeAgo(dateString) {
    const date = new Date(dateString);
    const now = new Date();

    const seconds = Math.floor((now - date) / 1000);

    if (seconds < 60) {
      return `${seconds} second${seconds !== 1 ? "s" : ""} ago`;
    }
    const minutes = Math.floor(seconds / 60);

    if (minutes < 60) {
      return `${minutes} minute${minutes !== 1 ? "s" : ""} ago`;
    }
    const hours = Math.floor(minutes / 60);

    if (hours < 24) {
      return `${hours} hour${hours !== 1 ? "s" : ""} ago`;
    }
    const days = Math.floor(hours / 24);

    if (days < 30) {
      return `${days} day${days !== 1 ? "s" : ""} ago`;
    }
    const months = Math.floor(days / 30);

    if (months < 12) {
      return `${months} month${months !== 1 ? "s" : ""} ago`;
    }
    const years = Math.floor(days / 365);

    return `${years} year${years !== 1 ? "s" : ""} ago`;
  }

  useEffect(
    function () {
      setLoading(true);

      axios
        .get(`https://route-posts.routemisr.com/posts/${postId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })
        .then(function (response) {
          const postData = response.data.data.post;
          setPost(postData);
          setLiked(isIdInArray(getStoredLikedIds(), postId));
          setBookmarked(isIdInArray(getStoredBookmarkedIds(), postId));
        })
        .finally(function () {
          setLoading(false);
        });
    },
    [postId],
  );

  useEffect(
    function () {
      if (asideOpen || showShareModal) {
        document.body.style.overflow = "hidden";
      } else {
        document.body.style.overflow = "auto";
      }

      return function () {
        document.body.style.overflow = "auto";
      };
    },
    [asideOpen, showShareModal],
  );

  useEffect(function () {
    function handleDocumentClick(e) {
      if (
        optionsMenuRef.current &&
        !optionsMenuRef.current.contains(e.target)
      ) {
        setShowOptionsMenu(false);
      }
    }

    document.addEventListener("click", handleDocumentClick);

    return function () {
      document.removeEventListener("click", handleDocumentClick);
    };
  }, []);

  function handleLikeToggle() {
    const wasLiked = liked;
    const newCount = wasLiked ? post.likesCount - 1 : post.likesCount + 1;

    setLiked(!wasLiked);
    setPost(function (prevPost) {
      return { ...prevPost, likesCount: newCount };
    });

    const updatedLikedIds = wasLiked
      ? getStoredLikedIds().filter((id) => id !== postId)
      : [...getStoredLikedIds(), postId];
    persistLikedIds(updatedLikedIds);

    axios
      .put(
        `https://route-posts.routemisr.com/posts/${postId}/like`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      )
      .catch(function (error) {
        setLiked(wasLiked);
        setPost(function (prevPost) {
          return { ...prevPost, likesCount: post.likesCount };
        });

        const revertedLikedIds = wasLiked
          ? [...getStoredLikedIds(), postId]
          : getStoredLikedIds().filter((id) => id !== postId);
        persistLikedIds(revertedLikedIds);

        showAlert("error", "Could not update like");
      });
  }

  function handleBookmarkToggle() {
    const wasBookmarked = bookmarked;
    setBookmarked(!wasBookmarked);

    const updatedBookmarkedIds = wasBookmarked
      ? getStoredBookmarkedIds().filter((id) => id !== postId)
      : [...getStoredBookmarkedIds(), postId];
    persistBookmarkedIds(updatedBookmarkedIds);

    axios
      .put(
        `https://route-posts.routemisr.com/posts/${postId}/bookmark`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      )
      .catch(function (error) {
        setBookmarked(wasBookmarked);

        const revertedBookmarkedIds = wasBookmarked
          ? [...getStoredBookmarkedIds(), postId]
          : getStoredBookmarkedIds().filter((id) => id !== postId);
        persistBookmarkedIds(revertedBookmarkedIds);

        showAlert("error", "Could not update bookmark");
      });
  }

  function confirmDeletePost() {
    Swal.fire({
      icon: "warning",
      title: "Delete this post?",
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
        handleDeletePost();
      }
    });
  }

  function handleDeletePost() {
    axios
      .delete(`https://route-posts.routemisr.com/posts/${postId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then(function (response) {
        showAlert("success", "Post deleted");
        navigate("/");
      })
      .catch(function (error) {
        showAlert(
          "error",
          error.response?.data?.message || "Could not delete post",
        );
      });
  }

  return (
    <div className="w-full min-h-dvh bg-(--main-color)">
      {asideOpen && (
        <div
          onClick={() => setAsideOpen(false)}
          className="fixed inset-0 bg-black/50 z-40"
        ></div>
      )}

      <aside
        className={`fixed top-0 left-0 h-full w-65 bg-[#181818] border-r border-(--secondary-color) z-50 transform transition-transform duration-300 ${
          asideOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          <span className="text-(--secondary-color) font-(family-name:--boldy-font) text-[20px]">
            WISP
          </span>
          <button
            onClick={() => setAsideOpen(false)}
            className="text-white hover:text-(--secondary-color) transition-colors cursor-pointer"
          >
            <i className="fa-solid fa-xmark text-[18px]"></i>
          </button>
        </div>
        <nav className="flex flex-col gap-1 p-3">
          <Link
            to="/"
            className="flex items-center gap-3 text-white px-3 py-2.5 rounded-[10px] hover:bg-(--secondary-color) hover:text-(--main-color) transition-all duration-200 font-(family-name:--text-font)"
          >
            <i className="fa-solid fa-house w-5"></i>
            Home
          </Link>
          <Link
            to="/myprofile"
            className="flex items-center gap-3 text-white px-3 py-2.5 rounded-[10px] hover:bg-(--secondary-color) hover:text-(--main-color) transition-all duration-200 font-(family-name:--text-font)"
          >
            <i className="fa-solid fa-user w-5"></i>
            Profile
          </Link>
          <Link
            to="/settings"
            className="flex items-center gap-3 text-white px-3 py-2.5 rounded-[10px] hover:bg-(--secondary-color) hover:text-(--main-color) transition-all duration-200 font-(family-name:--text-font)"
          >
            <i className="fa-solid fa-gear w-5"></i>
            Settings
          </Link>
          <Link
            to="/about"
            className="flex items-center gap-3 text-white px-3 py-2.5 rounded-[10px] hover:bg-(--secondary-color) hover:text-(--main-color) transition-all duration-200 font-(family-name:--text-font)"
          >
            <i className="fa-solid fa-circle-info w-5"></i>
            About
          </Link>
          <Link
            to={"/"}
            onClick={Logout}
            className="flex items-center gap-3 text-white px-3 py-2.5 rounded-[10px] hover:bg-(--secondary-color) hover:text-(--main-color) transition-all duration-200 font-(family-name:--text-font) mt-2 border-t border-white/10 pt-4 cursor-pointer"
          >
            <i className="fa-solid fa-arrow-right-from-bracket w-5"></i>
            Logout
          </Link>
        </nav>
      </aside>

      <nav className="w-full sticky top-0 z-30 bg-(--main-color) border-b border-white/10 px-4 py-3 grid grid-cols-3 items-center">
        <button
          onClick={() => setAsideOpen(true)}
          className="justify-self-start text-white hover:text-(--secondary-color) transition-colors cursor-pointer"
        >
          <i className="fa-solid fa-bars text-[22px]"></i>
        </button>

        <Link
          to="/"
          className="justify-self-center text-(--secondary-color) font-(family-name:--boldy-font) text-[30px]"
        >
          WISP
        </Link>

        <Link to="/myprofile" className="justify-self-end">
          <img
            src={profile.photo}
            alt="Profile"
            className="w-10 h-10 rounded-full border-2 border-(--secondary-color) object-cover"
          />
        </Link>
      </nav>

      {loading && (
        <p className="text-center text-white/50 py-20 font-(family-name:--text-font)">
          Loading post...
        </p>
      )}

      {!loading && !post && (
        <p className="text-center text-white/50 py-20 font-(family-name:--text-font)">
          Post not found
        </p>
      )}

      {!loading && post && (
        <div className="max-w-150 mx-auto px-4 py-5">
          <div className="bg-black/35 border border-white/10 rounded-2xl overflow-hidden">
            <div className="flex items-center gap-3 p-3">
              <Link to={`/profile/${post.user._id}`}>
                <img
                  src={post.user.photo}
                  alt="Avatar"
                  className="w-10 h-10 rounded-full object-cover"
                />
              </Link>

              <div>
                <Link to={`/profile/${post.user._id}`}>
                  <p className="text-white font-semibold text-[15px] font-(family-name:--text-font)">
                    {post.user.username}
                  </p>
                </Link>

                <p className="text-white/50 text-[12px] font-(family-name:--text-font)">
                  {timeAgo(post.createdAt)}
                </p>
              </div>

              {post.user._id === myUserId && (
                <div ref={optionsMenuRef} className="relative ml-auto">
                  <button
                    onClick={() => setShowOptionsMenu(!showOptionsMenu)}
                    className="text-white/60 hover:text-(--secondary-color) cursor-pointer px-2 py-1"
                  >
                    <i className="fa-solid fa-ellipsis"></i>
                  </button>

                  {showOptionsMenu && (
                    <div className="absolute right-0 top-full mt-1 bg-[#181818] border border-white/10 rounded-[10px] overflow-hidden z-30 w-32 shadow-lg">
                      <button
                        onClick={() => {
                          setShowEditModal(true);
                          setShowOptionsMenu(false);
                        }}
                        className="w-full text-left px-4 py-2.5 text-[13px] text-white/80 hover:bg-white/5 cursor-pointer font-(family-name:--text-font)"
                      >
                        Edit
                      </button>
                      <button
                        onClick={confirmDeletePost}
                        className="w-full text-left px-4 py-2.5 text-[13px] text-red-400 hover:bg-white/5 cursor-pointer font-(family-name:--text-font)"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {post.image && (
              <div className="w-full h-fit bg-[#242622]">
                <img
                  src={post.image}
                  alt="Post Image"
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            <p className="text-white/90 px-4 py-3 text-[14px] font-(family-name:--text-font)">
              {post.body}
            </p>

            {post.isShare && post.sharedPost && (
              <SharedPostPreview sharedPost={post.sharedPost} />
            )}

            <div className="flex items-center gap-5 px-4 pb-3 border-t border-white/10 pt-3">
              <button
                onClick={handleLikeToggle}
                className={`flex items-center gap-2 transition-colors cursor-pointer ${
                  liked
                    ? "text-(--secondary-color)"
                    : "text-white/70 hover:text-(--secondary-color)"
                }`}
              >
                <i
                  className={`${liked ? "fa-solid" : "fa-regular"} fa-heart text-[18px]`}
                ></i>
                <span className="text-[13px] font-(family-name:--text-font)">
                  {post.likesCount}
                </span>
              </button>
              <button
                onClick={() => setShowShareModal(true)}
                className="flex items-center gap-2 text-white/70 hover:text-(--secondary-color) transition-colors cursor-pointer ms-auto"
              >
                <i className="fa-regular fa-paper-plane text-[18px]"></i>
                <span className="text-[13px] font-(family-name:--text-font)">
                  {post.sharesCount}
                </span>
              </button>
              <button
                onClick={handleBookmarkToggle}
                className={`flex items-center gap-2 transition-colors cursor-pointer ${
                  bookmarked
                    ? "text-(--secondary-color)"
                    : "text-white/70 hover:text-(--secondary-color)"
                }`}
              >
                <i
                  className={`${bookmarked ? "fa-solid" : "fa-regular"} fa-bookmark text-[18px]`}
                ></i>
              </button>
            </div>
          </div>
          <div className="mt-5">
            <h3 className="text-white font-bold text-[16px] font-(family-name:--text-font) mb-4">
              Comments
            </h3>
            <PostComments postId={postId} myAvatar={profile.photo} />
          </div>
        </div>
      )}

      {showShareModal && post && (
        <ShareModal post={post} onClose={() => setShowShareModal(false)} />
      )}

      {showEditModal && post && (
        <PostFormModal
          mode="edit"
          post={post}
          onClose={() => setShowEditModal(false)}
          onSuccess={(updatedPost) => setPost(updatedPost)}
        />
      )}
    </div>
  );
}
