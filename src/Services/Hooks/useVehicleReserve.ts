import { useCallback, useState } from "react";
import { ServiceError, vehicleService, type Reservation, type ReserveInput } from "../vehicleService";


export const UseVehicleReserve = () => {

    const [results, setResults] = useState<Reservation>();
    const [error, setError] = useState<string | null>(null);
    const [status, setStatus] = useState<string>("");


    const reserveVehicle = useCallback(async (reserveInput: ReserveInput) => {

        try {
            const result = await vehicleService.reserve(reserveInput);
            setResults(result);
            setStatus("confirmed");
        } catch (err: unknown) {
            if (err instanceof ServiceError && err.code === "UNKNOWN_RESULT") {
                // Ni éxito ni fracaso: desconocido. Conservas la referencia para reintentar.
                setStatus("unknown");
            } else if (err instanceof ServiceError && err.code === "NOT_AVAILABLE") {
                setStatus("unavailable");
            } else {
                setStatus("error");
                setError("No se pudo completar la reserva.");
            }
        }

    }, [])



    return {
        results, error, status, reserveVehicle
    }

}
