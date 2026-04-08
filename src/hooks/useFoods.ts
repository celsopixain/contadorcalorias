import { useState, useEffect } from 'react';
import type { Food } from '../types';

type Status = 'loading' | 'ready' | 'error';

export function useFoods() {
  const [foods, setFoods] = useState<Food[]>([]);
  const [status, setStatus] = useState<Status>('loading');

  useEffect(() => {
    fetch('/foods.json')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load food data');
        return res.json() as Promise<Food[]>;
      })
      .then((data) => {
        setFoods(data);
        setStatus('ready');
      })
      .catch(() => setStatus('error'));
  }, []);

  return { foods, status };
}
