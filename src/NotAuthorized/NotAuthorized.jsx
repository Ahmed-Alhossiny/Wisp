import React from "react";
import { Link } from "react-router-dom";

export default function NotAuthorized() {
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
        <div className="w-full mt-50 flex flex-col items-center justify-center">
          <div className="font-black text-[35px] mb-10 font-(family-name:--text-font) text-center">
            <p>
              Welcome to the{" "}
              <span
                className="bg-[linear-gradient(90deg,rgba(174,255,70,0.4)_0%,rgba(174,255,70,1)_50%,rgba(174,255,70,0.4)_100%)]  bg-size-[200%_100%] 
  bg-clip-text text-transparent"
                style={{ animation: "shimmer 3s linear infinite" }}
              >
                Network
              </span>
              , fam
            </p>
          </div>
          <div>
            <Link
              to={"/login"}
              className="text-(--secondary-color) underline text-center font-(family-name:--text-font) text-[25px] font-medium"
            >
              Log in
            </Link>
            <span className="mx-3 font-semibold text-[22px]">or</span>
            <Link
              to={"/signup"}
              className="text-(--secondary-color) underline text-center font-(family-name:--text-font) text-[25px] font-medium"
            >
              Sign up
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
