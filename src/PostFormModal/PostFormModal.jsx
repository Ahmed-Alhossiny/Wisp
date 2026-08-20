import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { showAlert } from "../Utils/showAlert";

export default function PostFormModal({ mode, post, onClose, onSuccess }) {
  const isEdit = mode === "edit";

  const [body, setBody] = useState(isEdit ? post.body : "");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(isEdit ? post.image : null);
  const [submitting, setSubmitting] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(function () {
    document.body.style.overflow = "hidden";

    return function () {
      document.body.style.overflow = "auto";
    };
  }, []);

  function handleImageChange(e) {
    const file = e.target.files[0];

    if (!file) {
      return;
    }

    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  }

  function clearImage() {
    setImageFile(null);
    setImagePreview(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  function handleSubmit() {
    if (body.trim() === "") {
      return;
    }

    setSubmitting(true);

    const formData = new FormData();
    formData.append("body", body);

    if (imageFile) {
      formData.append("image", imageFile);
    }

    const request = isEdit
      ? axios.put(
          `https://route-posts.routemisr.com/posts/${post._id}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          },
        )
      : axios.post("https://route-posts.routemisr.com/posts", formData, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

    request
      .then(function (response) {
        showAlert("success", isEdit ? "Post updated" : "Post created", 2000);
        onSuccess(response.data.data.post);
        onClose();
      })
      .catch(function (error) {
        showAlert(
          "error",
          error.response?.data?.message || "Something went wrong",
          2000,
        );
      })
      .finally(function () {
        setSubmitting(false);
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
          {isEdit ? "Edit Post" : "Create Post"}
        </h3>

        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="What's on your mind?"
          rows={4}
          className="w-full bg-[#242622] p-3 rounded-[10px] text-white placeholder:text-white/40 placeholder:text-[14px] font-(family-name:--text-font) resize-none focus:border focus:border-(--secondary-color) focus:outline-none mb-3"
        ></textarea>

        {imagePreview && (
          <div className="relative w-fit mb-3">
            <img
              src={imagePreview}
              alt="Preview"
              className="max-h-40 rounded-[10px] object-cover"
            />
            <button
              onClick={clearImage}
              className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-black/80 flex items-center justify-center text-white/80 hover:text-red-400 cursor-pointer"
            >
              <i className="fa-solid fa-xmark text-[11px]"></i>
            </button>
          </div>
        )}

        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => fileInputRef.current.click()}
            className="text-white/60 hover:text-(--secondary-color) transition-colors cursor-pointer flex items-center gap-2 text-[13px] font-(family-name:--text-font)"
          >
            <i className="fa-regular fa-image text-[16px]"></i>
            {imagePreview ? "Change photo" : "Add photo"}
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
          />
        </div>

        <button
          onClick={handleSubmit}
          disabled={body.trim() === "" || submitting}
          className="w-full py-2.5 rounded-[10px] bg-(--secondary-color) text-(--main-color) font-semibold text-[14px] font-(family-name:--text-font) hover:bg-transparent hover:border hover:border-(--secondary-color) hover:text-(--secondary-color) transition-all duration-200 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-(--secondary-color) disabled:hover:text-(--main-color)"
        >
          {submitting
            ? isEdit
              ? "Saving..."
              : "Posting..."
            : isEdit
              ? "Save Changes"
              : "Post"}
        </button>
      </div>
    </div>
  );
}
