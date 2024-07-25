/********************************************************************************* 
Add the following declaration at the top of your server.js file:
/*********************************************************************************
* WEB700 – Assignment 04
* I declare that this assignment is my own work in accordance with Seneca Academic Policy. No part
* of this assignment has been copied manually or electronically from any other source
* (including 3rd party web sites) or distributed to other students.
*
* Name: Ashika Sapkota ID: 143067239 Date: 07/18/2024
*
* Online (Heroku) Link: https://enigmatic-springs-50381-167781a6254a.herokuapp.com/
* Github Link: https://github.com/Sanuashika/Assignment-4 

********************************************************************************/

const express = require("express");
const path = require("path");
exphbs = require ("express-handlebars");
const data = require("./modules/collegeData.js");

const app = express();


const HTTP_PORT = process.env.PORT || 8080;
app.engine('.hbs',exphbs.engine({
    extname:'.hbs',
    defaultLayout: 'main',
    helpers:{
        navLink: function(url, options){
            return '<li' + ((url==app.locals.activeRoute)?  'class="nav-item active" ':'class="nav-item active"')+
            '><a class ="nav-item active" href ="' +url +'">' + options.fn(this) + '</a></li>';
        },
        equal: function(lvalue, rvalue, options){
            if (arguments, length<3)
                throw new error("Handlebar Heler equal needs 2 parameter");
            if (lvalue !=rvalue){
                return options.inverse(this);
            }
            else{
                return options.fn(this);
            }
        }
    }

}));
app.set('view engine', '.hbs');
app.set('views', 'views');

app.use(express.static("public"));
app.use(express.urlencoded({extended: true}));


app.get("/", (req,res) => {
    res.render('home');
});

app.get("/about", (req,res) => {
    res.render('about');
});

app.get("/htmlDemo", (req,res) => {
    res.render('htmlDemo');
});

app.use(function(req,res,next){
    let route = req.path.substring(1);
    app.locals.acMveRoute = "/" + (isNaN(route.split('/')[1]) ? route.replace(/\/(?!.*)/, "") : route.replace(/\/(.*)/, ""));
    next();
});

app.get("/students", (req, res) => {
    if (req.query.course) {
        data.getStudentsByCourse(req.query.course).then((data) => {
            res.render('students', {students:data })
        }).catch((err) => {
            res.render('student', { message: 'no results found' });
        });
    } else {
        data.getAllStudents().then((data) => {
            res.render('students', {students:data })
        }).catch((err) => {
            res.render('student', { message: 'no results found' });
        });
    }
});

app.get("/students/add", (req,res) => {
    res.render('addstudent');
});


app.post("/students/add", (req, res) => {
    data.addStudent(req.body).then(()=>{
      res.redirect("/students");
    });
  });

app.post("/students/update", (req, res) => {
    data.updateStudent(req.body).then(()=>{
      res.redirect("/students");
    });
});
app.get("/student/:studentNum", (req, res) => {
    data.getStudentByNum(req.params.studentNum).then((data) => {
        res.render('student', {student:data })
    }).catch((err) => {
        res.render('student', { message: 'no results found' });
    });
});

app.get("/tas", (req,res) => {
    data.getTAs().then((data)=>{
        res.json(data);
    });
});

app.get("/courses", (req,res) => {
    data.getCourses().then((data)=>{
        res.render('courses', {courses:data});
    });
});
app.get("/course/:coursenum", (req, res) => {
    data.getCourseById(req.params.coursenum).then((data) => {
        console.log(data);
        res.render('course', { course:data })
    }).catch((err) => {
        res.render('course', { message: 'no results found' });
    });
});


app.use((req,res)=>{
    res.status(404).send("Page Not Found");
});


data.initialize().then(function(){
    app.listen(HTTP_PORT, function(){
        console.log("app listening on: " + HTTP_PORT)
    });
}).catch(function(err){
    console.log("unable to start server: " + err);
});