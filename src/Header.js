import logo from './logo.svg';
import './App.css';

const divStyle = {
    //Fuente: https://www.iteramos.com/pregunta/2517/redimensionar-la-imagen-proporcionalmente-con-css

    width:"100%", /* you can use px (For example: "520px". WIDTH 100% hace q ocupe todo el ancho de la pagina*/ 
    height: "auto"
}

export default function Header(props) {  
    return (<div style={divStyle} id="cabecera">
      <img className="logo" src={logo} alt="logo" />
      <h3 className="mensaje">Bienvenido a la página de Jorge Molina Lafuente</h3>      
    </div>)
  }
