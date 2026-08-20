import axios from "axios";
import React, { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { authContext } from "../AuthContext/AuthContext";
import { showAlert } from "../Utils/showAlert";

export default function Signup() {
  const nameRegex = /^[A-Za-z ]{8,20}$/;
  const userNameRegex = /^[A-Za-z][A-Za-z0-9_]{2,19}$/;
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  const navigate = useNavigate();
  const { setUserToken } = useContext(authContext);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      username: "",
      email: "",
      gender: "",
      dateOfBirth: "",
      password: "",
      rePassword: "",
    },
  });

  const passwordValue = watch("password");

  function submitData(userData) {
    axios
      .post("https://route-posts.routemisr.com/users/signup", userData)
      .then((response) => {
        showAlert("success", "Account created", 2000);
        setUserToken(response.data.data.token);
        localStorage.setItem("token", response.data.data.token);
        navigate("/");
      })
      .catch((error) => {
        showAlert(
          "error",
          error.response?.data?.message || "Something went wrong",
          2000,
        );
      });
  }

  return (
    <>
      <section
        id="login"
        className="w-full min-h-dvh bg-(--main-color) py-5 px-4"
      >
        <div className="logo flex justify-center items-center">
          <a
            href="/"
            className="text-(--secondary-color) font-(family-name:--boldy-font) text-[30px]"
          >
            WISP
          </a>
        </div>
        <div className="login mt-7 flex flex-col items-center gap-2 px-3 py-5 rounded-2xl bg-black/35 border-2 border-(--secondary-color) mb-5">
          <p className="text-white text-center font-(family-name:--text-font) text-[20px]">
            Share{" "}
            <span className="text-(--secondary-color)">everyday moments</span>{" "}
            with your close friends.
          </p>
          <h3 className="text-white font-bold my-3 text-[25px]">Sign up</h3>
          <form onSubmit={handleSubmit(submitData)} className="w-full px-5">
            <div>
              <div className="full-name flex items-center relative">
                <i className="fa-regular fa-user absolute top-1/2 left-2.5 -translate-y-1/2 "></i>
                <input
                  {...register("name", {
                    required: "Full name is required",
                    pattern: {
                      value: nameRegex,
                      message: "Min: 8 , Max: 20",
                    },
                  })}
                  type="text"
                  id="userName"
                  placeholder="Full name"
                  className="w-full ps-10 bg-[#242622] p-3 rounded-[10px] placeholder:text-[17px] placeholder:font-semibold placeholder:text-[#0c0c0c] 
                focus:border
                focus:border-(--secondary-color) focus:outline-none"
                />
              </div>
              {errors.name && (
                <p className="text-(--secondary-color) font-medium ms-3">
                  {errors.name.message}
                </p>
              )}
            </div>
            <div>
              <div className="username flex items-center relative mt-3">
                <i className="fa-solid fa-at absolute top-1/2 left-2.5 -translate-y-1/2"></i>
                <input
                  {...register("username", {
                    required: "Username is required",
                    pattern: {
                      value: userNameRegex,
                      message: "Must start with a letter",
                    },
                  })}
                  type="text"
                  id="username"
                  placeholder="Username"
                  className="w-full ps-10 bg-[#242622] p-3 rounded-[10px] placeholder:text-[17px] placeholder:font-semibold placeholder:text-[#0c0c0c] focus:border
                focus:border-(--secondary-color) focus:outline-none"
                />
              </div>
              {errors.username && (
                <p className="text-(--secondary-color) font-medium ms-3">
                  {errors.username.message}
                </p>
              )}
            </div>
            <div>
              <div className="email flex items-center relative mt-3">
                <i className="fa-regular fa-envelope absolute top-1/2 left-2.5 -translate-y-1/2 "></i>
                <input
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: emailRegex,
                      message: "Invalid Email",
                    },
                  })}
                  type="email"
                  id="userEmail"
                  placeholder="Email address"
                  className="w-full ps-10 bg-[#242622] p-3 rounded-[10px] placeholder:text-[17px] placeholder:font-semibold placeholder:text-[#0c0c0c] 
                focus:border
                focus:border-(--secondary-color) focus:outline-none"
                />
              </div>
              {errors.email && (
                <p className="text-(--secondary-color) font-medium ms-3">
                  {errors.email.message}
                </p>
              )}
            </div>
            <div>
              <div className="gender flex items-center relative mt-3">
                <i className="fa-solid fa-venus-mars absolute top-1/2 left-2.5 -translate-y-1/2"></i>
                <select
                  {...register("gender", {
                    required: "Please select a gender",
                  })}
                  id="gender"
                  defaultValue=""
                  className="w-full ps-9 bg-[#242622] p-3 rounded-[10px] placeholder:text-[17px] placeholder:font-semibold placeholder:text-[#0c0c0c] 
                focus:border
                focus:border-(--secondary-color) focus:outline-none"
                >
                  <option value="" disabled>
                    Select gender
                  </option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>
              {errors.gender && (
                <p className="text-(--secondary-color) font-medium ms-3">
                  {errors.gender.message}
                </p>
              )}
            </div>
            <div>
              <div className="age flex items-center relative mt-3">
                <i className="fa-solid fa-calendar absolute top-1/2 left-2.5 -translate-y-1/2"></i>
                <input
                  {...register("dateOfBirth", {
                    required: "Date of birth is required",
                    validate: (value) => {
                      const birthDate = new Date(value);
                      const today = new Date();

                      let age = today.getFullYear() - birthDate.getFullYear();
                      const monthDiff = today.getMonth() - birthDate.getMonth();
                      const dayDiff = today.getDate() - birthDate.getDate();

                      if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
                        age = age - 1;
                      }

                      return age >= 18 || "You must be at least 18 years old";
                    },
                  })}
                  type="date"
                  id="userAge"
                  className="w-full ps-10 bg-[#242622] p-3 rounded-[10px] placeholder:text-[17px] placeholder:font-semibold placeholder:text-[#0c0c0c] focus:border
focus:border-(--secondary-color) focus:outline-none"
                />
              </div>
              {errors.dateOfBirth && (
                <p className="text-(--secondary-color) font-medium ms-3">
                  {errors.dateOfBirth.message}
                </p>
              )}
            </div>
            <div className="passNconfirm grid grid-cols-2 gap-2.5">
              <div>
                <div className="pass flex items-center relative mt-3">
                  <i className="fa-solid fa-key absolute top-1/2 left-2.5 -translate-y-1/2"></i>
                  <input
                    {...register("password", {
                      required: "Password is required",
                      pattern: {
                        value: passwordRegex,
                        message:
                          "Min: 8 , at least one uppercase, one lowercase, one number, one special character",
                      },
                    })}
                    type="password"
                    id="userPassword"
                    placeholder="Password"
                    className="w-full ps-10 bg-[#242622] p-3 rounded-[10px] placeholder:text-[17px] placeholder:font-semibold placeholder:text-[#0c0c0c] focus:border
                focus:border-(--secondary-color) focus:outline-none"
                  />
                </div>
                {errors.password && (
                  <p className="text-(--secondary-color) font-medium ms-3">
                    {errors.password.message}
                  </p>
                )}
              </div>
              <div>
                <div className="confirm-pass flex items-center mt-3">
                  <input
                    {...register("rePassword", {
                      required: "Please confirm your password",
                      validate: (value) =>
                        value === passwordValue || "Passwords do not match",
                    })}
                    type="password"
                    id="userConfirmPass"
                    placeholder="Confirm password"
                    className="w-full bg-[#242622] p-3 rounded-[10px] placeholder:text-[17px] placeholder:font-semibold placeholder:text-[#0c0c0c] focus:border
                focus:border-(--secondary-color) focus:outline-none"
                  />
                </div>
                {errors.rePassword && (
                  <p className="text-(--secondary-color) font-medium ms-3">
                    {errors.rePassword.message}
                  </p>
                )}
              </div>
            </div>
            <button
              type="submit"
              className="p-3 mt-3 w-full rounded-[10px] bg-(--secondary-color) text-(--main-color) font-(family-name:--text-font) text-[20px] font-semibold hover:text-(--secondary-color) hover:bg-(--main-color) transition-all duration-300 cursor-pointer"
            >
              Sign up
            </button>
          </form>
        </div>
        <p className="text-center font-(family-name:--text-font) text-[20px] font-medium">
          Already a fam?{" "}
          <Link to={"/login"} className="text-(--secondary-color) underline">
            Log in
          </Link>
        </p>
      </section>
    </>
  );
}
