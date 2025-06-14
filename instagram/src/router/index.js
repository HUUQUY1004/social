import VideoCall from "../component/Call/call";
import AlbumPage from "../pages/Album/album";
import ChangePassword from "../pages/ChangePassword/ChangePassword";
import EditProfile from "../pages/EditProfile/EditProfile";
import Friends from "../pages/Friends/Friends";
import Home from "../pages/Home/home";
import Login from "../pages/Login/login";
import Messages from "../pages/Messages/Messages";
import Profile from "../pages/MyProFile/MyProfile";
import PostPage from "../pages/PostPage/PostPage";
import ProfileUser from "../pages/ProfileUser/ProfileUser";
import Reels from "../pages/Reel/reels";
import Register from "../pages/Register/register";
import FindAccount from "../pages/ResetPassword/FindAccount";
import Suggestion from "../pages/Suggesstion/Suggesstion";
import TrashPost from "../pages/TrashPost/TrashPost";
export const router = [
  {
    Component: Home,
    path: "/",
  },
  {
    Component: Register,
    path: "/register",
    layout: null,
  },
  {
    Component: Login,
    path: "/login",
    layout: null,
  },
  {
    Component: Profile,
    path: "/profile",
  },
  {
    Component: ProfileUser,
    path: "/:userId",
  },
  {
    Component: PostPage,
    path: "/p/:id",
  },
  {
    Component: PostPage,
    path: "/p/trash/:id",
  },
  {
    Component: Messages,
    path: "direct/inbox",
  },
  {
    Component: TrashPost,
    path: "/:username/trash",
  },
  {
    Component: Suggestion,
    path: "/suggestion-friendships",
  },
  {
    Component: Friends,
    path: "/friends",
  },
  {
    Component: VideoCall,
    path: "/call",
  },
  {
    Component: AlbumPage,
    path: "/album/:id",
  },
  {
    Component: Reels,
    path: "/reels",
  },
  {
    Component: FindAccount,
    path: "/account/find",
    layout: null,
  },
  {
    Component: ChangePassword,
    path: "/account/changePassword",
    layout: null,
  },
  {
    Component: EditProfile,
    path: "/edit-profile",
  },
];
