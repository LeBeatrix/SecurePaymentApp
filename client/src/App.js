import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./Login";
import Register from "./Register";
import Payment from "./Payment";

// 🔐 Protected Route Component
function ProtectedRoute({ children }) {
    const token = localStorage.getItem("token");

    if (!token) {
        return <Navigate to="/" replace />;
    }

    return children;
}

function App() {
    return (
        <BrowserRouter>
            <div style={{
                maxWidth: "500px",
                margin: "auto",
                padding: "20px",
                border: "1px solid #ccc",
                borderRadius: "10px",
                fontFamily: "Arial",
                textAlign: "center"
            }}>
                <h1>🌍 International Payments Portal</h1>

                <Routes>
                    {/* 🔐 Login Page (default) */}
                    <Route path="/" element={<Login />} />

                    {/* 📝 Register Page */}
                    <Route path="/register" element={<Register />} />

                    {/* 💳 Payment Page (PROTECTED) */}
                    <Route path="/payment" element={
                        <ProtectedRoute>
                            <Payment />
                        </ProtectedRoute>
                    } />

                    {/* fallback route */}
                    <Route path="*" element={<Navigate to="/" />} />
                </Routes>
            </div>
        </BrowserRouter>
    );
}

export default App;