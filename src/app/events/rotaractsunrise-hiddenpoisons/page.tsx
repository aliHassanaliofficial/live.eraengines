import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Rotaract Sunrise - Hidden Poisons",
  description: "Rotaract Sunrise - Hidden Poisons",
};

export default function HiddenPoisonsPage() {
  return (
    <div className="fixed inset-0 z-50 h-full w-full overflow-hidden">
      <iframe
        src="https://eraengines-hiddenpoisons.vercel.app"
        title="Rotaract Sunrise - Hidden Poisons"
        className="h-full w-full border-0"
        allowFullScreen
        referrerPolicy="no-referrer"
        style={{ overflow: "hidden", display: "block" }}
      />
    </div>
  );
}
