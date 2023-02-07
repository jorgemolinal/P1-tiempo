
export default function Resultados(props) {
    //En props (dentro) viene 2 parametros, que son numitem e items. Se les llama props.numitem y props.item.

    /* Creo un nuevo array con el metodo slice (selecionar solo un cacho) usando props.items.daily.slice( y lo q sea aqui ) */
    var arrayLongNumItems = props.items.daily.slice(0, props.numitems);

    const newDate = (timestamp) => {
        var date = new Date(timestamp* 1000).toLocaleDateString()
        return date;
    } //Para cambiar el formato de las fechas de UNIX (en el que vienen) a uno normal y corriente

    const tempCelsius = (grados) => {
        var celsius = grados-273.15;
        return celsius.toFixed(2); //.toFixed(2) = Solo devolvemos 2 decimales.
    }


	return (<div id="resultados">
        <h2>Timezone: {props.items.timezone}</h2>
        <h3>El tiempo de los próximos dias será:</h3> 
        <ul id="items">

    {/* Un map es un bucle. Va a recorrer props.items.daily y a cada elemento (de 1 en 1) lo llama item,
    como si lo llamara i o elemento. */}
    
    {/* {console.log(props.items.daily)} ----> Imprime todos los elementos de dentro de daily */}
        {arrayLongNumItems.map((item,index) => ( 
                <li key={item.dt}>  
                {/* tanto temp como humidity como wind_speed son cosas/parametros q estan dentro de daily. Cada item del map
                es un props.items.daily distinto, recorre ese array en orden */}  
                <h3>{newDate(item.dt)}</h3>  
                <p>Temperatura máxima:{tempCelsius(item.temp.max)} <sup>o</sup>C </p>
                <p>Temperatura mínima:{tempCelsius(item.temp.min)} <sup>o</sup>C</p>
                <p>Humedad: {item.humidity}%</p>
                <p>Viento: {item.wind_speed} m/s </p>
                
                <p><img src={`http://openweathermap.org/img/wn/${item.weather[0].icon}.png`} className="tiempoimg" alt="Imagen de {item.weather[0].icon}"/></p>
                </li>
            
        ))}
        </ul>

  </div>)
}