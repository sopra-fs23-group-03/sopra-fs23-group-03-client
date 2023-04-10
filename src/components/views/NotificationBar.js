import React from "react";
import "styles/views/NotificationBar.scss";

// const NotificationBar = () => {
//   return (
//     <div className="Notification-bar">
//       <h2>Your Notifications </h2>
//       {/* <p>{props.notificationContent}</p> */}
//     </div>
//   );
// };

//

const NotificationBar = () => {
  return (
    <div className="notification-bar">
      <h2>Your Notifications</h2>
      <div className="group-join-requests">
        <h3>Would you like to join the group?</h3>
        <div className="group-join-request">
          <span className="group-name">Group A</span>
          <button className="join-button">Join</button>
          <button className="reject-button">Reject</button>
        </div>
        <div className="group-join-request">
          <span className="group-name">Group B</span>
          <button className="join-button">Join</button>
          <button className="reject-button">Reject</button>
        </div>
      </div>
    </div>
  );
};

export default NotificationBar;
