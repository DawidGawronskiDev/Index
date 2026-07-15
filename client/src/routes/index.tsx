import { Search } from "@/features/search/components/search";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <section className="mx-auto max-w-2xl px-6 py-10 sm:py-14">
      <Search />
    </section>
  );
}
