export default function HomePage() {
    return (
        <main style={mainStyle}>
            <div style={containerStyle}>
                <h1 style={titleStyle}>Home</h1>
                <p style={textStyle}>Welcome to the home page</p>
            </div>
        </main>
    );
}

const mainStyle = {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "20px",
};

const containerStyle = {
    textAlign: "center" as const,
    maxWidth: "600px",
};

const titleStyle = {
    fontSize: "2.5rem",
    marginBottom: "1rem",
    fontWeight: 600,
};

const textStyle = {
    fontSize: "1.1rem",
    color: "#666",
};
