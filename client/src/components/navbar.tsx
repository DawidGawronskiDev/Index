import { Link } from "@tanstack/react-router";

export const Navbar = () => {
  return (
    <header className="border-b border-border">
      <div className="mx-auto flex max-w-2xl items-center px-6 py-4">
        <Link
          to="/"
          className="font-heading text-lg text-foreground transition-colors hover:text-primary"
        >
          The Index
        </Link>
      </div>
    </header>
  );
};
