// prevent empty for add
function preventEmptyNameAdd(){
    if (document.getElementById("input-first-name-add").value === ''){
        window.alert("Please enter First Name.")
        event.preventDefault()
    }
    else if (document.getElementById("input-last-name-add").value === ''){
        window.alert("Please enter Last Name.")
        event.preventDefault()
    }
    else if (document.getElementById("input-email-add").value === ''){
        window.alert("Please enter email.")
        event.preventDefault
    }
    else if (document.getElementById("input-phone-add").value === ''){
        window.alert("Please enter phone number.")
        event.preventDefault
    }
};

