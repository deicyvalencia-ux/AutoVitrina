import heroImg from './assets/hero.png'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import InputAutocomplete from './components/atoms/InputAutocomplete'
import './App.css'
import { useState } from 'react'
import type { Vehicle } from './Services/vehicleService'
import { FormRerseva } from './components/organisms/FormRerseva'

function App() {
  const [openModal, setOpenModal] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle>();


  const handleOpenModal = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle)
    setOpenModal(true);
  }
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
             <FormRerseva />
            </div>

          </div>
        )}
      </section>

      <div className="ticks"></div>


      <div className="ticks"></div>
      <section id="spacer"></section>
    </>
  )
}

export default App
