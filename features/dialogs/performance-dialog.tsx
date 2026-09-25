"use client";

import { useState } from "react";
import { Check, X } from "lucide-react";

const fields = [
  ["School", "school"],
  ["Assessment", "assessment"],
  ["Academic year", "year"],
  ["Candidates", "candidates"],
  ["Mean score", "mean"],
  ["Best subject", "bestSubject"],
  ["Below expectation", "below"],
] as const;

type PerformanceValues = Record<(typeof fields)[number][1], string>;

const emptyValues: PerformanceValues = {
  school: "",
  assessment: "KPSEA",
  year: "2026",
  candidates: "",
  mean: "",
  bestSubject: "",
  below: "",
};

export function PerformanceDialog({
  mode,
  item = "",
  onClose,
}: {
  mode: "add" | "edit";
  item?: string;
  onClose: () => void;
}) {
  const [saved, setSaved] = useState(false);
  const [values, setValues] = useState<PerformanceValues>({
    ...emptyValues,
    school: item,
    candidates: mode === "edit" ? "50" : "",
    mean: mode === "edit" ? "9.30" : "",
    bestSubject: mode === "edit" ? "English" : "",
    below: mode === "edit" ? "12%" : "",
  });

  const update = (key: keyof PerformanceValues, value: string) =>
    setValues((current) => ({ ...current, [key]: value }));

  return (
    <div className="overlay" onClick={onClose}>
      <div className="form-dialog" onClick={(event) => event.stopPropagation()}>
        <div className="dialog-head">
          <div>
            <span className="eyebrow">Performance management</span>
            <h2>{mode === "add" ? "Add performance record" : "Edit performance record"}</h2>
            <p>{mode === "add" ? "Capture a school assessment result." : "Update the school assessment result."}</p>
          </div>
          <button className="icon-button" onClick={onClose} aria-label="Close performance form">
            <X />
          </button>
        </div>
        {saved ? (
          <div className="success-state">
            <div><Check /></div>
            <h3>{mode === "add" ? "Performance record added" : "Performance record updated"}</h3>
            <p>The record has been queued for synchronization.</p>
            <button className="outline-button" onClick={onClose}>Done</button>
          </div>
        ) : (
          <form onSubmit={(event) => { event.preventDefault(); setSaved(true); }}>
            <div className="form-section">
              <h3>Assessment information</h3>
              <div className="form-grid">
                {fields.map(([label, key]) => (
                  <label key={key}>
                    {label}
                    {key === "assessment" ? (
                      <select value={values[key]} onChange={(event) => update(key, event.target.value)}>
                        <option>KPSEA</option><option>KJSEA</option><option>KCSE</option>
                      </select>
                    ) : (
                      <input required={key !== "bestSubject"} value={values[key]} onChange={(event) => update(key, event.target.value)} placeholder={`Enter ${label.toLowerCase()}`} />
                    )}
                  </label>
                ))}
              </div>
            </div>
            <div className="dialog-footer">
              <button className="outline-button" type="button" onClick={onClose}>Cancel</button>
              <button className="modal-primary-button" type="submit">{mode === "add" ? "Add record" : "Save changes"}</button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default PerformanceDialog;
