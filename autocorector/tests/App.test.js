/*
expect matchers: https://jestjs.io/docs/expect
custom DOM matchers for expect: https://github.com/testing-library/jest-dom
*/
import {render, fireEvent, waitFor, screen} from '@testing-library/react'
import App from './App';
import Header from './Header';

const mytestconfig = {
  server_url: "https://api.openweathermap.org/data/2.5/onecall",
  api_key: "apikeyfake_nohacefaltaporquehagomockdefetch",
  num_items: 4,
  default_lat: 41.416775,
  default_lon: -4.703790,
  use_server: false,
  force_error: false  
};

jest.setTimeout(10000);

jest.mock('./config/config', () => ( {
  __esModule: true,
  default: mytestconfig  
} ));

afterAll(() => jest.resetAllMocks());


let testinfo = {
    name: "La aplicación tiene un componente Header con el logo y el mensaje de bienvenida",
    score: 1,
    msg_ok: "Header encontrada",
    msg_error: "Header no encontrada o no es como se esperaba, revise el enunciado"
}
test(JSON.stringify(testinfo), () => {
  console.log();
  console.log("LOGS DEL ALUMNO:");
  render(<Header />);
  console.log("------FIN LOGS DEL ALUMNO------");
  const cabecera = document.querySelector('#cabecera');
  const logo = document.querySelector('.logo');
  const mensaje = document.querySelector('.mensaje');

  expect(cabecera).toBeInTheDocument();
  expect(mensaje).toHaveTextContent(/Enrique Barra/i);
  expect(cabecera.tagName).toBe('DIV');
  expect(cabecera).toContainElement(logo);
  expect(cabecera).toContainElement(mensaje);
});

testinfo = {
  name: "La aplicación tiene un h2 con id 'titulo' y el texto 'El tiempo'",
  score: 1,
  msg_ok: "h2 con id 'titulo' y con el texto 'El tiempo' encontrado",
  msg_error: "h2 con id 'titulo' y con el texto 'El tiempo' NO encontrado"
}
test(JSON.stringify(testinfo), () => {
  console.log();
  console.log("LOGS DEL ALUMNO:");
  render(<App />);
  console.log("------FIN LOGS DEL ALUMNO------");
  const eltiempo = document.querySelector('#titulo');
  expect(eltiempo).toBeInTheDocument();
  expect(eltiempo).toHaveTextContent(/El tiempo/i);
  expect(eltiempo.tagName).toBe('H2');
});

testinfo = {
  name: "La aplicación tiene los input para que el usuario introduzca la latitud y la longitud y el botón buscar",
  score: 1,
  msg_ok: "Campos latitud y longitud y botón buscar encontrados",
  msg_error: "Campos latitud y longitud y botón buscar NO encontrados"
}
test(JSON.stringify(testinfo), () => {
  console.log();
  console.log("LOGS DEL ALUMNO:");
  render(<App />);
  console.log("------FIN LOGS DEL ALUMNO------");
  const lat = document.querySelector('#latitud');
  const lon = document.querySelector('#longitud');
  const buscar = document.querySelector('#buscar');

  expect(lat).toBeInTheDocument();
  expect(lat.tagName).toBe('INPUT');
  expect(lon).toBeInTheDocument();
  expect(lon.tagName).toBe('INPUT');
  expect(buscar).toBeInTheDocument();
  expect(buscar.tagName).toBe('BUTTON');
});

testinfo = {
  name: "Los input latitud y longitud inicializan con los valores por defecto",
  score: 1,
  msg_ok: "Campos latitud y longitud inicializan adecuadamente",
  msg_error: "Campos latitud y longitud NO inicializan adecuadamente con los valores provistos en el fichero de config"
}
test(JSON.stringify(testinfo), () => {
  console.log();
  console.log("LOGS DEL ALUMNO:");
  render(<App />);
  console.log("------FIN LOGS DEL ALUMNO------");
  const lat = document.querySelector('#latitud');
  const lon = document.querySelector('#longitud');
  expect(lat).toHaveValue(mytestconfig.default_lat);
  expect(lon).toHaveValue(mytestconfig.default_lon);  
});

testinfo = {
  name: "Los input latitud y longitud cambian cuando el usuario escribe en ellos",
  score: 1,
  msg_ok: "Campos latitud y longitud cambian adecuadamente",
  msg_error: "Campos latitud y longitud NO cambian adecuadamente con los valores que introduce el usuario"
}
test(JSON.stringify(testinfo), () => {
  console.log();
  console.log("LOGS DEL ALUMNO:");
  render(<App />);
  console.log("------FIN LOGS DEL ALUMNO------");
  const lat = document.querySelector('#latitud');
  const lon = document.querySelector('#longitud');
  fireEvent.change(lat, {target: {value: 45.6}})
  fireEvent.change(lon, {target: {value: -15.6}})
  expect(lat).toHaveValue(45.6);
  expect(lon).toHaveValue(-15.6);  
});


testinfo = {
  name: "La aplicación carga los datos de constants/mock.js si en la configuración se indica que no se use el servidor",
  score: 1,
  msg_ok: "Datos de mock.js cargados adecuadamente",
  msg_error: "Datos de mock.js NO renderizados correctamente"
}
test(JSON.stringify(testinfo), async () => {
  console.log();
  console.log("LOGS DEL ALUMNO:");
  render(<App />);
  console.log("------FIN LOGS DEL ALUMNO------");
  const buscar = document.querySelector('#buscar');
  fireEvent.click(buscar);
  //espero a que cargue los resultados, para ello uso scren.getAllByText que devuelve una promesa
  await waitFor(() => screen.getAllByText(/Humedad/i));
  const resultado = document.querySelector('#resultados');
  expect(resultado).toBeInTheDocument();
  expect(resultado).toHaveTextContent(/El tiempo/i);
  expect(resultado).toHaveTextContent(/Timezone/i);
  expect(resultado).toHaveTextContent("30/6/2022");
});


testinfo = {
  name: "La aplicación carga el número de items que se indica en la configuración con num_items",
  score: 1,
  msg_ok: "Número de items correcto",
  msg_error: "Número de items NO correcto",
}
test(JSON.stringify(testinfo), async () => {
  console.log();
  console.log("LOGS DEL ALUMNO:");
  render(<App />);
  console.log("------FIN LOGS DEL ALUMNO------");
  const buscar = document.querySelector('#buscar');
  fireEvent.click(buscar);
  //espero a que cargue los resultados, para ello uso scren.getAllByText que devuelve una promesa
  await waitFor(() => screen.getAllByText(/Humedad/i), {timeout: 10000});
  const tarjetas = document.querySelectorAll('.tarjeta');
  expect(tarjetas).toHaveLength(mytestconfig.num_items);
});




