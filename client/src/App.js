import React from "react";
import { BrowserRouter, Routes, Route, Navigate, Link } from "react-router-dom";

import Login from "./Login";
import Register from "./Register";
import Payment from "./Payment";
import EmployeeLogin from "./EmployeeLogin";
import EmployeePortal from "./EmployeePortal";

// Customer protected route
function CustomerProtectedRoute({ children }) {
    const token = localStorage.getItem("token");

    if (!token) {
        return <Navigate to="/" replace />;
    }

    return children;
}

// Employee protected route
function EmployeeProtectedRoute({ children }) {
    const employeeToken = localStorage.getItem("employeeToken");

    if (!employeeToken) {
        return <Navigate to="/employee-login" replace />;
    }

    return children;
}

function App() {
    return (
        <BrowserRouter>
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
                    <Link to="/" style={{ marginRight: "10px" }}>Customer Login</Link>
                    <Link to="/register" style={{ marginRight: "10px" }}>Customer Register</Link>
                    <Link to="/payment" style={{ marginRight: "10px" }}>Make Payment</Link>
                    <Link to="/employee-login" style={{ marginRight: "10px" }}>Employee Login</Link>
                    <Link to="/employee-portal">Employee Portal</Link>
                </nav>

                <Routes>
                    {/* Customer Routes */}
                    <Route path="/" element={<Login />} />

                    <Route path="/register" element={<Register />} />

                    <Route
                        path="/payment"
                        element={
                            <CustomerProtectedRoute>
                                <Payment />
                            </CustomerProtectedRoute>
                        }
                    />

                    {/* Employee Routes */}
                    <Route path="/employee-login" element={<EmployeeLogin />} />

                    <Route
                        path="/employee-portal"
                        element={
                            <EmployeeProtectedRoute>
                                <EmployeePortal />
                            </EmployeeProtectedRoute>
                        }
                    />

                    {/* Fallback */}
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </div>
        </BrowserRouter>
    );
}

export default App;