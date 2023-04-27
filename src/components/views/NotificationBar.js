import "styles/views/NotificationBar.scss";
import React, { useState, useEffect, useMemo } from "react";
import PropTypes from "prop-types";
import "styles/views/NavigationBar.scss";
import { useHistory } from "react-router-dom";
import { api } from "helpers/api";

const NotificationBar = ({ notificationData }) => {
  const history = useHistory();
  const guestId = localStorage.getItem("userId");
  const headers = useMemo(() => {
    return { "X-Token": localStorage.getItem("token") };
  }, []);

  console.log(notificationData);

  const handleAcceptInvitation = async (groupId, guestId) => {
    try {
      console.log(groupId, guestId);
      await api.put(
        `/groups/${groupId}/invitations/accept`,
        JSON.stringify({ guestId }),
        {
          headers,
        }
      );
    } catch (error) {
      console.error(error);
    }
    history.push(`/groupforming/${groupId}/guest`);
  };

  const handleRejectInvitation = async (groupId, guestId) => {
    try {
      console.log(groupId, guestId);
      await api.put(
        `/groups/${groupId}/invitations/reject`,
        JSON.stringify({ guestId }),
        {
          headers,
        }
      );
    } catch (error) {
      console.error(error);
    }
  };

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
                onClick={() => handleAcceptInvitation(notification.id, guestId)}
              >
                done
              </button>
              <button
                className="material-icons reply-button"
                onClick={() =>
                  handleRejectInvitation(
                    notification.id,
                    localStorage.getItem("userId")
                  )
                }
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

NotificationBar.propTypes = {
  notificationData: PropTypes.array.isRequired,
};

export default NotificationBar;
