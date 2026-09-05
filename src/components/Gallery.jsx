import ImageSlot from "./ImageSlot";

const BackIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    className="h-4 w-4"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const SLOT_COUNT = 8;

export default function Gallery({ hobby, onBack }) {
  return (
    <div className="fixed inset-0 z-50 flex flex-col overflow-y-auto bg-cream p-6 text-neutral-900 sm:p-10">
      <div className="mb-8 flex shrink-0 flex-wrap items-center justify-between gap-4">
        <button
          type="button"
          onClick={onBack}
          className="flex w-fit items-center gap-2 rounded-full border-2 border-accent-personal px-5 py-2.5 text-sm font-semibold text-accent-personal transition hover:bg-accent-personal hover:text-neutral-950"
        >
          <BackIcon />
          Back
        </button>
        <h2 className="flex items-center gap-2 font-display text-xl font-bold">
          <span>{hobby.emoji}</span>
          <span>{hobby.label}</span>
        </h2>
      </div>

      <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
        {Array.from({ length: SLOT_COUNT }).map((_, i) => (
          <div
            key={i}
            className="rounded-sm bg-white p-3 pb-4 shadow-[0_16px_30px_-12px_rgba(0,0,0,0.3)]"
          >
            <ImageSlot
              label={hobby.label}
              dropText={`Add a ${hobby.label.toLowerCase()} photo`}
              placeholder={hobby.color}
              className="aspect-square w-full"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
