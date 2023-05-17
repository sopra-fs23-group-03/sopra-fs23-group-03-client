import React from "react";
import PropTypes from "prop-types";
import "styles/ui/ConfirmationModal.scss";

const ConfirmationModal = ({ message, onConfirm }) => {
  return (
    <div className="confirmation-modal">
      <div className="modal-content">
        <p>{message}</p>
        <div className="modal-buttons">
          <button className="confirm-button" onClick={onConfirm}>
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

ConfirmationModal.propTypes = {
  message: PropTypes.string.isRequired,
  onConfirm: PropTypes.func.isRequired,
};

export default ConfirmationModal;
