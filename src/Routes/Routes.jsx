import { createBrowserRouter } from "react-router-dom";
import Root from "../Layouts/Root";
import Home from "../pages/Home/Home";
import Login from "../pages/Validation/Login";
import Registration from "../pages/Validation/Registration";
import Profile from "../components/Profile";
import Users from "../pages/Users/Users";
import PrivateRoute from "./PrivateRoute";
import AddCustomers from "../pages/Customers/AddCustomers";
import ListCustomers from "../pages/Customers/ListCustomers";
import CustomersDetails from "../pages/Customers/CustomersDetails";


const router = createBrowserRouter([
    {
        path: "/",
        element: <Root />,
        errorElement: <></>,
        children: [
            {
                path: '/',
                element: <PrivateRoute><Home /></PrivateRoute>
            },
            {
                path: '/login',
                element: <Login></Login>
            },
            {
                path: '/add-user',
                element: <PrivateRoute><Registration></Registration></PrivateRoute>
            },
            {
                path: '/profile',
                element: <PrivateRoute><Profile></Profile></PrivateRoute>
            },
            {
                path: '/all-users',
                element: <PrivateRoute><Users></Users></PrivateRoute>
            },
            {
                path: '/add-customers',
                element: <PrivateRoute><AddCustomers></AddCustomers></PrivateRoute>
            },
            {
                path: '/list-customers',
                element: <PrivateRoute><ListCustomers></ListCustomers></PrivateRoute>
            },
            {
                path: '/customer-details',
                element: <PrivateRoute><CustomersDetails /></PrivateRoute>
            }


        ]
    },

]);

export default router;
