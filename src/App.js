
import './App.css';

import { useState } from "react";
import Resultados from "./Resultados";
import ErrorStatus from "./ErrorStatus";
import Header from "./Header";
import {mock1} from "./constants/mock";
import CONFIG from "./config/config";

const USE_SERVER = CONFIG.use_server;

function App() {

  const [lat, setLat] = useState(CONFIG.default_lat);
  const [lon, setLon] = useState(CONFIG.default_lon);
  const [resultado, setResultado] = useState(null);
  const [errorStatus, setErrorStatus] = useState(null);
  //OPCION 2: Eliminar este ultimo y eliminar el componente

  const callServer = async () => {
    console.log("funciona el boton")
      if (USE_SERVER){
        try {
          //URL/LLamada a la API = https://api.openweathermap.org/data/2.5/onecall?lat=40.416775&lon=-3.703790&appid=813
          //pq la URL viene sin los parametros estos, hay que añadirlos
          let params = "?lat=" + lat + "&lon=" + lon + "&appid=" +CONFIG.api_key;
          const response = await fetch(`${CONFIG.server_url}${params}`);
          const data = await response.json();

          if(response.status === 200){ //200 OK para probar si la respuesta del server es correcta         
            //console.log(data);
            setResultado(data); //Aqui le doy valor a resultado. Si el status fuera distinto de 200 no le da valor y resultado = null
            setErrorStatus(null); 
            //OPCION 2: 1)Quitar el setErrorStatus(null); y meter dentro del if lo siguiente: const data = await response.json(); 
          } else {
            //Si recibo un status !== 200 el data es un json con cod y message
            setErrorStatus(data)
            setResultado(null);
            //OPCIÓN 2: Cambiar contenido del else y poner:
            // const data ={"mensaje" : <div> error llamada API. Codigo: {response.status} </div>}
          }
          //Cada vez que yo hago una llamada a callServer le doy un valor a resultado y a errorStatus. Entonces tengo que poner 
          //uno con la data del json y otro a null, pq si no se guardarían los valores anteriores y se pintarian el resultado
          //y el error.

        } catch(error) { 
          console.log("error llamada al server");
          setResultado({ error: {description: error.message} });
          //console.log(error) y ya esta
        }
      } else {
        //Si el server esta false (no carga)
        setResultado(mock1)
      }
  };


  return (
    <div className="App">
      <Header />
      <h2 id="titulo">El tiempo</h2>

      <div className="inputs">
        {/* placeholder para poner algo dentro */}
        <div className="input">
          <b>Latitud: </b>
          <input type="number" id="latitud" value={lat} onChange={e=>setLat(e.target.value)}></input>
        </div>

        <div className="input">
          <b>Longitud: </b>
          <input type="number" id="longitud" value={lon} onChange={e=>setLon(e.target.value)}></input>
        </div>

        <button id="buscar" className="botonBusqueda" onClick={()=>callServer()}>
				  Buscar
				</button>
    {/* Si resultado vale null no pintes nada, si vale algo distinto de null ya haces lo de despues de &&.
    Pintas el componente Resultados pasandole al componenete 2 cosas: numitems y items */}
        {resultado && <Resultados numitems={CONFIG.num_items} items={resultado} />}
        {errorStatus && <ErrorStatus cod={errorStatus.cod} message={errorStatus.message} />}
      </div>
        
    </div>
  ); //¿Cómo hacer que a resultados puedas meterle un numitems distinto de CONFIG.num_items?
}

export default App;
