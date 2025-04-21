# FinalProjectUSM


### Installing the Backend
---------------------------
#### All tools
Python - version 3.12.6
post gresql version 15.11 
PG ADMIN 

#### 1) Creating the Virtual Environment (env file)
Go to visual studio code:

click Terminal then New Terminal

Once you see the terminal please input :

*Windows* 
python -m venv env

*MAC* 
python3 -m venv env

*result*: You should see the env folder between the frontend and backend

Please then activate the virtual environment

Insert this in the terminal: 

*Windows*
.\env\Scripts\activate

*MAC*
source env/bin/activate

*result*: you should see (env) in your terminal now

#### 2) Please ensure you've got python installed (version 3.12.6)

#### 3) Installing the backend (Django and more) 
in the terminal , do not CD anything and insert:

pip install -r requirements.txt

result: this should install the backend:

asgiref
Django
django-cors-headers
djangorestframework
djangorestframework-simplejwt
PyJWT
pytz
sqlparse
psycopg2-binary
python-dotenv

### Installing the Frontend
---------------------------
In the terminal please now enter this in the terminal to go into the frontend folder

cd Frontend

now once you are in the frontend folder, please enter this in the terminal:

npm install

*result*: it should install everything from the frontend (e.g. Axios, tailwind, react, lucide)

#####Front end dependencies are now installed.

### Setting up database
---------------------------
- install postgreSQl and pgadmin 4 via https://www.postgresql.org/download/ if you dont have it already (pgadmin 4 is included in this same install)

- Make sure post gre sql is working in the terminal

#####PLEASE NOTE!!!: Once you create your pgadmin account,make a note of your password as this will be added onto the config file.

- on pgAdmin, please create a database called usm *(please take a look on the config file as it will say the name of the database there as well)*

- Go to the config file and put down the password used to access the pgAdmin *(this will allow the connection to the database)*

#### Inserting to the database
--------------------------
The next important step is download the seeds, this will insert the university names,sports,teams as well as the leagues.

### step 1:
In the terminal , enter the backend directory:

    cd backend

if it's currently still on frontend, please go back a directory by entering:

    cd ../
    cd backend

##### entering the database in the terminal
Please entire this in the terminal:

    python manage.py shell

result: this should enter the database

#### PLEASE FOLLOW THIS ORDER
enter this in the terminal

#### step 1
    from SeedOne import run

#### step 2
    run ()

#### step 3
    from SeedTwo import run

#### step 4
    run ()

#### step 5
    from SeedThree import run

#### step 6
    run ()

#### step 7
    from SeedFour import run

#### step 8
    run ()

#### step 9
    from SeedFive import run

#### step 8
    run ()



SeedOne.py -> adds the universities and sports
SeedTwo-> Creates the sports teams
SeedThree -> Creates the leagues
SeedFour-> Assigns the teams to those leagues
SeedFive -> creates Matches

#### Running the project (locally on the machine) 
--------------------------
Go on a new terminal and split screen it with another terminal

Ensure virtual environment is on
Make sure you are at the root (not in any folder)

*Windows*
    .\env\Scripts\activate

*MAC*
    source env/bin/activate

*result*: you should (env) in your terminal now

#### running the backend

and on the terminal enter the backend directory

    cd backend
    python manage.py runserver


#### run the front end
On the other terminal (splitScreen)

enter the front end directory

    cd frontend
    npm run dev


#### you'll be provided a link in the terminal
http://localhost:5173/
and it should get sent to the login page
http://localhost:5173/login

### IMPORTANT PLEASE READ WHEN YOU ARE ON THE WEBSITE
SeedTwo created the first admin account for "University of Yellow"
as it requires at least one admin file for seed to fully work.

### University of Yellow admin account
    email: yellowAdmin@hotmail.com
    password: yellowAdmin123

Please use this account to access the admin side for the university of Yellow account.

#### Please make another account for the same university to be able to test (admin and student)

This project only allows the first ever account made for that specific university to be an admin account and other accounts made for that specific university will be a student account.

e.g. the next account now made when someone from university of Yellow will automatically go to the student page.

There are 4 universities in total, therefore once you create the first account for each of the other universities it will be an admin account, then other accounts made will be students.

#### PLEASE NOTE!
 If you do create accounts, please make a note to help you as you will be going back and forth from admin and student sides.

 The univerisity admins can only do certain actions (e.g. accepting/rejecting requests and more ) to ONLY students from that same university. Please make a note of accounts made from that same university. 

#### Student Features
-  Request to join a team (admin from that university needs to accept)
- See their teammates (take into account by creating another account)
- Update their position 
- Choose their availability for a match
- See their personal team ranking in the league
- See the top 5 scorers (both league and their team)
- Change their email, first name and password
#### Admins Features
- accepts/rejects team request
- Can see all team members of each of the team
- update scores and dates for a match (affects team ranking)
- can assign goals to the players
- can see who's available for each match
- Change their email, first name and password
- Can see all of the leagues and their rankings

































