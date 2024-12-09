
// Get the objects we need to modify
let updateCampgroundForm = document.getElementById('update-campground-form');

// Modify the objects we need
updateCampgroundForm.addEventListener("submit", function (e) {
   
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputName = document.getElementById("mySelectCampName");
    let inputPhone = document.getElementById("update-phone");
    let inputSites = document.getElementById("update-sites");
    let inputState = document.getElementById("update-state");
    let inputTown = document.getElementById("update-town");
    let inputDistance = document.getElementById("update-distance");
    let inputLongitude = document.getElementById("update-longitude");
    let inputLatitude = document.getElementById("update-latitude");

    // Get the values from the form fields
    let nameValue = inputName.value;
    let phoneValue = inputPhone.value;
    let sitesValue = inputSites.value;
    let stateValue = inputState.value;
    let townValue = inputTown.value;
    let distValue = inputDistance.value; 
    let longValue = inputLongitude.value;
    let latValue = inputLatitude.value;
    // currently the database table for bsg_people does not allow updating values to NULL
    // so we must abort if being bassed NULL for homeworld
    // if (isNaN(nameValue)) {return;}
    // if (isNaN(phoneValue)) {return;}
    // if (isNaN(sitesValue)) {return;}
    // if (isNaN(stateValue)) {return;}
    // if (isNaN(townValue)) {return;}
    // if (isNaN(distValue)) {return;}
    // if (isNaN(longValue)) {return;}
    // if (isNaN(latValue)) {return;}
    
    // Put our data we want to send in a javascript object
    let data = {
        name: nameValue,
        phone: phoneValue,
        sites: sitesValue,
        state: stateValue,
        town: townValue,
        dist: distValue,
        long: longValue,
        lat: latValue
    }
    console.log(data);
    
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("PUT", "/put-campground", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            updateRow(xhttp.response, nameValue);
             // Clear the input fields for another transaction
             inputName.value = '';
             inputPhone.value = '';
             inputSites.value = '';
             inputState.value = '';
             inputTown.value = '';
             inputDistance.value = '';
             inputLongitude.value = '';
             inputLatitude.value = '';
        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }
    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));
})


function updateRow(data, name){
    let parsedData = JSON.parse(data);
    console.log(parsedData);

    let table = document.getElementById("campgrounds-table");

    for (let i = 0, row; row = table.rows[i]; i++) {
       //iterate through rows
       //rows would be accessed using the "row" variable assigned in the for loop
       if (table.rows[i].getAttribute("data-value") == name) {

            // Get the location of the row where we found the matching person ID
            let updateRowIndex = table.getElementsByTagName("tr")[i];

            // Get td of homeworld value
            let tdName = updateRowIndex.getElementsByTagName("td")[1];
            let tdPhone = updateRowIndex.getElementsByTagName("td")[2];
            let tdSites = updateRowIndex.getElementsByTagName("td")[3];
            let tdState = updateRowIndex.getElementsByTagName("td")[4];
            let tdTown = updateRowIndex.getElementsByTagName("td")[5];
            let tdDistance = updateRowIndex.getElementsByTagName("td")[6];
            let tdLongitude = updateRowIndex.getElementsByTagName("td")[7];
            let tdLatitude = updateRowIndex.getElementsByTagName("td")[8];

            console.log("Found row:", updateRowIndex);
            console.log("Name cell:", tdName);
            console.log("Phone cell:", tdPhone);

            // Reassign to every td
            tdName.innerHTML = parsedData.Name;
            tdPhone.innerHTML = parsedData.phone;
            tdSites.innerHTML = parsedData.sites;
            tdState.innerHTML = parsedData.state;
            tdTown.innerHTML = parsedData.town;
            tdDistance.innerHTML = parsedData.dist;
            tdLongitude.innerHTML = parsedData.long;
            tdLatitude.innerHTML = parsedData.lat; 
       }
    }
}


