import { Link } from "@tanstack/react-router";

import { useArticle } from "../hooks";
import type { ContentBlock } from "../types";
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
          <ArticleTableOfContents articleId={articleId} />
          <ArticleContent articleId={articleId} />
          <ArticleBibliography articleId={articleId} />
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

type ArticleTableOfContentsProps = React.ComponentProps<"nav"> & {
  articleId: string;
};

export const ArticleTableOfContents = ({
  articleId,
  className,
  ...props
}: ArticleTableOfContentsProps) => {
  const { article } = useArticle(articleId);

  if (!article) return null;

  const headings = article.sections.filter(
    (block): block is Extract<ContentBlock, { type: "heading" }> =>
      block.type === "heading",
  );

  if (headings.length === 0) return null;

  return (
    <nav
      aria-label="Table of contents"
      className={cn("mb-10", className)}
      {...props}
    >
      <p className="text-xs font-medium tracking-[0.14em] text-muted-foreground uppercase">
        Contents
      </p>
      <ol className="mt-2 flex flex-col gap-1 text-sm">
        {headings.map((heading) => (
          <li key={heading.id} className={heading.level === 3 ? "pl-4" : ""}>
            <a
              href={`#${heading.id}`}
              className="text-muted-foreground transition-colors hover:text-primary"
            >
              {heading.text}
            </a>
          </li>
        ))}
      </ol>
    </nav>
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
    <div className={cn("max-w-[70ch]", className)} {...props}>
      {article.sections.map((block, index) => {
        if (block.type === "heading") {
          const Tag = block.level === 2 ? "h2" : "h3";
          return (
            <Tag
              key={block.id}
              id={block.id}
              className={cn(
                "scroll-mt-24 font-heading text-foreground",
                block.level === 2 ? "mt-10 mb-3 text-2xl" : "mt-8 mb-2 text-xl",
              )}
            >
              {block.text}
            </Tag>
          );
        }

        return (
          <p
            key={index}
            className="mb-4 text-base leading-relaxed text-foreground"
          >
            {block.text}
          </p>
        );
      })}
    </div>
  );
};

type ArticleBibliographyProps = React.ComponentProps<"div"> & {
  articleId: string;
};

export const ArticleBibliography = ({
  articleId,
  className,
  ...props
}: ArticleBibliographyProps) => {
  const { article } = useArticle(articleId);

  if (!article || article.bibliography.length === 0) return null;

  return (
    <div
      className={cn("mt-12 border-t border-border pt-6", className)}
      {...props}
    >
      <details>
        <summary className="cursor-pointer text-xs font-medium tracking-[0.14em] text-muted-foreground uppercase">
          Bibliography ({article.bibliography.length})
        </summary>
        <ol className="mt-4 flex max-w-[70ch] flex-col gap-8 text-sm text-muted-foreground">
          {article.bibliography.map((entry, index) => (
            <li key={index}>{entry}</li>
          ))}
        </ol>
      </details>
    </div>
  );
};
