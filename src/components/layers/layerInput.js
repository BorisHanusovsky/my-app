import React, { useState } from "react";

export default function LayerInput({layer, handleLayerClick, handleLayerDoubleClick, isActive}) {
   
const handleClick = () => {
  handleLayerClick(layer.index);
};

const handleDoubleClick = () => {
  handleLayerDoubleClick(layer.index);
};

return (
      <div className="layer" onClick={handleClick} onDoubleClick={handleDoubleClick}
        style={{
          backgroundColor: isActive ? "#F2545B" : "",
          color: isActive ? "white" : "",
        }}
      >
        <h3>{layer.type}</h3>
        <h4>shape: ({layer.inputShape1}, {layer.inputShape2})</h4>
      </div>
    );
}