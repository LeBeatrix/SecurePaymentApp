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
                body: JSON.stringify({
                    accountNumber: form.account,
                    password: form.password
                })
            });

            let data = null;
            try {
                data = await res.json();
            } catch {
                data = null;
            }

            if (res.ok) {
                // 🔐 Store JWT token if returned
                if (data?.token) {
                    localStorage.setItem("token", data.token);
                }

                setMessage("Login successful! Redirecting... ✅");

                // 🚀 Redirect to Payment page
                setTimeout(() => {
                    navigate("/payment");
                }, 800);

            } else {
                setMessage(data?.message || "Login failed ❌");
            }

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