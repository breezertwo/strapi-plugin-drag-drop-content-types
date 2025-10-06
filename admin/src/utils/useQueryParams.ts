import { useEffect, useState } from 'react';
import { QueryParams } from '../components/types';

export function useQueryParams() {
  const [params, setParams] = useState<QueryParams | null>(null);

  useEffect(() => {
    const q = new Proxy(new URLSearchParams(window.location.search), {
      get: (queryParams, prop) => queryParams.get(prop.toString()),
    });
    setParams(q as unknown as QueryParams);
  }, [window.location.search]);

  return { queryParams: params };
}
