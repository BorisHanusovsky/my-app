import React, { useState } from "react";

export default function LayerEmpty({isActive}){
  return (
    <div className="layer"
      style={{
        backgroundColor: isActive ? "#F2545B" : "",
        color: isActive ? "white" : "",
      }}
    >
    <h3>"EMPTY"</h3>
    </div>
  );
}