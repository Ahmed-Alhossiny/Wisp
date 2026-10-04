# WISP

WISP is a social feed app where you can share posts, follow friends, and interact through likes, comments, bookmarks, and shares — all in a fast, single-page React interface.

## Features

- **Feed** — infinite-scroll post feed with "For You" and "Following" filters
- **Posts** — create, edit, and delete posts with optional image attachments
- **Comments** — add, edit, and delete comments (with images), paginated
- **Likes & bookmarks** — optimistic UI updates with automatic rollback on failure
- **Sharing** — share a post to your own feed with a caption
- **Profiles** — view your own profile and other users' profiles, with posts/saved-posts tabs
- **Follow system** — follow suggested users or any profile you visit
- **Notifications** — like/comment/follow notifications with read/unread state
- **Settings** — update avatar, change password, view account details
- **Auth** — signup and login with client-side validation

## Tech Stack

| Layer          | Technology                                                                            |
| -------------- | ------------------------------------------------------------------------------------- |
| Framework      | [React 19](https://react.dev/) + [Vite](https://vite.dev/)                            |
| Routing        | [React Router 7](https://reactrouter.com/)                                            |
| Styling        | [Tailwind CSS 4](https://tailwindcss.com/) + [Font Awesome](https://fontawesome.com/) |
| Forms          | [React Hook Form](https://react-hook-form.com/)                                       |
| HTTP client    | [Axios](https://axios-http.com/)                                                      |
| Alerts/dialogs | [SweetAlert2](https://sweetalert2.github.io/)                                         |
| API            | [Route Academy Posts API](https://route-posts.routemisr.com)                          |

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) 18 or later
- npm

### Installation

```bash
git clone https://github.com/Ahmed-Alhossiny/wisp.git
cd wisp
npm install
```

### Development

```bash
npm run dev
```

The app will be available at `http://localhost:5173`.

### Build

```bash
npm run build
```

Production files are output to `dist/`.

### Preview a production build

```bash
npm run preview
```

## Project Structure

```
src/
├── About/              Static about page
├── AuthContext/        Auth state provider
├── CommentsModal/      Comments modal (used from the feed)
├── Home/                Main feed, sidebar nav, filters
├── Login/, Signup/     Auth forms
├── MyProfile/          Own profile (posts, saved posts)
├── NotAuthorized/      Logged-out gate page
├── Notifications/      Notifications tab
├── PostComments/       Comment list, create/edit/delete
├── PostDetails/        Single post view
├── PostFormModal/      Create/edit post modal
├── ProtectRoute/       Route guard for authenticated pages
├── Settings/           Avatar, password, account info
├── ShareModal/         Share-a-post modal
├── SharedPostPreview/  Preview card for shared posts
├── SuggestedFriends/   Suggested users to follow
├── UserProfile/        Other users' profiles
└── Utils/              Shared helpers (auth, API calls, alerts)
```

## Author

**Ahmed Alhossiny**
[ahmed.alhossiny.32@gmail.com](mailto:ahmedalhossiny.dev@gmail.com)
