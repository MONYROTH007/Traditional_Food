import type { Food } from "@/data/foods";

const accentHex: Record<string, string> = {
  gold: "#E4C34F",
  sage: "#A9BE9E",
  brick: "#C25646",
};

/**
 * Stand-in artwork for real food photography. Renders a bowl motif with the
 * dish's Khmer name, so every card is visually distinct without needing
 * external image assets.
 */
export default function DishArt({ food, className = "" }: { food: Food; className?: string }) {
  const accent = accentHex[food.accent] ?? "#E4C34F";
  return (
    <div
      className={`relative overflow-hidden bg-gradient-to-br ${food.color} ${className}`}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 400 300"
        className="absolute inset-0 h-full w-full opacity-90"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <radialGradient id={`glow-${food.id}`} cx="50%" cy="35%" r="65%">
            <stop offset="0%" stopColor={accent} stopOpacity="0.35" />
            <stop offset="100%" stopColor={accent} stopOpacity="0" />
          </radialGradient>
        </defs>
        <rect width="400" height="300" fill={`url(#glow-${food.id})`} />
        {/* bowl */}
        <ellipse cx="200" cy="205" rx="120" ry="26" fill="#0B1512" fillOpacity="0.25" />
        <path
          d="M90 175 a110 60 0 0 0 220 0 Z"
          fill="#0B1512"
          fillOpacity="0.35"
        />
        <ellipse cx="200" cy="172" rx="110" ry="34" fill={accent} fillOpacity="0.55" />
        <ellipse cx="200" cy="168" rx="86" ry="24" fill="#0B1512" fillOpacity="0.18" />
        {/* steam */}
        <g stroke="#F2E9D8" strokeWidth="3" strokeLinecap="round" fill="none" opacity="0.5">
          <path d="M170 130 q-10 -20 0 -35 q10 -15 0 -32" className="animate-steam" />
          <path
            d="M200 130 q10 -20 0 -35 q-10 -15 0 -32"
            className="animate-steam"
            style={{ animationDelay: "0.6s" }}
          />
          <path
            d="M230 130 q-10 -20 0 -35 q10 -15 0 -32"
            className="animate-steam"
            style={{ animationDelay: "1.2s" }}
          />
        </g>
      </svg>
      <div className="absolute inset-0 flex items-end justify-between p-4">
        <span className="font-display text-lg italic text-rice/90 drop-shadow-sm">
          {food.khmerName}
        </span>
        <span className="font-mono text-[10px] uppercase tracking-widest text-rice/70">
          placeholder
        </span>
      </div>
    </div>
  );
}
