import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
    const [form, setForm] = useState({ account: "", password: "" });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    const navigate = useNavigate();

    const submit = async () => {
        if (!form.account || !form.password) {
            setMessage("Please enter both account and password.");
            return;
        }

        try {
            setLoading(true);
            setMessage("");

            const res = await fetch("https://localhost:7028/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },

                // 🔥 FIXED: must match backend LoginModel
                body: JSON.stringify({
                    account: form.account,
                    password: form.password
                })
            });

            const data = await res.json().catch(() => null);

            if (!res.ok) {
                setMessage(data?.message || "Login failed ❌");
                return;
            }

            // 🔐 store JWT token
            if (data?.token) {
                localStorage.setItem("token", data.token);
            }

            setMessage("Login successful! Redirecting... ✅");

            setTimeout(() => {
                navigate("/payment");
            }, 800);

        } catch (error) {
            console.error(error);
            setMessage("Server not reachable ❌ (check backend)");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: "320px" }}>
            <h3>Login</h3>

            <input
                value={form.account}
                placeholder="Account Number"
                onChange={e =>
                    setForm({ ...form, account: e.target.value })
                }
            />
            <br />

            <input
                type="password"
                value={form.password}
                placeholder="Password"
                onChange={e =>
                    setForm({ ...form, password: e.target.value })
                }
            />
            <br />

            <button onClick={submit} disabled={loading}>
                {loading ? "Logging in..." : "Login"}
            </button>

            <button onClick={() => navigate("/register")}>
                Register
            </button>

            <p>{message}</p>
        </div>
    );
}

export default Login;