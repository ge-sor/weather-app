import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { addItem } from "./actions/actions";
import { v4 as uuidv4 } from "uuid";

import ErrorPopup from "./components/ErrorPopup";
import PlacePopup from "./components/PlacePopup";
import AddPlacePopup from "./components/AddPlacePopup";
import Card from "./components/Card";
import * as api from "./utils/api";

import "./App.css";

const App = ({ cards, addCard }) => {
  const [selectedCard, setSelectedCard] = useState(null);

  const [isErrorPopupOpen, setIsErrorPopupOpen] = useState(false);
  const [isCardPopupOpen, setCardPopupOpen] = useState(false);
  const [isAddCardPopupOpen, setAddCardPopupOpen] = useState(false);

  function handleError() {
    setIsErrorPopupOpen(true);
  }

  function handleCardClick(card) {
    setSelectedCard(card);
  }

  function handleAddCardClick() {
    setAddCardPopupOpen(true);
  }

  function closeAllPopups() {
    setIsErrorPopupOpen(false);
    setCardPopupOpen(false);
    setAddCardPopupOpen(false);
    setSelectedCard(null);
  }

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(function (position) {
      api
        .getWeatherByCoords(position.coords.longitude, position.coords.latitude)
        .then((res) => {
          const newCard = {
            id: uuidv4(),
            title: "Моё местоположение",
            temp: `${Math.floor(res.main.temp)}°C`,
            icon: `http://openweathermap.org/img/wn/${res.weather[0].icon}.png`,
            weather: res.weather[0].description,
            coord: {
              lon: res.coord.lon,
              lat: res.coord.lat,
            },
          };
          addCard(newCard);
        })
        .catch(() => {
          setIsErrorPopupOpen(true);
        });
    });
  }, [addCard]);

  return (
    <div className="page">
      <ul className="cards__list">
        {cards.map((card) => (
          <Card
            className="card"
            key={card.id}
            card={card}
            onCardClick={handleCardClick}
          />
        ))}
      </ul>
      <button className="button new-place-btn" onClick={handleAddCardClick} />

      <ErrorPopup isOpen={isErrorPopupOpen} onClose={closeAllPopups} />

      <PlacePopup
        card={selectedCard}
        isOpen={isCardPopupOpen}
        onClose={closeAllPopups}
      />

      <AddPlacePopup
        isOpen={isAddCardPopupOpen}
        onClose={closeAllPopups}
        error={handleError}
      />
    </div>
  );
};

const mapStateToProps = (state) => ({
  cards: state.items,
});

const mapDispatchToProps = (dispatch) => ({
  addCard: (card) => dispatch(addItem(card)),
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
