export const Footer = () => {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto max-w-2xl px-6 py-6 text-xs text-muted-foreground">
        <p>
          The Index — a hand-built search engine over Wikipedia, using a
          from-scratch inverted index and TF-IDF ranking.
        </p>
        <p className="mt-1">
          Article text adapted from{" "}
          <a
            href="https://www.wikipedia.org"
            target="_blank"
            rel="noopener noreferrer"
            className="underline decoration-transparent underline-offset-4 transition-colors hover:text-primary hover:decoration-primary"
          >
            Wikipedia
          </a>
          , available under the{" "}
          <a
            href="https://creativecommons.org/licenses/by-sa/4.0/"
            target="_blank"
            rel="noopener noreferrer"
            className="underline decoration-transparent underline-offset-4 transition-colors hover:text-primary hover:decoration-primary"
          >
            CC BY-SA 4.0
          </a>{" "}
          license.
        </p>
      </div>
    </footer>
  );
};
