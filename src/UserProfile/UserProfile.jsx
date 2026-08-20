import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useParams, Navigate } from "react-router-dom";

function getMyUserIdFromToken() {
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

export default function UserProfile() {
  const { userId } = useParams();
  const myUserId = getMyUserIdFromToken();

  const [myProfile, setMyProfile] = useState(null);
  const [profile, setProfile] = useState(null);
  const [userPosts, setUserPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [avatarZoomed, setAvatarZoomed] = useState(false);
  const [asideOpen, setAsideOpen] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followLoading, setFollowLoading] = useState(false);

  function GetMyProfileData() {
    axios
      .get("https://route-posts.routemisr.com/users/profile-data", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then(function (response) {
        const profileData = response.data.data.user;
        setMyProfile(profileData);
      });
  }

  useEffect(() => {
    GetMyProfileData();
  }, []);

  function checkIfFollowing(followersArray) {
    if (!followersArray) {
      return false;
    }

    for (let i = 0; i < followersArray.length; i++) {
      const follower = followersArray[i];
      const followerId = typeof follower === "string" ? follower : follower._id;

      if (followerId === myUserId) {
        return true;
      }
    }

    return false;
  }

  function GetUserPosts(id) {
    axios
      .get(`https://route-posts.routemisr.com/users/${id}/posts`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then(function (response) {
        setUserPosts(response.data.data.posts);
      });
  }

  useEffect(
    function () {
      if (userId === myUserId) {
        return;
      }

      setLoading(true);

      axios
        .get(`https://route-posts.routemisr.com/users/${userId}/profile`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })
        .then(function (response) {
          const profileData = response.data.data.user;
          setProfile(profileData);
          setIsFollowing(checkIfFollowing(profileData.followers));
          GetUserPosts(userId);
        })
        .finally(function () {
          setLoading(false);
        });
    },
    [userId],
  );

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

  function handleFollowToggle() {
    setFollowLoading(true);

    axios
      .put(
        `https://route-posts.routemisr.com/users/${userId}/follow`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      )
      .then(function (response) {
        setIsFollowing(!isFollowing);
      })
      .finally(function () {
        setFollowLoading(false);
      });
  }

  if (userId === myUserId) {
    return <Navigate to="/myprofile" replace />;
  }

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
            src={myProfile?.photo}
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
                <div className="flex justify-around mt-3 text-center">
                  <div>
                    <p className="text-white font-bold text-[18px] font-(family-name:--text-font)">
                      {userPosts.length}
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

                <button
                  onClick={handleFollowToggle}
                  disabled={followLoading}
                  className={`w-full py-2 rounded-[10px] font-semibold text-[13px] font-(family-name:--text-font) transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
                    isFollowing
                      ? "bg-transparent border border-white/20 text-white/70 hover:border-red-500/50 hover:text-red-400"
                      : "bg-(--secondary-color) text-(--main-color) hover:bg-transparent hover:border hover:border-(--secondary-color) hover:text-(--secondary-color)"
                  }`}
                >
                  {followLoading ? "..." : isFollowing ? "Following" : "Follow"}
                </button>
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
              <p className="flex-1 text-center pb-3 flex items-center justify-center gap-2 font-(family-name:--text-font) text-[14px] font-semibold text-(--secondary-color) border-b-2 border-(--secondary-color)">
                <i className="fa-solid fa-table-cells"></i>
                Posts
              </p>
            </div>

            <div className="grid grid-cols-3 gap-1 mt-1">
              {userPosts.length === 0 && (
                <p className="col-span-3 text-center text-white/50 py-10 font-(family-name:--text-font)">
                  No posts yet
                </p>
              )}

              {userPosts.map(function (post) {
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
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
