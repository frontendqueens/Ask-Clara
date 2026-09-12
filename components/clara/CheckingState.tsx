import { Loader } from "lucide-react";

export function CheckingState() {
  return (
    <section aria-live="polite" aria-busy="true" className="space-y-3">
      <h2 className="flex items-center gap-2 text-2xl font-semibold">
        <Loader aria-hidden="true" className="size-6 animate-spin" />
        Clara is checking this message
      </h2>
      <p>Please wait. Clara is looking for warning signs.</p>
    </section>
  );
}
