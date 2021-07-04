export const BASE_URL = "https://api.openweathermap.org/data/2.5";
const handleResponse = (response) =>
  response.ok ? response.json() : Promise.reject(`Ошибка ${response.status}`);
const key = "e8589dd59b877616c63ff3a5270d69ff";

export const getWeatherByCoords = (lon, lat) => {
  return fetch(
    `${BASE_URL}/weather?lat=${lat}&lon=${lon}&appid=${key}&lang=ru&units=metric`
  ).then(handleResponse);
};

export const getWeatherByCity = (city) => {
  return fetch(
    `${BASE_URL}/weather?q=${city}&appid=${key}&lang=ru&units=metric`
  ).then(handleResponse);
};

export const getForecast = (lon, lat) => {
  return fetch(
    `${BASE_URL}/onecall?lat=${lat}&lon=${lon}&exclude=hourly,minutely&appid=${key}&units=metric&lang=ru`
  ).then(handleResponse);
};
