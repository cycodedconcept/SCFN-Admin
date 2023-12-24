const baseUrl = "https://www.sicklecellfoundation.com/scfn-luth-api/api/";

function adminLog(event) {
    event.preventDefault()

    const getSpin = document.querySelector(".spin");
    getSpin.style.display = "inline-block";

    const getEmail = document.getElementById("email").value;
    const getPassword = document.getElementById("password").value;

    if (getEmail === "" || getPassword === "") {
        Swal.fire({
            icon: 'info',
            text: 'All Fields are Required',
            confirmButtonColor: '#DF3331'
        })
        getSpin.style.display = "none";
    }
    else {
        const logData = new FormData()
        logData.append("email", getEmail);
        logData.append("password", getPassword);

        const logMethod = {
            method: 'POST',
            body: logData
        }

        const url = `${baseUrl}login-admin`;

        fetch(url, logMethod)
        .then(response => response.json())
        .then(result => {
            console.log(result)
        })
        .catch(error => console.log('error', error));
    }

}