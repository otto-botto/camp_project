// App.js

/*
    SETUP
*/
var express = require('express');   // We are using the express library for the web server
var app     = express();            // We need to instantiate an express object to interact with the server in our code
PORT        = 49809;                 // Set a port number at the top so it's easy to change in the future

// app.js
const { engine } = require('express-handlebars');
var exphbs = require('express-handlebars');     // Import express-handlebars
app.engine('.hbs', engine({extname: ".hbs"}));  // Create an instance of the handlebars engine to process templates
app.set('view engine', '.hbs');                 // Tell express to use the handlebars engine whenever it encounters a *.hbs file.

// Database
var db = require('./database/db-connector')

// app.js - SETUP section
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(express.static(__dirname + '/public'));         // this is needed to allow for the form to use the ccs style sheet/javscript
    
// --- READ --- 
// app.js
app.get('/', function(req, res){
    return res.render('index');
})

app.get('/campgrounds', function(req, res)
{   
    // Declare the first query
    let query1;
    // If there is no query string, perform SELECT
    if (req.query.CampgroundName === undefined)
    {
        query1 = `SELECT * FROM Campgrounds;`;
    }
    // If there is a query string, assume it's from search and return the appropriate result
    else
    {
        query1 = `SELECT * FROM Campgrounds WHERE CampgroundName LIKE '${req.query.CampgroundName}%';`
    }
    
    // Run the first query
    db.pool.query(query1, function(error, rows, fields){  // Execute the query        
        // Save the campgrounds
        let campgrounds = rows; 

        return res.render('campgrounds', {data:campgrounds});
    })
});

app.get('/customers', function(req, res)
{
    // Declare Query 1
    let query;
    // If there is no query string, perform SELECT
    if (req.query.LastName === undefined)
        {
            query1 = `SELECT * FROM Customers;`;
        }
// If there is a query string, assume it's from search and return the appropriate result
    else
        {
        query1 = `SELECT * FROM Customers WHERE LastName LIKE '${req.query.LastName}%';`
        
        }    
    
    // Run the first query
    db.pool.query(query1, function(error, rows, fields){  // Execute the query        
        // Save the campgrounds
        let customers = rows; 

        return res.render('customers', {data:customers});
    })
});

app.get('/sites', function(req, res)
{
    // Q1 to show what we want for Sites: Camp name, site ID, and site number
    let query1 = `select Campgrounds.CampgroundName, CampgroundSites.SiteId, CampgroundSites.SiteNumber 
                from Campgrounds
                join CampgroundSites on CampgroundSites.GroundSiteId = Campgrounds.CampgroundId  
                order by Campgrounds.CampgroundName;`;
    // Q2 to add Campground drop down for adding 
    let query2 = `SELECT CampgroundId, CampgroundName FROM Campgrounds;`

    
    // Run the 1st query
    db.pool.query(query1, function(error, rows, fields){
        if(error){
            console.log(error);
            res.sendStatus(500);
            return;
        }

        // Save the columns from Q1    
        let sites = rows;

        // Run the 2nd query
        db.pool.query(query2, (error, rows, fields) => {
            if(error){
                console.log(error);
                res.sendStatus(500);
                return;
            }

            // Save the campgrounds
            let campgrounds = rows;
            return res.render('sites', {data: sites, campgrounds: campgrounds});
            })
        })
    });

app.get('/reservations', function(req, res){
    // Q1 to show what we want for Reservations: reservation id, customer id, site id, and campground name
    let query1 = `select SiteReservations.ReservationId, Customers.FirstName, Customers.LastName, 
                    CampgroundSites.SiteNumber, 
                    Campgrounds.CampgroundName, SiteReservations.ReservationStart, SiteReservations.ReservationEnd 
                    from CampgroundSites
                    join SiteReservations on SiteReservations.SiteReservationId = CampgroundSites.SiteId
                    join Customers on Customers.CustomerId = SiteReservations.CustReservationId
                    join Campgrounds on Campgrounds.CampgroundId = CampgroundSites.GroundSiteId
                    order by SiteReservations.ReservationId;`;
    // Q2 to add sites for drop-down
    let query2 = `select CampgroundSites.SiteNumber as site, Campgrounds.CampgroundName as name
                  from CampgroundSites
                  join Campgrounds
                  on CampgroundSites.GroundSiteId = Campgrounds.CampgroundId;`;
    // Q3 to add customers for drop-down
    let query3 = `select * from Customers;`;
    // Q4 to add campgrounds for drop-down
    let query4 = `select * from Campgrounds`;

    // Run teh 1st query
    db.pool.query(query1, (error, rows, fields) => {
        // save the columns from Q1
        let reservations = rows;
        // Run the 2nd query
        db.pool.query(query2, (error, rows, fields) => {
            // save the sites
            let sites = rows;
            console.log(sites);
            // Run the 3rd query
            db.pool.query(query3, (error, rows, fields) =>{
                // save the customers
                let customers = rows;
                // Run the 4th query
                db.pool.query(query4, (error, rows, fields) => {
                    // save campgrounds
                    let campgrounds = rows;
                    return res.render('reservations', {data: reservations, sites: sites, 
                                       customers: customers, campgrounds: campgrounds});
                })           
            })
        })
    })

});

// --- CREATE ---
app.post('/add-campground-form', function(req, res){
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;

    // Capture NULL values
    let phone = parseInt(data['input-phone']);
    if (isNaN(phone))
    {
        phone = 'NULL'
    }

    // Create the query and run it on the database
    query1 = `INSERT INTO Campgrounds (CampgroundName, CampgroundPhone, NumberOfSites,
    CampgroundState, ClosestTown, DistanceToTown, Longitude, Latitude) 
    VALUES ('${data['input-name']}', ${phone}, '${data['input-sites']}', 
    '${data['input-state']}', '${data['input-town']}', '${data['input-distance']}', 
    '${data['input-longitude']}', '${data['input-latitude']}')`;
    db.pool.query(query1, function(error, rows, fields){

        // Check to see if there was an error
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error)
            res.sendStatus(400);
        }

        // If there was no error, we redirect back to our root route, which automatically runs the SELECT * FROM bsg_people and
        // presents it on the screen
        else
        {
            res.redirect('/campgrounds');
        }
    })
});

app.post('/add-customer-form', function(req, res){
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;

    // Capture NULL values
    let fname = parseInt(data['input-first-name']);
    if (isNaN(fname))
    {
        fname = 'NULL'
    }

    let lname = parseInt(data['input-last-name']);
    if (isNaN(lname))
    {
        lname = 'NULL'
    }

    let email = parseInt(data['input-email']);
    if (isNaN(email))
    {
        email = 'NULL'
    }

    // Create the query and run it on the database
    query1 = `INSERT INTO Customers (FirstName, LastName, CustomerEmail, CustomerPhone) 
    VALUES ('${data['input-first-name']}', '${data['input-last-name']}', '${data['input-email']}', 
    '${data['input-phone']}')`;
    db.pool.query(query1, function(error, rows, fields){

        // Check to see if there was an error
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error)
            res.sendStatus(400);
        }

        // If there was no error, we redirect back to our root route, which automatically runs the SELECT * FROM bsg_people and
        // presents it on the screen
        else
        {
            res.redirect('/customers');
        }
    })
});

app.post('/add-site-form', function(req, res){
    // Capture incoming data and parse it into a JS object
    let data = req.body;
    console.log(data);
    // capture NULL values
    let site = parseInt(data['input-site-number']);
    if(isNaN(site)){
        site = NULL;
    }

    let campground = parseInt(data['input-campground']);
    if(isNaN(campground)){
        campground = NULL;
    }

    // create the query to insert into the database 
    query1 = `insert into CampgroundSites (GroundSiteId, SiteNumber)
              values (${campground}, ${site});`
    // run the query
    db.pool.query(query1, (error, rows, fields) => {
        if(error){
            console.log(error);
            res.sendStatus(400);
        }
        else{
            res.redirect('/sites');
        }
    })

});

app.post('/add-reservation-form', function(req, res){
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;
    console.log(data);
    // Capture NULL values
    let customer = parseInt(data['input-customer']);
    if (isNaN(customer))
    {
        customer = 'NULL'
    }    
    let campground = parseInt(data['input-campground']);
    if (isNaN(campground))
    {
        campground = 'NULL'
    }
    let site = parseInt(data['input-site']);
    if (isNaN(site)){
        site = 'NULL'
    }
    // Create the query and run it on the database
    query1 = `insert into SiteReservations(SiteReservationId, CustReservationId, ReservationTimestamp, ReservationStart,
                             ReservationEnd)
              values ((select CampgroundSites.SiteId
                        from CampgroundSites
                        where CampgroundSites.GroundSiteId = ${campground}
                        and CampgroundSites.SiteNumber = ${site}
                       ),
                     ${customer},
                     NOW(),
                     '${data['input-start']}',
                     '${data['input-end']}');`;
    db.pool.query(query1, function(error, rows, fields){
        // Check to see if there was an error
        if (error) {
            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error);
            res.sendStatus(400);
        }
        // If there was no error, we redirect back to our root route, which automatically runs the SELECT * FROM bsg_people and
        // presents it on the screen
        else
        {
            res.redirect('/reservations');
        }
    })
});

// --- DELETE ---

app.delete('/delete-campground-ajax/', function(req,res,next){
  let data = req.body;
  let campID = parseInt(data.CampgroundId);
  let deleteCampgrounds = `delete from Campgrounds where CampgroundId = ?`;
  let deleteSites= `delete from CampgroundSites where GroundSiteId = ?`;


        // Run the 1st query
        db.pool.query(deleteCampgrounds, [campID], function(error, rows, fields){
            if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error);
            res.sendStatus(400);
            }

            else
            {
                // Run the second query
                db.pool.query(deleteSites, [campID], function(error, rows, fields) {

                    if (error) {
                        console.log(error);
                        res.sendStatus(400);
                    } else {
                        res.sendStatus(204);
                    }
                })
            }
})});

app.delete('/delete-customer-ajax/', function(req,res,next){
    let data = req.body;
    let custID = parseInt(data.CustomerId);
    let deleteCustomers = `delete from Customers where CustomerId = ?`;
        // Run the 1st query
        db.pool.query(deleteCustomers, [custID], function(error, rows, fields){
            if (error) {
                // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                console.log(error);
                res.sendStatus(400);
            }
  
            else
            {
                res.sendStatus(204);
            }
        })          
});

app.delete('/delete-site-ajax/', function(req,res,next){
    let data = req.body;
    let siteID = parseInt(data.SiteId);
    let deleteSites = `delete from CampgroundSites where SiteId = ?`;
        // Run the 1st query
        db.pool.query(deleteSites, [siteID], function(error, rows, fields){
            if (error) {
                // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                console.log(error);
                res.sendStatus(400);
            }
  
            else
            {
                res.sendStatus(204);
            }
        })          
});

app.delete('/delete-reservation-ajax/', function(req,res,next){
    let data = req.body;
    let reserveID = parseInt(data.ReservationId);
    let deleteReserves = `delete from SiteReservations where ReservationId = ?;`;
        // Run the 1st query
        db.pool.query(deleteReserves, [reserveID], function(error, rows, fields){
            if (error) {
                // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                console.log(error);
                res.sendStatus(400);
            }
  
            else
            {
                res.sendStatus(204);
            }
        })          
});

// app.put('/put-person-ajax', function(req,res,next){                                   
//   let data = req.body;

//   let homeworld = parseInt(data.homeworld);
//   let person = parseInt(data.fullname);

//   queryUpdateWorld = `UPDATE bsg_people SET homeworld = ? WHERE bsg_people.id = ?`;
//   selectWorld = `SELECT * FROM bsg_planets WHERE id = ?`

//         // Run the 1st query
//         db.pool.query(queryUpdateWorld, [homeworld, person], function(error, rows, fields){
//             if (error) {

//             // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
//             console.log(error);
//             res.sendStatus(400);
//             }

//             // If there was no error, we run our second query and return that data so we can use it to update the people's
//             // table on the front-end
//             else
//             {
//                 // Run the second query
//                 db.pool.query(selectWorld, [homeworld], function(error, rows, fields) {
        
//                     if (error) {
//                         console.log(error);
//                         res.sendStatus(400);
//                     } else {
//                         res.send(rows);
//                     }
//                 })
//             }
// })});



/*
    LISTENER
*/
app.listen(PORT, function(){            // This is the basic syntax for what is called the 'listener' which receives incoming requests on the specified PORT.
    console.log('Express started on http://localhost:' + PORT + '; press Ctrl-C to terminate.')
});