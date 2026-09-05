import ImageSlot from "./ImageSlot";

export default function Polaroid({
  label,
  emoji,
  color,
  rotate,
  marginTop = 0,
  className = "",
}) {
  return (
    <div
      className={`w-full max-w-[220px] rounded-sm bg-white p-2.5 pb-4 shadow-[0_12px_24px_-8px_rgba(0,0,0,0.25)] transition-transform duration-300 hover:z-10 hover:!rotate-0 ${className}`}
      style={{ transform: `rotate(${rotate}deg)`, marginTop }}
    >
      <ImageSlot
        label={label}
        placeholder={color}
        showLabel={false}
        className="aspect-square w-full"
      />
      <p className="mt-3 flex items-center gap-1.5 text-sm text-neutral-700">
        <span>{emoji}</span>
        <span>{label}</span>
      </p>
    </div>
  );
}
