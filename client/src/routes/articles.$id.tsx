import { createFileRoute } from "@tanstack/react-router";

import { Article } from "@/features/search/components/article";

export const Route = createFileRoute("/articles/$id")({
  component: RouteComponent,
});

function RouteComponent() {
  const { id } = Route.useParams();

  return (
    <section className="mx-auto max-w-2xl px-6 py-10 sm:py-14">
      <Article articleId={id} />
    </section>
  );
}
