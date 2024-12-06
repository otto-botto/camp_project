// code for deleteCampground function using jQuery
function deleteCampground(campID) {
  let link = '/delete-campground-ajax/';
  let data = {
    CampgroundId: campID
  };
  console.log(campID);

  $.ajax({
    url: link,
    type: 'DELETE',
    data: JSON.stringify(data),
    contentType: "application/json; charset=utf-8", 
    success: function(result) {
      deleteRow(campID);
    }
  });
}

// code for deletePerson using regular javascript/xhttp
// function deletePerson(personID) {
//     // Put our data we want to send in a javascript object
//     let data = {
//         id: personID
//     };
    
//     // Setup our AJAX request
//     var xhttp = new XMLHttpRequest();
//     xhttp.open("DELETE", "/delete-person-ajax", true);
//     xhttp.setRequestHeader("Content-type", "application/json");

//     // Tell our AJAX request how to resolve
//     xhttp.onreadystatechange = () => {
//         if (xhttp.readyState == 4 && xhttp.status == 204) {

//             // Add the new data to the table
//             deleteRow(personID);
//         }
//         else if (xhttp.readyState == 4 && xhttp.status != 204) {
//             console.log("There was an error with the input.")
//         }
//     }
//     // Send the request and wait for the response
//     xhttp.send(JSON.stringify(data));
// }

function deleteRow(campID){

    let table = document.getElementById("campgrounds-table");
    for (let i = 0, row; row = table.rows[i]; i++) {
       //iterate through rows
       //rows would be accessed using the "row" variable assigned in the for loop
       if (table.rows[i].getAttribute("data-value") == campID) {
            table.deleteRow(i);
            //seems to work without this function on Sites
            // deleteDropDownMenu(campID);
            break;
       }
    }
}


// function deleteDropDownMenu(personID){
//   let selectMenu = document.getElementById("mySelect");
//   for (let i = 0; i < selectMenu.length; i++){
//     if (Number(selectMenu.options[i].value) === Number(personID)){
//       selectMenu[i].remove();
//       break;
//     } 

//   }
// }

