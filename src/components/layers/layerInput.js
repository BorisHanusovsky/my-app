export default function LayerInput({layer, handleLayerClick, handleLayerDoubleClick, isActive}) { // komponent reprezentujúci plne prepojenú vrstvu v Model panel(NEPOUŽÍVA SA)
   
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