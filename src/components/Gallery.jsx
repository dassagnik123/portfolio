import ImageSlot from "./ImageSlot";
import ShaderBackground from "./ShaderBackground";

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

const SCATTER = [
  { rotate: -6, offset: 8, shiftX: -6 },
  { rotate: 5, offset: -10, shiftX: 8 },
  { rotate: -8, offset: 6, shiftX: 4 },
  { rotate: 7, offset: -6, shiftX: -8 },
  { rotate: -4, offset: 10, shiftX: 6 },
  { rotate: 8, offset: -8, shiftX: -4 },
];

export default function Gallery({ hobby, onBack }) {
  const slots = hobby.images?.length ? hobby.images : Array(SLOT_COUNT).fill(null);

  return (
    <div className="fixed inset-0 z-50 flex flex-col overflow-y-auto p-6 text-neutral-900 sm:p-10">
      <div aria-hidden>
        <ShaderBackground mode="personal" />
      </div>

      <button
        type="button"
        onClick={onBack}
        className="group absolute left-6 top-6 flex w-fit items-center gap-2 overflow-hidden rounded-full border-2 border-accent-personal px-5 py-2.5 text-sm font-semibold text-accent-personal transition-colors duration-300 hover:text-neutral-950 sm:left-10 sm:top-10"
      >
        <span
          aria-hidden
          className="absolute inset-0 origin-left scale-x-0 bg-accent-personal transition-transform duration-300 ease-out group-hover:scale-x-100"
        />
        <span className="relative z-10 flex items-center gap-2">
          <BackIcon />
          Back
        </span>
      </button>

      <h2 className="font-heading mb-8 mt-16 shrink-0 text-center text-4xl font-bold text-accent-personal sm:text-5xl">
        {hobby.label} Gallery
      </h2>

      <div className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-4 sm:gap-y-14">
        {slots.map((src, i) => {
          const { rotate, offset, shiftX } = SCATTER[i % SCATTER.length];
          return (
            <div
              key={i}
              className="polaroid-float aspect-[3/4] rounded-sm bg-white p-2.5 pb-14 shadow-[0_16px_30px_-12px_rgba(0,0,0,0.3)]"
              style={{
                "--rotate": `${rotate}deg`,
                "--offset": `${offset}px`,
                "--shift-x": `${shiftX}px`,
                "--float-delay": `${(i % 6) * 0.4}s`,
              }}
            >
              <ImageSlot
                label={hobby.label}
                placeholder={hobby.color}
                initial={src}
                uploadable={false}
                className="h-full w-full"
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
