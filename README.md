# Introduction

This project contains some sample GitLab CI/CD pipelines that demonstrate different CI/CD features.

# Samples

## TotD

Tip of the Day service contains a script to be run with every login to a bash environment - linux server, WSL, etc.
It contains the actual tips files and the script. Both are deployed to remote hosts, either for user specific or host wide use. The pipeline build the service by "compiling" the tips files to simple enumerated versions, tests the script and deploys it to remote server.

## TotD version 2

ToTD version 2 is an application made with PERN stack (PostgreSQL, Express, ReactJS and Node.js) containing CRUD operations, authorization and authentication. There are two kinds of roles in the application and the page views depend on the role of the logged in user. As admin you have access to the Adminpage where you can change normal users (role=guest) username, email, password and role and delete users as well as edit their Tips or delete them. As a guest you can add Tips by writing in the Add tip page textfield (which is only shown to guests) and press Add Tip. Users can see their own Tips in the My Tips page and edit Tip name, category or delete them. As a guest you can also change your own password, username, email or delete the account in the profile page. Everyone can view all the tips in the ViewTips page even if not logged in. Liking, adding or modifying tips can be done only by the admin or guest users.

TotD version 2 is deployed on Render where the database, backend and frontend are maintained. 

The link to render: https://totd-frontend.onrender.com/ 


## TotD version 2 running instructions

install dependencies in the nodeapp folder with command
````
npm install
````
create .env file in the nodeapp folder with values:

````
DB_PORT=5432
DB_HOST=localhost
POSTGRES_USER=user
POSTGRES_PASSWORD=password
POSTGRES_DB=tips
JWT_KEY=yourOwnKey
````
to run the database in docker container run the following command in the root directory of the project
````
docker compose up
````
to start webserver run following command in the nodeapp folder
````
npm run dev
````


endpoints

````
Get all tips (GET)
http://localhost:3000/api/tips/getall

Get all users (GET)
http://localhost:3000/api/users/getusers

Get tips by category (GET)
http://localhost:3000/api/tips/getall/:category

Get tips by creator (GET)
http://localhost:3000/api/tips/getbycreator/:creator

Get a random tip (GET)
http://localhost:3000/api/tips/randomtip

Get tip by Id (GET)
http://localhost:3000/api/users/:uid

Get user by Id (GET)
http://localhost:3000/api/tips/:tid

Get tip by Id as plain text (GET) and can use any positive integer number as :tid value to fetch tip
http://localhost:3000/api/tips/:tid/plain

Delete tip by Id (DELETE)
http://localhost:3000/api/tips/:tid/delete

Delete user by Id (DELETE)
http://localhost:3000/api/users/:uid/delete

Add a like to a tip by Id (PATCH)
http://localhost:3000/api/tips/:tid/like

Update tip by Id (PATCH)
http://localhost:3000/api/tips/:tid/update

Update user by Id (PATCH)
http://localhost:3000/api/users/:uid/update

Add new tip (POST)
http://localhost:3000/api/tips/addtip

Sign up (POST)
http://localhost:3000/api/users/signup

Login (POST)
http://localhost:3000/api/users/login

````

# Running the frontend with database and backend

create .env file in the client folder with value:
````
REACT_APP_LOCAL_BACKEND_URL=http://localhost:3000
````

install dependencies in the client folder with command
````
npm install --force
````

start database in docker container by running the following command in the root directory of the project
````
docker compose up
````

to start webserver run following command in the nodeapp folder
````
npm run dev
````

to start frontend run following command in the client folder
````
npm start
````

# Run entire application in Docker

In the root directory of the project run command
````
docker-compose -f docker-compose.full.yml up
````

if you want to run containers in the background run command
````
docker-compose -f docker-compose.full.yml up -d
````

if you wanna just rebuild the containers run command
````
docker-compose -f docker-compose.full.yml up --build
````


If you wanna run static version of the application run command
````
docker-compose -f docker-compose.static.yml up
````

if you wanna just rebuild the static containers run command
````
docker-compose -f docker-compose.static.yml up --build
````

if you don't already have the data you can add tips and admin to the database by navigating to nodeapp/ and running command
````
npm run seed:db 
````

# Running the tests

Cypress tests:

in the client folder run command
````
npx cypress open 
````
To run the the tests successfully you need to have the backend, frontend and database running. Run the specs in this order: adminpage, authenticate, functionality, profilepage.


Backend tests:

in the nodeapp folder run command
````
npm run test:jest
````
To run the the tests successfully you need to have the database running. If you want to see the test coverage run command
````
npm run test:coverage
````
You can find the report in the nodeapp/coverage/lcov-report/index.html file. The coverage folder is created when running the command.



# Links and References

* https://docs.gitlab.com/ee/ci/pipelines/
* https://docs.gitlab.com/ee/ci/ssh_keys/
* https://www.udemy.com/course/gitlab-ci-pipelines-ci-cd-and-devops-for-beginners/



