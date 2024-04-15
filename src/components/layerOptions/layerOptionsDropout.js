import React from 'react';
import "./layerOptions.css";

export default class LayerOptionsDropout extends React.Component{ // komponent nastavení vypadávacej vrstvy 
  state = {
    visibility : this.props.vis, // viditeľnosť - príznak nastavujúci viditeľnosť okna
    onClose: this.props.onClose, // metóda volaná po zatvorení okna
    index: this.props.index, // index vrsty v sieti
    rate : this.props.rate, // miera vypadávania
    type: this.props.type // typ vrstvy - zobrazí vo vrchnej časti okna
  };

  componentDidUpdate(prevProps) { // zmena stavu komponentu v prípade zmien vstupných argumentov
    if (prevProps.rate!== this.props.rate) {
      this.setState({
        rate: this.props.rate || 0.5
      });
    }
  }

  handleClose = () => { // po stlačení tlačidla X nebudú uložené aktuálne nastavenia do modelu
    if(this.state.rate!= ""){
      this.setState({
        visibility: false
      });
      this.props.onClose(); 
    }
  };

  handleSubmit = () => { // po stlačení tlačidla OK budú uložené aktuálne nastavenia do modelu
    if(this.state.rate!= ""){
      this.setState({
        visibility: false
      });
      this.props.onClose(this.state); 
    }
  };

// UKLADANIE STAVU KOMPONENT
//-----------------------------------------------------------------------------------------
  
  handleRateChange = (event) =>{
    this.setState({
      rate: event.target.value
    });
  }

//-----------------------------------------------------------------------------------------
// ZOBRAZENIE OKNA

  render(){
    if (this.props.vis) {  // okno zbude zobrazené len ak argument vis(viditeľnosť) bude mať kladnú hodnotu
      return (
        <div className="layerOptions" style={{ visibility: this.props.vis }}>
          <div className ="layerOptionsRow" style={{gridRow:1, gridColumn:1/3}}>
             {/* tlačidlo X pre zatvorenie okna */}
            <span id = "layerOptionsClose" className="close" onClick={this.handleClose}>
              &times;
            </span>
            <h1 id = "layerOptionsTitle">{this.props.type}</h1>
          </div>
          {/* editor miery vypadávania */}
          <div className ="layerOptionsRow" style={{gridRow:2, gridColumn:1/3}}>
            <label className = "layerOptionsLabel">Rate:</label>
            <input className="numberEditor" type="number" value={this.state.rate} onChange={(event) => this.handleRateChange(event)}/>
          </div>
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
