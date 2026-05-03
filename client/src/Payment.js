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

        if (!amountValid) {
            alert("Invalid amount");
            return false;
        }

        if (!swiftValid) {
            alert("Invalid SWIFT code");
            return false;
        }

        if (!accountValid) {
            alert("Invalid beneficiary account");
            return false;
        }

        return true;
    };

    const handlePayment = async () => {
        if (!validate()) return;

        try {
            // Simulated secure API call (replace later with backend endpoint)
            const response = await fetch("/api/payment/send", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(form)
            });

            if (!response.ok) {
                alert("Payment failed");
                return;
            }

            alert("Payment sent securely to processing system");

            setForm({
                amount: "",
                currency: "USD",
                swift: "",
                beneficiary: ""
            });

        } catch (error) {
            console.error(error);
            alert("Server error - payment not processed");
        }
    };

    return (
        <div>
            <h3>International Payment</h3>

            <input
                placeholder="Amount"
                value={form.amount}
                onChange={e => setForm({ ...form, amount: e.target.value })}
            />
            <br />

            <select
                value={form.currency}
                onChange={e => setForm({ ...form, currency: e.target.value })}
            >
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="ZAR">ZAR</option>
            </select>
            <br />

            <input
                placeholder="SWIFT Code"
                value={form.swift}
                onChange={e => setForm({ ...form, swift: e.target.value.toUpperCase() })}
            />
            <br />

            <input
                placeholder="Beneficiary Account"
                value={form.beneficiary}
                onChange={e => setForm({ ...form, beneficiary: e.target.value })}
            />
            <br />

            <button onClick={handlePayment}>Pay Now</button>
        </div>
    );
}

export default Payment;