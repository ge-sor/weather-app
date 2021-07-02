import React from "react";
import { connect } from "react-redux";
import { removeItem } from "../actions/actions";

function Card({ card, removeCard, onCardClick }) {
  function handleDelete(id) {
    removeCard(id);
  }

  function handleClick() {
    onCardClick(card);
  }

  return (
    <div className="card__container">
      <li className="card" onClick={handleClick}>
        <h2 className="card__text">{card.title}</h2>
        <p>{card.temp}</p>

        <img className="card__image" src={card.icon} alt={card.weather} />
      </li>
      <button
        className={
          card.title !== "Моё местоположение"
            ? "button delete-btn"
            : "button_inactive"
        }
        type="button"
        onClick={() => handleDelete(card.id)}
      ></button>
    </div>
  );
}

const mapDispatchToProps = (dispatch) => ({
  removeCard: (id) => dispatch(removeItem(id)),
});

export default connect(null, mapDispatchToProps)(Card);
