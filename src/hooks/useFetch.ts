"use client";
import { useState, useCallback } from "react";
import type { ApiResponse } from "@/types";

interface FetchState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

export function useFetch<T = unknown>() {
  const [state, setState] = useState<FetchState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const execute = useCallback(async (url: string, options?: RequestInit): Promise<T | null> => {
    setState((prev) => ({ ...prev, loading: true, error: null }));
    try {
      const res = await fetch(url, options);
      const json: ApiResponse<T> = await res.json();
      if (!json.success) {
        setState({ data: null, loading: false, error: json.error || "Request failed" });
        return null;
      }
      setState({ data: json.data ?? null, loading: false, error: null });
      return json.data ?? null;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Network error";
      setState({ data: null, loading: false, error: message });
      return null;
    }
  }, []);

  const reset = useCallback(() => {
    setState({ data: null, loading: false, error: null });
  }, []);

  return { ...state, execute, reset };
}
