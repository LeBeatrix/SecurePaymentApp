import React, { useState } from "react";

function Register() {
    const [form, setForm] = useState({
        name: "",
        account: "",
        password: ""
    });

    const validate = () => {
        const nameRegex = /^[A-Za-z\s]{2,50}$/;
        const accountRegex = /^[0-9]{10,12}$/;

        if (!nameRegex.test(form.name)) {
            alert("Invalid name");
            return false;
        }

        if (!accountRegex.test(form.account)) {
            alert("Invalid account number");
            return false;
        }

        if (form.password.length < 8) {
            alert("Password must be at least 8 characters");
            return false;
        }

        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validate()) return;

        try {
            const response = await fetch("/api/auth/register", {
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

            if (!response.ok) {
                const msg = await response.text();
                alert("Error: " + msg);
                return;
            }

            alert("Registration successful!");

            setForm({
                name: "",
                account: "",
                password: ""
            });

        } catch (error) {
            console.error(error);
            alert("Server not reachable");
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

            <button type="submit">Register</button>
        </form>
    );
}

export default Register;