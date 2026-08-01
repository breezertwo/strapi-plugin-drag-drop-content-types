import { useEffect, useState } from "react";
import { QueryParams } from "../components/types";

const readQueryParams = () =>
  new Proxy(new URLSearchParams(window.location.search), {
    get: (queryParams, prop) => queryParams.get(prop.toString()),
  }) as unknown as QueryParams;

export function useQueryParams() {
  const [params, setParams] = useState<QueryParams>(readQueryParams);

  useEffect(() => {
    setParams(readQueryParams());
  }, [window.location.search]);

  return { queryParams: params };
}
