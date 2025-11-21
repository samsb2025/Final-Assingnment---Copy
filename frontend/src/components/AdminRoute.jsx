import { Navigate, Outlet } from "react-router-dom";

const AdminRoute = () => {
  const token = localStorage.getItem("token");
  const user = localStorage.getItem("user");
  const admin = user && JSON.parse(user).role === "admin";
  return admin ? <Outlet /> : <Navigate to="/login" />;
};

export default AdminRoute;
