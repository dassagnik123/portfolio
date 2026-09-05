import { useRef, useState } from "react";

const ImageIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    className="h-7 w-7"
    stroke="currentColor"
    strokeWidth="1.5"
  >
    <rect x="3" y="4" width="18" height="16" rx="2" />
    <circle cx="8.5" cy="9.5" r="1.5" />
    <path d="M21 15l-5-5-9 9" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export default function ImageSlot({
  label,
  placeholder,
  showLabel = true,
  className = "",
  iconClassName = "text-neutral-500",
  initial = null,
}) {
  const [src, setSrc] = useState(initial);
  const inputRef = useRef(null);

  function handleFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setSrc(URL.createObjectURL(file));
  }

  if (src) {
    return (
      <label
        className={`group relative block cursor-pointer overflow-hidden ${className}`}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFile}
        />
        <img
          src={src}
          alt={label}
          className="h-full w-full object-cover transition group-hover:brightness-90"
        />
      </label>
    );
  }

  return (
    <label
      className={`group relative flex cursor-pointer flex-col items-center justify-center gap-3 overflow-hidden ${className}`}
      style={placeholder ? { backgroundColor: placeholder } : undefined}
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFile}
      />
      <span className={iconClassName}>
        <ImageIcon />
      </span>
      {showLabel && (
        <span className="px-6 text-center text-sm leading-snug text-neutral-500">
          Drop the {label} screenshot
          <br />
          or{" "}
          <span className="underline underline-offset-2 group-hover:text-neutral-300">
            browse files
          </span>
        </span>
      )}
    </label>
  );
}
