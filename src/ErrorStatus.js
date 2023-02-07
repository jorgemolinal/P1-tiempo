export default function ErrorStatus(props) {

    //Recibe props.cod y props.message
    return (<div id="error">
        <h1>ERROR</h1>
        <h2>Se ha producido un error</h2>
        <p>Descripción: Error al llamar al API. Código {props.cod}</p>
        <p>Mensaje del servidor: {props.message}</p>
        </div>
    )
        

}