# CollaborEat

![CollaborEat logo](src/assets/logo.jpg)

[Deployed Server](https://sopra-fs23-group-03-server.oa.r.appspot.com/)

[Deployed Client](https://sopra-fs23-group-03-client.oa.r.appspot.com/)

CollaborEat is an online application where people can get together to plan a meal. Users can create an account and specify their allergies, favorite cuisines, and dietary preferences. They have an option to go solo and get a random recipe based on their profile. They can also opt to host a group and invite other users to plan a meal together. Guests can join groups by accepting an invitation to one, but they can also request to join an existing group in their group-forming stage. Once a group is formed and all the guests are ready, the host can start the meal-finding process. All members of the group must enter the ingredients they want to contribute to the upcoming meal, and once the information is gathered everyone must rate the potential contributions to the meal. Finally, a recipe will be chosen based on the final ingredients everyone has agreed upon and the members' allergies. In case all ingredients are voted out by the members, or all their ingredients match the allergies of group members, they will receive a random recipe based on the allergies of the group members. On the result page, a photo of the chosen meal, the instructions, and the necessary ingredients will be displayed to the members of the group and the rest is up to them! 

### Motivation
Our motivation for this project was to aid fellow students in planning their meals with food they might already have at home. With our application we aim to reduce food waste and help in saving money and time for our users, but we also hope to inspire people to get creative with their meals and to get together to bond and have fun cooking together.

## Technologies
- React
- Google Cloud (deployment)

TODO: add more?

lany- I just looked up the stack on the assignmentsheet 1 ^^' for the backend I knew what of that to add, but here I'm not certain :p -lany

## High-level components

TODO:
Identify your project’s 3-5 main components. What is their role?
How are they correlated? Reference the main class, file, or function in the README text
with a link.

## External API
The [spoonacular API](https://spoonacular.com/food-api) is used to retrieve the final recipes based on the given ingredients, intolerances, favourite cuisines and dietary preferences. The ingredients, which the user can choose to contribute to the meal, are also retrieved from the API to avoid the need for natural language processing in the backend. Furthermore, the intolerances (or allergies), favourite cuisines and dietary preferences used to personalize the profiles are retrieved from spoonacular to later match the requests to the API.

We distinguish between the recipe retrieval for a.) groups and b.) for single users (*solo* option). 
For every displayed final recipe, two calls are needed: First, to retrieve the recipe suggestion based on a.) the ingredients with respect to the intolerances b.) intolerances, dietary preferences and favourite cuisines. With the second call, more detailed information such as image, instructions and ready-in-minutes are retrieved. For the first call we use the complex search provided by spoonacular, with the following additions: `ignorePantry=true` (we assume that pantry items are at home already), `type=main course` (we give only recipes for main courses), `sort=max-used-ingredients` (we first maximise the used ingredients, instead of minimising the additionally needed ones). The second call uses the `api.spoonacular.com/recipes/id/information` call to retrieve the additional information on the recipe. 

## Disclaimers

### Users don't leave the process
We assume that all group members stay online and continue the meal-planning process together. If one member is not moving along in the process, all other members of the group get stuck at that point and would have to delete their local storage and create a new account in order to use our services.

TODO: add more? The one in the report?

### Web Browser
Our application was developed and tested mostly using [Google Chrome](https://www.google.com/chrome/). We therefore recommend you download and install Chrome to have the best experience with our application.

### Database
We have kept the in-memory H2 database of the template project provided by the SoPra FS23 Team. This means that whenever the server gets terminated, e.g. in our deployment due to inactivity, the database gets destroyed with it.

### Server Instance
In a first interaction with our deployed application, upon a server instance being created, you might experience our application stating that the server cannot be reached. This will resolve itself once the server has started properly. In order to avoid issues with multiple instances of the server we have also limited the maximum number of instances to one. This means, that our application does not scale for too many clients.


## Illustrations and main user flow
- **Landing Page**: This page provides an overview of all (active) users, current groups in various states of planning (more see below) and offers two option which lead to a recipe. Once the go-solo option, which gives recipe suggestions without typing in ingredients, but taking into account all personal information in the user profile. The other option is creating a group (which makes the user a host) and to start the group planning process. 
<img width="828" alt="grafik" src="https://github.com/sopra-fs23-group-03/sopra-fs23-group-03-client/assets/91547040/40631e73-b9e1-4e16-aff6-d147b23119a0">

As long as a group is open to join, one sees the "join" button next to it. When one requested to join, a tick is shown. As soon as the requested group moves on and the join request was denied, one sees a stop sign. 
<img width="393" alt="grafik" src="https://github.com/sopra-fs23-group-03/sopra-fs23-group-03-client/assets/91547040/ca4596f9-d30c-4f2b-a070-6a8ebfb6ced1">


- **Profile**: In the personal profile a user can change the name and passwort. More interesting though are the options to define diet preferences, allergies and favourite cuisines. This information will taken into acount during the recipe selection.
<img width="595" alt="grafik" src="https://github.com/sopra-fs23-group-03/sopra-fs23-group-03-client/assets/91547040/6f974ed8-26fe-4e87-85e5-a6f4c9d0c92e">


- **Notification Bar**: The bar includes a button to reach the profile, the notifications and the Landing Page. It also displays the logout functionality. In case a user got invited to a group, the notification "bell" will show a red node and upon clicking present the group the invitation came from as well as further possible actions. At certain stages within the group planning process, the notification bar is not shown, as we do want the user to focus on the planning process and exclude the option to logout.
<img width="1090" alt="grafik" src="https://github.com/sopra-fs23-group-03/sopra-fs23-group-03-client/assets/91547040/b0622112-71db-4bd0-9cd1-da823f0a958c">
<img width="662" alt="grafik" src="https://github.com/sopra-fs23-group-03/sopra-fs23-group-03-client/assets/91547040/95be40bc-8ba3-4117-b467-6b3ce3c24bb5">


- **Creating a group and starting the planning process (host view)**:
Upon clicking on "Form Group", one decided to be a host and starts the planning process with this screen: <img width="598" alt="grafik" src="https://github.com/sopra-fs23-group-03/sopra-fs23-group-03-client/assets/91547040/50deca5e-9fe4-4f3b-9f41-5b89b59abf5a">

Here the future host sees all active and available users (users which are not actively taking part of another planning process) to invite them. Only upon pressing "continue", the respective invited users get a notification. 
Once the guests confirmed they are "ready", their names are highlighted in green and the host can finally start the planning process.<img width="565" alt="grafik" src="https://github.com/sopra-fs23-group-03/sopra-fs23-group-03-client/assets/91547040/3eb74b6b-aae3-43fa-bf85-9df999a88165">


- **Starting the planning process (guest view)**:
Upon accepting the invitation send by a host/the acceptance of a join request, a guest has to confirm again that one is ready to start the process. We planned it in that way, because once a group is in the planning process, it is needed that every one actively participates. Otherwise the whole group gets stuck. In this view "Gisela" still has the option to leave the group. <img width="595" alt="grafik" src="https://github.com/sopra-fs23-group-03/sopra-fs23-group-03-client/assets/91547040/7f9f8299-1091-43b2-b3a3-7f469365bbea">


- **Waiting pages**:
Several waiting pages allign the group process and inform the users about the next steps. 
<img width="652" alt="grafik" src="https://github.com/sopra-fs23-group-03/sopra-fs23-group-03-client/assets/91547040/03d919a3-4e75-4ee8-949b-7385d26447d2">
<img width="639" alt="grafik" src="https://github.com/sopra-fs23-group-03/sopra-fs23-group-03-client/assets/91547040/376dee0e-6315-4ca5-99fc-b1ba6755b9f5">
<img width="614" alt="grafik" src="https://github.com/sopra-fs23-group-03/sopra-fs23-group-03-client/assets/91547040/67dc064d-47ca-467f-bb1d-99e23c881f4e">
<img width="626" alt="grafik" src="https://github.com/sopra-fs23-group-03/sopra-fs23-group-03-client/assets/91547040/d879ad91-d888-4e03-a038-bcd72327ad9f">


- **Adding Ingredients**:
This step retrieves the ingredients used by the external API. This is why a user will see certain suggestions based on his typed letters. One can only submit those proposed ingredients. At this point, double entries made by the user are possible, but won't be taken into acount later. For simplicity reasons, we ignore quantity measurements in general in this app.  Every user has to submit at least one ingredient to be able to continue. <img width="484" alt="grafik" src="https://github.com/sopra-fs23-group-03/sopra-fs23-group-03-client/assets/91547040/4d1f11a2-f70a-46e5-b639-b77217ea9c31">


- **Rating the ingredients**:
<img width="467" alt="grafik" src="https://github.com/sopra-fs23-group-03/sopra-fs23-group-03-client/assets/91547040/09ef2fcd-072e-4a57-8806-9dee6a23f137">

After the rating, all group members see the final ingredients being left. In case there are no ingredients left, an info text is shown. <img width="475" alt="grafik" src="https://github.com/sopra-fs23-group-03/sopra-fs23-group-03-client/assets/91547040/426970c8-e389-4596-93d4-109526eb2a52">



- **Final Recipe**:



## Roadmap
See the [Future Work](https://github.com/orgs/sopra-fs23-group-03/projects/1/views/5?filterQuery=milestone%3A%22Future+Work%22) in our Project Board for the functionality we'd plan to develop further in our application. Here are the three most interesting additions we'd like to implement:

- **The distribution of missing ingredients**: While we maximize the ingredients from the final list of ingredients to be used in the recipe, it can happen, that the recipe requires ingredients, that are missing. In a next step, we'd implement a way to decide/plan which of the members of the group will bring which of the missing ingredients. Related user story: [#24](https://github.com/sopra-fs23-group-03/sopra-fs23-group-03-server/issues/24)

- **Additional decision logic**: The rating of the ingredients is implemented with a majority-vote-logic. In a next step, we'd add additional decision logics to this step, e.g. a point-distribution logic. Related user story: [#22](https://github.com/sopra-fs23-group-03/sopra-fs23-group-03-server/issues/22)

- **Choose from multiple recipes**: A group will get one final recipe at the end of the process, if the spoonacular API had returned multiple recipes, we choose one at random for the group. In a next step we'd give the group all options that the spoonacular API provides and let the host choose one of them as the final recipe. Related user story: [#25](https://github.com/sopra-fs23-group-03/sopra-fs23-group-03-server/issues/25)

## Authors and acknowledgment
- Kalliopi Papadaki - [KallPap](https://github.com/KallPap)
- Orestis Bollano - [OrestisBollano](https://github.com/OrestisBollano)
- Ann-Kathrin Hedwig Sabina Kübler - [akkuebler](https://github.com/akkuebler)
- Chiara Letsch - [chiaralentsch](https://github.com/chiaralentsch)
- Lany Dennise Weizenblut Oseguera - [wlany](https://github.com/wlany)

## License
Apache License 2.0

## Launch & Deployment
TODO:
Write down the steps a new developer joining your team would have to take to get started with your application. What commands are required to build and run your project locally? How can they run the tests? Do you have external dependencies or a database that needs to be running? How can they do releases?

lany- I put here what used to be in the README from the template. adapt what's necessary :) -lany

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

#### Testing
Testing is optional, and you can run the tests with `npm run test`.
This launches the test runner in an interactive watch mode. See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

> For macOS user running into a 'fsevents' error: https://github.com/jest-community/vscode-jest/issues/423

#### Build
Finally, `npm run build` builds the app for production to the `build` folder.<br>
It correctly bundles React in production mode and optimizes the build for the best performance: the build is minified, and the filenames include hashes.<br>

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### Learn More

To learn React, check out the [React documentation](https://reactjs.org/).

> Thanks to Lucas Pelloni and Kyrill Hux for working on the template on how to launch & deploy

