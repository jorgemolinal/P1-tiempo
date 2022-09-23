import {render, fireEvent, waitFor, screen} from '@testing-library/react'
import App from '../../src/App';
import {mock2} from '../utils/mock2';

//hay un segundo test suite para cambiar la configuración, si lo hago al vuelo así:
//mock per test: https://mikeborozdin.com/post/changing-jest-mocks-between-tests/
//config.default.use_server = true;
//como ya se ha cargado App con el import, si el alumno ha salvado el valor de config en una variable ya no se cambia
//si ha hecho por ejemplo const USE_SERVER = CONFIG.use_server; antes de function App
//la otra opción para hacer esto sería hacer un dynamic import https://www.npmjs.com/package/babel-plugin-dynamic-import-node https://jestjs.io/docs/next/jest-object#jestdomockmodulename-factory-options


const mytestconfig = {
  server_url: "http://nuevoserver.com",
  api_key: "apikeyfake_nohacefaltaporquehagomockdefetch",
  num_items: 3,
  default_lat: 41.416775,
  default_lon: -4.703790,
  use_server: true,
  force_error: false  
};

jest.setTimeout(10000);

jest.mock('../../src/config/config', () => ( {
  __esModule: true,
  default: mytestconfig  
} ));

afterAll(() => jest.resetAllMocks());

let testinfo = {
  name: "La aplicación llama al servidor si se indica así en la configuración y funciona bien con un 200 OK",
  score: 1,
  msg_ok: "La aplicación llama al servidor adecuadamente y funciona bien con un 200 OK",
  msg_error: "La aplicación NO llama al servidor adecuadamente o NO funciona bien con un 200 OK"
}
test(JSON.stringify(testinfo), async () => {
  //mock de fetch. O se pone aquí o en beforeEach, si no no tira
  global.fetch = jest.fn(() => Promise.resolve({
    status: 200,
    json: () => Promise.resolve(mock2)
  }));
  
  render(<App />);
  const buscar = document.querySelector('#buscar');
  fireEvent.click(buscar);
  //espero a que cargue los resultados, para ello uso scren.getAllByText que devuelve una promesa
  await waitFor(() => screen.getAllByText(/Humedad/i), {timeout: 10000});
  const resultado = document.querySelector('#resultados');
  expect(resultado).toBeInTheDocument();
  expect(resultado).toHaveTextContent(/El tiempo/i);
  expect(resultado).toHaveTextContent(/Inventado2\/Pais2/i);
  expect(resultado).toHaveTextContent("4/8/2022");
  const imagenes = document.querySelectorAll('.tiempoimg');
  expect(imagenes).toHaveLength(mytestconfig.num_items);
});

testinfo = {
  name: "La query formada para llamar al servidor es correcta",
  score: 1,
  msg_ok: "La query formada para llamar al servidor es correcta",
  msg_error: "La query formada para llamar al servidor NO es correcta"
}
test(JSON.stringify(testinfo), async () => {
  //mock de fetch. O se pone aquí o en beforeEach, si no no tira
  global.fetch = jest.fn(() => Promise.resolve({
    status: 200,
    json: () => Promise.resolve(mock2)
  }));
  render(<App />);
  const lat = document.querySelector('#latitud');
  const lon = document.querySelector('#longitud');
  fireEvent.change(lat, {target: {value: 45.6}});
  fireEvent.change(lon, {target: {value: -15.6}});
  const buscar = document.querySelector('#buscar');
  await fireEvent.click(buscar);
  
  //necesitamos waitFor porque hacemos un re-render asincrono después del fetch en App.js - https://davidwcai.medium.com/react-testing-library-and-the-not-wrapped-in-act-errors-491a5629193b
  //además he tenido que añadir await a fireEvent.click(buscar) para que funcione
  await waitFor(() => {
    const url = global.fetch.mock.calls[0][0];
    expect(url).toMatch(mytestconfig.server_url);
    expect(url).toMatch("appid="+mytestconfig.api_key);
    expect(url).toMatch("lat=45.6");
    expect(url).toMatch("lon=-15.6");
  });
});


testinfo = {
  name: "La aplicación llama al servidor si se indica así en la configuración y funciona para códigos de error",
  score: 1.5,
  msg_ok: "La aplicación llama al servidor adecuadamente y funciona bien con códigos de error",
  msg_error: "La aplicación NO llama al servidor adecuadamente o NO funciona bien con códigos de error"
}
test(JSON.stringify(testinfo), async () => {
  //mock de fetch. O se pone aquí o en beforeEach, si no no tira
  global.fetch = jest.fn(() => Promise.resolve({
    status: 500,
    json: () => Promise.resolve({ cod: "500", message: "XXX - YYY - ZZZ"})
  }));
  
  render(<App />);
  const buscar = document.querySelector('#buscar');
  fireEvent.click(buscar);
  //espero a que cargue los resultados, para ello uso scren.getAllByText que devuelve una promesa
  await waitFor(() => screen.getAllByText(/error/i), {timeout: 5000});
  const resultado = document.querySelector('#error');
  expect(resultado).toBeInTheDocument();
  expect(resultado).toHaveTextContent(/error/i);
});



