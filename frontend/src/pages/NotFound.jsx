import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => (
    <div style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        color: "#222",
        textAlign: "center",
        padding: "2rem"
    }}>
        <h1 style={{ fontSize: "6rem", margin: 0 }}>404</h1>
        <h2 style={{ fontSize: "2rem", margin: "1rem 0" }}>Lost in the pews?</h2>
        <p style={{ maxWidth: 400, margin: "1rem auto 2rem" }}>
            We couldn&apos;t find the page you&apos;re looking for. Maybe it&apos;s in another congregation!<br />
            Let&apos;s help you get back to the community.
        </p>
        <Link to="/" style={{
            padding: "0.75rem 2rem",
            background: "#4f46e5",
            color: "#fff",
            borderRadius: "0.5rem",
            textDecoration: "none",
            fontWeight: "bold",
            fontSize: "1.1rem",
            boxShadow: "0 2px 8px rgba(79,70,229,0.1)",
            transition: "background 0.2s"
        }}>
            Return Home
        </Link>
    </div>
);

export default NotFound;
