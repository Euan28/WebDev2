# WebDev2

Create the folder C:\Users\euan6\mongo-datacrudtodonewdb to allow the .bat to store user inputted data from the database
Ensure that .bat file is running (Start MongoDBCRUDTODONewdb)
This application uses MongoDB and MongoDB Compass Community so therefore, a .bat file will be needed.
MongoDB Compass Community does not create the folder we use to send all of our user inputted information too, MongoDB does. 
Therefore, both were needed to be installed to allow this application to work. 
In MongoDB CC, we created a database called 'testForAuth' with collections such as employees and tasks (milestones).
cd "directory, depends on where you have the folder"
cd CRUDTODONewdb
cd project
npm install bcrypt@4.0.1 body-parser@1.18.3 clipboard@2.0.6 connect-mongo@1.3.2 express@4.17.1 express-handlebars@3.0.0 express-session@1.15.2 mongoose@5.2.8 morgan@1.9.0 nodemon@2.0.2 serve-favicon@2.4.5 handlebars@4.5.0

cd .\CRUDTODONewdb\project
node .\server.js

http://localhost:3000/pages/login