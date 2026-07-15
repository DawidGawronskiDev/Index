import { Link } from "@tanstack/react-router";

import { useArticle } from "../hooks";
import { cn } from "@/lib/utils";

type ArticleViewProps = React.ComponentProps<"div"> & {
  articleId: string;
};

export const Article = ({
  articleId,
  className,
  ...props
}: ArticleViewProps) => {
  const { article, isLoading, error } = useArticle(articleId);

  return (
    <div className={cn("w-full", className)} {...props}>
      <ArticleBreadcrumb articleId={articleId} />

      {isLoading && (
        <p className="mt-8 text-sm text-muted-foreground">Loading article…</p>
      )}

      {error && <p className="mt-8 text-sm text-destructive">{error}</p>}

      {article && (
        <article className="mt-8">
          <ArticleHeader articleId={articleId} />
          <ArticleContent articleId={articleId} />
        </article>
      )}
    </div>
  );
};

type ArticleBreadcrumbProps = React.ComponentProps<"nav"> & {
  articleId: string;
};

export const ArticleBreadcrumb = ({
  articleId,
  className,
  ...props
}: ArticleBreadcrumbProps) => {
  const { article } = useArticle(articleId);

  if (!article) return null;

  return (
    <nav
      aria-label="Breadcrumb"
      className={cn(
        "flex items-center gap-1.5 text-sm text-muted-foreground",
        className,
      )}
      {...props}
    >
      <ol className="flex items-center gap-1.5 text-sm text-muted-foreground">
        <li>
          <Link to="/" className="transition-colors hover:text-primary">
            Index
          </Link>
        </li>
        <li aria-hidden="true" className="text-muted-foreground/40">
          /
        </li>
        <li
          aria-current="page"
          className="max-w-[30ch] truncate text-foreground"
        >
          {article.title}
        </li>
      </ol>
    </nav>
  );
};

type ArticleHeaderProps = React.ComponentProps<"header"> & {
  articleId: string;
};

export const ArticleHeader = ({
  articleId,
  className,
  ...props
}: ArticleHeaderProps) => {
  const { article } = useArticle(articleId);

  if (!article) return null;

  return (
    <header className={cn("mb-8", className)} {...props}>
      <h1 className="font-heading text-4xl text-foreground">{article.title}</h1>
      <a
        href={article.url}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-2 inline-block text-sm text-muted-foreground underline decoration-transparent underline-offset-4 transition-colors hover:text-primary hover:decoration-primary"
      >
        View on Wikipedia ↗
      </a>
    </header>
  );
};

type ArticleContentProps = React.ComponentProps<"div"> & {
  articleId: string;
};

export const ArticleContent = ({
  articleId,
  className,
  ...props
}: ArticleContentProps) => {
  const { article } = useArticle(articleId);

  if (!article) return null;

  return (
    <div
      className={cn(
        "max-w-[70ch] space-y-4 text-base leading-relaxed whitespace-pre-line text-foreground",
        className,
      )}
      {...props}
    >
      {article.content}
    </div>
  );
};
