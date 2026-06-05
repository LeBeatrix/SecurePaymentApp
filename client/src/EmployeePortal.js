import React, { useEffect, useCallback, useState } from "react";

function EmployeePortal({ onLogout }) {
    const [payments, setPayments] = useState([]);
    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState("");
    const [processingId, setProcessingId] = useState(null);

    const token = localStorage.getItem("employeeToken");

    const showMessage = (text, type) => {
        setMessage(text);
        setMessageType(type);
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

    const loadPayments = useCallback(async () => {
        try {
            const res = await fetch(
                "https://localhost:7028/api/payment/pending",
                {
                    headers: {
                        Authorization: "Bearer " + token
                    }
                }
            );

            if (!res.ok) {
                const errorText = await res.text();

                showMessage(
                    "Unable to load pending payments.",
                    "error"
                );

                console.error(errorText);
                return;
            }

            const data = await res.json();
            setPayments(data);
        }
        catch (error) {
            console.error(error);

            showMessage(
                "Could not connect to SecureAPI.",
                "error"
            );
        }
    }, [token]);

    const verifyPayment = async (id) => {
        setProcessingId(id);

        try {
            showMessage(
                "Verifying payment...",
                "info"
            );

            const res = await fetch(
                `https://localhost:7028/api/payment/${id}/verify`,
                {
                    method: "PATCH",
                    headers: {
                        Authorization: "Bearer " + token
                    }
                }
            );

            if (!res.ok) {
                const errorText = await res.text();

                showMessage(
                    "Payment verification failed.",
                    "error"
                );

                console.error(errorText);
                return;
            }

            showMessage(
                "Payment verified successfully.",
                "success"
            );

            loadPayments();
        }
        catch (error) {
            console.error(error);

            showMessage(
                "Could not verify payment.",
                "error"
            );
        }
        finally {
            setProcessingId(null);
        }
    };

    const submitToSwift = async (id) => {
        setProcessingId(id);

        try {
            showMessage(
                "Submitting payment to SWIFT...",
                "info"
            );

            const res = await fetch(
                `https://localhost:7028/api/payment/${id}/submit-swift`,
                {
                    method: "POST",
                    headers: {
                        Authorization: "Bearer " + token
                    }
                }
            );

            if (!res.ok) {
                const errorText = await res.text();

                showMessage(
                    "SWIFT submission failed.",
                    "error"
                );

                console.error(errorText);
                return;
            }

            showMessage(
                "Payment submitted to SWIFT successfully.",
                "success"
            );

            loadPayments();
        }
        catch (error) {
            console.error(error);

            showMessage(
                "Could not submit payment to SWIFT.",
                "error"
            );
        }
        finally {
            setProcessingId(null);
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

            {payments.length === 0 && (
                <p>No pending payments found.</p>
            )}

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
                    <p>
                        <strong>Amount:</strong> {payment.amount}
                    </p>

                    <p>
                        <strong>Currency:</strong> {payment.currency}
                    </p>

                    <p>
                        <strong>Beneficiary Account:</strong> {payment.beneficiaryAccount}
                    </p>

                    <p>
                        <strong>SWIFT Code:</strong> {payment.swiftCode}
                    </p>

                    <p>
                        <strong>Status:</strong> {payment.status}
                    </p>

                    {payment.verifiedBy && (
                        <p>
                            <strong>Verified By:</strong> {payment.verifiedBy}
                        </p>
                    )}

                    <button
                        onClick={() => verifyPayment(payment.id)}
                        disabled={
                            processingId === payment.id ||
                            payment.status === "Verified" ||
                            payment.status === "Submitted to SWIFT"
                        }
                        style={{ marginRight: "10px" }}
                    >
                        {processingId === payment.id
                            ? "Verifying..."
                            : "Verify"}
                    </button>

                    <button
                        onClick={() => submitToSwift(payment.id)}
                        disabled={
                            processingId === payment.id ||
                            payment.status !== "Verified"
                        }
                    >
                        {processingId === payment.id
                            ? "Submitting..."
                            : "Submit to SWIFT"}
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