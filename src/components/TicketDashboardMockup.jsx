const STATUS_STYLES = {
  Open: "bg-blue-100 text-blue-700",
  Pending: "bg-amber-100 text-amber-700",
  Closed: "bg-emerald-100 text-emerald-700",
  Escalated: "bg-rose-100 text-rose-700",
};

const rows = [
  { priority: "High", status: "Open", w: "70%" },
  { priority: "Low", status: "Closed", w: "55%" },
  { priority: "Low", status: "Pending", w: "80%" },
  { priority: "Medium", status: "Pending", w: "45%" },
  { priority: "High", status: "Escalated", w: "65%" },
  { priority: "Low", status: "Pending", w: "50%" },
  { priority: "Medium", status: "Closed", w: "72%" },
  { priority: "High", status: "Pending", w: "40%" },
];

const PRIORITY_DOT = {
  High: "bg-rose-500",
  Medium: "bg-amber-500",
  Low: "bg-neutral-400",
};

export default function TicketDashboardMockup() {
  return (
    <div className="w-full max-w-sm rounded-lg bg-white shadow-2xl ring-1 ring-black/5">
      <div className="flex items-center gap-1.5 rounded-t-lg border-b border-neutral-200 px-3 py-2">
        <span className="h-2 w-2 rounded-full bg-rose-400" />
        <span className="h-2 w-2 rounded-full bg-amber-400" />
        <span className="h-2 w-2 rounded-full bg-emerald-400" />
        <span className="ml-2 text-[9px] text-neutral-400">
          Dashboard / Support Desk / Ticket List
        </span>
      </div>
      <div className="px-4 py-3">
        <p className="font-display text-[13px] font-bold text-neutral-900">
          Support Tickets
        </p>
        <p className="text-[9px] text-neutral-400">
          Track, reassign, and resolve customer issues efficiently
        </p>
        <div className="mt-3 flex items-center justify-between gap-2">
          <div className="h-5 flex-1 rounded bg-neutral-100" />
          <div className="h-5 w-10 rounded bg-neutral-100" />
          <div className="h-5 w-14 rounded bg-neutral-900" />
        </div>
        <div className="mt-3 space-y-1.5">
          {rows.map((row, i) => (
            <div
              key={i}
              className="flex items-center gap-2 rounded border border-neutral-100 px-1.5 py-1.5"
            >
              <span
                className={`h-1.5 w-1.5 shrink-0 rounded-full ${PRIORITY_DOT[row.priority]}`}
              />
              <span
                className="h-1.5 rounded-full bg-neutral-200"
                style={{ width: row.w }}
              />
              <span
                className={`ml-auto shrink-0 rounded-full px-1.5 py-0.5 text-[7px] font-semibold ${STATUS_STYLES[row.status]}`}
              >
                {row.status}
              </span>
              <span className="h-3.5 w-3.5 shrink-0 rounded-full bg-neutral-200" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
