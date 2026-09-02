"use client";
import React, { useState, ChangeEvent } from "react";
import { ArchiveEntry } from "../types";

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddEntry: (newEntry: ArchiveEntry) => void;
}

export default function UploadModal({ isOpen, onClose, onAddEntry }: UploadModalProps) {
  const [titleKhmer, setTitleKhmer] = useState("");
  const [titleEnglish, setTitleEnglish] = useState("");
  const [category, setCategory] = useState("Main Dish");
  const [province, setProvince] = useState("Battambang");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState<string>("");

  if (!isOpen) return null;

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!titleKhmer || !titleEnglish) return;

    const newEntry: ArchiveEntry = {
      id: String(Date.now()).slice(-3),
      titleKhmer,
      titleEnglish,
      category,
      province,
      description,
      recordedDate: "September 2026",
      imageUrl: imageUrl || "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80",
    };

    onAddEntry(newEntry);
    onClose();
    // Reset
    setTitleKhmer("");
    setTitleEnglish("");
    setDescription("");
    setImageUrl("");
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="glass-card"
        style={{ width: "100%", maxWidth: 520, padding: 32 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <h2 style={{ fontSize: 20, fontWeight: 700, color: "#FFF", margin: 0 }}>Add New Khmer Dish Recipe</h2>
          <button onClick={onClose} style={{ background: "none", border: "none", color: "#94A3B8", fontSize: 20, cursor: "pointer" }}>✕</button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div>
            <label style={{ fontSize: 13, color: "#94A3B8", display: "block", marginBottom: 6 }}>Khmer Name (ឈ្មោះខ្មែរ)</label>
            <input className="form-input" placeholder="e.g. អាម៉ុកត្រី" value={titleKhmer} onChange={(e) => setTitleKhmer(e.target.value)} required />
          </div>

          <div>
            <label style={{ fontSize: 13, color: "#94A3B8", display: "block", marginBottom: 6 }}>English Name</label>
            <input className="form-input" placeholder="e.g. Fish Amok" value={titleEnglish} onChange={(e) => setTitleEnglish(e.target.value)} required />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div>
              <label style={{ fontSize: 13, color: "#94A3B8", display: "block", marginBottom: 6 }}>Category</label>
              <select className="form-input" value={category} onChange={(e) => setCategory(e.target.value)}>
                <option value="Main Dish">Main Dish</option>
                <option value="Soup / Stew">Soup / Stew</option>
                <option value="Noodle Dish">Noodle Dish</option>
                <option value="Dip & Side">Dip & Side</option>
                <option value="Salad / Appetizer">Salad / Appetizer</option>
              </select>
            </div>
            <div>
              <label style={{ fontSize: 13, color: "#94A3B8", display: "block", marginBottom: 6 }}>Province Origin</label>
              <input className="form-input" value={province} onChange={(e) => setProvince(e.target.value)} />
            </div>
          </div>

          <div>
            <label style={{ fontSize: 13, color: "#94A3B8", display: "block", marginBottom: 6 }}>Description / Ingredients</label>
            <textarea className="form-input" rows={3} placeholder="Describe traditional ingredients and method..." value={description} onChange={(e) => setDescription(e.target.value)} />
          </div>

          <div>
            <label style={{ fontSize: 13, color: "#94A3B8", display: "block", marginBottom: 6 }}>Upload Dish Photo</label>
            <input type="file" accept="image/*" onChange={handleImageChange} style={{ color: "#94A3B8", fontSize: 13 }} />
            {imageUrl && (
              <div style={{ marginTop: 10, borderRadius: 8, overflow: "hidden", height: 120 }}>
                <img src={imageUrl} alt="Dish Preview" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              </div>
            )}
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: 12, marginTop: 8 }}>
            <button type="button" className="btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-primary">Save Recipe Entry</button>
          </div>
        </form>
      </div>
    </div>
  );
}
