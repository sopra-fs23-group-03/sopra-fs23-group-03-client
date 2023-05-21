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
import GoSoloFinal from "components/views/GoSoloFinal";
import IngredientsVoting from "components/views/IngredientsVoting";
import Dashboard from "components/views/Dashboard";
import IngredientsFinal from "components/views/IngredientsFinal";
import Lobby from "components/views/Lobby";
import UserStateGuard from "components/routing/routeProtectors/UserStateGuard";

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
        <Route exact path="/dashboard">
          <GameGuard>
            <UserStateGuard state="NOGROUP">
              <Dashboard />
            </UserStateGuard>
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
            <UserStateGuard state="NOGROUP">
              <Profile />
            </UserStateGuard>
          </GameGuard>
        </Route>

        <Route exact path="/users/:userId">
          <GameGuard>
            <UserStateGuard state="NOGROUP">
              <Profile />
            </UserStateGuard>
          </GameGuard>
        </Route>

        <Route path="/group-creation">
          <GameGuard>
            {/* <UserStateGuard state="NOGROUP" > */}
            <GroupCreation />
            {/* </UserStateGuard> */}
          </GameGuard>
        </Route>

        <Route exact path="/recipe/:groupId">
          <GameGuard>
            <UserStateGuard state="RECIPE">
              <Final />
            </UserStateGuard>
          </GameGuard>
        </Route>

        <Route exact path="/groupforming/:groupId/guest">
          <GameGuard>
            <UserStateGuard state="GROUPFORMING_GUEST">
              <GroupFormingGuest
                exitbuttonLabel={"Exit Group"}
                buttonLabel={"Ready"}
              />
            </UserStateGuard>
          </GameGuard>
        </Route>

        <Route exact path="/groupforming/host/lobby">
          <GameGuard>
            <UserStateGuard state="GROUPFORMING_HOST_LOBBY">
              <Lobby
                groupState={"INGREDIENTENTERING"}
                message={"Now it's time to check out your fridge and pantry! What would you like to contribute?"}
                nextRoute={"/ingredients/:groupId"}
              />
            </UserStateGuard>
          </GameGuard>
        </Route>

        <Route exact path="/groupforming/:groupId/host">
          <GameGuard>
            <UserStateGuard state="GROUPFORMING_HOST">
              <GroupFormingHost />
            </UserStateGuard>
          </GameGuard>
        </Route>

        <Route path="/groupforming/lobby">
          <GameGuard>
            <UserStateGuard state="GROUPFORMING_LOBBY">
              <Lobby
                groupState={"INGREDIENTENTERING"}
                message={
                  "You successfully registered for this event! Wait for other friends to join..."
                }
                nextRoute={"/ingredients/:groupId"}
              />
            </UserStateGuard>
          </GameGuard>
        </Route>

        <Route exact path="/invitation/:groupId">
          <GameGuard>
            <UserStateGuard state="NOGROUP">
              <GroupFormingGuest
                exitbuttonLabel={"Cancel"}
                buttonLabel={"Join"}
              />
            </UserStateGuard>
          </GameGuard>
        </Route>

        <Route exact path="/solo">
          <GameGuard>
            <UserStateGuard state="NOGROUP">
              <GoSoloFinal />
            </UserStateGuard>
          </GameGuard>
        </Route>

        <Route exact path="/ingredientsfinal/:groupId">
          <GameGuard>
            <UserStateGuard state="FINAL">
              <IngredientsFinal />
            </UserStateGuard>
          </GameGuard>
        </Route>

        <Route path="/ingredients/lobby">
          <GameGuard>
            <UserStateGuard state="INGREDIENTENTERING_LOBBY">
              <Lobby
                groupState={"INGREDIENTVOTING"}
                message={
                  "We took note of your ingredients! Wait for the other members to complete this phase..."
                }
                nextRoute={"/ingredientvoting/:groupId"}
              />
            </UserStateGuard>
          </GameGuard>
        </Route>

        <Route exact path="/ingredients/:groupId">
          <GameGuard>
            <UserStateGuard state="INGREDIENTENTERING">
              <Ingredient />
            </UserStateGuard>
          </GameGuard>
        </Route>

        <Route path="/ingredientvoting/lobby">
          <GameGuard>
            <UserStateGuard state="INGREDIENTVOTING_LOBBY">
              <Lobby
                groupState={"FINAL"}
                message={
                  "You successfully submitted your preferences! Wait for the other members to vote..."
                }
                nextRoute={`/ingredientsfinal/:groupId`}
              />
            </UserStateGuard>
          </GameGuard>
        </Route>

        <Route exact path="/ingredientvoting/:groupId">
          <GameGuard>
            <UserStateGuard state="INGREDIENTVOTING">
              <IngredientsVoting />
            </UserStateGuard>
          </GameGuard>
        </Route>

        <Route path="/final/lobby">
          <GameGuard>
            <UserStateGuard state="FINAL_LOBBY">
              <Lobby
                groupState={"RECIPE"}
                message={"We’re looking for the best recipe for your meal!"}
                nextRoute={`/recipe/:groupId`}
              />
            </UserStateGuard>
          </GameGuard>
        </Route>

        <Route path="/">
          <UserStateGuard state="NOGROUP">
            <Redirect to="/dashboard" />
          </UserStateGuard>
        </Route>
      </Switch>
    </BrowserRouter>
  );
};

/*
 * Don't forget to export your component!
 */
export default AppRouter;
