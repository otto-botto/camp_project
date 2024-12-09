Bobby Tables Camping Co

We used the starter code from the CS340 repo for out app.js and handlebar files. 
We also added js files to prevent an admin from adding and updating with empty entries. 
Update applies to tables Campgrounds, Customers, and SiteReservations. 

-- CmapgroundSites (Sites) is a table, which receives campground information from
Campgrounds. The admin can add a site to an existing campground. 

-- SiteReservations (Reservations) is an associative table of the M:N relationship
between Customers and Campgrounds. An admin can add and update a reservation. 
