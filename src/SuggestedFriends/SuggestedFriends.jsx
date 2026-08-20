import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function SuggestedFriends() {
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [followedIds, setFollowedIds] = useState([]);
  const [followLoadingId, setFollowLoadingId] = useState(null);

  function GetSuggestions() {
    setLoading(true);

    axios
      .get("https://route-posts.routemisr.com/users/suggestions", {
        params: {
          limit: 10,
        },
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then(function (response) {
        setSuggestions(response.data.data.suggestions);
        setLoading(false);
      })
      .catch(function (error) {
        setLoading(false);
      });
  }

  useEffect(function () {
    GetSuggestions();
  }, []);

  function handleFollow(userId) {
    setFollowLoadingId(userId);

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
        setFollowedIds(function (prevIds) {
          const updated = [];

          for (let i = 0; i < prevIds.length; i++) {
            updated.push(prevIds[i]);
          }
          updated.push(userId);

          return updated;
        });
      })
      .finally(function () {
        setFollowLoadingId(null);
      });
  }

  function isFollowed(userId) {
    for (let i = 0; i < followedIds.length; i++) {
      if (followedIds[i] === userId) {
        return true;
      }
    }
    return false;
  }

  return (
    <div className="flex flex-col gap-3 p-3">
      {loading && (
        <p className="text-center text-white/50 py-5 font-(family-name:--text-font)">
          Loading suggestions...
        </p>
      )}

      {!loading && suggestions.length === 0 && (
        <p className="text-center text-white/50 py-5 font-(family-name:--text-font)">
          No suggestions right now
        </p>
      )}

      {suggestions.map(function (user) {
        const followed = isFollowed(user._id);

        return (
          <div
            key={user._id}
            className="bg-black/35 border border-white/10 rounded-2xl p-3 flex items-center gap-3"
          >
            <Link to={`/profile/${user._id}`}>
              <img
                src={
                  user.photo ||
                  `https://ui-avatars.com/api/?name=${user.name}&background=aeff46&color=212121`
                }
                alt={user.username}
                className="w-12 h-12 rounded-full object-cover"
              />
            </Link>

            <div className="flex-1 min-w-0">
              <Link to={`/profile/${user._id}`}>
                <p className="text-white font-semibold text-[15px] font-(family-name:--text-font) truncate">
                  {user.name}
                </p>
              </Link>
              <p className="text-white/50 text-[13px] font-(family-name:--text-font) truncate">
                @{user.username}
              </p>
            </div>

            <button
              onClick={() => handleFollow(user._id)}
              disabled={followed || followLoadingId === user._id}
              className={`px-4 py-2 rounded-[10px] text-[13px] font-semibold font-(family-name:--text-font) transition-all duration-200 cursor-pointer whitespace-nowrap disabled:cursor-not-allowed ${
                followed
                  ? "bg-transparent border border-white/20 text-white/40"
                  : "bg-(--secondary-color) text-(--main-color) hover:bg-transparent hover:border hover:border-(--secondary-color) hover:text-(--secondary-color)"
              }`}
            >
              {followLoadingId === user._id
                ? "..."
                : followed
                  ? "Following"
                  : "Follow"}
            </button>
          </div>
        );
      })}
    </div>
  );
}
