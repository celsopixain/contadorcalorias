import { useState, useMemo } from 'react';
import type { Food } from '../types';
import {
  buildTrigramIndex,
  searchWithIndex,
  getPage,
  PAGE_SIZE,
} from '../utils/search';

export function useSearch(foods: Food[]) {
  const [query, setQuery] = useState('');
  const [submittedQuery, setSubmittedQuery] = useState('');
  const [page, setPage] = useState(1);
  const [emptyAttempt, setEmptyAttempt] = useState(false);

  // Built once when foods are loaded; rebuilds only if the dataset changes.
  const index = useMemo(() => buildTrigramIndex(foods), [foods]);

  const allResults = useMemo(
    () => searchWithIndex(index, submittedQuery),
    [index, submittedQuery],
  );

  const visibleResults = useMemo(
    () => getPage(allResults, page),
    [allResults, page],
  );

  const hasMore = visibleResults.length < allResults.length;

  function search() {
    if (!query.trim()) {
      setEmptyAttempt(true);
      return;
    }
    setEmptyAttempt(false);
    setSubmittedQuery(query);
    setPage(1);
  }

  function clear() {
    setQuery('');
    setSubmittedQuery('');
    setPage(1);
    setEmptyAttempt(false);
  }

  function loadMore() {
    setPage((p) => p + 1);
  }

  const searched = submittedQuery.trim() !== '';

  function handleSetQuery(value: string) {
    setQuery(value);
    if (emptyAttempt) setEmptyAttempt(false);
  }

  return {
    query,
    setQuery: handleSetQuery,
    search,
    clear,
    emptyAttempt,
    visibleResults,
    totalResults: allResults.length,
    hasMore,
    loadMore,
    searched,
    PAGE_SIZE,
  };
}
