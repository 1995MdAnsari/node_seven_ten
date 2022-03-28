let express = require("express");
let passport = require("passport");
let jwt = require("jsonwebtoken");
let JwtStrategy = require("passport-jwt").Strategy;
let ExtractJWT = require("passport-jwt").ExtractJwt; // ExtractJWT from the different places like cookies, bady, querypara, authorization header
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
app.use(passport.initialize()); // initializing the passport
app.listen(2410, () =>console.log("Node app listening on port 2410"));

const params = {
    jwtFromRequest : ExtractJWT.fromAuthHeaderAsBearerToken(),
    secretOrKey : "jwtsecrate23647832"
} 
// fromAuthHeaderAsBearerToken() : this is means as the token would be inthe authorization header as a BearerToken
const jwtExpirySeconds = 300;

let StrategyAll = new JwtStrategy(params,function(token,done){
    console.log("In JWTStrategy-All", token);
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

let StrategyAdmin = new JwtStrategy(params,function(token,done){
    console.log("In JWTStrategy-Admin", token);
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
        // Generating the token
        let token = jwt.sign(payload,params.secretOrKey,{
            algorithm : "HS256",
            expiresIn: jwtExpirySeconds,
        });
        res.send({token : "bearer " + token}); // Must be space after bearer
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