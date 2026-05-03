import React, { useState } from "react";

function Login() {
    const [form, setForm] = useState({ account: "", password: "" });

    const submit = async () => {
        const res = await fetch("https://localhost:5001/api/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(form)
        });

        if (res.ok) alert("Login successful");
        else alert("Login failed");
    };

    return (
        <div>
            <h3>Login</h3>
            <input placeholder="Account" onChange={e => setForm({ ...form, account: e.target.value })} /><br />
            <input type="password" placeholder="Password" onChange={e => setForm({ ...form, password: e.target.value })} /><br />
            <button onClick={submit}>Login</button>
        </div>
    );
}
