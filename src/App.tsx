import heroImg from './assets/hero.png'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import InputAutocomplete from './components/atoms/InputAutocomplete'
import './App.css'
import { useEffect, useState } from 'react'
import type { Vehicle } from './Services/vehicleService'
import { FormRerseva } from './components/organisms/FormRerseva'

function App() {
  const [openModal, setOpenModal] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle>();
  const [isSuccesReserved, setIsSuccesReserved] = useState<boolean>(false);



  const handleOpenModal = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle)
    setOpenModal(true);
  }

  const handleCancel = () => {
    setOpenModal(!openModal)
  }

  useEffect(() => {
    setOpenModal(prev => !prev)
  }, [isSuccesReserved]);


  return (
    <>
      <section id="center">
        <div className="hero">
          <img src={heroImg} className="base" width="170" height="179" alt="" />
          <img src={reactLogo} className="framework" alt="React logo" />
          <img src={viteLogo} className="vite" alt="Vite logo" />
        </div>
        <div>
          <h1>AutoVitrina</h1>
          <p>Busca el vehículo</p>
        </div>
        <InputAutocomplete handleOpenModal={handleOpenModal} />
        {openModal && (
          <div className='modal-overlay'>
            <div className='modal-content'>
              <FormRerseva handleCancel={handleCancel} vehicle={selectedVehicle} setIsSuccesReserved={setIsSuccesReserved} />
            </div>

          </div>
        )}
      </section>

      <div className="ticks">
        {isSuccesReserved && (
          <p>
            Se Reservo con exito
          </p>
        )}
      </div>

    </>
  )
}

export default App
