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
import GroupFormingGuest from "components/views/GroupFormingGuest";
import GroupFormingHost from "components/views/GroupFormingHost";
import Ingredient from "components/views/Ingredient";
import IngredientSolo from "components/views/IngredientSolo";


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
          <GameGuard>
            <Profile />
          </GameGuard>
        </Route>

        <Route path="/group-creation">
          <GameGuard>
            <GroupCreation />
          </GameGuard>
        </Route>

        <Route path="/final">
          <GameGuard>
            <Final />
          </GameGuard>
        </Route>

        <Route exact path="/users/:userId">
          <GameGuard>
            <Profile />
          </GameGuard>
        </Route>

        <Route exact path="/groupforming/host/:userId">
          <GameGuard>
            <GroupFormingHost />
          </GameGuard>
        </Route>

        <Route exact path="/groupforming/guest/:userId">
          <GameGuard>
            <GroupFormingGuest />
          </GameGuard>
        </Route>

        <Route exact path="/ingredients/:userId">
          <GameGuard>
            <Ingredient />
          </GameGuard>
        </Route>

        <Route exact path="/invitation/:groupName">
          <GameGuard>
            <GroupFormingGuest />
          </GameGuard>
        </Route>

        <Route exact path="/solo">
          <GameGuard>
            <IngredientSolo />
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
