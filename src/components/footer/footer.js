import React, { useRef } from 'react';
import "./footer.css";

export default function Footer() { // komponent päty aplikácie 
  return (
    <div id = "footer">
      <div id ="centered">
        <p className= "university">© 2024 Technical university of Kosice</p>
        <p className= "university">Depertment of cybernetics and artificial inteligence</p>
      </div>
    </div>
  );
}
