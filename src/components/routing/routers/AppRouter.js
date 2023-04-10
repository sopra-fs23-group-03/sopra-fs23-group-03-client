import { BrowserRouter, Redirect, Route, Switch } from "react-router-dom";
import { GameGuard } from "components/routing/routeProtectors/GameGuard";
import GameRouter from "components/routing/routers/GameRouter";
import { LoginGuard } from "components/routing/routeProtectors/LoginGuard";
import Login from "components/views/Login";
import Register from "components/views/Register";
import NavigationBar from "components/views/NavigationBar";
import Profile from "components/views/Profile";
import { ProfileGuard } from "components/routing/routeProtectors/ProfileGuard";

/**
 * Main router of your application.
 * In the following class, different routes are rendered. In our case, there is a Login Route with matches the path "/login"
 * and another Router that matches the route "/game".
 * The main difference between these two routes is the following:
 * /login renders another component without any sub-route
 * /game renders a Router that contains other sub-routes that render in turn other react components
 * Documentation about routing in React: https://reacttraining.com/react-router/web/guides/quick-start
 */

const AppRouter = () => {
  return (
    <BrowserRouter>
      <NavigationBar />
      <Switch>
        <Route path="/game">
          <GameGuard>
            <GameRouter base="/game" />
          </GameGuard>
        </Route>

        <Route exact path="/login">
          <LoginGuard>
            <Login />
          </LoginGuard>
        </Route>

        <Route exact path="/register">
          <LoginGuard>
            <Register />
          </LoginGuard>
        </Route>
        <Route path="/profile">
          <ProfileGuard>
            <Profile />
          </ProfileGuard>
        </Route>

        {/* <Route exact path="/users/:userId">
          <GameGuard>
            <Profile />
          </GameGuard>
        </Route>

        <Route exact path="/:userId/edit">
          <GameGuard>
            <EditProfile />
          </GameGuard>
        </Route> */}

        <Route exact path="/">
          <Redirect to="/game" />
        </Route>
      </Switch>
    </BrowserRouter>
  );
};

/*
 * Don't forget to export your component!
 */
export default AppRouter;
