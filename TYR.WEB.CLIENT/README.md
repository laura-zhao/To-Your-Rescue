# Getting Started with TYR React App

This To Your Rescue project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).
Main idea to be followed in this project development will be Seperation Of Concerns(SoC). The related Model, View, and Controller will form one component.
Router, Store and Auth will be seperated from other components to maintain SoC.

## Project Organisation

We are following a minimalist project organization keeping pages/features in components and will add hoc dir if need be as TYR has pages like Animals or PCO where PCO can be accessed within other pages/components like Animals as a component as done in legacy app. [Reboot Studio](https://reboot.studio/blog/folder-structures-to-organize-react-project/) is the reference to the good practices of defining a folder structure for react projects.

## ESLint - AIRBNB Configuration
AirBNB Linting/coding style is enforced on the project. [AirBnb Github](https://github.com/airbnb/javascript)

## Packages

This project overall utilizes below mentioned packages. There resource locations have been mentioned with their descriptions.

### ANTD

ANT Design is an open source library which has UI components designed to be used in library like React. [Components Ref](https://ant.design/components).

## Available Scripts

In the project directory, you can run:

### `yarn start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `yarn test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `yarn build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `yarn eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
