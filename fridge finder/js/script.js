let form = document.getElementById("itemForm");
let fridgeGrid = document.getElementById("fridgeGrid");

document.addEventListener("DOMContentLoaded", function () {
    let saved = JSON.parse(localStorage.getItem("fridgeItems")) || [];
    saved.forEach(item => {
        let newItem = document.createElement("div");
        newItem.classList.add("item-row");
        newItem.innerHTML = `
            <span class="item-name">${item.name}</span>
            <span class="item-expiry">${item.expiry}</span>
            <button class="remove-btn" aria-label="Remove item">✕</button>
        `;
        fridgeGrid.appendChild(newItem);
    });
});

form.addEventListener("submit", function(event) {
    event.preventDefault();

    let foodName = document.getElementById("itemName").value;
    let expiryDate = document.getElementById("expiryDate").value;

    let newItem = document.createElement("div");
    newItem.classList.add("item-row");

    newItem.innerHTML = `
        <span class="item-name">${foodName}</span>
        <span class="item-expiry">${expiryDate}</span>
        <button class="remove-btn" aria-label="Remove item">✕</button>
    `;

    fridgeGrid.appendChild(newItem);

    let saved = JSON.parse(localStorage.getItem("fridgeItems")) || [];
    saved.push({ name: foodName, expiry: expiryDate });
    localStorage.setItem("fridgeItems", JSON.stringify(saved));

    form.reset();
});

document.addEventListener("click", function(event) {
    if (event.target.classList.contains("remove-btn")) {
        let row = event.target.parentElement;
        let name = row.querySelector(".item-name").textContent;
        let expiry = row.querySelector(".item-expiry").textContent;

        row.remove();

        let saved = JSON.parse(localStorage.getItem("fridgeItems")) || [];
        saved = saved.filter(item => !(item.name === name && item.expiry === expiry));
        localStorage.setItem("fridgeItems", JSON.stringify(saved));
    }
});

document.getElementById("clearFridge").addEventListener("click", function () {
    fridgeGrid.innerHTML = "";
    localStorage.removeItem("fridgeItems");
});

let dateSpan = document.getElementById("currentDate");

let today = new Date();
let options = { weekday: "long", year: "numeric", month: "long", day: "numeric" };
dateSpan.textContent = today.toLocaleDateString(undefined, options);

function updateExpiryColors() {
    let rows = document.querySelectorAll(".item-row");

    rows.forEach(row => {
        let expiryText = row.querySelector(".item-expiry").textContent;
        let expDate = new Date(expiryText);
        let today = new Date();

        let diff = expDate - today;
        let daysLeft = Math.ceil(diff / (1000 * 60 * 60 * 24));

        // remove old classes
        row.classList.remove("expiring", "expired");

        if (daysLeft < 0) {
            row.classList.add("expired");
        } else if (daysLeft <= 3) {
            row.classList.add("expiring");
        }
    });
}

document.addEventListener("DOMContentLoaded", updateExpiryColors);
document.addEventListener("click", updateExpiryColors);
form.addEventListener("submit", updateExpiryColors);