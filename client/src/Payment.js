import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Payment() {
    const [form, setForm] = useState({
        amount: "",
        currency: "USD",
        swift: "",
        beneficiary: ""
    });

    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    // 🔐 Extra protection (even if route is bypassed)
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            navigate("/");
        }
    }, [navigate]);

    const validate = () => {
        const amountValid = /^\d+(\.\d{1,2})?$/.test(form.amount);
        const swiftValid = /^[A-Z0-9]{8,11}$/.test(form.swift);
        const accountValid = /^[0-9]{8,20}$/.test(form.beneficiary);

        if (!amountValid) {
            setMessage("Invalid amount");
            return false;
        }

        if (!swiftValid) {
            setMessage("Invalid SWIFT code");
            return false;
        }

        if (!accountValid) {
            setMessage("Invalid beneficiary account");
            return false;
        }

        return true;
    };

    const handlePayment = async () => {
        if (!validate()) return;

        try {
            setLoading(true);
            setMessage("");

            const token = localStorage.getItem("token");

            const response = await fetch("https://localhost:7028/api/payment/send", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    amount: form.amount,
                    currency: form.currency,
                    swiftCode: form.swift,
                    beneficiaryAccount: form.beneficiary
                })
            });

            let data = null;
            try {
                data = await response.json();
            } catch {
                data = null;
            }

            if (!response.ok) {
                setMessage(data?.message || "Payment failed ❌");
                return;
            }

            setMessage("Payment sent securely for processing ✅");

            setForm({
                amount: "",
                currency: "USD",
                swift: "",
                beneficiary: ""
            });

        } catch (error) {
            console.error(error);
            setMessage("Server error - payment not processed ❌");
        } finally {
            setLoading(false);
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
                onChange={e =>
                    setForm({ ...form, swift: e.target.value.toUpperCase() })
                }
            />
            <br />

            <input
                placeholder="Beneficiary Account"
                value={form.beneficiary}
                onChange={e =>
                    setForm({ ...form, beneficiary: e.target.value })
                }
            />
            <br />

            <button onClick={handlePayment} disabled={loading}>
                {loading ? "Processing..." : "Pay Now"}
            </button>

            <p>{message}</p>
        </div>
    );
}

export default Payment;