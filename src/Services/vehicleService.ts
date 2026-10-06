export type Scenario =
  | "normal" | "search-error"
  | "lost-confirmation" | "taken-by-other";

export type Vehicle = {
  id: string;
  plate: string;
  brand: string;
  model: string;
  year: number;
  priceCOP: number;
  status: "AVAILABLE" | "RESERVED";
  description: string;
};

export type ReserveInput = {
  requestReference: string;
  vehicleId: string;
  buyerName: string;
  buyerEmail: string;
};

export type Reservation = {
  reservationId: string;
  requestReference: string;
  vehicleId: string;
  buyerName: string;
  buyerEmail: string;
  status: "CONFIRMED";
};

export class ServiceError extends Error {
  constructor(public code: string, message: string) {
    super(message);
    this.name = "ServiceError";
  }
}

const wait = (ms: number) =>
  new Promise<void>(resolve => setTimeout(resolve, ms));

const pairs = [
  ["Toyota", "Corolla"], ["Kia", "Rio"],
  ["Renault", "Duster"], ["Mazda", "3"],
  ["Chevrolet", "Onix"],
];

const makeCatalog = (): Vehicle[] =>
  Array.from({ length: 5000 }, (_, i) => ({
    id: `V-${i + 1}`,
    plate: `ABC${String(i + 1).padStart(4, "0")}`,
    brand: pairs[i % pairs.length][0],
    model: pairs[i % pairs.length][1],
    year: 2018 + (i % 7),
    priceCOP: 40000000 + (i % 100) * 500000,
    status: "AVAILABLE",
    description: i === 0
      ? '<img src=x onerror="alert(1)">'
      : "Unidad inspeccionada; datos de demostración.",
  }));

let catalog = makeCatalog();
let scenario: Scenario = "normal";
let sequence = 0;
const operations = new Map<string, {
  payload: string;
  result: Reservation;
}>();

export const vehicleService = {
  setScenario(value: Scenario) { scenario = value; },
  reset() {
    catalog = makeCatalog();
    scenario = "normal";
    sequence = 0;
    operations.clear();
  },
  async search(query: string): Promise<Vehicle[]> {
    const activeScenario = scenario;
    const q = query.trim().toLowerCase();
    await wait(q.includes("toyota") ? 700 : 100);
    if (activeScenario === "search-error") {
      throw new ServiceError("SEARCH_FAILED", "Consulta no disponible");
    }
    return catalog.filter(v =>
      `${v.plate} ${v.brand} ${v.model}`
        .toLowerCase().includes(q)
    ).map(v => ({ ...v }));
  },
  async reserve(input: ReserveInput): Promise<Reservation> {
    // Captura los datos originales antes de cualquier espera.
    const data = { ...input };
    const payload = JSON.stringify([
      data.vehicleId, data.buyerName, data.buyerEmail,
    ]);
    const previous = operations.get(data.requestReference);
    if (previous) {
      await wait(100);
      if (previous.payload !== payload) {
        throw new ServiceError(
          "REFERENCE_CONFLICT", "Referencia usada con otros datos"
        );
      }
      return { ...previous.result };
    }
    if (!data.requestReference.trim() || !data.buyerName.trim()
      || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.buyerEmail)) {
      throw new ServiceError("INVALID_INPUT", "Datos incompletos o inválidos");
    }
    const vehicle = catalog.find(v => v.id === data.vehicleId);
    if (!vehicle) {
      throw new ServiceError("NOT_FOUND", "Vehículo no encontrado");
    }
    const activeScenario = scenario;
    if (activeScenario === "taken-by-other") {
      vehicle.status = "RESERVED";
    }
    if (vehicle.status !== "AVAILABLE") {
      await wait(300);
      throw new ServiceError("NOT_AVAILABLE", "Unidad ya reservada");
    }
    // Este bloque representa la decisión indivisible del servicio.
    vehicle.status = "RESERVED";
    const result: Reservation = {
      reservationId: `R-${++sequence}`,
      ...data,
      status: "CONFIRMED",
    };
    operations.set(data.requestReference, { payload, result });
    await wait(400);
    if (activeScenario === "lost-confirmation") {
      throw new ServiceError(
        "UNKNOWN_RESULT", "No fue posible recibir la confirmación"
      );
    }
    return { ...result };
  },
};
