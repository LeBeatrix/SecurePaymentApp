import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

function Login() {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        accountNumber: "",
        password: ""
    });

    const login = async () => {
        const accountRegex = /^[0-9]{10,12}$/;

        if (!accountRegex.test(form.accountNumber)) {
            alert("Invalid account number.");
            return;
        }

        if (!form.password || form.password.length < 8) {
            alert("Invalid password.");
            return;
        }

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
                alert("Customer login failed: " + errorText);
                return;
            }

            const data = await res.json();

            if (!data.token) {
                alert("Login succeeded, but no token was returned.");
                return;
            }

            localStorage.setItem("token", data.token);

            alert("Customer login successful");

            navigate("/payment");
        }
        catch (error) {
            console.error("API connection error:", error);

            alert(
                "Could not connect to SecureAPI. Ensure the API is running on https://localhost:7028"
            );
        }
    };

    return (
        <div>
            <h2>Customer International Payments Portal</h2>

            <p style={{ fontSize: "14px", color: "#555" }}>
                Registered customers can log in to create international payments.
            </p>

            <input
                type="text"
                placeholder="Account Number"
                value={form.accountNumber}
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
                onChange={(e) =>
                    setForm({
                        ...form,
                        password: e.target.value
                    })
                }
            />

            <br />
            <br />

            <button onClick={login}>
                Login
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