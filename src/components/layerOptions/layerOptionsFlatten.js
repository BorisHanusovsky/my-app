import React from 'react';
import "./layerOptions.css";

export default class LayerOptionsflatten extends React.Component{ // komponent nastavení vyhlazovacej vrstvy 
  state = {
    visibility : this.props.vis, // viditeľnosť - príznak nastavujúci viditeľnosť okna
    onClose: this.props.onClose, // metóda volaná po zatvorení okna
    index: this.props.index, // index vrsty v sieti
    type: this.props.type, // typ vrstvy - zobrazí vo vrchnej časti okna
    batchSize: this.props.batchSize, // veľkosť vstupnej dávky
    inputShape:this.props.inputShape, // tvar vstupných dát
  };

  componentDidUpdate(prevProps) { // zmena stavu komponentu v prípade zmien vstupných argumentov
    if (prevProps.inputShape !== this.props.inputShape) {
        this.setState({
          inputShape: this.props.inputShape
        })
      }
      if(this.state.inputShape){
        if(this.props.batchSize !== this.state.inputShape[0]){
          const updatedInputShape = [...this.state.inputShape];
          updatedInputShape[0] = this.props.batchSize; // úprava tvaru vstupu do siete podľa veľkosti vstupnej dávky
          this.setState({
            inputShape: updatedInputShape
          })
        }
      }
    
  }

  handleClose = () => { // po stlačení tlačidla X nebudú uložené aktuálne nastavenia do modelu
    this.props.onClose();
  };

  handleSubmit = () => { // po stlačení tlačidla OK budú uložené aktuálne nastavenia do modelu
    this.props.onClose(this.state);
  };

// UKLADANIE STAVU KOMPONENT
//-----------------------------------------------------------------------------------------

  handleInputShapeChange = (event) => {
    const inputShapeString = event.target.value;
    const inputShapeArray = inputShapeString.split(',').map(num => parseInt(num, 10) || 0);
    this.setState({ inputShape: inputShapeArray });
  }

  handleBatchSizeChange = (event) =>{
    this.setState({
        batchSize: event.target.value,
      });
  }

//-----------------------------------------------------------------------------------------
// ZOBRAZENIE OKNA

  render(){
    if (this.props.vis) { // okno zbude zobrazené len ak argument vis(viditeľnosť) bude mať kladnú hodnotu
        let shapeEditor;
        if (this.props.index === 0){ // logika zobrazenia/nezobrazenia editoru pre veľkosť vstupnej dávky
            shapeEditor = <div className ="layerOptionsRow" style={{gridRow:2, gridColumn:1/3}}> 
                            <label className = "layerOptionsLabel">Batch size:</label>
                            <input id="layerCountTextbox" type="number" className="textik" min={1} max={512} value={this.state.batchSize} onChange={(event) => this.handleBatchSizeChange(event)}/>
                          <p>Input shape: {String([this.state.batchSize, this.state.inputShape.slice(1)])}</p>
                        </div>
                        }
      return (
        <div className="layerOptions" style={{ visibility: this.props.vis }}>
          <div className ="layerOptionsRow" style={{gridRow:1, gridColumn:1/3}}>
            {/* tlačidlo X pre zatvorenie okna */}
            <span id = "layerOptionsClose" className="close" onClick={this.handleClose}>
              &times;
            </span>
            <h1 id = "layerOptionsTitle">{this.props.type}</h1>
          </div>
          {/* editor veľkosti vstupnej dávky*/}
          {shapeEditor}
          {/* tlačidlo OK pre zatvorenie okna a uloženie nastavení vrstvy do siete*/}
          <div className ="layerOptionsRow" style={{gridRow:3, gridColumn:1/3}}>
            <button id ="okButton" onClick={this.handleSubmit}>OK</button>
          </div>
        </div>
      );
    } else {
      return null;
    }
  }
}
