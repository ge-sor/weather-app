import React, { useState, useEffect } from "react";
import * as api from "../utils/api";

export default function PlacePopup({ onClose, card }) {
  const [forecast, setForecast] = useState({});

  useEffect(() => {
    if (card) {
      api.getForecast(card.coord.lon, card.coord.lat).then((res) => {

        const newForecast = {
          temp: `${Math.floor(res.daily[1].temp.day)}°C`,
          icon: `http://openweathermap.org/img/wn/${res.daily[1].weather[0].icon}.png`,
          weather: res.daily[1].weather.description,
        };

        const dawnUnix = new Date(res.daily[0].sunrise * 1000);
        const duskUnix = new Date(res.daily[0].sunset * 1000);
        const dawnTomorrowUnix = new Date(res.daily[1].sunrise * 1000);
        const duskTomorrowUnix = new Date(res.daily[1].sunset * 1000);

        newForecast.dusk = duskUnix.toLocaleTimeString([], {
          timeZone: res.timeZone,
          hour: "2-digit",
          minute: "2-digit",
        });
        newForecast.dawn = dawnUnix.toLocaleTimeString([], {
          timeZone: res.timeZone,
          hour: "2-digit",
          minute: "2-digit",
        });
        newForecast.duskTomorrow = duskTomorrowUnix.toLocaleTimeString([], {
          timeZone: res.timeZone,
          hour: "2-digit",
          minute: "2-digit",
        });
        newForecast.dawnTomorrow = dawnTomorrowUnix.toLocaleTimeString([], {
          timeZone: res.timeZone,
          hour: "2-digit",
          minute: "2-digit",
        });
        setForecast(newForecast);
      });
    }
  }, [card]);

  return (
    <section className={`popup ${card && "popup_opened"}`}>
      <div className="popup__container popup__container_place">
        <h2 className="card__text">{card?.title}</h2>
        <h3>Сегодня</h3>
        <div className="card__container">
          <p>{card?.temp}</p>

          <img className="card__image" src={card?.icon} alt={card?.weather} />
          <p className="card__time-text">Рассвет: {forecast.dawn}</p>
          <p className="card__time-text">Закат: {forecast.dusk}</p>
        </div>
        <h3>Завтра</h3>
        <div className="card__container">
          <p>{forecast.temp}</p>

          <img
            className="card__image"
            src={forecast.icon}
            alt={forecast.weather}
          />
          <p className="card__time-text">Рассвет: {forecast.dawnTomorrow}</p>
          <p className="card__time-text">Закат: {forecast.duskTomorrow}</p>
        </div>
        <button
          type="button"
          className="button popup__close-btn"
          onClick={onClose}
        ></button>
      </div>
    </section>
  );
}
