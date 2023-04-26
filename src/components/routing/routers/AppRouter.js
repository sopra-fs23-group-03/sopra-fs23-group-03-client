import { BrowserRouter, Redirect, Route, Switch } from "react-router-dom";
import { GameGuard } from "components/routing/routeProtectors/GameGuard";
import GameRouter from "components/routing/routers/GameRouter";
import { LoginGuard } from "components/routing/routeProtectors/LoginGuard";
import Login from "components/views/Login";
import Register from "components/views/Register";
import NavigationBar from "components/views/NavigationBar";
import Profile from "components/views/Profile";
import GroupCreation from "components/views/GroupCreation";
import Final from "components/views/Final";
import { ProfileGuard } from "components/routing/routeProtectors/ProfileGuard";
import { useContext } from "react";
import AuthContext from "components/contexts/AuthContext";



const AppRouter = () => {
  const { isLoggedIn } = useContext(AuthContext);

  return (
    <BrowserRouter>
      <NavigationBar isLoggedIn={isLoggedIn} />

      <Switch>

        <Route exact path="/login">
          <LoginGuard>
            <Login />
          </LoginGuard>
        </Route>

        <Route path="/game">
          <GameGuard>
            <GameRouter base="/game" />
          </GameGuard>
        </Route>
        
        <Route exact path="/register">
          <LoginGuard>
            <Register />
          </LoginGuard>
        </Route>
        
        <Route exact path="/profile/:userId">
          <ProfileGuard>
            <Profile />
          </ProfileGuard>
        </Route>

        <Route path="/group-creation">
          <ProfileGuard>
            <GroupCreation />
          </ProfileGuard>
        </Route>

        <Route path="/final">
            <Final />
        </Route>

        <Route exact path="/users/:userId">
          <GameGuard>
            <Profile />
          </GameGuard>
        </Route>

        <Route exact path="/">
          <Redirect to="/register" />
        </Route>
      </Switch>
    </BrowserRouter>
  );
};

/*
 * Don't forget to export your component!
 */
export default AppRouter;