import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import PostFormModal from "../PostFormModal/PostFormModal";

export default function MyProfile() {
  const [profile, setProfile] = useState(null);
  const [myPosts, setMyPosts] = useState([]);
  const [savedPosts, setSavedPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("posts");
  const [avatarZoomed, setAvatarZoomed] = useState(false);
  const [asideOpen, setAsideOpen] = useState(false);
  const [showCreatePost, setShowCreatePost] = useState(false);

  function GetMyPosts(userId) {
    axios
      .get(`https://route-posts.routemisr.com/users/${userId}/posts`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then(function (response) {
        setMyPosts(response.data.data.posts);
      });
  }

  function GetSavedPosts() {
    axios
      .get("https://route-posts.routemisr.com/users/bookmarks", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then(function (response) {
        setSavedPosts(response.data.data.bookmarks);
      });
  }

  useEffect(function () {
    setLoading(true);

    axios
      .get("https://route-posts.routemisr.com/users/profile-data", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then(function (response) {
        const profileData = response.data.data.user;
        setProfile(profileData);
        GetMyPosts(profileData._id);
        GetSavedPosts();
      })
      .finally(function () {
        setLoading(false);
      });
  }, []);

  useEffect(
    function () {
      if (avatarZoomed || asideOpen) {
        document.body.style.overflow = "hidden";
      } else {
        document.body.style.overflow = "auto";
      }

      return function () {
        document.body.style.overflow = "auto";
      };
    },
    [avatarZoomed, asideOpen],
  );

  function Logout() {
    localStorage.removeItem("token");
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
            src={profile?.photo}
            alt="Profile"
            className="w-10 h-10 rounded-full border-2 border-(--secondary-color) object-cover"
          />
        </Link>
      </nav>

      {loading && (
        <div className="flex items-center justify-center py-20">
          <p className="text-white/50 font-(family-name:--text-font)">
            Loading profile...
          </p>
        </div>
      )}

      {!loading && !profile && (
        <div className="flex items-center justify-center py-20">
          <p className="text-white/50 font-(family-name:--text-font)">
            Could not load profile
          </p>
        </div>
      )}

      {!loading && profile && (
        <>
          {avatarZoomed && (
            <div
              onClick={() => setAvatarZoomed(false)}
              className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center cursor-zoom-out"
            >
              <img
                src={profile.photo}
                alt={profile.username}
                className="w-70 h-70 rounded-full object-cover border-4 border-(--secondary-color)"
              />
            </div>
          )}

          <div className="max-w-150 mx-auto px-4 py-6">
            <div className="flex items-center gap-6">
              <img
                onClick={() => setAvatarZoomed(true)}
                src={profile.photo}
                alt={profile.username}
                className="w-24 h-24 rounded-full object-cover border-2 border-(--secondary-color) cursor-pointer hover:opacity-90 transition-opacity duration-200"
              />

              <div className="flex-1 flex flex-col gap-3">
                <div className="flex justify-around mt-5 text-center">
                  <div>
                    <p className="text-white font-bold text-[18px] font-(family-name:--text-font)">
                      {myPosts.length}
                    </p>
                    <p className="text-white/50 text-[13px] font-(family-name:--text-font)">
                      Posts
                    </p>
                  </div>
                  <div>
                    <p className="text-white font-bold text-[18px] font-(family-name:--text-font)">
                      {profile.followersCount}
                    </p>
                    <p className="text-white/50 text-[13px] font-(family-name:--text-font)">
                      Followers
                    </p>
                  </div>
                  <div>
                    <p className="text-white font-bold text-[18px] font-(family-name:--text-font)">
                      {profile.followingCount}
                    </p>
                    <p className="text-white/50 text-[13px] font-(family-name:--text-font)">
                      Following
                    </p>
                  </div>
                </div>

                <Link
                  to={"/settings"}
                  className="w-full py-2 text-center rounded-[10px] bg-(--secondary-color) text-(--main-color) font-semibold text-[13px] font-(family-name:--text-font) hover:bg-transparent hover:border hover:border-(--secondary-color) hover:text-(--secondary-color) transition-all duration-200 cursor-pointer"
                >
                  Edit profile
                </Link>
              </div>
            </div>

            <div>
              <p className="text-white font-semibold text-[16px] font-(family-name:--text-font)">
                {profile.name}
              </p>
              <p className="text-white/50 text-[14px] font-(family-name:--text-font)">
                @{profile.username}
              </p>
            </div>

            <div className="w-full flex items-center gap-5 border-b border-white/10 mt-6">
              <button
                onClick={() => setActiveTab("posts")}
                className={`flex-1 text-center pb-3 flex items-center justify-center gap-2 font-(family-name:--text-font) text-[14px] font-semibold transition-colors duration-200 cursor-pointer border-b-2 ${
                  activeTab === "posts"
                    ? "text-(--secondary-color) border-(--secondary-color)"
                    : "text-white/60 border-transparent hover:text-white"
                }`}
              >
                <i className="fa-solid fa-table-cells"></i>
                My Posts
              </button>
              <button
                onClick={() => setActiveTab("saved")}
                className={`flex-1 text-center pb-3 flex items-center justify-center gap-2 font-(family-name:--text-font) text-[14px] font-semibold transition-colors duration-200 cursor-pointer border-b-2 ${
                  activeTab === "saved"
                    ? "text-(--secondary-color) border-(--secondary-color)"
                    : "text-white/60 border-transparent hover:text-white"
                }`}
              >
                <i className="fa-regular fa-bookmark"></i>
                Saved Posts
              </button>
            </div>

            <div className="grid grid-cols-3 gap-1 mt-1">
              {(activeTab === "posts" ? myPosts : savedPosts).length === 0 && (
                <p className="col-span-3 text-center text-white/50 py-10 font-(family-name:--text-font)">
                  {activeTab === "posts"
                    ? "No posts yet"
                    : "No saved posts yet"}
                </p>
              )}

              {(activeTab === "posts" ? myPosts : savedPosts).map(
                function (post) {
                  return (
                    <Link
                      to={`/post/${post._id}`}
                      key={post._id}
                      className="aspect-square bg-[#242622] overflow-hidden cursor-pointer group relative"
                    >
                      {post.isShare && post.sharedPost?.image ? (
                        <img
                          src={post.sharedPost.image}
                          alt="Post"
                          className="w-full h-full object-cover group-hover:opacity-80 transition-opacity duration-200"
                        />
                      ) : post.image ? (
                        <img
                          src={post.image}
                          alt="Post"
                          className="w-full h-full object-cover group-hover:opacity-80 transition-opacity duration-200"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center p-2">
                          <p className="text-white/60 text-[12px] font-(family-name:--text-font) line-clamp-4 text-center">
                            {post.isShare && post.sharedPost
                              ? post.sharedPost.body
                              : post.body}
                          </p>
                        </div>
                      )}

                      {post.isShare && (
                        <div className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-black/70 flex items-center justify-center">
                          <i className="fa-solid fa-share text-white text-[10px]"></i>
                        </div>
                      )}
                    </Link>
                  );
                },
              )}
            </div>
          </div>
        </>
      )}

      <button
        onClick={() => setShowCreatePost(true)}
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-(--secondary-color) text-(--main-color) flex items-center justify-center shadow-lg hover:scale-105 transition-transform duration-200 cursor-pointer z-30"
      >
        <i className="fa-solid fa-plus text-[20px]"></i>
      </button>

      {showCreatePost && (
        <PostFormModal
          mode="create"
          onClose={() => setShowCreatePost(false)}
          onSuccess={(newPost) =>
            setMyPosts(function (prevPosts) {
              const updated = [newPost];

              for (let i = 0; i < prevPosts.length; i++) {
                updated.push(prevPosts[i]);
              }

              return updated;
            })
          }
        />
      )}
    </div>
  );
}
