import { createBrowserRouter } from "react-router-dom";
import Home from "./pages/Home";
import { Children } from "react";
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import WorkSpace from "./pages/WorkSpace";
import ChartMaker from "./pages/MAC/ChartMaker";
import Admin from "./pages/admin/Admin";

export const MACRouter = createBrowserRouter([
    {
        path: '/',
        element: <Home />
    },
    {
        path: '/login',
        element: <Login />
    },
    {
        path: '/signup',
        element: <Signup />
    },
    {
        path: '/workspace',
        element: <WorkSpace />
    },
    {
        path: '/maker',
        element: <ChartMaker />
    },
    {
        path: '/admin',
        element: <Admin />
    }
])