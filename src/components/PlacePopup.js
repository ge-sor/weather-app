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

        const dawnHours = -dawnUnix.getHours() * 7.5 + 180;
        const duskHours = -duskUnix.getHours() * 7.5 + 180;
        const dawnTomorrowHours = -dawnTomorrowUnix.getHours() * 7.5 + 180;
        const duskTomorrowHours = -duskTomorrowUnix.getHours() * 7.5 + 180;

        newForecast.dusk = duskUnix.toLocaleTimeString([], {
          timeZone: res.timezone,
          hour: "2-digit",
          minute: "2-digit",
        });
        newForecast.dawn = dawnUnix.toLocaleTimeString([], {
          timeZone: res.timezone,
          hour: "2-digit",
          minute: "2-digit",
        });
        newForecast.duskTomorrow = duskTomorrowUnix.toLocaleTimeString([], {
          timeZone: res.timezone,
          hour: "2-digit",
          minute: "2-digit",
        });
        newForecast.dawnTomorrow = dawnTomorrowUnix.toLocaleTimeString([], {
          timeZone: res.timezone,
          hour: "2-digit",
          minute: "2-digit",
        });
        setForecast(newForecast);

        let radius = 40;
        let point_size = 3;
        let center_x = 60;
        let center_y = 60;
        let font_size = "10px";

        const c = document.getElementById("canvas");
        const ct = c.getContext("2d");
        const cc = document.getElementById("canvas2");
        const cctx = cc.getContext("2d");

        function drawCircle(ctx) {
          ctx.clearRect(0, 0, 180, 100);
          ctx.beginPath();
          ctx.arc(center_x, center_y, radius, 0, Math.PI, true);
          ctx.stroke();
        }

        pics(ct, dawnHours, duskHours);
        pics(cctx, dawnTomorrowHours, duskTomorrowHours);

        function pics(ctx, angleA, angleB) {
          let x = center_x - 10 + radius * Math.cos((-angleA * Math.PI) / 180);
          let y = center_y - 10 + radius * Math.sin((-angleA * Math.PI) / 180);

          let xA = center_x - 10 + radius * Math.cos((-angleB * Math.PI) / 180);
          let yA = center_y - 10 + radius * Math.sin((-angleB * Math.PI) / 180);

          const sun = new Image();
          sun.src = `http://openweathermap.org/img/wn/01d.png`;
          sun.onload = function () {
            ctx.drawImage(sun, x, y, 20, 20);
          };
          const moon = new Image();
          moon.src = `http://openweathermap.org/img/wn/01n.png`;
          moon.onload = function () {
            ctx.drawImage(moon, xA, yA, 20, 20);
          };
        }

        function drawPoint(angle, label, ctx) {
          let x = center_x + radius * Math.cos((-angle * Math.PI) / 180);
          let y = center_y + radius * Math.sin((-angle * Math.PI) / 180);

          ctx.beginPath();
          ctx.arc(x, y, point_size, 0, 2 * Math.PI);
          ctx.fill();

          ctx.font = font_size;
          ctx.fillText(label, x + 10, y);
        }

        //Execution
        drawCircle(ct);
        drawPoint(dawnHours, forecast.dawn, ct);
        drawPoint(duskHours, forecast.dusk, ct);

        drawCircle(cctx);
        drawPoint(dawnTomorrowHours, forecast.dawnTomorrow, cctx);
        drawPoint(duskTomorrowHours, forecast.duskTomorrow, cctx);
      });
    }
  }, [
    card,
    forecast.dawn,
    forecast.dawnTomorrow,
    forecast.dusk,
    forecast.duskTomorrow,
  ]);

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
        <canvas id="canvas" width="180" height="80"></canvas>

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
        <canvas id="canvas2" width="180" height="80"></canvas>
      </div>
    </section>
  );
}
