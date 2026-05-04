import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Register() {
    const [form, setForm] = useState({
        name: "",
        account: "",
        password: ""
    });

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    const navigate = useNavigate();

    const validate = () => {
        const nameRegex = /^[A-Za-z\s]{2,50}$/;
        const accountRegex = /^[0-9]{10,12}$/;

        if (!nameRegex.test(form.name)) {
            setMessage("Invalid name");
            return false;
        }

        if (!accountRegex.test(form.account)) {
            setMessage("Invalid account number");
            return false;
        }

        if (form.password.length < 8) {
            setMessage("Password must be at least 8 characters");
            return false;
        }

        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validate()) return;

        try {
            setLoading(true);
            setMessage("");

            const response = await fetch("https://localhost:7028/api/auth/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    name: form.name,
                    accountNumber: form.account,
                    password: form.password
                })
            });

            let data = null;
            try {
                data = await response.json();
            } catch {
                data = null;
            }

            if (!response.ok) {
                setMessage(data?.message || "Registration failed ❌");
                return;
            }

            // 🔐 Store JWT token if backend returns it
            if (data?.token) {
                localStorage.setItem("token", data.token);
            }

            setMessage("Registration successful! Redirecting... ✅");

            // 🔄 Redirect to Payment page after registration
            setTimeout(() => {
                navigate("/payment");
            }, 1000);

            setForm({
                name: "",
                account: "",
                password: ""
            });

        } catch (error) {
            console.error(error);
            setMessage("Server not reachable ❌ (check backend)");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h3>Register</h3>

            <input
                placeholder="Full Name"
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
            />
            <br />

            <input
                placeholder="Account Number"
                value={form.account}
                onChange={e => setForm({ ...form, account: e.target.value })}
            />
            <br />

            <input
                type="password"
                placeholder="Password"
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
            />
            <br />

            <button type="submit" disabled={loading}>
                {loading ? "Registering..." : "Register"}
            </button>

            <p>{message}</p>
        </form>
    );
}

export default Register;