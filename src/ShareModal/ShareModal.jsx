import axios from "axios";
import React, { useState } from "react";
import { showAlert } from "../Utils/showAlert";

export default function ShareModal({ post, onClose }) {
  const [caption, setCaption] = useState("");
  const [sharing, setSharing] = useState(false);

  function handleShare() {
    if (caption.trim() === "") {
      return;
    }

    setSharing(true);

    axios
      .post(
        `https://route-posts.routemisr.com/posts/${post._id}/share`,
        {
          body: caption,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        },
      )
      .then(function (response) {
        showAlert("success", "Post shared", 2000);
        onClose();
      })
      .catch(function (error) {
        showAlert(
          "error",
          error.response?.data?.message || "Could not share post",
          2000,
        );
      })
      .finally(function () {
        setSharing(false);
      });
  }

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center px-4"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-[#181818] border border-(--secondary-color)/40 rounded-2xl w-full max-w-100 p-5 relative"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white/60 hover:text-(--secondary-color) transition-colors cursor-pointer"
        >
          <i className="fa-solid fa-xmark text-[18px]"></i>
        </button>

        <h3 className="text-white font-bold text-[18px] font-(family-name:--text-font) mb-4">
          Share Post
        </h3>

        <textarea
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          placeholder="Say something about this post..."
          rows={3}
          className="w-full bg-[#242622] p-3 rounded-[10px] text-white placeholder:text-white/40 placeholder:text-[14px] font-(family-name:--text-font) resize-none focus:border focus:border-(--secondary-color) focus:outline-none mb-4"
        ></textarea>

        <div className="bg-black/35 border border-white/10 rounded-[10px] p-3 flex items-center gap-3 mb-4">
          <img
            src={post.user?.photo}
            alt="Avatar"
            className="w-9 h-9 rounded-full object-cover"
          />
          <div className="flex-1 min-w-0">
            <p className="text-white text-[13px] font-semibold font-(family-name:--text-font) truncate">
              {post.user?.username}
            </p>
            <p className="text-white/60 text-[12px] font-(family-name:--text-font) truncate">
              {post.body}
            </p>
          </div>
          {post.image && (
            <img
              src={post.image}
              alt="Post"
              className="w-11 h-11 rounded-md object-cover shrink-0"
            />
          )}
        </div>

        <button
          onClick={handleShare}
          disabled={caption.trim() === "" || sharing}
          className="w-full py-2.5 rounded-[10px] bg-(--secondary-color) text-(--main-color) font-semibold text-[14px] font-(family-name:--text-font) hover:bg-transparent hover:border hover:border-(--secondary-color) hover:text-(--secondary-color) transition-all duration-200 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-(--secondary-color) disabled:hover:text-(--main-color)"
        >
          {sharing ? "Sharing..." : "Share"}
        </button>
      </div>
    </div>
  );
}
