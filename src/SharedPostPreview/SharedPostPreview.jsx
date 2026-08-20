import React from "react";
import { Link, useNavigate } from "react-router-dom";

export default function SharedPostPreview({ sharedPost }) {
  const navigate = useNavigate();

  if (!sharedPost) {
    return null;
  }

  function goToPost() {
    navigate(`/post/${sharedPost._id}`);
  }

  function stopBubble(e) {
    e.stopPropagation();
  }

  return (
    <div
      onClick={goToPost}
      className="mx-4 mb-3 bg-black/30 border border-white/10 rounded-[14px] overflow-hidden cursor-pointer hover:border-(--secondary-color)/40 transition-colors duration-200"
    >
      <div className="flex items-center gap-2.5 p-3">
        <Link to={`/profile/${sharedPost.user._id}`} onClick={stopBubble}>
          <img
            src={sharedPost.user.photo}
            alt="Avatar"
            className="w-8 h-8 rounded-full object-cover"
          />
        </Link>
        <Link to={`/profile/${sharedPost.user._id}`} onClick={stopBubble}>
          <p className="text-white font-semibold text-[13px] font-(family-name:--text-font)">
            {sharedPost.user.username}
          </p>
        </Link>
      </div>

      {sharedPost.image && (
        <div className="w-full max-h-70 bg-[#242622] overflow-hidden">
          <img
            src={sharedPost.image}
            alt="Shared Post"
            className="w-full h-full object-cover"
          />
        </div>
      )}

      <p className="text-white/80 px-3 py-2.5 text-[13px] font-(family-name:--text-font)">
        {sharedPost.body}
      </p>
    </div>
  );
}
