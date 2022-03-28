
const express = require("express");
let app = express();
app.use(express.json());
app.use(function(req,res,next){
    res.header("Access-Control-Allow-Origin","*");
    res.header(
        "Access-Control-Allow-Methods",
        "GET, POST, OPTIONs, PUT, PATCH, DELETE, HEAD"
    );
    res.header(
        "Access-Control-Allow-Headers",
        "Origin,X-Request-With,Content-Type,Access"
    );
    next();
});
const port=2410;
app.listen(port, () =>console.log(`Node app listening on port ${port}!`));


// using cookie-parser 
const cookieParser = require("cookie-parser");
// app.use(cookieParser());

app.use(cookieParser("abcdef-3477198")); // for the sign cookies, provide any string as para


// GET Method with the get mathod
app.get("/viewPage",function(req,res){
    // let name = req.cookies.name; // geting the  cookies name 
    // let counter = req.cookies.counter;

    // signed cookies 
    let name = req.signedCookies.name; // geting the  signedCookies name 
    let counter = req.signedCookies.counter;
    console.log(name);
    if(!name){
        // res.cookie("name","Guest"); // initializing the cookies value
        // res.cookie("Counter", 1); // initializing the cookies value

        res.cookie("name","Guest",{maxAge:150000,signed:true}); // setting the time for the cookies
        res.cookie("Counter", 1,{maxAge:150000,signed:true}); 
        res.send("Cookie set");
    }
    else
    {   
        res.cookie("Counter", +counter + 1 )
        res.send(`Cookies recd for name:${name} counter : ${counter}`);
    }
})

// Post Method 

app.post("/viewPage",function(req,res){
    let {name} = req.body; // geting the  cookies form body 
    res.cookie("name",name,{maxAge:150000,signed:true}); // set the cookies
    res.cookie("counter",1,{maxAge:150000,signed:true}); // reset the counter values
    res.send(`Cookies set for name:${name}`);
});

// Deleting the cookies

app.delete("/viewPage",function(req,res){
    res.clearCookie("name");
    res.clearCookie("counter");
    res.send("Cookies deleted")
})