import React, { useState } from "react";

function Payment({ onLogout }) {
    const [form, setForm] = useState({
        amount: "",
        currency: "USD",
        swiftCode: "",
        beneficiaryAccount: ""
    });

    const validate = () => {
        const amountRegex = /^\d+(\.\d{1,2})?$/;
        const swiftRegex = /^[A-Z]{6}[A-Z0-9]{2}([A-Z0-9]{3})?$/;
        const accountRegex = /^[0-9]{8,20}$/;

        if (!amountRegex.test(form.amount) || Number(form.amount) <= 0) {
            alert("Invalid amount.");
            return false;
        }

        if (!swiftRegex.test(form.swiftCode)) {
            alert("Invalid SWIFT code.");
            return false;
        }

        if (!accountRegex.test(form.beneficiaryAccount)) {
            alert("Invalid beneficiary account.");
            return false;
        }

        return true;
    };

    const submitPayment = async () => {
        if (!validate()) return;

        const token = localStorage.getItem("token");

        try {
            const res = await fetch("https://localhost:7028/api/payment/send", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + token
                },
                body: JSON.stringify({
                    amount: Number(form.amount),
                    currency: form.currency,
                    swiftCode: form.swiftCode,
                    beneficiaryAccount: form.beneficiaryAccount
                })
            });

            if (!res.ok) {
                const errorText = await res.text();
                alert("Payment failed: " + errorText);
                return;
            }

            alert("Payment submitted successfully.");
        }
        catch (error) {
            console.error("API connection error:", error);
            alert("Could not connect to SecureAPI.");
        }
    };

    return (
        <div>
            <h2>Make International Payment</h2>

            <p style={{ fontSize: "14px", color: "#555" }}>
                Enter payment details for employee verification and SWIFT submission.
            </p>

            <input
                placeholder="Amount"
                value={form.amount}
                onChange={e => setForm({ ...form, amount: e.target.value })}
            />
            <br />
            <br />

            <select
                value={form.currency}
                onChange={e => setForm({ ...form, currency: e.target.value })}
            >
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="GBP">GBP</option>
                <option value="ZAR">ZAR</option>
            </select>
            <br />
            <br />

            <input
                placeholder="SWIFT Code"
                value={form.swiftCode}
                onChange={e => setForm({ ...form, swiftCode: e.target.value.toUpperCase() })}
            />
            <br />
            <br />

            <input
                placeholder="Beneficiary Account"
                value={form.beneficiaryAccount}
                onChange={e => setForm({ ...form, beneficiaryAccount: e.target.value })}
            />
            <br />
            <br />

            <button onClick={submitPayment} style={{ marginRight: "10px" }}>
                Pay Now
            </button>

            <button onClick={onLogout}>
                Logout
            </button>
        </div>
    );
}

export default Payment;