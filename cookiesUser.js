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
app.use(cookieParser("abcdef-3477198")); // for the sign cookies, provide any string as para
 let { laptops, mobiles,users} = require("./data.js");

 app.get("/mobiles", function(req, res){
     let userdata = req.signedCookies.userdata;
     console.log(`userdata : ${JSON.stringify(userdata)}`);
     if(!userdata){
         userdata = {user:"Guest",pages:[]}
     }
     userdata.pages.push({url:"/mobiles", date:Date.now()});
     res.cookie("userdata",userdata,{maxAge:30000, signed:true});
     res.send(mobiles)
 })

 app.get("/laptops", function(req, res){
    let userdata = req.signedCookies.userdata;
    console.log(`userdata : ${JSON.stringify(userdata)}`);
    if(!userdata){
        userdata = {user:"Guest",pages:[]}
    }
    userdata.pages.push({url:"/laptops", date:Date.now()});
    res.cookie("userdata",userdata,{maxAge:30000, signed:true});
    res.send(laptops)
});

// for the correct user is login or not.

app.post("/login",function(req,res){
    let {name, password} = req.body;
    let user = users.find((u)=> u.name===name && u.password === password);
    if(!user){
        res.status(401).send("Login Faild");
    }
    else{
        res.cookie("Userdata",{user:name, pages:[]},{maxAge:30000, signed:true})
        res.send("Login success")
    }
});
 

app.get("/logout", function(req,res){{
    res.clearCookie("userdata");
    res.send("Cookies clear")
}});

// show the userdata and pages

app.get("/cookieData", function(req, res){
    let userdata = req.signedCookies.userdata;
    res.send(userdata);
});

app.get("/users", function(req, res){
    let userdata = req.signedCookies.userdata;
    let {user,pages} = userdata;
    if(!userdata || user==="Guest"){
        res.status(401).send("No access. Please login first");
    }
    else{
        let useFind = userdata.find(u => u.name ===user);
        if(useFind.role === "admin"){
            let allUser = users.map(u => u.name);
            res.send(allUser);
        }
        else{
            res.status(403).send("Firbidden");
        }
    }
})

