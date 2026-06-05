import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function EmployeeLogin({ onLogin }) {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        username: "",
        password: ""
    });

    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState("");
    const [isLoading, setIsLoading] = useState(false);

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

    const login = async () => {
        setMessage("");

        const usernameRegex = /^[A-Za-z0-9]{3,30}$/;

        if (!usernameRegex.test(form.username)) {
            showMessage(
                "Invalid username. Use letters and numbers only.",
                "error"
            );
            return;
        }

        if (!form.password || form.password.length < 8) {
            showMessage(
                "Invalid password. Password must contain at least 8 characters.",
                "error"
            );
            return;
        }

        setIsLoading(true);
        showMessage(
            "Authenticating employee...",
            "info"
        );

        try {
            const res = await fetch(
                "https://localhost:7028/api/employee/login",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        username: form.username,
                        password: form.password
                    })
                }
            );

            if (!res.ok) {
                const errorText = await res.text();

                console.error(
                    "Employee login failed:",
                    errorText
                );

                showMessage(
                    "Invalid employee credentials.",
                    "error"
                );

                return;
            }

            const data = await res.json();

            if (!data.token) {
                showMessage(
                    "Authentication failed. No token was returned.",
                    "error"
                );

                return;
            }

            localStorage.setItem(
                "employeeToken",
                data.token
            );

            if (onLogin) {
                onLogin();
            }

            showMessage(
                "Employee authenticated successfully. Redirecting to employee portal...",
                "success"
            );

            setTimeout(() => {
                navigate("/employee-portal");
            }, 1000);
        }
        catch (error) {
            console.error(
                "API connection error:",
                error
            );

            showMessage(
                "Could not connect to SecureAPI. Please ensure the backend is running.",
                "error"
            );
        }
        finally {
            setIsLoading(false);
        }
    };

    return (
        <div>
            <h2>Employee International Payments Portal</h2>

            <p style={{ fontSize: "14px", color: "#555" }}>
                Pre-registered employees only. No registration is available.
            </p>

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

            <input
                placeholder="Username"
                value={form.username}
                disabled={isLoading}
                onChange={e =>
                    setForm({
                        ...form,
                        username: e.target.value
                    })
                }
            />

            <br />
            <br />

            <input
                type="password"
                placeholder="Password"
                value={form.password}
                disabled={isLoading}
                onChange={e =>
                    setForm({
                        ...form,
                        password: e.target.value
                    })
                }
            />

            <br />
            <br />

            <button
                onClick={login}
                disabled={isLoading}
            >
                {isLoading ? "Authenticating..." : "Login"}
            </button>
        </div>
    );
}

export default EmployeeLogin;