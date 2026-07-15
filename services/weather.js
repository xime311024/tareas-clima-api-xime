const axios = require('axios');

const API_BASE = 'https://api.openweathermap.org/data/2.5/weather';
const API_KEY = process.env.WEATHER_API_KEY;

async function obtenerClima(ciudad) {
  if (!ciudad) {
    const err = new Error('Parámetro ciudad vacío');
    err.code = 'INVALID_PARAM';
    throw err;
  }

  if (!API_KEY) {
    const err = new Error('Clave API de clima no configurada (usar variable WEATHER_API_KEY)');
    err.code = 'NO_API_KEY';
    throw err;
  }

  try {
    const resp = await axios.get(API_BASE, {
      params: { q: ciudad, appid: API_KEY, units: 'metric', lang: 'es' },
      timeout: 5000
    });

    const data = resp.data;
    return {
      ciudad: data.name,
      temperatura: data.main && data.main.temp,
      descripcion: data.weather && data.weather[0] && data.weather[0].description,
      raw: data
    };
  } catch (error) {
    const err = new Error('Error en servicio externo de clima');
    err.code = 'SERVICE_ERROR';
    err.cause = error;
    throw err;
  }
}

module.exports = { obtenerClima };
