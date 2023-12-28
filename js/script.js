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
            confirmButtonColor: 'rgb(13, 141, 13)'
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
            localStorage.setItem("admin", result.api_key);

            if (result.status === "success") {
                Swal.fire({
                    icon: 'success',
                    text: `${result.status}`,
                    confirmButtonColor: 'rgb(13, 141, 13)'
                })

                setTimeout(() => {
                    location.href = "./dashboard"
                }, 3000)
            }
            else {
                Swal.fire({
                    icon: 'info',
                    text: `${result.status}`,
                    confirmButtonColor: 'rgb(13, 141, 13)'
                }) 
            }
        })
        .catch(error => console.log('error', error));
    }

}

function createDev(event) {
    event.preventDefault();

    const openModal = document.getElementById("up-modal");
    openModal.style.display = "block";
}

function upModal() {
    const openModal = document.getElementById("up-modal");
    openModal.style.display = "none"; 
}


function createNewContent(event) {
    event.preventDefault();

    const getSpin = document.querySelector(".spin");
    getSpin.style.display = "inline-block";

    
    const eventName = document.querySelector(".eName").value;
    const frontImage = document.querySelector(".fimg").files[0];
    const eventCategory = document.querySelector(".cat").value;


    // let eventContent = document.querySelector(".content").value;

    let myContent = tinymce.activeEditor.getContent();
    let strippedOutput = myContent.replace(/<[^>]*>/g, '');

    let multipleImage = document.querySelector(".mimg");

    let selectFiles = multipleImage.files;

    

    if (frontImage === "" || eventName === "") {
        Swal.fire({
            icon: 'info',
            text: 'All Fields are Required!',
            confirmButtonColor: 'rgb(13, 141, 13)'
        })

        getSpin.style.display = "none";
    }

    else {
        const getKey = localStorage.getItem("admin");

        const contentHeader = new Headers();
        contentHeader.append("Authorization", `Bearer ${getKey}`);

        const contentData = new FormData();
        contentData.append("front_image", frontImage);

        for (let i = 0; i < selectFiles.length; i++) {
            contentData.append("files[]", selectFiles[i])
        }
        contentData.append("events_news_name", eventName);
        contentData.append("category_type", eventCategory);
        contentData.append("events_news_content", strippedOutput);


        const contentMethod = {
            method: 'POST',
            headers: contentHeader,
            body: contentData
        }

        const url = `${baseUrl}admin/create-events-and-news`;

        fetch(url, contentMethod)
        .then(response => response.json())
        .then(result => {
            console.log(result)

            if (result.message === "Files uploaded successfully!") {
                Swal.fire({
                    icon: 'success',
                    text: `${result.message}`,
                    confirmButtonColor: 'rgb(13, 141, 13)'
                })

                setTimeout(() => {
                    location.reload();
                }, 3000)
            }
            else {
                Swal.fire({
                    icon: 'info',
                    text: `${result.message}`,
                    confirmButtonColor: 'rgb(13, 141, 13)'
                })
                getSpin.style.display = "none";
            }
        })
        .catch(error => console.log('error', error));
    }

}