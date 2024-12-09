// prevent empty for add
function preventEmptyDateAdd(){
    if (document.getElementById("input-start-add").value === ""){
        window.alert("Please choose a start date")
        event.preventDefault()
    }
    else if (document.getElementById("input-end-add").value === ""){
        window.alert("Please choose an end date")
        event.preventDefault()
    }
};

//Prevent empty for update
function preventEmptyDateUpdate(){
    if (document.getElementById("input-start-update").value === ""){
        window.alert("Please choose a start date")
        event.preventDefault()
    }
    else if (document.getElementById("input-end-update").value === ""){
        window.alert("Please choose an end date")
        event.preventDefault()
    }
};