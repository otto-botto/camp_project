// Citation:The code setup here stems from CS 340 starter code for node js.
// website: https://github.com/osu-cs340-ecampus/nodejs-starter-app
// Submission date: 12/09/2024
// Group 07: Lora Dushanova and Sasha Richards
// The SQL queries are our original writing. The app.js functions have been modified from the starter code.


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
    let query1;
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
    let query1;
    if(req.query.CampgroundName === undefined){
        query1 = `select Campgrounds.CampgroundName, CampgroundSites.SiteId, CampgroundSites.SiteNumber 
                from Campgrounds
                join CampgroundSites on CampgroundSites.GroundSiteId = Campgrounds.CampgroundId  
                order by Campgrounds.CampgroundName;`;
    }
    else{
        query1 = `select Campgrounds.CampgroundName, CampgroundSites.SiteId, CampgroundSites.SiteNumber 
                  from Campgrounds
                  join CampgroundSites on CampgroundSites.GroundSiteId = Campgrounds.CampgroundId  
                  where Campgrounds.CampgroundName like '${req.query.CampgroundName}%'
                  order by Campgrounds.CampgroundName;`;
    }
    
    
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
    let query1;

    if(req.query.LastName === undefined){
        query1 = `select SiteReservations.ReservationId, Customers.FirstName, Customers.LastName, 
        CampgroundSites.SiteNumber, 
        Campgrounds.CampgroundName, SiteReservations.ReservationStart, SiteReservations.ReservationEnd,
        SiteReservations.ReservationTimestamp 
        from CampgroundSites
        join SiteReservations on SiteReservations.SiteReservationId = CampgroundSites.SiteId
        join Customers on Customers.CustomerId = SiteReservations.CustReservationId
        join Campgrounds on Campgrounds.CampgroundId = CampgroundSites.GroundSiteId
        order by SiteReservations.ReservationId;`;
    }
    else{
        query1 = `select SiteReservations.ReservationId, Customers.FirstName, Customers.LastName,                                     
                    CampgroundSites.SiteNumber,                                                                     
                    Campgrounds.CampgroundName, SiteReservations.ReservationStart, SiteReservations.ReservationEnd, 
                    SiteReservations.ReservationTimestamp                                                           
                    from CampgroundSites                                                                            
                    join SiteReservations on SiteReservations.SiteReservationId = CampgroundSites.SiteId            
                    join Customers on Customers.CustomerId = SiteReservations.CustReservationId                     
                    join Campgrounds on Campgrounds.CampgroundId = CampgroundSites.GroundSiteId                     
                    where Customers.LastName like '${req.query.LastName}%'                                                           
                    order by SiteReservations.ReservationId;                                                        `;  
    }


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
    console.log(data);

    // Create the query and run it on the database
    query1 = `INSERT INTO Customers (FirstName, LastName, CustomerEmail, CustomerPhone) 
    VALUES ('${data['input-first-name-add']}', '${data['input-last-name-add']}', '${data['input-email-add']}', 
    '${data['input-phone-add']}')`;

    console.log(query1);
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
                     '${data['input-start-add']}',
                     '${data['input-end-add']}');`;
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
    let deleteCustomers = `delete from Customers where CustomerId = ${custID};`;
    console.log(deleteCustomers);
        // Run the 1st query
        db.pool.query(deleteCustomers, function(error, rows, fields){
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

// --- UPDATE ---

// Update campground
app.post('/update-campground-form', function(req, res){
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;
    let id = parseInt(data['input-camp']);

    let querySelectCampground = `SELECT * FROM Campgrounds WHERE CampgroundId = ${id};`;
 
    // Create the query and run it on the database
    db.pool.query(querySelectCampground, function(error, rows, fields){
        // console.log(rows[0]);
 
        // Check to see if there was an error
        if (error) {
            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error)
            res.sendStatus(400);
        }
        else
        {
            let phone = rows[0].CampgroundPhone;
            let sites = rows[0].NumberOfSites;
            let state = rows[0].CampgroundState;
            let town = rows[0].ClosestTown;
            let dist = rows[0].DistanceToTown;
            let long = rows[0].Longitude;
            let lat = rows[0].Latitude;
            
            if (data['update-phone'] !== ''){
                phone = data['update-phone']
            };

            if (data['update-sites'] !== ''){
                sites = data['update-sites']
            };

            if (data['update-state'] !== ''){
                state = data['update-state']
            };

            if (data['update-town'] !== ''){
                town = data['update-town']
            };

            if (data['update-distance'] !== ''){
                dist = parseFloat(data['update-distance'])
            };
            if (data['update-longitude'] !== ''){
                long = parseFloat(data['update-longitude'])
            };
            if (data['update-latitude'] !== ''){
                lat = parseFloat(data['update-latitude'])
            };
            
            let queryUpdateCampground = `UPDATE Campgrounds 
                                        SET CampgroundPhone = '${phone}',
                                        NumberOfSites = ${sites},
                                        CampgroundState = '${state}',
                                        ClosestTown = '${town}',
                                        DistanceToTown = ${dist},
                                        Longitude = ${long},
                                        Latitude = ${lat} 
                                        WHERE CampgroundId = ${id};`;
                                   
            db.pool.query(queryUpdateCampground, function(error, rows, fields){
                if (error) {
                    console.log(error)
                    res.sendStatus(400);
                }
                else {
                    res.redirect('/campgrounds');
                }
        })}
    })}
);

//Update customer
app.post('/update-customer-form', function(req, res){
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;
    let id = parseInt(data['input-name-menu']);
 
    let querySelectCustomer = `SELECT * FROM Customers WHERE CustomerId = ${id};`;

    // Create the query and run it on the database
    db.pool.query(querySelectCustomer, function(error, rows, fields){
 
        // Check to see if there was an error
        if (error) {
 
            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error)
            res.sendStatus(400);
        } else
        {
            let phone = rows[0].CustomerPhone
            let email = rows[0].CustomerEmail

            if(data['input-phone-update'] !== ''){
                phone = data['input-phone-update']
            };

            if(data['input-email-update'] !== ''){
                email = data['input-email-update']
            };  
 
            let queryUpdateCustomer = `UPDATE Customers SET CustomerPhone = '${phone}', CustomerEmail = '${email}'
                                    WHERE CustomerId = ${id};`;
            
            console.log(queryUpdateCustomer);                       
            db.pool.query(queryUpdateCustomer, function(error, rows, fields){
 
                // Check to see if there was an error
                if (error) {
       
                    // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                    console.log(error)
                    res.sendStatus(400);
                }
 
                // If there was no error, we redirect back to our root route, which automatically runs the SELECT * FROM Customers and
                // presents it on the screen
                else {
                    res.redirect('/customers');
                }
        })}
    })}
);

//Update a reservation
app.post('/update-reservation-form', function(req, res){
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;
    let reservationId = parseInt(data['input-reservationId']);

    let querySelectReservation = `SELECT * FROM SiteReservations WHERE ReservationId = ${reservationId};`;

    // Create the query and run it on the database
    db.pool.query(querySelectReservation, function(error, rows, fields){

        // Check to see if there was an error
        if (error) {
            console.log(error);
            res.sendStatus(400);
        }

        else {

            // Validate empty fields values

            let startDate = rows[0].ReservationStart
            let endDate = rows[0].ReservationEnd

            if (data['input-start-update'] !== ''){
                startDate = data['input-start-update']
            };

            if (data['input-end-update'] !== ''){
                endDate = data['input-end-update']
            };

            // Create the query and run it on the database
            let queryUpdateReservation = `UPDATE SiteReservations 
                                          SET ReservationStart = '${startDate}', 
                                          ReservationEnd = '${endDate}'
                                          WHERE ReservationId = ${reservationId};`;

                console.log(queryUpdateReservation)
                db.pool.query(queryUpdateReservation, function(error, rows, fields){
                // Check to see if there was an error
                if (error) {

                    // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                    console.log(error)
                    res.sendStatus(400);
                }

                // If there was no error, we redirect back to our root route, which automatically runs the SELECT * FROM Customers and
                // presents it on the screen
                else {
                    res.redirect('/reservations');
                }
            })
        }})
});


/*
    LISTENER
*/
app.listen(PORT, function(){            // This is the basic syntax for what is called the 'listener' which receives incoming requests on the specified PORT.
    console.log('Express started on http://localhost:' + PORT + '; press Ctrl-C to terminate.')
});

