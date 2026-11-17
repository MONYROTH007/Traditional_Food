import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        {/* Server component rendered outside the language context, so this
            stays bilingual rather than following the switcher. */}
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">
          រកមិនឃើញទំព័រ (Page not found)
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          ទំព័រដែលអ្នកកំពុងស្វែងរកមិនមាន ឬត្រូវបានផ្លាស់ទីហើយ។
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            ត្រឡប់ទៅទំព័រដើម (Go home)
          </Link>
        </div>
      </div>
    </div>
  );
}
