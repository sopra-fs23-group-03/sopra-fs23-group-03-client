//import React from "react";
import React, { useState, useEffect } from "react";
import "styles/views/NotificationBar.scss";
import PropTypes from "prop-types";

const NotificationBar = () => {
  return (
    <div className="notification-bar">
      <h2>Your Notifications</h2>
      <div className="group-join-requests">
        <h3>Would you like to join the group?</h3>
        <div className="group-join-request">
          <span className="group-name">Group A</span>
          <div className="button-container"></div>
          <button className="material-icons reply-button">done</button>
          <button className="material-icons reply-button">clear</button>
        </div>
        <div className="group-join-request">
          <span className="group-name">Group B</span>
          <div className="button-container"></div>
          <button className="material-icons reply-button">done</button>
          <button className="material-icons reply-button">clear</button>
        </div>
      </div>
    </div>
  );
};

export default NotificationBar;

//For future use when backend is connected

// const NotificationBar = ({ requests }) => {
//   return (
//     <div className="notification-bar">
//       <h2>Your Notifications</h2>
//       {requests.length > 0 ? (
//         <div className="group-join-requests">
//           <h3>Would you like to join the group?</h3>
//           {requests.map((request) => (
//             <div className="group-join-request" key={request.groupId}>
//               <span className="group-name">{request.groupName}</span>
//                <button className="material-icons reply-button">done</button>
//                <button className="material-icons reply-button">clear</button>
//             </div>
//           ))}
//         </div>
//       ) : (
//         <p>You have no new notifications.</p>
//       )}
//     </div>
//   );
// };

// NotificationBar.propTypes = {
//   requests: PropTypes.array.isRequired,
// };
// export default NotificationBar;
