import React, { useState } from 'react';

export default function ModalDatasetSelect({ visibility, onDatasetClose }) { // komponent modálneho okna výberu datasetu
  const names = ['MNIST', 'CIFAR10', 'Fashion MNIST']; // ponúkané typy datasetov
  const [hoveredButtons, setHoveredButtons] = useState(Array(names.length).fill(false));
  const vis = visibility; // viditeľnosť modálneho okna

  const handleMouseEnter = (index) => { // udalosť prechodu kuzroru po tlačidle datasetu, dochádza k jeho zvýrazneniu
    const updatedHoveredButtons = [...hoveredButtons];
    updatedHoveredButtons[index] = true;
    setHoveredButtons(updatedHoveredButtons);
  };

  const handleMouseLeave = (index) => { // udalosť odchodu kuzroru z tlačidla datasetu, dochádza k odstráneniu zvýraznenia
    const updatedHoveredButtons = [...hoveredButtons];
    updatedHoveredButtons[index] = false;
    setHoveredButtons(updatedHoveredButtons);
  };

  const handleClosePressed = () => { // udalosť po kliku na tlačidlo X, indikujúce zatvorenie okna
    onDatasetClose(null);
  };

  const handleCloseSelected = (index) => {  // udalosť po kliku na tlačidlo datasetu a následné odoslanie jeho typu
    const selectedModelName = names[index];
    onDatasetClose(selectedModelName);
  };

  return (
    <div style={{ display: vis ? 'block' : 'none', position: 'fixed', backgroundColor: 'rgba(0,0,0,0.4)', zIndex: '1', width: '100%', height: '100%' }}>
      <div style={{ backgroundColor: '#427D9D', margin: '15% auto', padding: '20px', border: '2px solid #fff', width: '30%', minWidth: '300px' }}>
        <div className="layerOptionsRow" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2>Saved models</h2>
          {/* Tlačidlo X pre zatvorenie okna */}
          <span className="close" onClick={handleClosePressed} style={{ cursor: 'pointer' }}> &times; </span>
        </div>
        {/* Pridávanie tlačidiel s názvom datasetov a úprava ich štýlu */}
        {names.map((name, index) => (
          <button
            key={index}
            onMouseEnter={() => handleMouseEnter(index)}
            onMouseLeave={() => handleMouseLeave(index)}
            style={{
              width: '100%',
              margin: '5px auto',
              fontSize: '20px',
              cursor: 'pointer',
              backgroundColor: hoveredButtons[index] ? '#F2545B' : '#DDF2FD',
            }}
            onClick={() => handleCloseSelected(index)}
          >
            {name}
          </button>
        ))}
      </div>
    </div>
  );
}
