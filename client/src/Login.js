import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

function Login() {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        accountNumber: "",
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

        const accountRegex = /^[0-9]{10,12}$/;

        if (!accountRegex.test(form.accountNumber)) {
            showMessage(
                "Invalid account number. Please enter a valid 10–12 digit account number.",
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
        showMessage("Authenticating customer...", "info");

        try {
            const res = await fetch("https://localhost:7028/api/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    account: form.accountNumber,
                    password: form.password
                })
            });

            if (!res.ok) {
                const errorText = await res.text();

                console.error("Customer login failed:", errorText);

                showMessage(
                    "Invalid account number or password.",
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

            localStorage.setItem("token", data.token);

            showMessage(
                "Login successful. Redirecting to payment portal...",
                "success"
            );

            setTimeout(() => {
                navigate("/payment");
            }, 1000);
        }
        catch (error) {
            console.error("API connection error:", error);

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
            <h2>Customer International Payments Portal</h2>

            <p style={{ fontSize: "14px", color: "#555" }}>
                Registered customers can log in to create international payments.
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
                type="text"
                placeholder="Account Number"
                value={form.accountNumber}
                disabled={isLoading}
                onChange={(e) =>
                    setForm({
                        ...form,
                        accountNumber: e.target.value
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
                onChange={(e) =>
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

            <p style={{ marginTop: "15px" }}>
                New customer?{" "}
                <Link to="/register">
                    Register here
                </Link>
            </p>
        </div>
    );
}

export default Login;