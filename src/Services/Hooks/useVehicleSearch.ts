import { useCallback, useEffect, useRef, useState } from "react";
import {
  vehicleService,
  ServiceError,
  type Vehicle,
} from "../vehicleService";

/** Estado observable de la búsqueda. */
export type SearchStatus = "idle" | "loading" | "success" | "empty" | "error";

export type UseVehicleSearchResult = {
  /** Texto actual del input (controlado). */
  query: string;
  /** Actualiza el criterio de búsqueda. */
  setQuery: (value: string) => void;
  /** Resultados de la última búsqueda que terminó siendo la vigente. */
  results: Vehicle[];
  /** Estado distinguible para la UI: cargando / vacío / error / éxito. */
  status: SearchStatus;
  /** Mensaje de error legible cuando status === "error". */
  error: string | null;
  /** Reintenta la búsqueda vigente (p. ej. tras un error). */
  retry: () => void;
  /** Reemplaza un vehículo en los resultados (p. ej. tras reservarlo). */
  updateVehicle: (vehicle: Vehicle) => void;
};

const DEBOUNCE_MS = 300;

export function useVehicleSearch(): UseVehicleSearchResult {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Vehicle[]>([]);
  const [status, setStatus] = useState<SearchStatus>("idle");
  const [error, setError] = useState<string | null>(null);

  // Id de la última petición solicitada. Solo la respuesta cuyo id coincide
  // con este valor puede escribir en el estado (descarta respuestas obsoletas).
  const latestRequestId = useRef(0);
  // Permite relanzar la búsqueda vigente sin cambiar el texto.
  const retryTick = useRef(0);
  const [retrySignal, setRetrySignal] = useState(0);

  const runSearch = useCallback((criteria: string) => {
    const requestId = ++latestRequestId.current;
    setStatus("loading");
    setError(null);

    vehicleService
      .search(criteria)
      .then((vehicles) => {
        // Descarta la respuesta si ya hay una búsqueda más reciente en curso.
        if (requestId !== latestRequestId.current) return;
        setResults(vehicles);
        setStatus(vehicles.length === 0 ? "empty" : "success");
      })
      .catch((err: unknown) => {
        if (requestId !== latestRequestId.current) return;
        setResults([]);
        setStatus("error");
        setError(
          err instanceof ServiceError
            ? err.message
            : "No se pudo completar la consulta."
        );
      });
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => runSearch(query), DEBOUNCE_MS);
    return () => clearTimeout(timer);
    // retrySignal fuerza un reintento de la búsqueda vigente.
  }, [query, retrySignal, runSearch]);

  const retry = useCallback(() => {
    retryTick.current += 1;
    setRetrySignal(retryTick.current);
  }, []);

  const updateVehicle = useCallback((vehicle: Vehicle) => {
    setResults((prev) =>
      prev.map((v) => (v.id === vehicle.id ? { ...v, ...vehicle } : v))
    );
  }, []);

  return {
    query,
    setQuery,
    results,
    status,
    error,
    retry,
    updateVehicle,
  };
}
