export default function LayerEmpty({isActive}){ // komponent reprezentujúci prázdnu vrstvu v Model panel, slúži len na testovacie účely
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