import { ClaraChecker } from "@/components/clara/ClaraChecker";

export default function Home() {
  return (
    <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-6 px-4 py-8">
      <header className="space-y-3">
        <h1 className="text-4xl font-semibold">Ask Clara</h1>
        <p>
          Clara helps you understand a suspicious message before you click a
          link, reply, or send money.
        </p>
      </header>
      <ClaraChecker />
    </div>
  );
}
