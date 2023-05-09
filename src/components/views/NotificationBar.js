import "styles/views/NotificationBar.scss";
import React, { useState, useEffect, useMemo } from "react";
import PropTypes from "prop-types";
import "styles/views/NavigationBar.scss";
import { useHistory } from "react-router-dom";
import { api } from "helpers/api";
import useInvitationActions from "hooks/useInvitationActions";

const NotificationBar = ({ notificationData }) => {
  const history = useHistory();

  console.log(notificationData);
  const { handleAcceptInvitation, handleRejectInvitation } =
    useInvitationActions();

  return (
    <div className="notification-bar">
      <h2>Your Notifications</h2>
      {notificationData.length > 0 ? (
        <div className="group-join-requests">
          <h3>Would you like to join the group?</h3>
          {notificationData.map((notification) => (
            <div className="group-join-request" key={notification.id}>
              <button
                className="group-name"
                onClick={() => {
                  history.push(`/invitation/${notification.id}`);
                }}
              >
                {notification.groupName}
              </button>
              <button
                className="material-icons reply-button"
                onClick={() => handleAcceptInvitation(notification.id)}
              >
                done
              </button>
              <button
                className="material-icons reply-button"
                onClick={() => handleRejectInvitation(notification.id)}
              >
                clear
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p>You have no new notifications.</p>
      )}
    </div>
  );
};

NotificationBar.defaultProps = {
  notificationData: [],
};
export default NotificationBar;
