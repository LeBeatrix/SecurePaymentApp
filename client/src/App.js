import React from "react";
import { BrowserRouter, Routes, Route, Navigate, Link, useNavigate } from "react-router-dom";

import Login from "./Login";
import Register from "./Register";
import Payment from "./Payment";
import EmployeeLogin from "./EmployeeLogin";
import EmployeePortal from "./EmployeePortal";

function CustomerProtectedRoute({ children }) {
    const token = localStorage.getItem("token");
    return token ? children : <Navigate to="/" replace />;
}

function EmployeeProtectedRoute({ children }) {
    const employeeToken = localStorage.getItem("employeeToken");
    return employeeToken ? children : <Navigate to="/employee-login" replace />;
}

function AppContent() {
    const navigate = useNavigate();

    const customerLoggedIn = localStorage.getItem("token");
    const employeeLoggedIn = localStorage.getItem("employeeToken");

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("employeeToken");

        if (employeeLoggedIn) {
            navigate("/employee-login");
        } else {
            navigate("/");
        }

        window.location.reload();
    };

    return (
        <div style={{
            maxWidth: "700px",
            margin: "auto",
            padding: "20px",
            border: "1px solid #ccc",
            borderRadius: "10px",
            fontFamily: "Arial",
            textAlign: "center"
        }}>
            <h1>🌍 International Payments System</h1>

            <nav style={{ marginBottom: "20px" }}>
                {!customerLoggedIn && !employeeLoggedIn && (
                    <>
                        <Link to="/" style={{ marginRight: "10px" }}>
                            Customer Login
                        </Link>

                        <Link to="/register" style={{ marginRight: "10px" }}>
                            Customer Register
                        </Link>

                        <Link to="/employee-login">
                            Employee Login
                        </Link>
                    </>
                )}

                {customerLoggedIn && !employeeLoggedIn}
            </nav>

            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/register" element={<Register />} />

                <Route
                    path="/payment"
                    element={
                        <CustomerProtectedRoute>
                            <Payment onLogout={logout} />
                        </CustomerProtectedRoute>
                    }
                />

                <Route path="/employee-login" element={<EmployeeLogin />} />

                <Route
                    path="/employee-portal"
                    element={
                        <EmployeeProtectedRoute>
                            <EmployeePortal onLogout={logout} />
                        </EmployeeProtectedRoute>
                    }
                />

                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </div>
    );
}

function App() {
    return (
        <BrowserRouter>
            <AppContent />
        </BrowserRouter>
    );
}

export default App;