import React, { useEffect, useCallback, useState } from "react";

function EmployeePortal() {
    const [payments, setPayments] = useState([]);

    const token = localStorage.getItem("employeeToken");

    const loadPayments = useCallback(async () => {
        const res = await fetch("https://localhost:7028/api/payment/pending", {
            headers: {
                Authorization: "Bearer " + token
            }
        });

        if (res.ok) {
            const data = await res.json();
            setPayments(data);
        }
    }, [token]);

    const verifyPayment = async (id) => {
        await fetch(`https://localhost:7028/api/payment/${id}/verify`, {
            method: "PATCH",
            headers: {
                Authorization: "Bearer " + token
            }
        });

        loadPayments();
    };

    const submitToSwift = async (id) => {
        await fetch(`https://localhost:7028/api/payment/${id}/submit-swift`, {
            method: "POST",
            headers: {
                Authorization: "Bearer " + token
            }
        });

        loadPayments();
    };

    useEffect(() => {
        loadPayments();
    }, [loadPayments]);

    return (
        <div>
            <h2>Pending International Payments</h2>

            {payments.length === 0 && <p>No pending payments found.</p>}

            {payments.map(payment => (
                <div
                    key={payment.id}
                    style={{
                        border: "1px solid #ccc",
                        padding: "10px",
                        margin: "10px"
                    }}
                >
                    <p><strong>Amount:</strong> {payment.amount}</p>
                    <p><strong>Currency:</strong> {payment.currency}</p>
                    <p><strong>Beneficiary Account:</strong> {payment.beneficiaryAccount}</p>
                    <p><strong>SWIFT Code:</strong> {payment.swiftCode}</p>
                    <p><strong>Status:</strong> {payment.status}</p>

                    <button onClick={() => verifyPayment(payment.id)}>
                        Verify
                    </button>

                    <button onClick={() => submitToSwift(payment.id)}>
                        Submit to SWIFT
                    </button>
                </div>
            ))}
        </div>
    );
}

export default EmployeePortal;