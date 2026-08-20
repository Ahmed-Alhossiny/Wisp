import React, { useEffect } from "react";
import PostComments from "../PostComments/PostComments";

export default function CommentsModal({ post, myAvatar, onClose }) {
  useEffect(function () {
    document.body.style.overflow = "hidden";

    return function () {
      document.body.style.overflow = "auto";
    };
  }, []);

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center px-4"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-[#181818] border border-(--secondary-color)/40 rounded-2xl w-full max-w-100 max-h-[80vh] flex flex-col relative"
      >
        <div className="flex items-center justify-between p-4 border-b border-white/10 shrink-0">
          <h3 className="text-white font-bold text-[16px] font-(family-name:--text-font)">
            Comments
          </h3>
          <button
            onClick={onClose}
            className="text-white/60 hover:text-(--secondary-color) transition-colors cursor-pointer"
          >
            <i className="fa-solid fa-xmark text-[18px]"></i>
          </button>
        </div>

        <div className="overflow-y-auto p-4">
          <PostComments postId={post._id} myAvatar={myAvatar} />
        </div>
      </div>
    </div>
  );
}
