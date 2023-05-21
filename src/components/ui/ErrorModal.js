import React from "react";
import PropTypes from "prop-types";
import "styles/ui/ErrorModal.scss";

const ErrorModal = ({ message, onConfirm }) => {
  return (
    <div className="error-modal">
      <div className="error-content">
        <p>{message}</p>

        <button className="ok-button" onClick={onConfirm}>
          Ok
        </button>
      </div>
    </div>
  );
};

ErrorModal.propTypes = {
  message: PropTypes.string.isRequired,
  onConfirm: PropTypes.func.isRequired,
};

export default ErrorModal;
