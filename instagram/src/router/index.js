import Home from '../pages/Home/home';
import Login from '../pages/Login/login';
import Messages from '../pages/Messages/Messages';
import Profile from '../pages/MyProFile/MyProfile';
import PostPage from '../pages/PostPage/PostPage';
import Register from '../pages/Register/register';
import TrashPost from '../pages/TrashPost/TrashPost';
export const router = [
    {
        Component: Home,
        path: '/',
    },
    {
        Component: Register,
        path: '/register',
        layout: null,
    },
    {
        Component: Login,
        path: '/login',
        layout: null,
    },
    {
        Component: Profile,
        path: '/:username',
    },
    {
        Component: PostPage,
        path: '/p/:id',
    },
    {
        Component: PostPage,
        path: '/p/trash/:id',
    },
    {
        Component: Messages,
        path: 'direct/inbox',
    },
    {
        Component: TrashPost,
        path: '/:username/trash',
    },
];
