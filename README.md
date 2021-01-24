# my-dukaan

## Install dependencies

By default, dependencies were installed when this application was generated.
Whenever dependencies in `package.json` are changed, run the following command:

```sh
npm install
```

## Setup base project

Create a .env file in the src directory
```
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=postgrestest
DB_DATABASE=my-dukaan
DB_SCHEMA=main

FIREBASE_API_KEY=AIzaSyD_P1qQkOWgOvpncCNod-Lmqi0R3DQVccs
GOOGLE_DYNAMIC_LINK_GENERATOR_URI=https://firebasedynamiclinks.googleapis.com/v1/shortLinks?key=
SERVER_URL=https://abc.com
FIREBASE_DYNAMIC_LINK_PREFIX=https://testmydukaan.page.link/
ANDROID_PACKAGE_NAME=com.example.myapp
```

Add this to the .env file. (Modify the data according to your local setup)

To get the database up and running, execute the command
```npm run db-migrate```

This will update your database schema and seed some data for app to work properly.

## Run the application

```sh
npm start
```

The database architecture as of now follows this pattern

![my-dukaan](https://user-images.githubusercontent.com/20533190/105642565-83988d00-5eb0-11eb-9d7f-5fa04c56fe4a.png)


In the application there is a place when store information could be shared via a url. It displays a warning as shown in the below attached screenshot. It is because this project does not have any UI client to link to. Once the UI clients are up it will redirect to respective apps. 
For android it will redirect to the application and to a specific page inside (based on config). If the app is not installed it will take you to the play store.
Same behavious could be seen in IOS.
For web it will redirect you to the website (internal routing could be manages on website itself).

![image](https://user-images.githubusercontent.com/20533190/105642720-5bf5f480-5eb1-11eb-9f3b-a43bb40adb47.png)

The authentication used is JWT based. 
The authorization is permission based. This means that every action is based on permissions which are added to the database according to the level of user.

Also basic security items are being taken care of like hiding headers and rate limiting.
