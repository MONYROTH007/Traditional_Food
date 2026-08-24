import KramaDivider from "./KramaDivider";

export default function Footer() {
  return (
    <footer className="bg-paddy px-6 py-10 sm:px-10 lg:px-16">
      <div className="mx-auto max-w-6xl">
        <KramaDivider className="mb-8 max-w-[100px]" />
        <div className="flex flex-col gap-3 text-sm text-rice/50 sm:flex-row sm:items-center sm:justify-between">
          <p>
            Nhoam Khmer — a small guide to five traditional dishes of Cambodia.
          </p>
          <p className="font-mono text-xs">
            Dish photography shown here is placeholder art, not documentary
            photography.
          </p>
        </div>
      </div>
    </footer>
  );
}
