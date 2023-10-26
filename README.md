## Simple registration form

### Start project
- **This project only supports local database**
- install PostgreSql and create an empty table
- set up your environment variables in the .env file

* npm i - to install node modules
  
* npm run start - start local server
  
* npm run dev - start local server and listen (server updates automatically after update)

### Libraries
- express - serve the application
- bcrypt - hash user passwords to make them more secure
- express-session - store session details in a session cookie object
- express-flash - display flash messages to the user
- passport - authenticate users when they log in
- passport-local - implement a local authentication strategy for our application
- dotenv - enable use of .env files
- pg - enable connection to postgreSql
- ejs - enable usage of embedded javascript in html

### Features
The project includes a simple form with register and login functionalities. It uses PostgreSql database.  
  
The register form consists of `name`, `email`, `password` and `confirm password` fields.
Validation of the fields includes password validation, which means that the password must be at least 6 characters long and both passwords must be the same, email validaiton, which checks if the email is already registered, a validation that all fields must be filled.  
  
The login form consists of `email` and `password` fields.
The validation includes email validation, which checks if the email is registered in the database, and password validation, which checks if the password is correct for the given email.  
  
After loggin the user is redirected to a `userDetails`, which displays basic user info - name and email. A button `logout` is present, which logs the user out.  
  
If the user try to access the `userDetails` page, it automatically redirects them to the `login` page. If the user try to access the `login` or `registered` pages while logged in, it automatically redirects them to the `userDetails` page.

### File structure
- .env - includes environment variables
- src/server.js - the main application, which servers the server
- src/configs/dbConfig.js - sets up the connection to your local PostreSql database table
- src/configs/passportConfig.js - includes a function `initPassort` that helps authenticating users when they log in
- src/views/* - html files for the different pages: `index`, `register`, `login`, `userDetails`. .ejs files are used to enable embedded javascript in html.
