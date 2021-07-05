import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { addItem } from "../actions/actions";
import * as api from "../utils/api";
import { v4 as uuidv4 } from "uuid";

function AddPlacePopup({ addCard, isOpen, onClose, error }) {
  const [item, setItem] = useState({
    title: "",
  });

  useEffect(() => {
    if (isOpen) {
      setItem({
        title: "",
      });
    }
  }, [isOpen]);

  function handleChange(e) {
    setItem({
      title: e.target.value,
    });
  }

  function handleSubmit(e) {
    e.preventDefault();

    api
      .getWeatherByCity(item.title)
      .then((res) => {

        const newCard = {
          id: uuidv4(),
          title: res.name,
          temp: `${Math.floor(res.main.temp)}°C`,
          icon: `http://openweathermap.org/img/wn/${res.weather[0].icon}.png`,
          coord: {
            lon: res.coord.lon,
            lat: res.coord.lat,
          },
        };
        addCard(newCard);
        onClose();
      })
      .catch(() => {
        onClose();
        error();
      });
  }

  return (
    <section className={`popup ${isOpen && "popup_opened"}`}>
      <div className="popup__container">
        <h2>Добавить новый город</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            required
            minLength="3"
            maxLength="40"
            value={item.title || ""}
            onChange={handleChange}
            className="form__input"
          ></input>
          <button type="submit" className="button submit-btn"></button>
        </form>
        <button
          type="button"
          className="button popup__close-btn"
          onClick={onClose}
        ></button>
      </div>
    </section>
  );
}

const mapStateToProps = (state) => ({
  cards: state.items,
});

const mapDispatchToProps = (dispatch) => ({
  addCard: (card) => dispatch(addItem(card)),
});

export default connect(mapStateToProps, mapDispatchToProps)(AddPlacePopup);
