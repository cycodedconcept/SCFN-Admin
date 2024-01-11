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
    const dayItem = document.querySelector(".dayItem").value;
    const monthItem = document.querySelector(".monthItem").value;
    const yearItem = document.querySelector(".yearItem").value;



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
        contentData.append("day", dayItem);
        contentData.append("month", monthItem);
        contentData.append("year", yearItem);



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

        localStorage.setItem("items", JSON.stringify(result.data))

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
                            <p>${item.events_news_content.substring(0, 150)}<span style="color: #C80606"><a href="../details.html?id=${item.id}">...Read More</a></span></p>
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
               localStorage.setItem("items", JSON.stringify(result.data))
               result.data.map((item) => {
                data2 += `
                   <div class="col-sm-12 col-md-12 col-lg-6">
                      <div class="search-card">
                         <div class="search-card-header">
                            <img src=${item.events_news_front_image} alt="image" class="w-100">
                         </div>
                         <div class="search-card-body">
                            <h5>${item.events_news_name}</h5>
                            <p>${item.events_news_content.substring(0, 150)}<span style="color: #C80606"><a href="../details.html?id=${item.id}">...Read More</a></span></p>
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
    const upName = document.querySelector(".upeName");
    let dropdown = document.querySelector(".upcat");
    const day = document.getElementById("day");
    const month = document.getElementById("month");
    const year = document.getElementById("year");



    const getModal = document.getElementById("update-modal");
    getModal.style.display = "block";
    globalid = upid;

    const getItems = localStorage.getItem("items");
    const theItems = JSON.parse(getItems);

    let opValue;
    let dayValue;
    let monthValue;
    let yearValue;

    theItems.map((item) => {
        if (upid === item.id) {
            upName.setAttribute("value", `${item.events_news_name}`);
            tinyMCE.activeEditor.setContent(item.events_news_content);
            opValue = item.category_type;
            dayValue = item.day;
            monthValue = item.month;
            yearValue = item.year;
        }     

    })

    for (let i = 0; i < dropdown.options.length; i++) {
        if (dropdown.options[i].value === opValue) {
          dropdown.selectedIndex = i;
          break;
        }
    }

    for (let i = 0; i < day.options.length; i++) {
        if (dropdown.options[i].value === dayValue) {
            dropdown.selectedIndex = i;
            break;
        }
    }
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

function updateAdmin(event) {
    event.preventDefault();

    const getSpin = document.querySelector(".spin2");
    getSpin.style.display = "inline-block";

    const oldPass = document.querySelector(".oldpass").value;
    const newPass = document.querySelector(".newpass").value;


    if (oldPass === "" || newPass === "") {
        Swal.fire({
            icon: 'info',
            text: "Both Fields are Required!",
            confirmButtonColor: 'rgb(13, 141, 13)'
        })
        getSpin.style.display = "none";
    }

    else {
        const getKey = localStorage.getItem("admin");

        const contentHeader = new Headers();
        contentHeader.append("Authorization", `Bearer ${getKey}`);

        const updata = new FormData();
        updata.append("oldpassword", oldPass);
        updata.append("newpassword", newPass);

        const upMethod = {
            method: 'POST',
            headers: contentHeader,
            body: updata
        }

        const url = `${baseUrl}admin/update-admin-details`;

        fetch(url, upMethod)
        .then(response => response.json())
        .then(result => {
            console.log(result)

            if (result.status === "success") {
                Swal.fire({
                    icon: 'success',
                    text: `${result.message}`,
                    confirmButtonColor: 'rgb(13, 141, 13)'
                })
                setTimeout(() => {
                    location.href = "../index.html"
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


function blogDetails() {
    const params = new URLSearchParams(window.location.search);
    let getId = params.get('id');
    myId = parseInt(getId)

    const sectionBlog = document.querySelector(".owl-carousel");
    const frontImage = document.querySelector(".front-img");
    const blogHead = document.querySelector(".blog-head");

    const textBlog = document.querySelector(".item-text");


    const getItems = localStorage.getItem("items");
    const theItems = JSON.parse(getItems);

    let data = [];

    theItems.map((item) => {
        console.log(item)
        if (myId === item.id) {
            item.event_news_image_array.map((itemImage) => {
                data += `
                <div class="card-item-image">
                    <div class="search-card-force">
                        <div class="search-card-header">
                            <img src=${itemImage.file_url} alt="" class="w-100"/>
                        </div>
                    </div>
                </div>        
                `
                sectionBlog.innerHTML = data;
                
            })

        
            let dynamicText = item.events_news_content;

            let newText = dynamicText.replace(/\./g, `.\n <br><br>`);

            textBlog.innerHTML = `<p>${newText}</p>`;

            frontImage.src = item.events_news_front_image;
            blogHead.innerHTML = item.events_news_name;
        }
    })
}


function populateDays() {
    let dayDropdown = document.querySelector(".dayItem");
    let dayDropdown2 = document.querySelector(".updayItem");


    for (let i = 1; i <= 31; i++) {
      let option = document.createElement("option");
      option.value = i;
      option.text = i;
      dayDropdown.add(option);
    }

    for (let i = 1; i <= 31; i++) {
        let option = document.createElement("option");
        option.value = i;
        option.text = i;
        dayDropdown2.add(option);
    }
}

  // Function to populate the months dropdown
function populateMonths() {
    let monthDropdown = document.querySelector(".monthItem");
    let monthDropdown2 = document.querySelector(".upmonthItem");

    let months = [
        "January", "February", "March", "April",
        "May", "June", "July", "August",
        "September", "October", "November", "December"
    ];

    for (let i = 0; i < months.length; i++) {
        let option = document.createElement("option");
        option.value = i + 1;
        option.text = months[i];
        monthDropdown.add(option);
    }

    for (let i = 0; i < months.length; i++) {
        let option = document.createElement("option");
        option.value = i + 1;
        option.text = months[i];
        monthDropdown2.add(option);
    }
}

  // Function to populate the years dropdown (adjust the range as needed)
function populateYears() {
    let yearDropdown = document.querySelector(".yearItem");
    let yearDropdown2 = document.querySelector(".upyearItem");

    let currentYear = new Date().getFullYear();

    for (let i = currentYear; i >= currentYear - 100; i--) {
      let option = document.createElement("option");
      option.value = i;
      option.text = i;
      yearDropdown.add(option);
    }

    for (let i = currentYear; i >= currentYear - 100; i--) {
        let option = document.createElement("option");
        option.value = i;
        option.text = i;
        yearDropdown2.add(option);
    }
}

  
function showEventDetails(event) {
    const eSlide = document.querySelector(".event-side");
    event.currentTarget.value === "event" ? 
    eSlide.style.display = "block" : 
    eSlide.style.display = "none";

}


function slideIt() {
    $('.owl-two').owlCarousel({
        margin: 20,
        loop  : true,
        items: 1,
        dots:true,
        autoplay: true,
        smartSpeed :900,
        nav: true,
        navText: ["<div class='nav-button owl-prev'><img src='../assets/slo.png' style='width: 12px;'></div>", "<div class='nav-button owl-next'><img src='../assets/slo2.png' style='width: 12px;'></div>"],
        responsive: {
            0: {
                items: 1
            },
            600: {
                items: 1
            },
            1000: {
                items: 3
            }
        }
    });
}


