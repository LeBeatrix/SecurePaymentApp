import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function EmployeeLogin({ onLogin }) {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        username: "",
        password: ""
    });

    const login = async () => {
        const usernameRegex = /^[A-Za-z0-9]{3,30}$/;

        if (!usernameRegex.test(form.username)) {
            alert("Invalid username. Use letters and numbers only.");
            return;
        }

        if (!form.password || form.password.length < 8) {
            alert("Invalid password.");
            return;
        }

        try {
            const res = await fetch("https://localhost:7028/api/employee/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    username: form.username,
                    password: form.password
                })
            });

            if (!res.ok) {
                const errorText = await res.text();
                console.error("Employee login failed:", errorText);
                alert("Employee login failed: " + errorText);
                return;
            }

            const data = await res.json();

            if (!data.token) {
                alert("Login succeeded, but no token was returned.");
                return;
            }

            localStorage.setItem("employeeToken", data.token);

            if (onLogin) {
                onLogin();
            }

            alert("Employee login successful");
            navigate("/employee-portal");
        } catch (error) {
            console.error("API connection error:", error);
            alert("Could not connect to backend API. Check that SecureAPI is running on https://localhost:7028");
        }
    };

    return (
        <div>
            <h2>Employee International Payments Portal</h2>

            <p style={{ fontSize: "14px", color: "#555" }}>
                Pre-registered employees only. No registration is available.
            </p>

            <input
                placeholder="Username"
                value={form.username}
                onChange={e => setForm({ ...form, username: e.target.value })}
            />
            <br />

            <input
                type="password"
                placeholder="Password"
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
            />
            <br />

            <button onClick={login}>Login</button>
        </div>
    );
}

export default EmployeeLogin;