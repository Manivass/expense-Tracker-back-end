## Creating Expense Tracker Backend

- install express and nodemon
- connect DB to server , then connect
- create userSchema - firstName , lastName , emailId , password
- install bcrypt
- install jsonwebtoken
- signUp API - validate and sanitize the api then store into DB and get the cookie
- Login API - validate the email Id and Password ang get the cookie
- logout API - clear the cookie
- expense schema - userId , amount , category , date , note
- /expense/add - add the expense
- /user/startingAmount - add the starting amount
- /expense/financialOverView - over View of the balance
- /expense/list - to see the expense list
- added pagination in the expense/list
