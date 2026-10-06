import { useState } from "react";
import { useVehicleSearch } from "../../Services/Hooks/useVehicleSearch";
import "./InputAutocomplete.css";
import type { Vehicle } from "../../Services/vehicleService";

function formatPrice(value: number) {
  return value.toLocaleString("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  });
}

interface InputAutocompleteProps {
  handleOpenModal: (vehicle: Vehicle) => void

}

export default function InputAutocomplete({handleOpenModal}:InputAutocompleteProps ) {
  const { query, setQuery, results, status = "error", error, retry } = useVehicleSearch();
  const [open, setOpen] = useState(false);

  const showList = open && query.trim() !== "";

  return (

    <div className="autocomplete">
      <input
        type="text"
        className="autocomplete-input"
        placeholder="Busca por placa, marca o modelo..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => setOpen(true)}
        onBlur={() => setTimeout(() => setOpen(false), 150)}
      />

      {showList && (
        <div className="autocomplete-list">
          {status === "loading" && (
            <div className="autocomplete-message">Buscando...</div>
          )}

          {status === "error" && (
            <div className="autocomplete-message">
              {error}
              <button type="button" onClick={retry} className="retry-button">
                Reintentar
              </button>
            </div>
          )}

          {status === "empty" && (
            <div className="autocomplete-message">Sin resultados.</div>
          )}

          {status === "success" &&
            results.map((vehicle) => (
              <div key={vehicle.id} className="autocomplete-item">
                <span className="item-title">
                  {vehicle.brand} {vehicle.model} ({vehicle.year})
                </span>
                <span className="item-plate">{vehicle.plate}</span>
                <span className="item-price">
                  {formatPrice(vehicle.priceCOP)}
                </span>

                {vehicle.status != "RESERVED" && <button type="button" onClick={() => handleOpenModal(vehicle)}>Reservar</button>}
              </div>
            ))}
        </div>
      )}
    </div>
  );
}
