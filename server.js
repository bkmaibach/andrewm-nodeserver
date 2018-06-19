const express = require('express');
const hbs = require('hbs');
const fs = require('fs');

const port = process.env.PORT || 3000;

//This app object is how we will interact with express
var app = express();

hbs.registerPartials(__dirname + '/views/partials');

hbs.registerHelper('getCurrentYear', () => {
    return new Date().getFullYear();
});

hbs.registerHelper('screamIt', (toScream) => {
    return toScream.toUpperCase();
})

hbs.registerHelper('getRepoUrl', () => {
    return "https://github.com/bkmaibach/andrewm-nodeserver";
});


//This is how you integrate hbs into express
app.set('viewengine', 'hbs');



app.use((req, res, next) => {
    var now = new Date().toString();
    var log = `${now}: ${req.method} ${req.url}`
    console.log(log);
    fs.appendFile('server.log', log + '\n', (err) => {
        if (err){
            console.log('Unable to append to server.log');
        }
    })
    next();
});

// app.use((req, res, next) => {
//     res.render('maintenance.hbs', {
//         pageTitle: "Under Maintenance",
//         maintMessage: "The site is currently under maintenance and will be back soon."
//     })
// })

//__dirname provides the path to the andrewm-nodeserver folder
//This provides access to all of the files in thge /public folder
//It's what makes node with express super popular
//Notive that the order of the middleware calls such as this matter:
//If this were run before the above maintenance page middleware, a user
//Would still be able to access /help.html even when the maintenance page is
//blocking access to all the pages below.
app.use(express.static(__dirname + '/public'));


app.get('/', (req, res) => {
    //res.send('<h1>Hello Express!</h1>');
    // res.send({
    //     name: "Maibes",
    //     likes: ["cheese, archery, coding, bikes"],
    // });
    res.render('home.hbs', {
        pageTitle: 'Home Page',
        welcomeMessage: 'Welcome to my humble webpage',
    });
});

app.get('/about', (req, res) => {
    res.render('about.hbs', {
        pageTitle: 'About Page',
    });

});

app.get('/projects', (req,res) => {
    res.render('projects.hbs', {
        pageTitle: 'Projects'
    });
});

//create a route at /bad, respond using response.send sending back an errorMessage within json
app.get('/bad', (req, res) => {
    res.send({ errorMessage: "Unable to handle request."});
});

//Heroku supplies an environment variable for the listening port.
//Neat right?
app.listen(port, () => {
    console.log(`Application is a go on port ${port}`)
});