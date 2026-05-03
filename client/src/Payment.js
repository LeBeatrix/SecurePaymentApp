import React, { useState } from "react";

function Payment() {
    const [form, setForm] = useState({
        amount: "",
        currency: "USD",
        swift: "",
        beneficiary: ""
    });

    const validate = () => {
        const amountValid = /^\d+(\.\d{1,2})?$/.test(form.amount);
        const swiftValid = /^[A-Z0-9]{8,11}$/.test(form.swift);
        const accountValid = /^[0-9]{8,20}$/.test(form.beneficiary);

        if (!amountValid) return alert("Invalid amount");
        if (!swiftValid) return alert("Invalid SWIFT code");
        if (!accountValid) return alert("Invalid beneficiary account");

        return true;
    };

    const handlePayment = () => {
        if (!validate()) return;

        alert("Payment sent securely to processing system");
    };

    return (
        <div>
            <h3>International Payment</h3>

            <input
                placeholder="Amount"
                onChange={e => setForm({ ...form, amount: e.target.value })}
            /><br />

            <select onChange={e => setForm({ ...form, currency: e.target.value })}>
                <option>USD</option>
                <option>EUR</option>
                <option>ZAR</option>
            </select><br />

            <input
                placeholder="SWIFT Code"
                onChange={e => setForm({ ...form, swift: e.target.value })}
            /><br />

            <input
                placeholder="Beneficiary Account"
                onChange={e => setForm({ ...form, beneficiary: e.target.value })}
            /><br />

            <button onClick={handlePayment}>Pay Now</button>
        </div>
    );
}

export default Payment;