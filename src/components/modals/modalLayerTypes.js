import React, { useState } from 'react';

export default function ModalLayerTypes({ visibility, onModalLayerTypesClose, layerTypes}) {
  const [hoveredButtons, setHoveredButtons] = useState(Array(layerTypes.length).fill(false));
  const vis = visibility;
  const types = layerTypes === undefined ? [] : layerTypes;

  const handleMouseEnter = (index) => {
    const updatedHoveredButtons = [...hoveredButtons];
    updatedHoveredButtons[index] = true;
    setHoveredButtons(updatedHoveredButtons);
  };

  const handleMouseLeave = (index) => {
    const updatedHoveredButtons = [...hoveredButtons];
    updatedHoveredButtons[index] = false;
    setHoveredButtons(updatedHoveredButtons);
  };

  const handleClosePressed = () => {
    onModalLayerTypesClose(null);
  };

  const handleCloseSelected = (index) => {
    const selectedLayerType = types[index];
    onModalLayerTypesClose(selectedLayerType);
  };

  return (
    <div style={{ display: vis ? 'block' : 'none', position: 'fixed', backgroundColor: 'rgba(0,0,0,0.4)', zIndex: '1', width: '100%', height: '100%' }}>
      <div style={{ backgroundColor: '#427D9D', margin: '15% auto', padding: '20px', border: '2px solid #fff', width: '30%', minWidth: '300px' }}>
        <div className="layerOptionsRow" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2>Layer types</h2>
          <span className="close" onClick={handleClosePressed} style={{ cursor: 'pointer' }}> &times; </span>
        </div>
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
