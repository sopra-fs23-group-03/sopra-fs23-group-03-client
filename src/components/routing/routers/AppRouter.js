import { BrowserRouter, Redirect, Route, Switch } from "react-router-dom";
import { GameGuard } from "components/routing/routeProtectors/GameGuard";
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
import Dashboard from "components/views/Dashboard";
import IngredientsFinal from "components/views/IngredientsFinal";
import Lobby from "components/views/Lobby";
import GroupGuard from "components/routing/routeProtectors/GroupGuard";

/**
 * Main router of your application.
 * In the following class, different routes are rendered. In our case, there is a Login Route with matches the path "/login"
 * and another Router that matches the route "dashboard".
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
        <Route path="/dashboard">
          <GameGuard>
            <Dashboard />
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

        <Route exact path="/users/:userId">
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
            <GroupGuard state="FINAL">
              <Final />
            </GroupGuard>
          </GameGuard>
        </Route>

        <Route exact path="/groupforming/:groupId/guest">
          <GameGuard>
            <GroupGuard state="GROUPFORMING">
              <GroupFormingGuest
                exitbuttonLabel={"Exit Group"}
                buttonLabel={"Ready"}
              />
            </GroupGuard>
          </GameGuard>
        </Route>

        <Route exact path="/groupforming/lobby/host">
          <GameGuard>
            <Lobby
              groupState={"INGREDIENTENTERING"}
              message={"Enjoy the event!"}
              nextRoute={"/ingredients/:groupId"}
            />
          </GameGuard>
        </Route>

        <Route exact path="/groupforming/:groupId/host">
          <GameGuard>
            <GroupGuard state="GROUPFORMING">
              <GroupFormingHost />
            </GroupGuard>
          </GameGuard>
        </Route>

        <Route path="/groupforming/lobby">
          <GameGuard>
            <Lobby
              groupState={"INGREDIENTENTERING"}
              message={
                "You successfully registered for this event! Wait for other friends to join..."
              }
              nextRoute={"/ingredients/:groupId"}
            />
          </GameGuard>
        </Route>

        <Route exact path="/invitation/:groupId">
          <GameGuard>
            <GroupFormingGuest
              exitbuttonLabel={"Cancel"}
              buttonLabel={"Join"}
            />
          </GameGuard>
        </Route>

        <Route exact path="/solo">
          <GameGuard>
            <IngredientSolo />
          </GameGuard>
        </Route>

        <Route exact path="/ingredientsfinal/:groupId">
          <GameGuard>
            <IngredientsFinal />
          </GameGuard>
        </Route>

        <Route path="/ingredients/lobby">
          <GameGuard>
            <Lobby
              groupState={"INGREDIENTVOTING"}
              message={
                "We took note of your ingredients! Wait for the other members to complete this phase..."
              }
              nextRoute={"/ingredientsvoting/:groupId"}
            />
          </GameGuard>
        </Route>

        <Route exact path="/ingredients/:groupId">
          <GameGuard>
            <GroupGuard state="INGREDIENTENTERING">
              <Ingredient />
            </GroupGuard>
          </GameGuard>
        </Route>

        <Route path="/ingredientsvoting/lobby">
          <GameGuard>
            <Lobby
              groupState={"FINAL"}
              message={
                "You successfully submitted your preferences!Wait for the other members to vote...."
              }
              nextRoute={`/ingredientsfinal/:groupId`}
            />
          </GameGuard>
        </Route>

        <Route exact path="/ingredientsvoting/:groupId">
          <GameGuard>
            <GroupGuard state="INGREDIENTVOTING">
              <IngredientsVoting />
            </GroupGuard>
          </GameGuard>
        </Route>

        <Route exact path="/">
          <Redirect to="/dashboard" />
        </Route>
      </Switch>
    </BrowserRouter>
  );
};

/*
 * Don't forget to export your component!
 */
export default AppRouter;
