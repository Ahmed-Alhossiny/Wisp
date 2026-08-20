import React, { useContext } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import axios from "axios";
import { authContext } from "../AuthContext/AuthContext";
import { showAlert } from "../Utils/showAlert";

export default function Login() {
  const navigate = useNavigate();
  const { setUserToken } = useContext(authContext);

  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  function submitData(userData) {
    axios
      .post("https://route-posts.routemisr.com/users/signin", userData)
      .then((response) => {
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
        <div className="login mt-20 text-center flex flex-col items-center gap-2 px-3 py-7 rounded-2xl bg-black/35 border-2 border-(--secondary-color) mb-5">
          <p className="text-white font-(family-name:--text-font) text-[20px]">
            Welcome back <span className="text-(--secondary-color)">fam</span>
          </p>
          <h3 className="text-white font-bold my-3 text-[25px]">Log in</h3>
          <form onSubmit={handleSubmit(submitData)} className="w-full px-5">
            <div>
              <div className="email flex items-center relative mb-3">
                <i className="fa-regular fa-user absolute top-1/2 left-2.5 -translate-y-1/2 "></i>
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
                  placeholder="Email or Username"
                  className="w-full ps-10 bg-[#242622] p-3 rounded-[10px] placeholder:text-[17px] placeholder:font-semibold placeholder:text-[#0c0c0c] 
                focus:border
                focus:border-(--secondary-color) focus:outline-none"
                />
              </div>
              {errors.email && (
                <p className="text-(--secondary-color) font-medium ms-3 text-left">
                  {errors.email.message}
                </p>
              )}
            </div>
            <div>
              <div className="pass flex items-center relative mb-3">
                <i className="fa-solid fa-key absolute top-1/2 left-2.5 -translate-y-1/2"></i>
                <input
                  {...register("password", {
                    required: "Password is required",
                  })}
                  type="password"
                  id="userPassword"
                  placeholder="Password"
                  className="w-full ps-10 bg-[#242622] p-3 rounded-[10px] placeholder:text-[17px] placeholder:font-semibold placeholder:text-[#0c0c0c] focus:border
                focus:border-(--secondary-color) focus:outline-none"
                />
              </div>
              {errors.password && (
                <p className="text-(--secondary-color) font-medium ms-3 text-left">
                  {errors.password.message}
                </p>
              )}
            </div>
            <button className="p-3 mb-3 w-full rounded-[10px] bg-(--secondary-color) text-(--main-color) font-(family-name:--text-font) text-[20px] font-semibold hover:text-(--secondary-color) hover:bg-(--main-color) transition-all duration-300 cursor-pointer">
              Log in
            </button>
            <p className="text-white text-[18px]">
              <a href="#">Forgot password?</a>
            </p>
          </form>
        </div>
        <p className="text-center font-(family-name:--text-font) text-[20px] font-medium">
          Wanna Join?{" "}
          <Link to={"/signup"} className="text-(--secondary-color) underline">
            Sign up
          </Link>
        </p>
      </section>
    </>
  );
}
