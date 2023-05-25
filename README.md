# CollaborEat

![CollaborEat logo](src/assets/logo.jpg)

[Deployed Server](https://sopra-fs23-group-03-server.oa.r.appspot.com/)

[Deployed Client](https://sopra-fs23-group-03-client.oa.r.appspot.com/)

CollaborEat is an online application where people can get together to plan a meal. Users can create an account and specify their allergies, favorite cuisines, and dietary preferences. They have an option to go solo and get a random recipe based on their profile. They can also opt to host a group and invite other users to plan a meal together. Guests can join groups by accepting an invitation to one, but they can also request to join an existing group in their group-forming stage. Once a group is formed and all the guests are ready, the host can start the meal-finding process. All members of the group must enter the ingredients they want to contribute to the upcoming meal, and once the information is gathered everyone must rate the potential contributions to the meal. Finally, a recipe will be chosen based on the final ingredients everyone has agreed upon and the members' allergies. In case all ingredients are voted out by the members, or all their ingredients match the allergies of group members, they will receive a random recipe based on the allergies of the group members. On the result page, a photo of the chosen meal, the instructions, and the necessary ingredients will be displayed to the members of the group and the rest is up to them! 

### Motivation
Our motivation for this project was to aid fellow students in planning their meals with food they might already have at home. With our application we aim to reduce food waste and help in saving money and time for our users, but we also hope to inspire people to get creative with their meals and to get together to bond and have fun cooking together.

## Technologies
- [React](https://react.dev/)
- [npm](https://www.npmjs.com/)
- [node.js](https://nodejs.org/)
- [JavaScript](https://www.javascript.com/)
- [Google Cloud](https://cloud.google.com/)
- [GitHub](https://github.com/)

## High-level components

### [Dashboard](https://github.com/sopra-fs23-group-03/sopra-fs23-group-03-client/blob/main/src/components/views/Dashboard.js)
- Roles: Display existing groups, display online and offline existing users, display new invitations through a notification.
- Relations: From the dashboard the user can get into a group by accepting an invitation from a new group or by sending a join request to an existing group. The user can also opt for creating their own group or going solo.

### [Profile](https://github.com/sopra-fs23-group-03/sopra-fs23-group-03-client/blob/main/src/components/views/Profile.js)
- Roles: Display username, diet preference, allergies and favourite cuisine of the user also allowing him/her to modify them. 
- Relations: From the profile the user can either go back to the landing page or receive an invitation to a group in the notification section.

### [Ingredients-Entering Page](https://github.com/sopra-fs23-group-03/sopra-fs23-group-03-client/blob/main/src/components/views/Ingredient.js)
- Roles: Allow users to type in the ingredients they have in their fridge or paintry. The text field provides suggestions of possible ingredients.
- Relations: As soon as every member of the group typed in their ingredients, the user is directed to the voting page.

### [Voting Page](https://github.com/sopra-fs23-group-03/sopra-fs23-group-03-client/blob/main/src/components/views/Ingredient.js)
- Roles: Allow users to vote the overall list of typed-in ingredients through a majority vote system. They can express their opinion by selecting either yes, no, or indifferent.
- Relations: As soon as every member of the group expressed their votes the user is directed to the final ingredients page that summarizes the outcome of the majority voting.

### [Final Recipe](https://github.com/sopra-fs23-group-03/sopra-fs23-group-03-client/blob/main/src/components/views/Final.js)
- Roles: Display image, title, preparation time, and instructions of the suggested recipe as well as the ingredients the users need to contribute with and those they need to buy.
- Relations: From the final recipe page you can go back to the landing page and be able to join a new group or go solo.

## External API
The [spoonacular API](https://spoonacular.com/food-api) is used to retrieve the final recipes based on the given ingredients, intolerances, favourite cuisines and dietary preferences. The ingredients, which the user can choose to contribute to the meal, are also retrieved from the API to avoid the need for natural language processing in the backend. Furthermore, the intolerances (or allergies), favourite cuisines and dietary preferences used to personalize the profiles are retrieved from spoonacular to later match the requests to the API.

We distinguish between the recipe retrieval for a.) groups and b.) for single users ("Go Solo" option). 
For every displayed final recipe, two calls are needed: First, to retrieve the recipe suggestion based on a.) the ingredients with respect to the intolerances b.) intolerances, dietary preferences and favourite cuisines. With the second call, more detailed information such as image, instructions and ready-in-minutes are retrieved. For the first call we use the complex search provided by spoonacular, with the following additions: `ignorePantry=true` (we assume that pantry items are at home already), `type=main course` (we give only recipes for main courses), `sort=max-used-ingredients` (we first maximise the used ingredients, instead of minimising the additionally needed ones). The second call uses the `api.spoonacular.com/recipes/id/information` call to retrieve the additional information on the recipe. 

## Disclaimers

### Users don't leave the process
We assume that all group members stay online and continue the meal-planning process together. If one member is not moving along in the process, all other members of the group get stuck at that point and would have to delete their local storage and create a new account in order to use our services. 

### Web Browser
Our application was developed and tested mostly using the desktop version of [Google Chrome](https://www.google.com/chrome/). We therefore recommend you download and install Chrome to have the best experience with our application. Additionally we'd like to warn you at this point that you might want to adjust the aspect ratio of your browser in order to see all of our screens. Check our illustrations in the [README.md](https://github.com/sopra-fs23-group-03/sopra-fs23-group-03-client/blob/main/README.md) of our client repository if you are unsure whether you see the whole screen or not.

### Database
We have kept the in-memory H2 database of the template project provided by the SoPra FS23 Team. This means that whenever the server gets terminated, e.g. in our deployment due to inactivity, the database gets destroyed with it.

### Server Instance
In a first interaction with our deployed application, upon a server instance being created, you might experience our application stating that the server cannot be reached. This will resolve itself once the server has started properly. In order to avoid issues with multiple instances of the server we have also limited the maximum number of instances to one. This means, that our application does not scale for too many clients.

## Illustrations and main user flow

### Landing Page
This page provides an overview of all users (including their online-status), current groups in various states of planning (more see below), and offers two options which lead to a recipe. One is the go-solo option, which gives recipe suggestions without typing in ingredients, but taking into account all personal information in the user profile. The other option is creating a group (which makes the user a host) and to start the group planning process. 

<img width="395" alt="grafik" src="https://github.com/sopra-fs23-group-03/sopra-fs23-group-03-client/assets/91547040/6384d1b2-a489-4d21-919b-5d083624b114"> <img width="397" alt="grafik" src="https://github.com/sopra-fs23-group-03/sopra-fs23-group-03-client/assets/91547040/a3a48a92-fb7b-46f5-b9db-39dbeb09b7e0">

As long as a group is open to join, users see the "Request" button next to it. When one requested to join, a tick is shown. If the requested group moves on and the join request was denied or ignored, one sees a stop sign. 

### Profile
In the personal profile a user can change the name and password. More interesting though are the options to define diet preferences, allergies, and favourite cuisines. This information will taken into acount during the recipe selection.

<img width="299" alt="grafik" src="https://github.com/sopra-fs23-group-03/sopra-fs23-group-03-client/assets/91547040/7272711e-8080-4904-87d6-243235626f94">

### Navigation Bar
The bar includes a button to reach the profile, the notifications, and the Landing Page. It also displays the logout functionality. In case a user got invited to a group, the notification bell will show a red node and upon clicking present the group the invitation came from as well as further possible actions. At certain stages within the group planning process, the notification bar is not shown, as we want the user to focus on the planning process and e.g., exclude the option to logout.

<img width="452" alt="grafik" src="https://github.com/sopra-fs23-group-03/sopra-fs23-group-03-client/assets/91547040/78cfec31-496d-471b-834c-dac9ae911957">

### Creating a group and starting the planning process (host view)
Upon clicking on "Form Group", one decided to be a host and starts the planning process with this screen:

<img width="299" alt="grafik" src="https://github.com/sopra-fs23-group-03/sopra-fs23-group-03-client/assets/91547040/1d9c9ffa-5726-4359-b6c5-eba437859c08">

Here the future host sees all online and available users (users which are not actively taking part of another planning process) to invite them. Only upon pressing "continue", the respective invitations are sent and the potential guests get a notification. 
Once the guests confirmed that they are "ready", their names are highlighted in green and the host can finally start the planning process.
<img width="452" alt="grafik" src="https://github.com/sopra-fs23-group-03/sopra-fs23-group-03-client/assets/91547040/56be5d2d-3abe-4043-a342-fe7097d830a8">

### Starting the planning process (guest view)
Upon accepting the invitation send by a host or the acceptance of a join request by the guest themselves, a guest has to confirm again that they are ready to start the process. We planned it in this way, because once a group is in the planning process, it is important that every member actively participates. Otherwise the whole group gets stuck.

### Adding Ingredients
This step retrieves the ingredients used by the external API. This is why a user will see certain suggestions based on their typed letters. One can only submit the proposed ingredients. At this point, double entries made by the user are possible, but won't be taken into acount later. For simplicity reasons, we ignore quantity measurements in general in this app. Every user has to submit at least one ingredient to be able to continue.

<img width="452" alt="grafik" src="https://github.com/sopra-fs23-group-03/sopra-fs23-group-03-client/assets/91547040/85502a9e-7c35-44c8-9f49-c0d5fb69a8ed">

### Rating the ingredients
<img width="452" alt="grafik" src="https://github.com/sopra-fs23-group-03/sopra-fs23-group-03-client/assets/91547040/7d225116-c617-4b09-9783-aa19e1a2f67b">

After the rating, all group members see the final ingredients left. In case there are no ingredients left, an info text is shown.

### Final Recipe
<img width="452" alt="grafik" src="https://github.com/sopra-fs23-group-03/sopra-fs23-group-03-client/assets/91547040/e516d3c7-c4d8-48f2-9ff0-698dcc506b30">

## Roadmap
See the [Future Work](https://github.com/orgs/sopra-fs23-group-03/projects/1/views/5?filterQuery=milestone%3A%22Future+Work%22) in our Project Board for the functionality we'd plan to develop further in our application. Here are the three most interesting additions we'd like to implement:

- **The distribution of missing ingredients**: While we maximize the ingredients from the final list of ingredients to be used in the recipe, it can happen, that the recipe requires ingredients, that are missing. In a next step, we'd implement a way to decide/plan which of the members of the group will bring which of the missing ingredients. Related user story: [#24](https://github.com/sopra-fs23-group-03/sopra-fs23-group-03-server/issues/24)

- **Additional decision logic**: The rating of the ingredients is implemented with a majority-vote-logic. In a next step, we'd add additional decision logics to this step, e.g. a point-distribution logic. Related user story: [#22](https://github.com/sopra-fs23-group-03/sopra-fs23-group-03-server/issues/22)

- **Choose from multiple recipes**: A group will get one final recipe at the end of the process, if the spoonacular API had returned multiple recipes, we choose one at random for the group. In a next step we'd give the group all options that the spoonacular API provides and let the host choose one of them as the final recipe. Related user story: [#25](https://github.com/sopra-fs23-group-03/sopra-fs23-group-03-server/issues/25)

## Authors and acknowledgment
- Kalliopi Papadaki - [KallPap](https://github.com/KallPap)
- Orestis Bollano - [OrestisBollano](https://github.com/OrestisBollano)
- Ann-Kathrin Hedwig Sabina Kübler - [akkuebler](https://github.com/akkuebler)
- Chiara Lentsch - [chiaralentsch](https://github.com/chiaralentsch)
- Lany Dennise Weizenblut Oseguera - [wlany](https://github.com/wlany)

## License
Apache License 2.0

## Launch & Deployment

### Getting started

Read and go through these Tutorials. It will make your life easier:)

- Read the React [Docs](https://reactjs.org/docs/getting-started.html)
- Do this React [Getting Started](https://reactjs.org/tutorial/tutorial.html) Tutorial (it doesn’t assume any existing React knowledge)
- Get an Understanding of [CSS](https://www.w3schools.com/Css/), [SCSS](https://sass-lang.com/documentation/syntax), and [HTML](https://www.w3schools.com/html/html_intro.asp)!

Next, there are two other technologies that you should look at:

* [react-router-dom](https://reacttraining.com/react-router/web/guides/quick-start) offers declarative routing for React. It is a collection of navigational components that fit nicely with the application. 
* [react-hooks](https://reactrouter.com/web/api/Hooks) let you access the router's state and perform navigation from inside your components.

### Prerequisites and Installation
For your local development environment, you will need Node.js. You can download it [here](https://nodejs.org). All other dependencies, including React, get installed with:

```npm install```

Run this command before you start your application for the first time. Next, you can start the app with:

```npm run dev```

Now you can open [http://localhost:3000](http://localhost:3000) to view it in the browser.

Notice that the page will reload if you make any edits. You will also see any lint errors in the console (use Google Chrome).

#### Build
Finally, `npm run build` builds the app for production to the `build` folder.<br>
It correctly bundles React in production mode and optimizes the build for the best performance: the build is minified, and the filenames include hashes.<br>

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### Learn More

To learn React, check out the [React documentation](https://reactjs.org/).

> Thanks to Lucas Pelloni and Kyrill Hux for working on the template on how to launch & deploy

