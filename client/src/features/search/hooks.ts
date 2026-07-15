import React from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchArticle, fetchSearchResults } from "./api";

const DEBOUNCE_MS = 300;

export const useSearch = () => {
  const [searchTerm, setSearchTerm] = React.useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = React.useState("");

  React.useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, DEBOUNCE_MS);

    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  const { data, isFetching } = useQuery({
    queryKey: ["search", debouncedSearchTerm],
    queryFn: () => fetchSearchResults(debouncedSearchTerm),
    enabled: debouncedSearchTerm.length > 0,
  });

  return {
    searchTerm,
    setSearchTerm,
    results: data ?? [],
    isLoading: isFetching,
  };
};

export const useArticle = (id: string) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["article", id],
    queryFn: () => fetchArticle(id),
  });

  return {
    article: data ?? null,
    isLoading,
    error: error instanceof Error ? error.message : null,
  };
};
