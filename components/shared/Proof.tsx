import { SHOW_PROOF } from "@/lib/site";

export function Proof() {
  if (!SHOW_PROOF) return null;

  return (
    <section className="py-20 px-6 max-w-6xl mx-auto">
      <div className="text-center">
        <p className="label-sm text-ink/40 mb-2">Verified Client Results</p>
        <h2 className="font-serif text-3xl text-ink">What our clients say</h2>
      </div>
    </section>
  );
}

