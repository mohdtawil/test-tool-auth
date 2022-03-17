require('dotenv').config();
const express      = require('express'),
      app          = express(),
      indexRouter  = require('./routes/all-routes'),
      cookieParser = require('cookie-parser');
     





// app sets
app.set("view engine" , "ejs");   
app.use(cookieParser());
app.use(indexRouter);



// port connection
const port = process.env.PORT | 2090;
app.listen(port, () => {
    console.log("Server is listening");
})