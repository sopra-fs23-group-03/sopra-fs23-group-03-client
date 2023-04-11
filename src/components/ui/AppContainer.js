import PropTypes from "prop-types";
import "styles/ui/AppContainer.scss";

const AppContainer = (props) => (
  <div {...props} className={`app-container ${props.className ?? ""}`}>
    {props.children}
  </div>
);

AppContainer.propTypes = {
  children: PropTypes.node,
};

export default AppContainer;
