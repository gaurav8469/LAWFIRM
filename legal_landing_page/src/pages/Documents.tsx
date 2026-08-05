import { useRef, useState } from "react";
import { useLocation } from "react-router";
import { Upload, FileText, Download, Trash2 } from "lucide-react";

interface Doc {
  name: string;
  size: string;
  date: string;
  type: string;
}

const seedDocs: Doc[] = [
  {
    name: "Rental Agreement — Sector 45, Noida.pdf",
    size: "2.4 MB",
    date: "28 Jul 2026",
    type: "Contract",
  },
  {
    name: "Security Deposit Receipt — HDFC Bank.pdf",
    size: "180 KB",
    date: "15 Mar 2025",
    type: "Receipt",
  },
  {
    name: "AI Legal Report — Property Dispute.pdf",
    size: "1.1 MB",
    date: "30 Jul 2026",
    type: "AI Report",
  },
];

export default function Documents() {
  const location = useLocation();
  const isAdvocate = location.pathname.startsWith("/advocate");

  const [docs, setDocs] = useState<Doc[]>(seedDocs);
  const [toast, setToast] = useState<string | null>(null);

  const fileRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const file = files[0];

    const formData = new FormData();
    formData.append("document", file);

    try {
      const response = await fetch("http://localhost:5001/upload", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (!result.success) {
        alert("Upload failed");
        return;
      }

      const sizeKb = file.size / 1024;

      const size =
        sizeKb > 1024
          ? `${(sizeKb / 1024).toFixed(1)} MB`
          : `${sizeKb.toFixed(0)} KB`;

      setDocs((prev) => [
        {
          name: file.name,
          size,
          date: new Date().toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric",
          }),
          type: "Uploaded",
        },
        ...prev,
      ]);

      setToast(`${file.name} uploaded successfully`);

      setTimeout(() => {
        setToast(null);
      }, 2500);

      console.log(result);
    } catch (err) {
      console.error(err);
      alert("Server upload failed");
    }
  };

  const remove = (name: string) => {
    setDocs((prev) => prev.filter((d) => d.name !== name));
  };

  return (
    <div className="page-enter">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 12,
          marginBottom: 24,
        }}
      >
        <div>
          <h1
            style={{
              fontSize: "1.4rem",
              fontWeight: 800,
              color: "var(--text)",
              letterSpacing: "-0.03em",
            }}
          >
            Documents
          </h1>

          <p
            style={{
              color: "var(--text-muted)",
              fontSize: "0.9rem",
              marginTop: 2,
            }}
          >
            {isAdvocate
              ? "Client documents & case files"
              : "FIRs, contracts, receipts, and AI reports"}
          </p>
        </div>

        <div>
          <input
            ref={fileRef}
            type="file"
            style={{ display: "none" }}
            onChange={(e) => handleUpload(e.target.files)}
          />

          <button
            onClick={() => fileRef.current?.click()}
            className="btn-primary"
            style={{
              padding: "9px 16px",
              borderRadius: 9,
              fontSize: "0.85rem",
              fontWeight: 600,
              border: "none",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            <Upload size={15} />
            Upload Document
          </button>
        </div>
      </div>

      {toast && (
        <div
          style={{
            marginBottom: 16,
            padding: "10px 14px",
            borderRadius: 8,
            background: "var(--emerald-subtle)",
            border: "1px solid var(--emerald-light)",
            color: "var(--emerald)",
            fontSize: "0.82rem",
            fontWeight: 500,
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          <FileText size={14} />
          {toast}
        </div>
      )}

      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          handleUpload(e.dataTransfer.files);
        }}
        className="card"
        style={{
          padding: 28,
          marginBottom: 20,
          textAlign: "center",
          border: "2px dashed var(--border)",
          cursor: "pointer",
        }}
        onClick={() => fileRef.current?.click()}
      >
        <Upload
          size={26}
          style={{
            color: "var(--text-subtle)",
            marginBottom: 8,
          }}
        />

        <div
          style={{
            fontWeight: 600,
            color: "var(--text)",
            fontSize: "0.9rem",
          }}
        >
          Drag & drop a file, or click to browse
        </div>

        <div
          style={{
            color: "var(--text-muted)",
            fontSize: "0.78rem",
            marginTop: 3,
          }}
        >
          PDF, DOCX, JPG up to 20MB
        </div>
      </div>

      <div className="card" style={{ padding: 8 }}>
        {docs.map((d, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              padding: "12px 14px",
              borderBottom:
                i < docs.length - 1
                  ? "1px solid var(--border)"
                  : "none",
            }}
          >
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 8,
                flexShrink: 0,
                background: "var(--blue-subtle)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <FileText size={16} style={{ color: "var(--blue)" }} />
            </div>

            <div style={{ flex: 1, minWidth: 0 }}>
              <div
                style={{
                  fontWeight: 500,
                  color: "var(--text)",
                  fontSize: "0.85rem",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {d.name}
              </div>

              <div
                style={{
                  fontSize: "0.7rem",
                  color: "var(--text-muted)",
                  marginTop: 2,
                }}
              >
                {d.size} · {d.date}
              </div>
            </div>

            <span
              className="badge"
              style={{
                background: "var(--blue-subtle)",
                color: "var(--blue)",
              }}
            >
              {d.type}
            </span>

            <button
              title="Download"
              style={{
                padding: 7,
                borderRadius: 6,
                border: "1px solid var(--border)",
                background: "var(--bg-card)",
                color: "var(--text-muted)",
                cursor: "pointer",
                display: "flex",
              }}
            >
              <Download size={13} />
            </button>

            <button
              title="Remove"
              onClick={() => remove(d.name)}
              style={{
                padding: 7,
                borderRadius: 6,
                border: "1px solid var(--border)",
                background: "var(--bg-card)",
                color: "#EF4444",
                cursor: "pointer",
                display: "flex",
              }}
            >
              <Trash2 size={13} />
            </button>
          </div>
        ))}

        {docs.length === 0 && (
          <div
            style={{
              padding: "40px 20px",
              textAlign: "center",
              color: "var(--text-muted)",
              fontSize: "0.85rem",
            }}
          >
            No documents yet.
          </div>
        )}
      </div>
    </div>
  );
}