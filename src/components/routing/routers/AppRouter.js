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
import { useContext } from "react";
import AuthContext from "components/contexts/AuthContext";
import GroupFormingGuest from "components/views/GroupFormingGuest";
import GroupFormingHost from "components/views/GroupFormingHost";
import Ingredient from "components/views/Ingredient";
import IngredientSolo from "components/views/IngredientSolo";
import IngredientsVoting from "components/views/IngredientsVoting";

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
  const { isLoggedIn } = useContext(AuthContext);

  return (
    <BrowserRouter>
      <NavigationBar isLoggedIn={isLoggedIn} />
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

        <Route exact path="/profile/:userId">
          <GameGuard>
            <Profile />
          </GameGuard>
        </Route>

        <Route path="/group-creation">
          <GameGuard>
            <GroupCreation />
          </GameGuard>
        </Route>

        <Route exact path="/final/:groupId">
          <GameGuard>
            <Final />
          </GameGuard>
        </Route>

        <Route exact path="/users/:userId">
          <GameGuard>
            <Profile />
          </GameGuard>
        </Route>

        <Route exact path="/groupforming/:groupId/host">
          <GameGuard>
            <GroupFormingHost />
          </GameGuard>
        </Route>

        <Route exact path="/groupforming/:groupId/guest">
          <GameGuard>
            <GroupFormingGuest buttonLabel={"Ready"} />
          </GameGuard>
        </Route>

        <Route exact path="/ingredients/:groupId">
          <GameGuard>
            <Ingredient />
          </GameGuard>
        </Route>

        <Route exact path="/invitation/:groupId">
          <GameGuard>
            <GroupFormingGuest buttonLabel={"Join"} />
          </GameGuard>
        </Route>

        <Route exact path="/solo">
          <GameGuard>
            <IngredientSolo />
          </GameGuard>
        </Route>

        <Route exact path="/ingredientsvoting/:groupId">
          <GameGuard>
            <IngredientsVoting />
          </GameGuard>
        </Route>

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
