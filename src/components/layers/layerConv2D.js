import React, { useState } from "react";

export default function LayerConv2D({layer, handleLayerClick, handleLayerDoubleClick, isActive}) {
   
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
        <h4>activation: {layer.activationType}</h4>
        <h4>num. of kernels: {layer.numOfKernels}</h4>
        <h4>kernel shape: {"(" + layer.kernelSize[0] + "," + layer.kernelSize[1] + ")"}</h4>
        <h4>padding : {layer.padding}</h4>
        <h4>stride shape: {"(" + layer.stride[0] + "," + layer.stride[1] + ")"}</h4>
      </div>
    );
}