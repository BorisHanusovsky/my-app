import React, { useState } from 'react';

export default function ModalLayerTypes({ visibility, onModalLayerTypesClose, layerTypes}) { // komponent modálneho okna pridania vrstvy siete
  const [hoveredButtons, setHoveredButtons] = useState(Array(layerTypes.length).fill(false));
  const vis = visibility; // viditeľnosť modálneho okna
  const types = layerTypes === undefined ? [] : layerTypes; // typy vrstiev pochádzajúce z enumerátora

  const handleMouseEnter = (index) => { // udalosť prechodu kuzroru po tlačidle vrstvy, dochádza k jeho zvýrazneniu
    const updatedHoveredButtons = [...hoveredButtons];
    updatedHoveredButtons[index] = true;
    setHoveredButtons(updatedHoveredButtons);
  };

  const handleMouseLeave = (index) => { // udalosť odchodu kuzroru z tlačidla vrstvy, dochádza k odstráneniu zvýraznenia
    const updatedHoveredButtons = [...hoveredButtons];
    updatedHoveredButtons[index] = false;
    setHoveredButtons(updatedHoveredButtons);
  };

  const handleClosePressed = () => { // udalosť po kliku na tlačidlo X, indikujúce zatvorenie okna
    onModalLayerTypesClose(null);
  };

  const handleCloseSelected = (index) => { // udalosť po kliku na tlačidlo vrstvy a následné odoslanie jej typu
    const selectedLayerType = types[index];
    onModalLayerTypesClose(selectedLayerType);
  };

  return (
    <div style={{ display: vis ? 'block' : 'none', position: 'fixed', backgroundColor: 'rgba(0,0,0,0.4)', zIndex: '1', width: '100%', height: '100%' }}>
      <div style={{ backgroundColor: '#427D9D', margin: '15% auto', padding: '20px', border: '2px solid #fff', width: '30%', minWidth: '300px' }}>
        <div className="layerOptionsRow" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2>Layer types</h2>
          {/* Tlačidlo X pre zatvorenie okna */}
          <span className="close" onClick={handleClosePressed} style={{ cursor: 'pointer' }}> &times; </span>
        </div>
        {/* Pridávanie tlačidiel s názvom vrstiev a úprava ich štýlu */}
        {types.map((type, index) => (
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
            {type}
          </button>
        ))}
      </div>
    </div>
  );
}
