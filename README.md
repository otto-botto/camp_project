Bobby Tables Camping Co

We used the started code for CS340 mostly for app.js and the delete.js files. 
We also added js files to prevent the addition and update with empty entries. 
Update applies to tables Campgrounds and Customers. 

-- SiteReservations (Sites) is a table, which receives campground information from
Campgrounds. The admin can also add a site to a campground via this table. 

-- CampgroundReservations (Reservations) is an associative table of the M:N relationship
between Customers and Campgrounds. An admin is able to update a reservation. 
