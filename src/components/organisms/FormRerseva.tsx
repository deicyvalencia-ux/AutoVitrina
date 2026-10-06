import { useEffect, useState } from "react";
import { UseVehicleReserve } from "../../Services/Hooks/useVehicleReserve";
import type { Vehicle } from "../../Services/vehicleService";

interface FormRersevaProps {
    handleCancel: () => void,
    vehicle: Vehicle | undefined,
    setIsSuccesReserved: (data: boolean) => void
}

export const FormRerseva = ({ handleCancel, vehicle, setIsSuccesReserved }: FormRersevaProps) => {
    const [datos, setDatos] = useState({ buyerName: "", buyerEmail: "" });

    const { results, error, status, reserveVehicle } = UseVehicleReserve()


    const onChange = (e: any) => {
        const { name, value } = e.target
        setDatos((prev) => ({ ...prev, [name]: value }))
    }

    console.log("result", results, "error", error, "estado", status)

    const onSubmit = (e: any) => {
        e.preventDefault();

        const data = {
            ...datos,
            vehicleId: String(vehicle?.id),
            requestReference: crypto.randomUUID()

        }
        console.log(data)

        reserveVehicle(data)
    }

    useEffect(() => {
        if (status === "confirmed") {
            setIsSuccesReserved(true)
        }
    }, [status]);



    return (
        <>
            <form onSubmit={onSubmit}>
                <label htmlFor="buyerName">Nombre</label>
                <input type="text" name="buyerName" placeholder="Nombre de cliente" required onChange={(e) => onChange(e)} />
                <label htmlFor="buyerName">Correo</label>
                <input type="email" name="buyerEmail" placeholder="Correo de cliente" required onChange={(e) => onChange(e)} pattern="[^\s@]+@[^\s@]+\.[^\s@]{2,}"
                    title="Escribe un correo válido, por ejemplo nombre@dominio.com" />
                <div>
                    <button type="submit">Reservar</button>
                    <button type="button" onClick={handleCancel} >Cancelar</button>
                </div>
            </form>
            {error && status != "confirmed" && (
                <div >{error}</div>
            )}
        </>
    );
}
