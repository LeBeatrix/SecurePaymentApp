import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Register() {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        name: "",
        accountNumber: "",
        password: ""
    });

    const validate = () => {
        const nameRegex = /^[A-Za-z\s]{2,50}$/;
        const accountRegex = /^[0-9]{10,12}$/;

        if (!nameRegex.test(form.name)) {
            alert("Invalid name. Use letters only.");
            return false;
        }

        if (!accountRegex.test(form.accountNumber)) {
            alert("Invalid account number.");
            return false;
        }

        if (!form.password || form.password.length < 8) {
            alert("Password must be at least 8 characters.");
            return false;
        }

        return true;
    };

    const register = async () => {
        if (!validate()) return;

        try {
            const res = await fetch("https://localhost:7028/api/auth/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    name: form.name,
                    accountNumber: form.accountNumber,
                    password: form.password
                })
            });

            if (!res.ok) {
                const errorText = await res.text();
                alert("Registration failed: " + errorText);
                return;
            }

            alert("Customer account created successfully.");
            navigate("/");
        }
        catch (error) {
            console.error("API connection error:", error);
            alert("Could not connect to SecureAPI.");
        }
    };

    return (
        <div>
            <h2>Create Customer Account</h2>

            <p style={{ fontSize: "14px", color: "#555" }}>
                New customers must register before making international payments.
            </p>

            <input
                placeholder="Full Name"
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
            />
            <br />
            <br />

            <input
                placeholder="Account Number"
                value={form.accountNumber}
                onChange={e => setForm({ ...form, accountNumber: e.target.value })}
            />
            <br />
            <br />

            <input
                type="password"
                placeholder="Password"
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
            />
            <br />
            <br />

            <button onClick={register}>
                Create Account
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