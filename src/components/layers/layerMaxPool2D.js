export default function LayerMaxPool2D({layer, handleLayerClick, handleLayerDoubleClick, isActive}) { // komponent reprezentujúci hlasovaciu vrstvu s výberom maximálnej hodnoty v Model panel
   
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
        <h4>pool size: {"(" + layer.poolSize[0] + "," + layer.poolSize[1] + ")"}</h4>
        <h4>padding : {layer.padding}</h4>
        <h4>strides shape: {"(" + layer.strides[0] + "," + layer.strides[1] + ")"}</h4>
      </div>
    );
}