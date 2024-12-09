// code for deleteReservation function using jQuery
function deleteReservation(reserveID) {
    let link = '/delete-reservation-ajax/';
    let data = {
      ReservationId: reserveID
    };
    console.log(reserveID);
  
    $.ajax({
      url: link,
      type: 'DELETE',
      data: JSON.stringify(data),
      contentType: "application/json; charset=utf-8", 
      success: function(result) {
        deleteRow(reserveID);
      }
    });
  }

  function deleteRow(reserveID){

    let table = document.getElementById("reservations-table");
    for (let i = 0, row; row = table.rows[i]; i++) {
       //iterate through rows
       //rows would be accessed using the "row" variable assigned in the for loop
       if (table.rows[i].getAttribute("data-value") == reserveID) {
            table.deleteRow(i);
            //seems to work without this function on Reservations
            // deleteDropDownMenu(custID);
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