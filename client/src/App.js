function App() {
    return (
        <div style={{
            maxWidth: "500px",
            margin: "auto",
            padding: "20px",
            border: "1px solid #ccc",
            borderRadius: "10px",
            fontFamily: "Arial"
        }}>
            <h1 style={{ textAlign: "center" }}>
                🌍 International Payments Portal
            </h1>

            <Register />
            <hr />
            <Payment />
        </div>
    );
}