import { Link } from "@tanstack/react-router";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { useSearch } from "../hooks";

export const SearchPanel = () => {
  const { searchTerm, setSearchTerm, results, isLoading } = useSearch();

  return (
    <div className="w-full">
      <header className="mb-10">
        <p className="text-xs font-medium tracking-[0.14em] text-muted-foreground uppercase">
          Wikipedia archive
        </p>
        <h1 className="mt-1 font-heading text-4xl text-foreground">
          Search the index
        </h1>
      </header>

      <div className="relative">
        <Label htmlFor="search-input" className="sr-only">
          Search
        </Label>
        <Input
          id="search-input"
          autoFocus
          autoComplete="off"
          placeholder="annales school, historians, France…"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="h-auto rounded-none border-x-0 border-t-0 border-b-2 border-border bg-transparent px-0 py-2 text-lg placeholder:text-muted-foreground/70 focus-visible:border-b-primary focus-visible:ring-0"
        />
        <div
          aria-hidden
          className="absolute inset-x-0 bottom-0 h-0.5 origin-left bg-primary transition-transform duration-300 ease-out"
          style={{ transform: isLoading ? "scaleX(1)" : "scaleX(0)" }}
        />
      </div>

      <div className="mt-8">
        {!searchTerm && (
          <p className="text-sm text-muted-foreground">
            Search Wikipedia articles, crawled and ranked with a hand-built
            TF-IDF index.
          </p>
        )}

        {searchTerm && !isLoading && results.length === 0 && (
          <p className="text-sm text-muted-foreground">
            No matches for &ldquo;{searchTerm}&rdquo;.
          </p>
        )}

        <ol className="flex flex-col">
          {results.map((result, index) => (
            <li
              key={result.url}
              className="animate-in fade-in slide-in-from-bottom-1 flex items-baseline gap-4 border-b border-border py-4 duration-300 ease-out first:pt-0 last:border-b-0"
            >
              <span className="font-mono text-xs tabular-nums text-muted-foreground/70">
                {String(index + 1).padStart(2, "0")}
              </span>
              <div className="min-w-0 flex-1">
                <Link
                  to="/articles/$id"
                  params={{ id: result.id }}
                  className="font-heading text-lg text-foreground underline decoration-transparent decoration-2 underline-offset-4 transition-colors hover:text-primary hover:decoration-primary"
                >
                  {result.title}
                </Link>
                <a
                  href={result.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-0.5 block truncate text-xs text-muted-foreground hover:text-primary hover:underline"
                >
                  {result.url}
                </a>
              </div>
              <span className="shrink-0 font-mono text-xs tabular-nums text-muted-foreground/70">
                {result.score.toFixed(3)}
              </span>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
};
