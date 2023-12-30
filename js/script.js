const baseUrl = "https://www.sicklecellfoundation.com/scfn-luth-api/api/";
let globalid;

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

function getAllEvents() {
    const getKey = localStorage.getItem("admin");
    const paginationContainer = document.getElementById('pagination-container');


    const showEvent = document.querySelector(".showEvent");
    const getModal = document.querySelector(".pagemodal");

    getModal.style.display = "block";

    const contentHeader = new Headers();
    contentHeader.append("Authorization", `Bearer ${getKey}`);

    const eventMethod = {
        method: 'GET',
        headers: contentHeader
    }

    let data = [];

    const url = `${baseUrl}admin/get-events-and-news`;

    fetch(url, eventMethod)
    .then(response => response.json())
    .then(result => {
        console.log(result)

        if (result.data.length === 0) {
            showEvent.innerHTML = "No Records Found!";
            getModal.style.display = "none";
        }
        else {
            result.data.map((item) => {
                data += `
                   <div class="col-sm-12 col-md-12 col-lg-6">
                      <div class="search-card">
                         <div class="search-card-header">
                            <img src=${item.events_news_front_image} alt="image" class="w-100">
                         </div>
                         <div class="search-card-body">
                            <h5>${item.events_news_name}</h5>
                            <p>${item.events_news_content.substring(0, 150)}<span style="color: #C80606">...Read More</span></p>
                         </div>
                         <div class="search-card-footer text-right">
                            <i class="fas fa-edit tit" title="edit content" onclick="showEditModal(${item.id})"></i>
                         </div>
                      </div>
                   </div>
                `
                showEvent.innerHTML = data;
                getModal.style.display = "none";
            })
        }

        let totalPages = result.last_page;
        let currentPage = result.current_page;
        let maxVisiblePages = 5;

        function createPagination() {
            paginationContainer.innerHTML = '';

            const startPage = Math.max(currentPage - Math.floor(maxVisiblePages / 2), 1);
            const endPage = Math.min(startPage + maxVisiblePages - 1, totalPages);

            for (let page = startPage; page <= endPage; page++) {
                const pageElement = document.createElement('span');
                pageElement.textContent = page;
                pageElement.className = page === currentPage ? 'mactive3' : '';
                pageElement.classList.add("monc");
                pageElement.addEventListener('click', () => onPageClick(page));
                paginationContainer.appendChild(pageElement);
            }

            if (startPage > 1) {
                const prevDots = document.createElement('span');
                prevDots.textContent = '...';
                prevDots.className = 'dots';
                paginationContainer.insertBefore(prevDots, paginationContainer.firstChild);
            }
            if (endPage < totalPages) {
                const nextDots = document.createElement('span');
                nextDots.textContent = '...';
                nextDots.className = 'dots';
                paginationContainer.appendChild(nextDots);
            }
            
        }
        function onPageClick(page) {
            currentPage = page;
            console.log(currentPage)
            const getSpin = document.querySelector(".pagemodal");
            getSpin.style.display = "block";

            const getKey = localStorage.getItem("admin");

            const contentHeader = new Headers();
            contentHeader.append("Authorization", `Bearer ${getKey}`);

            const eventMethod = {
                method: 'GET',
                headers: contentHeader
            }

            let data2 = [];

            const url = `${baseUrl}admin/get-events-and-news?page=${currentPage}`;

           fetch(url, eventMethod)
           .then(response => response.json())
           .then(result => {
               console.log(result)
               result.data.map((item) => {
                data2 += `
                   <div class="col-sm-12 col-md-12 col-lg-6">
                      <div class="search-card">
                         <div class="search-card-header">
                            <img src=${item.events_news_front_image} alt="image" class="w-100">
                         </div>
                         <div class="search-card-body">
                            <h5>${item.events_news_name}</h5>
                            <p>${item.events_news_content.substring(0, 150)}<span style="color: #C80606">...Read More</span></p>
                         </div>
                         <div class="search-card-footer text-right">
                            <i class="fas fa-edit tit" title="edit content" onclick="showEditModal(${item.id})"></i>
                         </div>
                      </div>
                   </div>
                `
                showEvent.innerHTML = data2;
                getModal.style.display = "none";
            })
           })
           .catch(error => console.log('error', error));
            createPagination()
        }

        createPagination();

    })
    .catch(error => console.log('error', error));
}

function showEditModal(upid) {
    const getModal = document.getElementById("update-modal");
    getModal.style.display = "block";
    globalid = upid;
}

function updateModal() {
    const getModal = document.getElementById("update-modal");
    getModal.style.display = "none"
}

function updateContent(event) {
    event.preventDefault();

    const getSpin = document.querySelector(".spin");
    getSpin.style.display = "inline-block";

    const upeventName = document.querySelector(".upeName").value;
    const upfrontImage = document.querySelector(".upfimg").files[0];
    const upeventCategory = document.querySelector(".upcat").value;


    let myContent = tinymce.activeEditor.getContent();
    let strippedOutput = myContent.replace(/<[^>]*>/g, '');

    let multipleImage = document.querySelector(".upmimg");

    let selectFiles = multipleImage.files;

    if (upfrontImage === "" || upeventName === "" || upeventCategory === "") {
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
        contentData.append("id", globalid)
        contentData.append("front_image", upfrontImage);

        for (let i = 0; i < selectFiles.length; i++) {
            contentData.append("files[]", selectFiles[i])
        }
        contentData.append("events_news_name", upeventName);
        contentData.append("category_type", upeventCategory);
        contentData.append("events_news_content", strippedOutput);

        const contentMethod = {
            method: 'POST',
            headers: contentHeader,
            body: contentData
        }

        const url = `${baseUrl}admin/edit-events-and-news`;

        fetch(url, contentMethod)
        .then(response => response.json())
        .then(result => {
            console.log(result)

            if (result.message === "updated successfully") {
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