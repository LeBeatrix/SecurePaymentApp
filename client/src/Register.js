import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Register() {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        name: "",
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

    const validate = () => {
        const nameRegex = /^[A-Za-z\s]{2,50}$/;
        const accountRegex = /^[0-9]{10,12}$/;

        if (!nameRegex.test(form.name)) {
            showMessage(
                "Invalid name. Please use letters and spaces only.",
                "error"
            );
            return false;
        }

        if (!accountRegex.test(form.accountNumber)) {
            showMessage(
                "Invalid account number. Please enter a valid 10–12 digit account number.",
                "error"
            );
            return false;
        }

        if (!form.password || form.password.length < 8) {
            showMessage(
                "Password must contain at least 8 characters.",
                "error"
            );
            return false;
        }

        return true;
    };

    const register = async () => {
        setMessage("");

        if (!validate()) return;

        setIsLoading(true);
        showMessage(
            "Creating customer account...",
            "info"
        );

        try {
            const res = await fetch(
                "https://localhost:7028/api/auth/register",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        name: form.name,
                        accountNumber: form.accountNumber,
                        password: form.password
                    })
                }
            );

            if (!res.ok) {
                const errorText = await res.text();

                showMessage(
                    errorText || "Registration failed.",
                    "error"
                );

                return;
            }

            showMessage(
                "Customer account created successfully. Redirecting to login...",
                "success"
            );

            setTimeout(() => {
                navigate("/");
            }, 1500);
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
            <h2>Create Customer Account</h2>

            <p style={{ fontSize: "14px", color: "#555" }}>
                New customers must register before making international payments.
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
                placeholder="Full Name"
                value={form.name}
                disabled={isLoading}
                onChange={e =>
                    setForm({
                        ...form,
                        name: e.target.value
                    })
                }
            />
            <br />
            <br />

            <input
                placeholder="Account Number"
                value={form.accountNumber}
                disabled={isLoading}
                onChange={e =>
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
                onClick={register}
                disabled={isLoading}
            >
                {isLoading ? "Creating Account..." : "Create Account"}
            </button>

            <p style={{ marginTop: "15px" }}>
                Already registered?{" "}
                <Link to="/">
                    Login here
                </Link>
            </p>
        </div>
    );
}

export default Register;