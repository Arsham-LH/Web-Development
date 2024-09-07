//************************************Variables*********************************
let form_el = document.getElementById("contact-us-form");

let formName_el = document.getElementById("form-name");
let formEmail_el = document.getElementById("form-email");
let formTitle_el = document.getElementById("form-title");
let formText_el = document.getElementById("form-text");

let errorMessage_div = document.getElementById("errorMessage");
let successMessage_div = document.getElementById("successMessage");

//******************************************************************************
form_el.addEventListener("submit", submitForm);


//************************************Functions*********************************
function submitForm(event) {
    event.preventDefault();

    let name = formName_el.querySelector("input").value;
    let email = formEmail_el.querySelector("input").value;
    let title = formTitle_el.querySelector("input").value;
    let text = formText_el.querySelector("textarea").value;


    let [isValid, errorMessage] = validateForm(name, email, title);

    if (isValid) {
        let post_obj = new Object;
        post_obj.name = name;
        post_obj.email = email;
        post_obj.title = title;
        post_obj.text = text;
        console.log(JSON.stringify(post_obj));



        fetch('http://localhost:3000/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(post_obj)
            })
            .then((response) => {
                renderSuccess();
            })
            // .then((feedback) => {
            //     let success = feedback.success;

        //     if (!success) {
        //         let errorMessage = feedback.errorMessage;
        //         renderError(errorMessage);
        //     } else {
        //         renderSuccess();
        //     }
        // })
        .catch((error) => { console.log(error); });


    } else {
        renderError(errorMessage);
    }


}

function validateForm(name, email, title) {
    let isValid = true;
    let errorMessage = "";
    let errorSections = new Array();

    if (!name) {
        isValid = false;
        errorSections.push("نام و نام خانوادگی");
        formName_el.querySelector("input").classList.remove("is-valid");
        formName_el.querySelector("input").classList.add("is-invalid");
    } else {
        formName_el.querySelector("input").classList.add("is-valid");
        formName_el.querySelector("input").classList.remove("is-invalid");
    }

    if (!isValidEmail(email)) {

        isValid = false;
        errorSections.push("ایمیل معتبر");
        formEmail_el.querySelector("input").classList.remove("is-valid");
        formEmail_el.querySelector("input").classList.add("is-invalid");
    } else {
        formEmail_el.querySelector("input").classList.add("is-valid");
        formEmail_el.querySelector("input").classList.remove("is-invalid");
    }

    if (!title) {
        isValid = false;
        errorSections.push("عنوان");
        formTitle_el.querySelector("input").classList.remove("is-valid");
        formTitle_el.querySelector("input").classList.add("is-invalid");
    } else {
        formTitle_el.querySelector("input").classList.add("is-valid");
        formTitle_el.querySelector("input").classList.remove("is-invalid");
    }

    if (!isValid) {
        errorMessage = errorSections.join(" و ");
        errorMessage = "وارد کردن " + errorMessage + " الزامی است";
    }

    return [isValid, errorMessage];
}

function isValidEmail(email) {
    const emailRegex =
        new RegExp(/^[A-Za-z0-9_!#$%&'*+\/=?`{|}~^.-]+@[A-Za-z0-9.-]+$/, "gm");
    return emailRegex.test(email);
}

function renderError(errorMessage) {
    errorMessage_div.innerHTML = errorMessage;
    errorMessage_div.classList.remove("d-none");
    successMessage_div.classList.add("d-none");
}

function renderSuccess() {
    errorMessage_div.classList.add("d-none");
    successMessage_div.classList.remove("d-none");
}

//******************************************************************************