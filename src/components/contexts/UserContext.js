import { createContext } from "react";
import User from "models/User";

// Create the user context
const UserContext = createContext(new User());

export default UserContext;
