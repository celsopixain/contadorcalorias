import type { Food } from '../types';

const PAGE_SIZE = 25;

// Converts a search term (supporting * wildcard) into a RegExp.
// Example: "chick*" becomes /chick.*/i
function buildPattern(term: string): RegExp {
  const escaped = term.replace(/[.+?^${}()|[\]\\]/g, '\\$&');
  const withWildcard = escaped.replace(/[*]/g, '.*');
  return new RegExp(withWildcard, 'i');
}

export function searchFoods(foods: Food[], query: string): Food[] {
  const trimmed = query.trim();
  if (!trimmed) return [];

  const pattern = buildPattern(trimmed);
  return foods.filter((food) => pattern.test(food.name));
}

export function getPage(results: Food[], page: number): Food[] {
  return results.slice(0, page * PAGE_SIZE);
}

export { PAGE_SIZE };
