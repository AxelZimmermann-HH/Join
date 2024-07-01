const BASE_URL =
  "https://join-database-3d39f-default-rtdb.europe-west1.firebasedatabase.app/";

let contactsData = {}; 
let contactsArray = [];

async function fetchDataJson() {
  try {
    let response = await fetch(BASE_URL + ".json");
    let responseToJson = await response.json();
    contactsData = responseToJson; 
    console.log(contactsData);
    contactsArray = Object.values(contactsData); 
    contactsArray.sort((a, b) => a.name.split(' ')[0].localeCompare(b.name.split(' ')[0])); 
    console.log(contactsArray);

    createContactsList(); 

  } catch (error) {
    console.error("Error fetching data:", error);
  }
}


function createContactsList() {
    let content = document.getElementById('contacts-list');
    content.innerHTML = '';
    let currentLetter = '';

    for (i=0 ; i<contactsArray.length; i++) {
        let contact = contactsArray[i];
        let nameParts = contact.name.split(' ');
        let initials = nameParts[0][0] + nameParts[1][0];
        let firstLetter = nameParts[0][0].toUpperCase();
        
        if (firstLetter !== currentLetter) {
            currentLetter = firstLetter;
            content.innerHTML += `
                <div class="first-letter">${currentLetter}</div>
                <div class="line"></div>
            `;
        }

        content.innerHTML += `
            <div class="contact">
                <div class="contact-letters">${initials}</div>
                <div class="contact-data">
                    <div class="contact-name">${contact.name}</div>
                    <div class="contact-mail">${contact.email}</div>
                </div>
            </div>
        `
    }
}