
function deleteCustomer(custID) {
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
        refreshSelector(custID);
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
            break;
       }
    }
}

function refreshSelector(custID){
  let selectName = getElementById("input-name-menu");
  for(let i = 0; i < selectName.length; i++){
    if(Number(selectName.options[i].value) === Number(custID)){
      console.log(selectName.options[i].value);
      selectName[i].remove();
      break;
    }
  }
}