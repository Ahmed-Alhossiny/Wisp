import React from "react";
import Login from "./Login/Login";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./Home/Home";
import Signup from "./Signup/Signup";
import { AuthContextProvider } from "./AuthContext/AuthContext";
import ProtectRoute from "./ProtectRoute/ProtectRoute";
import NotAuthorized from "./NotAuthorized/NotAuthorized";
import MyProfile from "./MyProfile/MyProfile";
import Settings from "./Settings/Settings";
import UserProfile from "./UserProfile/UserProfile";
import PostDetails from "./PostDetails/PostDetails";
import About from "./About/About";

export default function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: (
        <ProtectRoute>
          <Home />
        </ProtectRoute>
      ),
    },
    {
      path: "/login",
      element: <Login />,
    },
    {
      path: "/signup",
      element: <Signup />,
    },
    {
      path: "/notauthorized",
      element: <NotAuthorized />,
    },
    {
      path: "/myprofile",
      element: <MyProfile />,
    },
    {
      path: "/settings",
      element: <Settings />,
    },
    {
      path: "/profile/:userId",
      element: <UserProfile />,
    },
    {
      path: "/post/:postId",
      element: <PostDetails />,
    },
    {
      path: "/about",
      element: <About />,
    },
  ]);

  return (
    <>
      <AuthContextProvider>
        <RouterProvider router={router} />
      </AuthContextProvider>
    </>
  );
}
