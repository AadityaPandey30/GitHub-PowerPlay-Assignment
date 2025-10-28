import React from "react";

interface Props {
  value: string;
  onChange: (v: string) => void;
}

export default React.memo(function SearchBar({ value, onChange }: Props) {
  return (
    <div className="max-w-4xl mx-auto px-4 py-4">
      <label className="sr-only">Search repositories</label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search GitHub repositories..."
        className="w-full rounded-md border px-3 py-2 shadow-sm focus:outline-none focus:ring"
      />
    </div>
  );
});
