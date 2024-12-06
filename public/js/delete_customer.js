// code for deleteCampground function using jQuery
function deleteSite(custID) {
    let link = '/delete-customer-ajax/';
    let data = {
      CustomerId: custID
    };
    console.log(custID);
  
    $.ajax({
      url: link,
      type: 'DELETE',
      data: JSON.stringify(data),
      contentType: "application/json; charset=utf-8", 
      success: function(result) {
        deleteRow(custID);
      }
    });
  }

  function deleteRow(custID){

    let table = document.getElementById("customers-table");
    for (let i = 0, row; row = table.rows[i]; i++) {
       //iterate through rows
       //rows would be accessed using the "row" variable assigned in the for loop
       if (table.rows[i].getAttribute("data-value") == custID) {
            table.deleteRow(i);
            //seems to work without this function on Sites
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