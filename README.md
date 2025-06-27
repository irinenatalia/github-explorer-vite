## Github Explorer App: Setup Guide

This is the guide to setup Github Explorer app environment, built in React + Typescript + Vite. 

- Run ``npm install`` to install dependencies
- Make sure you already have Github personal access token since this project is calling Github API, read the guide [here](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens)
- Create an .env file, add your personal access token into this line
    ```
    VITE_GITHUB_TOKEN=your_personal_access_token
    ```
- Run ``npm run dev`` and copy the URL into browser
- Happy exploring