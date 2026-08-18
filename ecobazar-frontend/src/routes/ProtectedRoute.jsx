import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
    // পরে এখানে JWT/Auth Context ব্যবহার করব
    const isAuthenticated = true;

    return isAuthenticated ? children : <Navigate to="/login" replace />;
}