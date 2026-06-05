import React, { useEffect, useCallback, useState } from "react";

function EmployeePortal({ onLogout }) {
    const [payments, setPayments] = useState([]);

    const token = localStorage.getItem("employeeToken");

    const loadPayments = useCallback(async () => {
        try {
            const res = await fetch("https://localhost:7028/api/payment/pending", {
                headers: {
                    Authorization: "Bearer " + token
                }
            });

            if (!res.ok) {
                const errorText = await res.text();
                console.error("Failed to load payments:", errorText);
                alert("Failed to load payments: " + errorText);
                return;
            }

            const data = await res.json();
            setPayments(data);
        }
        catch (error) {
            console.error("API connection error:", error);
            alert("Could not connect to SecureAPI.");
        }
    }, [token]);

    const verifyPayment = async (id) => {
        try {
            const res = await fetch(`https://localhost:7028/api/payment/${id}/verify`, {
                method: "PATCH",
                headers: {
                    Authorization: "Bearer " + token
                }
            });

            if (!res.ok) {
                const errorText = await res.text();
                alert("Verification failed: " + errorText);
                return;
            }

            alert("Payment verified successfully.");
            loadPayments();
        }
        catch (error) {
            console.error("Verification error:", error);
            alert("Could not verify payment.");
        }
    };

    const submitToSwift = async (id) => {
        try {
            const res = await fetch(`https://localhost:7028/api/payment/${id}/submit-swift`, {
                method: "POST",
                headers: {
                    Authorization: "Bearer " + token
                }
            });

            if (!res.ok) {
                const errorText = await res.text();
                alert("Submit to SWIFT failed: " + errorText);
                return;
            }

            alert("Payment submitted to SWIFT successfully.");
            loadPayments();
        }
        catch (error) {
            console.error("Submit to SWIFT error:", error);
            alert("Could not submit payment to SWIFT.");
        }
    };

    useEffect(() => {
        loadPayments();
    }, [loadPayments]);

    return (
        <div>
            <h2>Employee International Payments Portal</h2>

            <p style={{ fontSize: "14px", color: "#555" }}>
                Review pending payments, verify account details, and submit verified payments to SWIFT.
            </p>

            {payments.length === 0 && <p>No pending payments found.</p>}

            {payments.map(payment => (
                <div
                    key={payment.id}
                    style={{
                        border: "1px solid #ccc",
                        padding: "10px",
                        margin: "10px",
                        borderRadius: "6px"
                    }}
                >
                    <p><strong>Amount:</strong> {payment.amount}</p>
                    <p><strong>Currency:</strong> {payment.currency}</p>
                    <p><strong>Beneficiary Account:</strong> {payment.beneficiaryAccount}</p>
                    <p><strong>SWIFT Code:</strong> {payment.swiftCode}</p>
                    <p><strong>Status:</strong> {payment.status}</p>

                    {payment.verifiedBy && (
                        <p><strong>Verified By:</strong> {payment.verifiedBy}</p>
                    )}

                    <button
                        onClick={() => verifyPayment(payment.id)}
                        disabled={payment.status === "Verified" || payment.status === "Submitted to SWIFT"}
                        style={{ marginRight: "10px" }}
                    >
                        Verify
                    </button>

                    <button
                        onClick={() => submitToSwift(payment.id)}
                        disabled={payment.status !== "Verified"}
                    >
                        Submit to SWIFT
                    </button>
                </div>
            ))}

            <br />

            <button onClick={onLogout}>
                Logout
            </button>
        </div>
    );
}

export default EmployeePortal;