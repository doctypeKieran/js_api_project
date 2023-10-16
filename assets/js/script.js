// eRNCBmLcb9II4-BabXRcguNg6Vs

const API_KEY = "eRNCBmLcb9II4-BabXRcguNg6Vs";
const API_URL = "https://ci-jshint.herokuapp.com/api";
const resultsModal = new bootstrap.Modal(document.getElementById("resultsModal"));

document.getElementById("status").addEventListener("click", e => getStatus(e));
document.getElementById('submit').addEventListener("click", e => postForm(e));

function processOptions(form) {
    let optArray = [];

    for (let entry of form.entries()) {
        if (entry[0] === "options") {
            optArray.push(entry[1]);
        }
    }
    form.delete("options");

    form.append("options", optArray.join());

    return form;
}

async function postForm(e) {
    const form = processOptions(new FormData(document.getElementById("checksform")));

    const response = await fetch(API_URL, {
        method: "POST",
        headers: {
            "Authorization": API_KEY,
        },
        body: form
    });

    const data = await response.json();

    if (response.ok) {
        displayErrors(data);
    } else {
        displayException(data);
        throw new Error(data.error);
    }
}

function displayErrors(data) {
    const modalTitle = document.getElementById('resultsModalTitle');
    const modalContent = document.getElementById('results-content');

    let results = "";

    let heading = `JSHint Results for ${data.file}`;

    if (data.errors === 0) {
        results = `<div class="no_errors">No errors reported!</div>`;
    } else {
        results = `<div>Total Errors: <span class="error_count">${data.total_errors}</span></div>`;

        for (let error of data.error_list) {
            results += `<div>At line <span class="line">${error.line} </span>`;
            results += `column <span class="column">${error.col}</span></div>`;
            results += `<div class="error">${error.error}</div>`;
        }
    }

    modalTitle.innerText = heading;
    modalContent.innerHTML = results;

    resultsModal.show();
}

async function getStatus(e) {

    const queryString = `${API_URL}?api_key=${API_KEY}`;

    const response = await fetch(queryString);

    const data = await response.json();

    if (response.ok) {
        displayStatus(data);
    } else {
        displayException(data);
        throw new Error(data.error);
    }
}

function displayStatus(data) {
    const modalTitle = document.getElementById('resultsModalTitle');
    const modalContent = document.getElementById('results-content');

    modalTitle.innerText = "API Key Status";
    modalContent.innerText = `Your key is valid until \n${data.expiry}`;

    resultsModal.show();
}

function displayException(data) {
    const heading = "An Exception Occurred";

    const errorText = data.error;
    const errorCode = data.status_code;
    const errorNumber = data.error_no;

    const modalTitle = document.getElementById('resultsModalTitle');
    const modalContent = document.getElementById('results-content');

    modalTitle.innerText = heading;
    modalContent.innerHTML = `
    <div>The API returned status code ${errorCode}</div>
    <div>Error number: <strong>${errorNumber}</strong></div>
    <div>Error text: <strong>${errorText}</strong></div>
    `

    resultsModal.show();

    console.log(`Text: ${errorText}, Code: ${errorCode}, Number: ${errorNumber}`);
}