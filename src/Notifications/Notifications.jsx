import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Notifications() {
  const navigate = useNavigate();

  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [markingAllRead, setMarkingAllRead] = useState(false);

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

  function getNotificationIcon(type) {
    if (type === "like") {
      return "fa-solid fa-heart";
    }
    if (type === "comment") {
      return "fa-solid fa-comment";
    }
    if (type === "follow") {
      return "fa-solid fa-user-plus";
    }
    return "fa-solid fa-bell";
  }

  function getNotificationIconColor(type) {
    if (type === "like") {
      return "text-red-500";
    }
    if (type === "comment") {
      return "text-blue-400";
    }
    if (type === "follow") {
      return "text-(--secondary-color)";
    }
    return "text-white/60";
  }

  function GetNotifications(unreadOnly) {
    setLoading(true);

    axios
      .get("https://route-posts.routemisr.com/notifications", {
        params: {
          unread: unreadOnly,
          page: 1,
          limit: 10,
        },
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then(function (response) {
        setNotifications(response.data.data.notifications);
        setLoading(false);
      })
      .catch(function (error) {
        setLoading(false);
      });
  }

  function GetUnreadCount() {
    axios
      .get("https://route-posts.routemisr.com/notifications/unread-count", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then(function (response) {
        setUnreadCount(response.data.data.count);
      });
  }

  useEffect(
    function () {
      GetNotifications(filter === "unread");
      GetUnreadCount();
    },
    [filter],
  );

  function handleNotificationClick(notification) {
    if (!notification.read) {
      axios
        .patch(
          `https://route-posts.routemisr.com/notifications/${notification._id}/read`,
          {},
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          },
        )
        .then(function (response) {
          setNotifications(function (prevNotifications) {
            const updated = [];

            for (let i = 0; i < prevNotifications.length; i++) {
              if (prevNotifications[i]._id === notification._id) {
                updated.push({ ...prevNotifications[i], read: true });
              } else {
                updated.push(prevNotifications[i]);
              }
            }

            return updated;
          });

          setUnreadCount(function (prevCount) {
            return prevCount > 0 ? prevCount - 1 : 0;
          });
        });
    }

    if (notification.type === "follow" && notification.sender?._id) {
      navigate(`/profile/${notification.sender._id}`);
    } else if (notification.postId) {
      navigate(`/post/${notification.postId}`);
    }
  }

  function handleMarkAllRead() {
    setMarkingAllRead(true);

    axios
      .patch(
        "https://route-posts.routemisr.com/notifications/read-all",
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      )
      .then(function (response) {
        setNotifications(function (prevNotifications) {
          const updated = [];

          for (let i = 0; i < prevNotifications.length; i++) {
            updated.push({ ...prevNotifications[i], read: true });
          }

          return updated;
        });

        setUnreadCount(0);
      })
      .finally(function () {
        setMarkingAllRead(false);
      });
  }

  return (
    <div className="w-full min-h-dvh bg-(--main-color)">
      <div className="mx-4 py-5 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 bg-black/35 border border-white/10 rounded-[10px] p-1 w-fit">
            <button
              onClick={() => setFilter("all")}
              className={`px-4 py-1.5 rounded-lg text-[13px] font-semibold font-(family-name:--text-font) transition-all duration-200 cursor-pointer ${
                filter === "all"
                  ? "bg-(--secondary-color) text-(--main-color)"
                  : "text-white/60 hover:text-white"
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilter("unread")}
              className={`px-4 py-1.5 rounded-lg text-[13px] font-semibold font-(family-name:--text-font) transition-all duration-200 cursor-pointer flex items-center gap-1.5 ${
                filter === "unread"
                  ? "bg-(--secondary-color) text-(--main-color)"
                  : "text-white/60 hover:text-white"
              }`}
            >
              Unread
              {unreadCount > 0 && (
                <span
                  className={`text-[11px] px-1.5 rounded-full ${
                    filter === "unread"
                      ? "bg-(--main-color) text-(--secondary-color)"
                      : "bg-(--secondary-color) text-(--main-color)"
                  }`}
                >
                  {unreadCount}
                </span>
              )}
            </button>
          </div>

          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllRead}
              disabled={markingAllRead}
              className="text-(--secondary-color) text-[13px] font-(family-name:--text-font) cursor-pointer hover:underline disabled:opacity-50"
            >
              {markingAllRead ? "Marking..." : "Mark all as read"}
            </button>
          )}
        </div>

        <div className="flex flex-col gap-3">
          {loading && (
            <p className="text-center text-white/50 py-5 font-(family-name:--text-font)">
              Loading notifications...
            </p>
          )}

          {!loading && notifications.length === 0 && (
            <p className="text-center text-white/50 py-5 font-(family-name:--text-font)">
              {filter === "unread"
                ? "No unread notifications"
                : "No notifications yet"}
            </p>
          )}

          {notifications.map(function (notification) {
            return (
              <div
                key={notification._id}
                onClick={() => handleNotificationClick(notification)}
                className={`flex items-center gap-3 p-3 rounded-2xl border cursor-pointer transition-colors duration-200 ${
                  notification.read
                    ? "bg-black/35 border-white/10"
                    : "bg-(--secondary-color)/5 border-(--secondary-color)/30"
                }`}
              >
                <div className="relative">
                  <img
                    src={
                      notification.sender?.photo ||
                      `https://ui-avatars.com/api/?name=${notification.sender?.username}&background=aeff46&color=212121`
                    }
                    alt={notification.sender?.username}
                    className="w-11 h-11 rounded-full object-cover"
                  />
                  <div
                    className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-[#181818] flex items-center justify-center ${getNotificationIconColor(
                      notification.type,
                    )}`}
                  >
                    <i
                      className={`${getNotificationIcon(
                        notification.type,
                      )} text-[10px]`}
                    ></i>
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-white text-[14px] font-(family-name:--text-font)">
                    <span className="font-semibold">
                      {notification.sender?.username}
                    </span>{" "}
                    {notification.message}
                  </p>
                  <p className="text-white/50 text-[12px] font-(family-name:--text-font) mt-0.5">
                    {timeAgo(notification.createdAt)}
                  </p>
                </div>

                {!notification.read && (
                  <div className="w-2.5 h-2.5 rounded-full bg-(--secondary-color) shrink-0"></div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
