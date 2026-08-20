import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import SuggestedFriends from "../SuggestedFriends/SuggestedFriends";
import Notifications from "../Notifications/Notifications";
import ShareModal from "../ShareModal/ShareModal";
import { getMyUserIdFromToken } from "../Utils/auth";
import {
  isIdInArray,
  updatePostFields,
  toggleIdInList,
} from "../Utils/arrayHelpers";
import { showAlert } from "../Utils/showAlert";
import {
  getStoredLikedIds,
  persistLikedIds,
  getStoredBookmarkedIds,
  persistBookmarkedIds,
} from "../Utils/postInteractions";
import SharedPostPreview from "../SharedPostPreview/SharedPostPreview";
import CommentsModal from "../CommentsModal/CommentsModal";
import PostFormModal from "../PostFormModal/PostFormModal";
import Swal from "sweetalert2";

export default function Home() {
  const myUserId = getMyUserIdFromToken();

  const [profile, setProfile] = useState(false);
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [commentsModalPost, setCommentsModalPost] = useState(null);
  const [asideOpen, setAsideOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("feed");
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const [feedFilter, setFeedFilter] = useState("all");
  const [filterDropdownOpen, setFilterDropdownOpen] = useState(false);
  const filterContainerRef = useRef(null);

  const [likedPostIds, setLikedPostIds] = useState(getStoredLikedIds());
  const [bookmarkedPostIds, setBookmarkedPostIds] = useState(
    getStoredBookmarkedIds(),
  );
  const [shareModalPost, setShareModalPost] = useState(null);

  const [showOptionsMenuId, setShowOptionsMenuId] = useState(null);
  const [editModalPost, setEditModalPost] = useState(null);
  const optionsMenuRef = useRef(null);

  const POSTS_PER_PAGE = 40;

  useEffect(
    function () {
      if (asideOpen) {
        document.body.style.overflow = "hidden";
      } else {
        document.body.style.overflow = "auto";
      }

      return function () {
        document.body.style.overflow = "auto";
      };
    },
    [asideOpen],
  );

  useEffect(function () {
    function handleDocumentClick(e) {
      if (
        filterContainerRef.current &&
        !filterContainerRef.current.contains(e.target)
      ) {
        setFilterDropdownOpen(false);
      }
    }

    document.addEventListener("click", handleDocumentClick);

    return function () {
      document.removeEventListener("click", handleDocumentClick);
    };
  }, []);

  useEffect(function () {
    function handleDocumentClick(e) {
      if (
        optionsMenuRef.current &&
        !optionsMenuRef.current.contains(e.target)
      ) {
        setShowOptionsMenuId(null);
      }
    }

    document.addEventListener("click", handleDocumentClick);

    return function () {
      document.removeEventListener("click", handleDocumentClick);
    };
  }, []);

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

  const tabs = [
    { id: "feed", label: "Feed" },
    { id: "suggested", label: "Suggested Friends" },
    { id: "notifications", label: "Notifications" },
  ];

  function GetAllPosts(pageNum) {
    if (loading || !hasMore) {
      return;
    }

    setLoading(true);

    const url =
      feedFilter === "following"
        ? "https://route-posts.routemisr.com/posts/feed"
        : "https://route-posts.routemisr.com/posts";

    const params =
      feedFilter === "following"
        ? { only: "following", page: pageNum, limit: POSTS_PER_PAGE }
        : { page: pageNum, limit: POSTS_PER_PAGE };

    axios
      .get(url, {
        params: params,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then(function (response) {
        let newPosts = response.data.data.posts;

        if (feedFilter === "following") {
          const filtered = [];

          for (let i = 0; i < newPosts.length; i++) {
            if (newPosts[i].user._id !== myUserId) {
              filtered.push(newPosts[i]);
            }
          }

          newPosts = filtered;
        }

        if (newPosts.length < POSTS_PER_PAGE) {
          setHasMore(false);
        }

        setPosts(function (prevPosts) {
          const existingIds = new Set();

          for (let i = 0; i < prevPosts.length; i++) {
            existingIds.add(prevPosts[i]._id);
          }

          const merged = [];

          for (let i = 0; i < prevPosts.length; i++) {
            merged.push(prevPosts[i]);
          }

          for (let i = 0; i < newPosts.length; i++) {
            if (!existingIds.has(newPosts[i]._id)) {
              merged.push(newPosts[i]);
            }
          }

          return merged;
        });

        setLoading(false);
      })
      .catch(function (error) {
        setLoading(false);
      });
  }

  useEffect(
    function () {
      GetAllPosts(page);
    },
    [page, feedFilter],
  );

  useEffect(
    function () {
      function handleScroll() {
        const scrollPosition = window.innerHeight + window.scrollY;
        const pageHeight = document.documentElement.offsetHeight;

        if (scrollPosition >= pageHeight - 300 && !loading && hasMore) {
          setPage(function (prevPage) {
            return prevPage + 1;
          });
        }
      }

      window.addEventListener("scroll", handleScroll);

      return function () {
        window.removeEventListener("scroll", handleScroll);
      };
    },
    [loading, hasMore],
  );

  function handleFilterChange(filter) {
    if (filter === feedFilter) {
      setFilterDropdownOpen(false);
      return;
    }

    setPosts([]);
    setHasMore(true);
    setFeedFilter(filter);
    setPage(1);
    setFilterDropdownOpen(false);
  }

  function handleLikeToggle(post) {
    const wasLiked = isIdInArray(likedPostIds, post._id);
    const newCount = wasLiked ? post.likesCount - 1 : post.likesCount + 1;

    setLikedPostIds(function (prevIds) {
      const updated = toggleIdInList(prevIds, post._id);
      persistLikedIds(updated);
      return updated;
    });

    setPosts(function (prevPosts) {
      return updatePostFields(prevPosts, post._id, { likesCount: newCount });
    });

    axios
      .put(
        `https://route-posts.routemisr.com/posts/${post._id}/like`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      )
      .catch(function (error) {
        setLikedPostIds(function (prevIds) {
          const updated = toggleIdInList(prevIds, post._id);
          persistLikedIds(updated);
          return updated;
        });

        setPosts(function (prevPosts) {
          return updatePostFields(prevPosts, post._id, {
            likesCount: post.likesCount,
          });
        });

        showAlert("error", "Could not update like", 2000);
      });
  }

  function handleBookmarkToggle(post) {
    setBookmarkedPostIds(function (prevIds) {
      const updated = toggleIdInList(prevIds, post._id);
      persistBookmarkedIds(updated);
      return updated;
    });

    axios
      .put(
        `https://route-posts.routemisr.com/posts/${post._id}/bookmark`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      )
      .catch(function (error) {
        setBookmarkedPostIds(function (prevIds) {
          const updated = toggleIdInList(prevIds, post._id);
          persistBookmarkedIds(updated);
          return updated;
        });

        showAlert("error", "Could not update bookmark", 2000);
      });
  }

  function confirmDeletePost(postId) {
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
        handleDeletePost(postId);
      }
    });
  }

  function handleDeletePost(postId) {
    axios
      .delete(`https://route-posts.routemisr.com/posts/${postId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then(function (response) {
        showAlert("success", "Post deleted", 2000);

        setPosts(function (prevPosts) {
          return prevPosts.filter((p) => p._id !== postId);
        });
      })
      .catch(function (error) {
        showAlert(
          "error",
          error.response?.data?.message || "Could not delete post",
          2000,
        );
      });
  }

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
    location.reload();
  }

  return (
    <>
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
            <button
              onClick={Logout}
              className="flex items-center gap-3 text-white px-3 py-2.5 rounded-[10px] hover:bg-(--secondary-color) hover:text-(--main-color) transition-all duration-200 font-(family-name:--text-font) mt-2 border-t border-white/10 pt-4 cursor-pointer"
            >
              <i className="fa-solid fa-arrow-right-from-bracket w-5"></i>
              Logout
            </button>
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

        <div className="w-full sticky top-17 z-20 bg-(--main-color)/50 backdrop-blur-sm border-b border-white/10">
          <div className="max-w-150 mx-auto flex items-center gap-5 px-4">
            {tabs.map((tab) => {
              if (tab.id === "feed") {
                return (
                  <div
                    key={tab.id}
                    ref={filterContainerRef}
                    className="flex-1 relative"
                  >
                    <div className="flex items-center justify-center gap-1">
                      <button
                        onClick={() => setActiveTab(tab.id)}
                        className={`text-center pb-3 pt-3 whitespace-nowrap font-(family-name:--text-font) text-[15px] transition-colors duration-200 cursor-pointer border-b-2 ${
                          activeTab === tab.id
                            ? "text-(--secondary-color) border-(--secondary-color)"
                            : "text-white/60 border-transparent hover:text-white"
                        }`}
                      >
                        {tab.label}
                      </button>
                      <button
                        onClick={() =>
                          setFilterDropdownOpen(!filterDropdownOpen)
                        }
                        className={`pb-3 pt-3 cursor-pointer transition-colors duration-200 ${
                          activeTab === tab.id
                            ? "text-(--secondary-color)"
                            : "text-white/60 hover:text-white"
                        }`}
                      >
                        <i
                          className={`fa-solid fa-chevron-down text-[10px] transition-transform duration-200 ${
                            filterDropdownOpen ? "rotate-180" : ""
                          }`}
                        ></i>
                      </button>
                    </div>

                    {filterDropdownOpen && (
                      <div className="absolute top-full left-15 -translate-x-1/2 mt-1 bg-[#181818] border border-white/10 rounded-[10px] overflow-hidden z-30 w-36 shadow-lg">
                        <button
                          onClick={() => handleFilterChange("all")}
                          className={`w-full text-left px-4 py-2.5 text-[13px] font-(family-name:--text-font) transition-colors duration-200 cursor-pointer ${
                            feedFilter === "all"
                              ? "text-(--secondary-color) bg-(--secondary-color)/10"
                              : "text-white/70 hover:bg-white/5"
                          }`}
                        >
                          For You
                        </button>
                        <button
                          onClick={() => handleFilterChange("following")}
                          className={`w-full text-left px-4 py-2.5 text-[13px] font-(family-name:--text-font) transition-colors duration-200 cursor-pointer ${
                            feedFilter === "following"
                              ? "text-(--secondary-color) bg-(--secondary-color)/10"
                              : "text-white/70 hover:bg-white/5"
                          }`}
                        >
                          Following
                        </button>
                      </div>
                    )}
                  </div>
                );
              }

              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 text-center pb-3 pt-3 whitespace-nowrap font-(family-name:--text-font) text-[15px] transition-colors duration-200 cursor-pointer border-b-2 ${
                    activeTab === tab.id
                      ? "text-(--secondary-color) border-(--secondary-color)"
                      : "text-white/60 border-transparent hover:text-white"
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {activeTab == "feed" && (
          <main className="max-w-150 mx-auto px-4 py-5">
            <div className="flex flex-col gap-5">
              {posts.map((post) => {
                const liked = isIdInArray(likedPostIds, post._id);
                const bookmarked = isIdInArray(bookmarkedPostIds, post._id);

                return (
                  <div
                    key={post._id}
                    className="bg-black/35 border border-white/10 rounded-2xl overflow-hidden"
                  >
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
                        <div
                          ref={
                            showOptionsMenuId === post._id
                              ? optionsMenuRef
                              : null
                          }
                          className="relative ml-auto"
                        >
                          <button
                            onClick={() =>
                              setShowOptionsMenuId(
                                showOptionsMenuId === post._id
                                  ? null
                                  : post._id,
                              )
                            }
                            className="text-white/60 hover:text-(--secondary-color) cursor-pointer px-2 py-1"
                          >
                            <i className="fa-solid fa-ellipsis"></i>
                          </button>

                          {showOptionsMenuId === post._id && (
                            <div className="absolute right-0 top-full mt-1 bg-[#181818] border border-white/10 rounded-[10px] overflow-hidden z-30 w-32 shadow-lg">
                              <button
                                onClick={() => {
                                  setEditModalPost(post);
                                  setShowOptionsMenuId(null);
                                }}
                                className="w-full text-left px-4 py-2.5 text-[13px] text-white/80 hover:bg-white/5 cursor-pointer font-(family-name:--text-font)"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => {
                                  setShowOptionsMenuId(null);
                                  confirmDeletePost(post._id);
                                }}
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
                        onClick={() => handleLikeToggle(post)}
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
                        onClick={() => setCommentsModalPost(post)}
                        className="flex items-center gap-2 text-white/70 hover:text-(--secondary-color) transition-colors cursor-pointer"
                      >
                        <i className="fa-regular fa-comment text-[18px]"></i>
                        <span className="text-[13px] font-(family-name:--text-font)">
                          {post.commentsCount}
                        </span>
                      </button>
                      <button
                        onClick={() => setShareModalPost(post)}
                        className="flex items-center gap-2 text-white/70 hover:text-(--secondary-color) transition-colors cursor-pointer ms-auto"
                      >
                        <i className="fa-regular fa-paper-plane text-[18px]"></i>
                        <span className="text-[13px] font-(family-name:--text-font)">
                          {post.sharesCount}
                        </span>
                      </button>
                      <button
                        onClick={() => handleBookmarkToggle(post)}
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
                );
              })}
            </div>

            {!loading && posts.length === 0 && feedFilter === "following" && (
              <p className="text-center text-white/50 py-10 font-(family-name:--text-font)">
                No posts from people you follow yet
              </p>
            )}

            {loading && (
              <p className="text-center text-white/50 py-5 font-(family-name:--text-font)">
                Loading posts...
              </p>
            )}

            {!hasMore && posts.length > 0 && (
              <p className="text-center text-white/40 py-5 font-(family-name:--text-font)">
                You've reached the end
              </p>
            )}
          </main>
        )}
        {activeTab == "suggested" && <SuggestedFriends />}
        {activeTab == "notifications" && <Notifications />}

        <button
          onClick={() => setShowCreatePost(true)}
          className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-(--secondary-color) text-(--main-color) flex items-center justify-center shadow-lg hover:scale-105 transition-transform duration-200 cursor-pointer z-30"
        >
          <i className="fa-solid fa-plus text-[20px]"></i>
        </button>
      </div>

      {shareModalPost && (
        <ShareModal
          post={shareModalPost}
          onClose={() => setShareModalPost(null)}
        />
      )}

      {commentsModalPost && (
        <CommentsModal
          post={commentsModalPost}
          myAvatar={profile.photo}
          onClose={() => setCommentsModalPost(null)}
        />
      )}

      {showCreatePost && (
        <PostFormModal
          mode="create"
          onClose={() => setShowCreatePost(false)}
          onSuccess={(newPost) =>
            setPosts(function (prevPosts) {
              const updated = [newPost];

              for (let i = 0; i < prevPosts.length; i++) {
                updated.push(prevPosts[i]);
              }

              return updated;
            })
          }
        />
      )}

      {editModalPost && (
        <PostFormModal
          mode="edit"
          post={editModalPost}
          onClose={() => setEditModalPost(null)}
          onSuccess={(updatedPost) => {
            setPosts(function (prevPosts) {
              return updatePostFields(prevPosts, updatedPost._id, updatedPost);
            });
            setEditModalPost(null);
          }}
        />
      )}
    </>
  );
}
