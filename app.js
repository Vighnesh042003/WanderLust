if(process.env.NODE_ENV != 'production'){
    require('dotenv').config();
}

console.log(process.env)

const express = require('express');
const mongoose = require('mongoose');
const app = express();
const methodOverride = require('method-override');
const path = require('path');
const ejsMate = require('ejs-mate');
const ExpressError = require('./utils/ExpressError.js');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user.js');

const listingRouter = require('./routes/listing.js');
const reviewRouter = require('./routes/review.js');
const userRouter = require('./routes/user.js');

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname,"/public")));

// const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
const dburl = process.env.ATLASDB_URL;

const store = MongoStore.create({
    mongoUrl:dburl,
    crypto:{
        secret:process.env.SECRET,
    },
    touchAfter: 24 * 3600 ,
});

store.on("error",()=>{
    console.log("Error in mongo session " ,err);
})

const sessionOptions = {
    store,
    secret :process.nextTick.SECRET,
    resave :false ,
    saveUninitialized : true,
    cookie : {
        expires : Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge : 7 * 24 * 60 * 60 * 1000 ,
        https:true,
    },
};



app.use(session(sessionOptions));
app.use(flash());

// app.use(passport.authenticate());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

const port = 8080;

main()
.catch(err => console.log(err))
.then(()=>console.log("Connected TO DB") );

async function main() {
  await mongoose.connect(dburl);
}

app.get("/",(req,res)=>{
    res.redirect("/listings")
})

app.use((req,res,next)=>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
});

// app.get("/demouser",async(req,res)=>{
    
//     let fakeUser = new User({
//             email: "student@gmail.com",
//             username: "vighnesh",
//     });

//     let registeredUser = await User.register(fakeUser, "helloworld");
//     res.send(registeredUser);
//     // console.log(registeredUser);  
// });

// app.get("/demouser", async (req, res) => {

//         let fakeUser = new User({
//             email: "abc@gmail.com",
//             username: "abc@123",
//         });
//         let registeredUser = await User.register(fakeUser, "abc2003");
//         res.send(registeredUser);
// });

app.use("/listings",listingRouter);
app.use("/listings/:id",reviewRouter);
app.use("/",userRouter);



// app.get("/testListing", async(req,res)=>{
//     let sampleListing = new Listing({
//         title : "My New Villa",
//         description : "By the Beach",
//         price : 1300,
//         location : "Fort,Mumbai",
//         country : "India",
//     });
    
//     await sampleListing.save()
//     .then((res)=> console.log("saved in DB"))
//     .catch((err)=> console.log("Error in DB"));

//     console.log("sample was saved");
//     res.send("Save Was Successfull");

// });


app.all("*",(req,res,next)=>{
   next(new ExpressError(404,"Page Not Found"));
})

app.use((err,req,res,next)=>{
    let {status=500,message="something went wrong"} = err;
    res.status(status).render("error.ejs",{err})
    // res.status(status).send(message);
})

app.listen(port,()=>{
    console.log("App running on port 8080")
})


