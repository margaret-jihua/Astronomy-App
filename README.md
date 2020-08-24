# Astronomy App

Public Site : [The Astronomy App](https://astronomy-picture-app.herokuapp.com/)

## User Story

* As a user, I want to search the Astronomy Picture by the date 
* As a user, I want to sign up to save my favorite pictures
* As a user, I can delete pictures saved in favorite
* As a user, I can add comments under astronmy pictures
* As a user, I can view my comments in profile page and delete it
* As a user, I can change my username

## What it includes

* Sequelize user model / fave model / usersfaves model / comment model
* Settings for PostgreSQL
* Passport and passport-local for authentication
* Sessions to keep user logged in between pages
* Flash messages for errors and successes
* Passwords that are hashed with BCrypt
* EJS Templating and EJS Layouts
* Server route / auth route / profile route

## Resource Credit

* Materialize framework 
* Social media icons from [icons8]('https://icons8.com')
* [APOD API]('https://api.nasa.gov/) powered by [NASA]('https://www.nasa.gov/)
* [APOD documatation]('https://github.com/nasa/apod-api')
* [Mars Rover Photos API powered by NASA]('https://api.nasa.gov/)

## Models

<img src='https://github.com/margaret-jihua/Astronomy-App/blob/master/Untitled%20Diagram.png?raw=true' alt='ERD'>

### User Model

| Column Name | Data Type | Notes |
| --------------- | ------------- | ------------------------------ |
| id | Integer | Serial Primary Key, Auto-generated |
| name | String | Must be provided |
| email | String | Must be unique / used for login |
| password | String | Stored as a hash |
| createdAt | Date | Auto-generated |
| updatedAt | Date | Auto-generated |

### Fave Model

| Column Name | Data Type | Notes |
| --------------- | ------------- | ------------------------------ |
| id | Integer | Serial Primary Key, Auto-generated |
| date | String | Date of the picture user liked |
| url | String | URL of the picture user liked |
| createdAt | Date | Auto-generated |
| updatedAt | Date | Auto-generated |

### UsersFaves Model

Join-table associated with user and fave model

| Column Name | Data Type | Notes |
| --------------- | ------------- | ------------------------------ |
| id | Integer | Serial Primary Key, Auto-generated |
| userId | Integer | User id from user model |
| faveId | Integer | Fave id from fave model |
| createdAt | Date | Auto-generated |
| updatedAt | Date | Auto-generated |

### Comment Model

One-to-Many relationship with user model, one user has many comments

| Column Name | Data Type | Notes |
| --------------- | ------------- | ------------------------------ |
| id | Integer | Serial Primary Key, Auto-generated |
| date | string | Date of the picture to comment on |
| content | text | Content of the comment |
| userId | Integer | User id from user model |
| createdAt | Date | Auto-generated |
| updatedAt | Date | Auto-generated 

## Routes

### Server Routes

| Method | Path | Location | Purpose |
| ------ | ---------------- | -------------- | ------------------- |
| GET | / | server.js | Home page |
| GET | /search | server.js | Search page |
| GET | /gallery | server.js | Show random APOD pictures in gallery |
| GET | /mars | server.js | Show mars rover pictures in mars page |
| GET | /detail | server.js | Detail page of each astronomy picture |
| POST | /detail | server.js | Add comments in detail page |

### Auth Routes

| Method | Path | Location | Purpose |
| ------ | ---------------- | -------------- | ------------------- |
| GET | /auth/login | auth.js | Login form |
| GET | /auth/signup | auth.js | Signup form |
| POST | /auth/login | auth.js | Login user |
| POST | /auth/signup | auth.js | Creates user |
| GET | /auth/logout | auth.js | Removes session info |

### Profile Routes

| Method | Path | Location | Purpose |
| ------ | ---------------- | -------------- | ------------------- |
| GET | /profile | profile.js | Show users' collections and comments |
| POST | /profile | profile.js | Add favorite picture to user's collection |
| DELETE | /profile/:id | profile.js | Delete a picture from user's collection |
| DELETE | /profile/comment/:id | profile.js | Delete a comment |
| GET | /profile/edit | profile.js | Edit username form |
| PUT | /profile/edit/:id | profile.js | Update username |

## Author
Jihua (Margaret) Huang
