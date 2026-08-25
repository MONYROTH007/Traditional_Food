export default function RiverDivider({ flip = false }: { flip?: boolean }) {
  return (
    <div className={`w-full overflow-hidden leading-[0] ${flip ? "rotate-180" : ""}`} aria-hidden="true">
      <svg
        viewBox="0 0 1200 60"
        preserveAspectRatio="none"
        className="w-full h-[36px] md:h-[48px]"
      >
        <path
          d="M0,30 C150,60 250,0 400,25 C550,50 650,5 800,28 C950,50 1050,10 1200,30 L1200,60 L0,60 Z"
          fill="var(--paper)"
        />
        <path
          d="M0,32 C150,58 250,10 400,28 C550,46 650,12 800,30 C950,48 1050,16 1200,32"
          fill="none"
          stroke="var(--turmeric)"
          strokeWidth="1.5"
          strokeDasharray="1 9"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}
