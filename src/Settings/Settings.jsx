import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import { showAlert } from "../Utils/showAlert";

export default function Settings() {
  const [asideOpen, setAsideOpen] = useState(false);
  const [activeModal, setActiveModal] = useState(null);

  const [profile, setProfile] = useState(null);
  const [profileLoading, setProfileLoading] = useState(false);

  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [changingPassword, setChangingPassword] = useState(false);

  useEffect(
    function () {
      if (asideOpen || activeModal) {
        document.body.style.overflow = "hidden";
      } else {
        document.body.style.overflow = "auto";
      }

      return function () {
        document.body.style.overflow = "auto";
      };
    },
    [asideOpen, activeModal],
  );

  function closeModal() {
    setActiveModal(null);
    setSelectedFile(null);
    setPreviewUrl(null);
    setCurrentPassword("");
    setNewPassword("");
  }

  function openAboutModal() {
    axios
      .get("https://route-posts.routemisr.com/users/profile-data", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then(function (response) {
        setProfile(response.data.data.user);
      })
      .finally(function () {
        setProfileLoading(false);
      });
  }

  function formatDate(dateString) {
    const date = new Date(dateString);
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
  }

  function handleFileChange(e) {
    const file = e.target.files[0];

    if (!file) {
      return;
    }

    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  }

  function handleAvatarUpload() {
    if (!selectedFile) {
      return;
    }

    setUploading(true);

    const formData = new FormData();
    formData.append("photo", selectedFile);

    axios
      .put("https://route-posts.routemisr.com/users/upload-photo", formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then(function (response) {
        showAlert("success", "Avatar updated", 2000);
        closeModal();
        setTimeout(() => {
          location.reload();
        }, 2200);
      })
      .catch(function (error) {
        showAlert(
          "error",
          error.response?.data?.message || "Upload failed",
          2000,
        );
        closeModal();
      })
      .finally(function () {
        setUploading(false);
      });
  }

  function handlePasswordChange() {
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    if (currentPassword === "" || newPassword === "") {
      return;
    }

    if (!passwordRegex.test(newPassword)) {
      showAlert(
        "error",
        "Password must be min 8 characters, with uppercase, lowercase, number, and special character",
        4000,
      );
      return;
    }

    setChangingPassword(true);

    axios
      .patch(
        "https://route-posts.routemisr.com/users/change-password",
        {
          password: currentPassword,
          newPassword: newPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        },
      )
      .then(function (response) {
        if (response.data.data?.token) {
          localStorage.setItem("token", response.data.data.token);
        }

        showAlert("success", "Password changed", 2000);
        closeModal();
      })
      .catch(function (error) {
        const status = error.response?.status;

        if (status === 401 || status === 400) {
          showAlert("error", "Current password is incorrect", 2000);
        } else {
          showAlert(
            "error",
            error.response?.data?.message || "Could not change password",
            2000,
          );
        }
      })
      .finally(function () {
        setChangingPassword(false);
      });
  }

  const settingsOptions = [
    {
      id: "avatar",
      icon: "fa-solid fa-camera",
      title: "Add Avatar",
      description: "Update your profile picture",
    },
    {
      id: "password",
      icon: "fa-solid fa-lock",
      title: "Change Password",
      description: "Update your account password",
    },
    {
      id: "about",
      icon: "fa-solid fa-circle-info",
      title: "About",
      description: "View your account details",
    },
  ];

  function handleCardClick(id) {
    if (id === "about") {
      setActiveModal("about");
    } else {
      setActiveModal(id);
    }
  }

  useEffect(() => {
    openAboutModal();
  }, []);

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

      <div className="max-w-150 mx-auto px-4 py-6">
        <h2 className="text-white font-bold text-[22px] font-(family-name:--text-font) mb-5">
          Settings
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {settingsOptions.map(function (option) {
            return (
              <div
                key={option.id}
                onClick={() => handleCardClick(option.id)}
                className="bg-black/35 border border-white/10 rounded-2xl p-5 flex flex-col items-center text-center gap-3 cursor-pointer hover:border-(--secondary-color) transition-colors duration-200"
              >
                <div className="w-14 h-14 rounded-full bg-(--secondary-color)/10 flex items-center justify-center">
                  <i
                    className={`${option.icon} text-(--secondary-color) text-[22px]`}
                  ></i>
                </div>
                <div>
                  <p className="text-white font-semibold text-[15px] font-(family-name:--text-font)">
                    {option.title}
                  </p>
                  <p className="text-white/50 text-[12px] font-(family-name:--text-font) mt-1">
                    {option.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Modal overlay + wrapper, shared across all three modals */}
      {activeModal && (
        <div
          onClick={closeModal}
          className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center px-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-[#181818] border border-(--secondary-color)/40 rounded-2xl w-full max-w-100 p-5 relative"
          >
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-white/60 hover:text-(--secondary-color) transition-colors cursor-pointer"
            >
              <i className="fa-solid fa-xmark text-[18px]"></i>
            </button>

            {/* Avatar modal */}
            {activeModal === "avatar" && (
              <div className="flex flex-col items-center gap-4 pt-2">
                <h3 className="text-white font-bold text-[18px] font-(family-name:--text-font)">
                  Update Avatar
                </h3>

                <div
                  onClick={() => fileInputRef.current.click()}
                  className="w-32 h-32 rounded-full border-2 border-dashed border-(--secondary-color)/50 flex items-center justify-center cursor-pointer overflow-hidden bg-[#242622]"
                >
                  {previewUrl ? (
                    <img
                      src={previewUrl}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <i className="fa-solid fa-camera text-white/30 text-[28px]"></i>
                  )}
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />

                <button
                  onClick={() => fileInputRef.current.click()}
                  className="text-(--secondary-color) text-[13px] font-(family-name:--text-font) cursor-pointer hover:underline"
                >
                  {selectedFile ? "Choose a different photo" : "Choose a photo"}
                </button>

                <button
                  onClick={() => {
                    handleAvatarUpload();
                  }}
                  disabled={!selectedFile || uploading}
                  className="w-full py-2.5 rounded-[10px] bg-(--secondary-color) text-(--main-color) font-semibold text-[14px] font-(family-name:--text-font) hover:bg-transparent hover:border hover:border-(--secondary-color) hover:text-(--secondary-color) transition-all duration-200 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-(--secondary-color) disabled:hover:text-(--main-color)"
                >
                  {uploading ? "Uploading..." : "Save"}
                </button>
              </div>
            )}

            {/* Password modal */}
            {activeModal === "password" && (
              <div className="flex flex-col gap-4 pt-2">
                <h3 className="text-white font-bold text-[18px] font-(family-name:--text-font)">
                  Change Password
                </h3>

                <div className="flex items-center relative">
                  <i className="fa-solid fa-key absolute top-1/2 left-3 -translate-y-1/2 text-white/50"></i>
                  <input
                    type="password"
                    placeholder="Current password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full ps-10 bg-[#242622] p-3 rounded-[10px] placeholder:text-[14px] placeholder:font-semibold placeholder:text-white/40 text-white focus:border focus:border-(--secondary-color) focus:outline-none"
                  />
                </div>

                <div className="flex items-center relative">
                  <i className="fa-solid fa-lock absolute top-1/2 left-3 -translate-y-1/2 text-white/50"></i>
                  <input
                    type="password"
                    placeholder="New password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full ps-10 bg-[#242622] p-3 rounded-[10px] placeholder:text-[14px] placeholder:font-semibold placeholder:text-white/40 text-white focus:border focus:border-(--secondary-color) focus:outline-none"
                  />
                </div>

                <button
                  onClick={handlePasswordChange}
                  disabled={
                    currentPassword === "" ||
                    newPassword === "" ||
                    changingPassword
                  }
                  className="w-full py-2.5 rounded-[10px] bg-(--secondary-color) text-(--main-color) font-semibold text-[14px] font-(family-name:--text-font) hover:bg-transparent hover:border hover:border-(--secondary-color) hover:text-(--secondary-color) transition-all duration-200 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-(--secondary-color) disabled:hover:text-(--main-color)"
                >
                  {changingPassword ? "Saving..." : "Save"}
                </button>
              </div>
            )}

            {/* About modal */}
            {activeModal === "about" && (
              <div className="flex flex-col gap-4 pt-2">
                <h3 className="text-white font-bold text-[18px] font-(family-name:--text-font)">
                  About
                </h3>

                {profileLoading && (
                  <p className="text-white/50 text-center py-6 font-(family-name:--text-font)">
                    Loading...
                  </p>
                )}

                {!profileLoading && profile && (
                  <div className="flex flex-col divide-y divide-white/10">
                    <div className="flex justify-between py-2.5">
                      <span className="text-white/50 text-[13px] font-(family-name:--text-font)">
                        Name
                      </span>
                      <span className="text-white text-[13px] font-(family-name:--text-font)">
                        {profile.name}
                      </span>
                    </div>
                    <div className="flex justify-between py-2.5">
                      <span className="text-white/50 text-[13px] font-(family-name:--text-font)">
                        Username
                      </span>
                      <span className="text-white text-[13px] font-(family-name:--text-font)">
                        @{profile.username}
                      </span>
                    </div>
                    <div className="flex justify-between py-2.5">
                      <span className="text-white/50 text-[13px] font-(family-name:--text-font)">
                        Email
                      </span>
                      <span className="text-white text-[13px] font-(family-name:--text-font)">
                        {profile.email}
                      </span>
                    </div>
                    <div className="flex justify-between py-2.5">
                      <span className="text-white/50 text-[13px] font-(family-name:--text-font)">
                        Gender
                      </span>
                      <span className="text-white text-[13px] font-(family-name:--text-font) capitalize">
                        {profile.gender}
                      </span>
                    </div>
                    <div className="flex justify-between py-2.5">
                      <span className="text-white/50 text-[13px] font-(family-name:--text-font)">
                        Date of birth
                      </span>
                      <span className="text-white text-[13px] font-(family-name:--text-font)">
                        {formatDate(profile.dateOfBirth)}
                      </span>
                    </div>
                    <div className="flex justify-between py-2.5">
                      <span className="text-white/50 text-[13px] font-(family-name:--text-font)">
                        Created at
                      </span>
                      <span className="text-white text-[13px] font-(family-name:--text-font)">
                        {formatDate(profile.createdAt)}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
