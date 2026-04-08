import { useState, useMemo } from 'react';
import type { Food } from '../types';
import { searchFoods, getPage, PAGE_SIZE } from '../utils/search';

export function useSearch(foods: Food[]) {
  const [query, setQuery] = useState('');
  const [submittedQuery, setSubmittedQuery] = useState('');
  const [page, setPage] = useState(1);

  const allResults = useMemo(
    () => searchFoods(foods, submittedQuery),
    [foods, submittedQuery],
  );

  const visibleResults = useMemo(
    () => getPage(allResults, page),
    [allResults, page],
  );

  const hasMore = visibleResults.length < allResults.length;

  function search() {
    setSubmittedQuery(query);
    setPage(1);
  }

  function clear() {
    setQuery('');
    setSubmittedQuery('');
    setPage(1);
  }

  function loadMore() {
    setPage((p) => p + 1);
  }

  const searched = submittedQuery.trim() !== '';

  return {
    query,
    setQuery,
    search,
    clear,
    visibleResults,
    totalResults: allResults.length,
    hasMore,
    loadMore,
    searched,
    PAGE_SIZE,
  };
}
