
let express = require("express");

let passport = require("passport");
let localStrategy = require("passport-local").Strategy;
let {users, orders} = require("./jwtData")

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
const port = 2410;
app.use(passport.initialize()); // initializing the passport
app.listen(port, () =>console.log(`Node app listening on port ${port}!`));


let StrategyAll = new localStrategy(function(username, password,done){
    console.log("In Local strategy-All", username,password);
    let user1 = users.find((u) => u.name === username && u.password === password);
    console.log("user",user1);
    if(!user1)
    {
        return done(null,false,{message:"Incorrect username or password"});
    }
    else{
        return done(null,user1);
    }
});

// Only for the Admin
let StrategyAdmin = new localStrategy(function(username, password,done){
    console.log("In LocalStrategy-Admin", username,password);
    let user1 = users.find((u) => u.name === username && u.password === password);
    console.log("user",user1);
    if(!user1)
    {
        return done(null,false,{message:"Incorrect username or password"});
    }
    else if(user1.role!== "admin"){
        return done(null,false, {message : "This is for the only admin"})
    }
    else
    {
        return done(null,user1);
    }
});

passport.use("roleAll",StrategyAll);
passport.use("roleAdmin",StrategyAdmin);
// passport.use(Strategy); // configure the strategy

app.post("/user", function(req,res){
    let {username, password} = req.body;
    let user = users.find((u) => u.name === username && u.password === password);
    if(user) 
    {
        let payload = {id: user.id};
        res.send(payload)
    }
    else
    {
        res.sendStatus(401)
    }
});


// authenticating the user passport in route /user or callin the authenticate strategy fun
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
})