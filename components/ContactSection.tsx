"use client";
import React, { useState } from "react";

export default function ContactSection() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <section style={{ maxWidth: 800, margin: "40px auto", padding: "0 24px" }}>
      <div className="glass-card" style={{ padding: 40 }}>
        <p style={{ fontFamily: "'Courier New', monospace", color: "#2EE6A8", fontSize: 13, letterSpacing: 1.5, marginBottom: 12 }}>
          COMMUNITY CONTRIBUTIONS
        </p>
        <h1 style={{ fontSize: 32, fontWeight: 700, color: "#FFF", marginBottom: 16 }}>Contribute to the Archive</h1>
        <p style={{ fontSize: 16, color: "#94A3B8", marginBottom: 32 }}>
          Do you have a traditional family recipe, cooking technique, or ancestral food story from Battambang or rural Cambodia? Reach out to feature it in our living collection.
        </p>

        {submitted ? (
          <div style={{ padding: 24, borderRadius: 12, background: "rgba(16, 185, 129, 0.15)", border: "1px solid #10B981", color: "#2EE6A8" }}>
            <h3 style={{ fontSize: 18, marginBottom: 6 }}>Thank you for your submission!</h3>
            <p style={{ fontSize: 14 }}>Our curation team will review your contribution shortly.</p>
          </div>
        ) : (
          <form onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div>
              <label style={{ fontSize: 13, color: "#94A3B8", display: "block", marginBottom: 6 }}>Your Name</label>
              <input className="form-input" placeholder="e.g. Socheata Chan" required />
            </div>
            <div>
              <label style={{ fontSize: 13, color: "#94A3B8", display: "block", marginBottom: 6 }}>Email Address</label>
              <input type="email" className="form-input" placeholder="name@example.com" required />
            </div>
            <div>
              <label style={{ fontSize: 13, color: "#94A3B8", display: "block", marginBottom: 6 }}>Recipe or Story Details</label>
              <textarea className="form-input" rows={4} placeholder="Describe the recipe, regional origin, or elder storyteller..." required />
            </div>
            <button type="submit" className="btn-primary" style={{ alignSelf: "flex-start", marginTop: 8 }}>
              Submit Recipe Contribution
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
