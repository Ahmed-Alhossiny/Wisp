import React from "react";
import { Link } from "react-router-dom";

export default function About() {
  return (
    <div className="w-full min-h-dvh bg-(--main-color)">
      <nav className="w-full sticky top-0 z-30 bg-(--main-color) border-b border-white/10 px-4 py-3 flex items-center gap-4">
        <Link
          to="/"
          className="text-white hover:text-(--secondary-color) transition-colors cursor-pointer"
        >
          <i className="fa-solid fa-arrow-left text-[18px]"></i>
        </Link>
        <span className="text-(--secondary-color) font-(family-name:--boldy-font) text-[20px]">
          About WISP
        </span>
      </nav>

      <div className="max-w-150 mx-auto px-4 py-8">
        <div className="bg-black/35 border border-white/10 rounded-2xl p-6">
          <h1 className="text-white font-(family-name:--boldy-font) text-[24px] mb-4">
            WISP
          </h1>
          <p className="text-white/80 text-[14px] leading-relaxed font-(family-name:--text-font)">
            WISP is a social platform where you can share posts, connect with
            friends, like, comment, bookmark, and share content with the people
            who matter to you. Stay updated with your feed, discover suggested
            friends, and keep track of your notifications, all in one place.
          </p>
        </div>

        <p className="text-center text-white/60 text-[13px] font-(family-name:--text-font) mt-6">
          Made with{" "}
          <i className="fa-solid fa-heart text-(--secondary-color)"></i> by{" "}
          <a
            href="mailto:ahmed.alhossiny.32@gmail.com"
            className="text-white hover:text-(--secondary-color) transition-colors underline"
          >
            Ahmed Alhossiny
          </a>
        </p>
      </div>
    </div>
  );
}
