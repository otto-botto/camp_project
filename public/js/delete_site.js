// code for deleteSite function using jQuery
function deleteSite(siteID) {
    let link = '/delete-site-ajax/';
    let data = {
      SiteId: siteID
    };
    console.log(siteID);
  
    $.ajax({
      url: link,
      type: 'DELETE',
      data: JSON.stringify(data),
      contentType: "application/json; charset=utf-8", 
      success: function(result) {
        deleteRow(siteID);
      }
    });
  }

  function deleteRow(siteID){

    let table = document.getElementById("sites-table");
    for (let i = 0, row; row = table.rows[i]; i++) {
       //iterate through rows
       //rows would be accessed using the "row" variable assigned in the for loop
       if (table.rows[i].getAttribute("data-value") == siteID) {
            table.deleteRow(i);
            break;
       }
    }
}
