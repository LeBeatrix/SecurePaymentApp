import React, { useState } from "react";
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

    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState("");

    const customerLoggedIn = localStorage.getItem("token");
    const employeeLoggedIn = localStorage.getItem("employeeToken");

    const showMessage = (text, type) => {
        setMessage(text);
        setMessageType(type);
    };

    const getMessageStyle = () => {
        if (messageType === "success") {
            return {
                backgroundColor: "#d4edda",
                color: "#155724",
                border: "1px solid #c3e6cb"
            };
        }

        if (messageType === "error") {
            return {
                backgroundColor: "#f8d7da",
                color: "#721c24",
                border: "1px solid #f5c6cb"
            };
        }

        return {
            backgroundColor: "#d1ecf1",
            color: "#0c5460",
            border: "1px solid #bee5eb"
        };
    };

    const logout = () => {
        const wasEmployee = !!localStorage.getItem("employeeToken");

        localStorage.removeItem("token");
        localStorage.removeItem("employeeToken");

        showMessage(
            "You have been logged out successfully.",
            "success"
        );

        setTimeout(() => {
            if (wasEmployee) {
                navigate("/employee-login");
            } else {
                navigate("/");
            }

            window.location.reload();
        }, 800);
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

            {message && (
                <div
                    style={{
                        ...getMessageStyle(),
                        padding: "10px",
                        marginBottom: "15px",
                        borderRadius: "5px"
                    }}
                >
                    {message}
                </div>
            )}

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

                {customerLoggedIn && !employeeLoggedIn && (
                    <Link to="/payment">
                        Make Payment
                    </Link>
                )}
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