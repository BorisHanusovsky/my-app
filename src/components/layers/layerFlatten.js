import React, { useState } from "react";

export default function LayerFlatten({layer, handleLayerClick,isActive}) {
   
const handleClick = () => {
  handleLayerClick(layer.index);
};

return (
      <div className="layer" onClick={handleClick}
        style={{
          backgroundColor: isActive ? "#F2545B" : "",
          color: isActive ? "white" : "",
        }}
      >
        <h3>{layer.type}</h3>
      </div>
    );
}