import React from "react";

export default function ErrorPopup({ isOpen, onClose }) {
  return (
    <section className={`popup ${isOpen && "popup_opened"}`}>
      <div className="popup__container">
        <h2>Ошибка добавления города</h2>
        <button
          type="button"
          className="button popup__close-btn"
          onClick={onClose}
        ></button>
      </div>
    </section>
  );
}
