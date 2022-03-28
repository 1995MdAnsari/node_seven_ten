let express = require("express");

let passport = require("passport");
let CookieStrategy = require("passport-cookie").Strategy;
let cookieParser = require("cookie-parser");
let {users, orders} = require("./jwtData");

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
app.use(cookieParser()); // first cookieParser() then passport.initialize()
app.use(passport.initialize()); // initializing the passport
app.listen(2410, () =>console.log("Node app listening on port 2410"));


// Define All strategy

let myCookie = "passportCookie";

let StrategyAll = new CookieStrategy({cookieName : myCookie},function(token,done){
    console.log("In CookieStrategy-All", token);
    let user1 = users.find((u) => u.id === token.id);
    console.log("user",user1);
    if(!user1)
    {
        return done(null,false,{message:"Incorrect username or password"});
    }
    else{
        return done(null,user1);
    }
});

let StrategyAdmin = new CookieStrategy({cookieName : myCookie},function(token,done){
    console.log("In CookieStrategy-Admin", token);
    let user1 = users.find((u) => u.id === token.id);
    console.log("user",user1);
    if(!user1)
    {
        return done(null,false,{message:"Incorrect username or password"});
    }
    else if(user1.role !== "admin"){
        return done(null,false,{message:"You do not have admin role"});
    }
    else
    {
        return done(null,user1);
    }
});

passport.use("roleAll",StrategyAll);
passport.use("roleAdmin",StrategyAdmin);


app.post("/user", function(req,res){
    let {username, password} = req.body;
    let user = users.find((u) => u.name === username && u.password === password);
    if(user) 
    {
        let payload = {id: user.id};
        res.cookie(myCookie,payload);
        res.send("log in success")
    }
    else
    {
        res.sendStatus(401)
    }
});

app.get("/user",passport.authenticate("roleAll",{session: false}),function(req,res){
    console.log("In GET /user", req.user)
    res.send(req.user); // if user is find the it send the get req
});

app.get("/myOrders",passport.authenticate("roleAll",{session: false}),function(req,res){
    console.log("In GET /myOrders", req.user) // receiving the user id which send by post
    let order1 = orders.filter((ord)=> ord.userId === req.user.id);
    res.send(order1)
});


app.get("/allOrders",passport.authenticate("roleAdmin",{session:false}),function(req,res){
    console.log("In GET /allOrders", req.user) // receiving the user id which send by post
    res.send(orders)
});
