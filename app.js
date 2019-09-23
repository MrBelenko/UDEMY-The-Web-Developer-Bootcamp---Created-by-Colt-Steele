var express    = require("express"),
    app        = express(),
    bodyParser = require("body-parser"),
    mongoose   = require("mongoose"),
    passport   = require("passport"),
    flash      = require("connect-flash"),
    Campground = require("./models/campground"),
    Comment    = require("./models/comment"),
    LocalStrategy = require("passport-local"),
    User       = require("./models/user"),
    methodOverride =require("method-override"),
    seedDB     = require("./seeds")

//requring routes   
var campgroundRoutes = require("./routes/campgrounds"),
    commentRoutes    = require("./routes/comments"),
    indexRoutes      = require("./routes/index")
    
    // seedDB();  //seed the database
    
// var url = process.env.DATABASEURL || "mongodb://localhost/YelpCampWithoutMongoDBAtlas"

mongoose.connect("mongodb://localhost/YelpCampWithoutMongoDBAtlas",
    {
    useNewUrlParser: true,
    useUnifiedTopology: true
    }).then(() =>{
        console.log("Connected to DB");
    }).catch(err =>{
      console.log("Error:", err.message); 
    });

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());

//PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "Once again Rusty wins cutest dog!",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy (User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

app.use("/", indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);


// app.listen(process.env.PORT, process.env.IP, function(){
//     console.log("The YelpCamp server has started");
// });

const PORT = process.env.PORT|| 5500;
const IP = process.env.IP || 'localhost';
app.listen( PORT, IP, function(){
 console.log("The YelpCamp server has started");
});