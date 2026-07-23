import Link from "next/link";

export default function NotFound() {
  return (
    <section className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <p className="text-[80px] sm:text-[120px] font-bold text-white/10 leading-none">404</p>
        <h1 className="text-2xl sm:text-3xl font-bold text-white mt-4 mb-3">
          Page Not Found
        </h1>
        <p className="text-sm text-[#949fa6] leading-[1.6] mb-8">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <Link
          href="/"
          className="inline-block bg-white text-[#0b0b0d] px-8 py-3.5 rounded-[100px] text-sm font-semibold hover:opacity-90 transition-opacity"
        >
          Back to Home
        </Link>
      </div>
    </section>
  );
}
