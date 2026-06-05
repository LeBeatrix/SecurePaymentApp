import React, { useState } from "react";

function Payment({ onLogout }) {
    const [form, setForm] = useState({
        amount: "",
        currency: "USD",
        swiftCode: "",
        beneficiaryAccount: ""
    });

    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const showMessage = (text, type) => {
        setMessage(text);
        setMessageType(type);
    };

    const validate = () => {
        const amountRegex = /^\d+(\.\d{1,2})?$/;
        const swiftRegex = /^[A-Z]{6}[A-Z0-9]{2}([A-Z0-9]{3})?$/;
        const accountRegex = /^[0-9]{8,20}$/;

        if (!amountRegex.test(form.amount) || Number(form.amount) <= 0) {
            showMessage("Invalid amount. Please enter a valid amount greater than 0.", "error");
            return false;
        }

        if (!swiftRegex.test(form.swiftCode)) {
            showMessage("Invalid SWIFT code. Example of a valid SWIFT code: CHASUS33.", "error");
            return false;
        }

        if (!accountRegex.test(form.beneficiaryAccount)) {
            showMessage("Invalid beneficiary account. Use 8 to 20 digits only.", "error");
            return false;
        }

        return true;
    };

    const submitPayment = async () => {
        setMessage("");

        if (!validate()) return;

        const token = localStorage.getItem("token");

        if (!token) {
            showMessage("You are not logged in. Please log in again.", "error");
            return;
        }

        setIsLoading(true);
        showMessage("Processing payment request...", "info");

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
                showMessage("Payment failed: " + errorText, "error");
                return;
            }

            showMessage(
                "Payment submitted successfully. Status: Pending Employee Verification.",
                "success"
            );

            setForm({
                amount: "",
                currency: "USD",
                swiftCode: "",
                beneficiaryAccount: ""
            });
        }
        catch (error) {
            console.error("API connection error:", error);
            showMessage("Could not connect to SecureAPI. Please ensure the backend is running.", "error");
        }
        finally {
            setIsLoading(false);
        }
    };

    const getMessageStyle = () => {
        if (messageType === "success") {
            return {
                backgroundColor: "#d4edda",
                color: "#155724",
                border: "1px solid #c3e6cb"
            };
        }

        if (messageType === "error") {
            return {
                backgroundColor: "#f8d7da",
                color: "#721c24",
                border: "1px solid #f5c6cb"
            };
        }

        return {
            backgroundColor: "#d1ecf1",
            color: "#0c5460",
            border: "1px solid #bee5eb"
        };
    };

    return (
        <div>
            <h2>Make International Payment</h2>

            <p style={{ fontSize: "14px", color: "#555" }}>
                Enter payment details for employee verification and SWIFT submission.
            </p>

            {message && (
                <div
                    style={{
                        ...getMessageStyle(),
                        padding: "10px",
                        marginBottom: "15px",
                        borderRadius: "5px"
                    }}
                >
                    {message}
                </div>
            )}

            <input
                placeholder="Amount"
                value={form.amount}
                onChange={e => setForm({ ...form, amount: e.target.value })}
                disabled={isLoading}
            />
            <br />
            <br />

            <select
                value={form.currency}
                onChange={e => setForm({ ...form, currency: e.target.value })}
                disabled={isLoading}
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
                disabled={isLoading}
            />
            <br />
            <br />

            <input
                placeholder="Beneficiary Account"
                value={form.beneficiaryAccount}
                onChange={e => setForm({ ...form, beneficiaryAccount: e.target.value })}
                disabled={isLoading}
            />
            <br />
            <br />

            <button
                onClick={submitPayment}
                disabled={isLoading}
                style={{ marginRight: "10px" }}
            >
                {isLoading ? "Processing..." : "Pay Now"}
            </button>

            <button onClick={onLogout} disabled={isLoading}>
                Logout
            </button>
        </div>
    );
}

export default Payment;