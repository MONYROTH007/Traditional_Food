export default function KramaDivider({ className = "" }: { className?: string }) {
  return (
    <div
      className={`krama-divider w-full opacity-80 ${className}`}
      role="presentation"
      aria-hidden="true"
    />
  );
}
