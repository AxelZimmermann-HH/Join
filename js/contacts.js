const BASE_URL =
  "https://join-database-3d39f-default-rtdb.europe-west1.firebasedatabase.app/";

let contactsData = {}; 
let contactsArray = [];
let contactsKeys = [];


async function fetchDataJson() {
  try {
    let response = await fetch(BASE_URL + ".json");
    let responseToJson = await response.json();
    contactsData = responseToJson || {}; // Sicherstellen, dass contactsData ein Objekt ist
    contactsArray = Object.values(contactsData);
    contactsKeys = Object.keys(contactsData);

    // Kontakte und Schlüssel gemeinsam sortieren
    const sortedContacts = contactsArray.map((contact, index) => ({ contact, key: contactsKeys[index] }))
                                        .sort((a, b) => a.contact.name.split(' ')[0].localeCompare(b.contact.name.split(' ')[0]));

    // Sortierte Kontakte und Schlüssel zuweisen
    contactsArray = sortedContacts.map(item => item.contact);
    contactsKeys = sortedContacts.map(item => item.key);

    createContactsList(); 
    return true; // Daten erfolgreich geladen

  } catch (error) {
    console.error("Error fetching data:", error);
    return false; // Fehler aufgetreten
  }
}


function createContactsList() {
  let content = document.getElementById('contacts-list');
  content.innerHTML = '';
  let currentLetter = '';

  for (let i = 0; i < contactsArray.length; i++) {
      let contact = contactsArray[i];
      let key = contactsKeys[i];
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
          <div id="contact${key}" onclick='showContact("${initials}", ${JSON.stringify(contact)}, "${key}")' class="contact">
              <div class="contact-letters">${initials}</div>
              <div class="contact-data">
                  <div class="contact-name">${contact.name}</div>
                  <div class="contact-mail">${contact.email}</div>
              </div>
          </div>
      `;
  }
}


async function postData(path = "", data = {}) {
  try {
    let response = await fetch(BASE_URL + path + ".json", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    return await response.json();
  } catch (error) {
    console.error("Error posting data:", error);
  }
}


async function addContact() {
  let name = document.getElementById("add-contact-name").value;
  let mail = document.getElementById("add-contact-mail").value;
  let phone = document.getElementById("add-contact-phone").value;

  let newContact = {email: mail, name: name, phone: phone};
  await postData("", newContact);

  let dataFetched = await fetchDataJson(); // Warten bis die Kontaktliste aktualisiert wurde
  if (dataFetched) {
    document.getElementById("add-contact-name").value = '';
    document.getElementById("add-contact-mail").value = '';
    document.getElementById("add-contact-phone").value = '';

    closeAddContactLayer();

    let newIndex = contactsArray.findIndex(contact => contact.email === newContact.email && contact.name === newContact.name);
    let initials = newContact.name.split(' ')[0][0] + newContact.name.split(' ')[1][0];
    showContact(initials, newContact, newIndex); // Richtigen Index des neuen Kontakts verwenden
  } else {
    console.error('Failed to fetch updated contact data.');
  }
}


async function deleteContact(key) {
  try {
    let response = await fetch(BASE_URL + key + ".json", {
      method: "DELETE",
    });
    await response.json();
    fetchDataJson(); 

    document.getElementById('contact-profile').innerHTML = '';

  } catch (error) {
    console.error("Error deleting contact:", error);
  }
}


function showContact(initials, contact, key) {
  highlightContact(key);

  let content = document.getElementById('contact-profile');
  content.innerHTML = '';

  content.classList.remove('slide-in-right'); // Reset animation
  void content.offsetWidth; // Trigger reflow
  content.classList.add('slide-in-right');

  content.innerHTML += generateContactHTML(initials, contact, key);
}


function highlightContact(key) {
  let contacts = document.getElementsByClassName('contact');

  for (let j = 0; j < contacts.length; j++) {
      contacts[j].classList.remove('selected-contact');
  }

  let currentContact = document.getElementById(`contact${key}`);
  if (currentContact) {
      currentContact.classList.add('selected-contact');
  }
}


function generateContactHTML(initials, contact, key) {
  return `
      <div class="contact-profile-firstrow">
        <div class="contact-letters-big">${initials}</div>
        <div class="contact-profile-firstrow-right">
          <h3>${contact.name}</h3>
          <div class="contact-actions">
            <a class="contact-links">
              <img class="contact-icon" src="img/contact-edit.svg" alt="">Edit
            </a>
            <a onclick="deleteContact('${key}')" class="contact-links">
              <img class="contact-icon" src="img/contact-delete.svg" alt="">Delete
            </a>
          </div>
        </div>
      </div>

      <p class="padding-top-bottom-27">Contact Information</p>

      <div class="contact-channels">
        <p>Email</p>
        <a href="#">${contact.email}</a>
      </div>
      <div class="contact-channels">
        <p>Phone</p>
        <a class="black-link" href="#">${contact.phone}</a>
      </div>
  `;
}


function openAddContactLayer() {
    document.getElementById('add-contact-layer').classList.remove('d-none');
    let content = document.getElementById('add-contact-inner-layer');

    content.classList.remove('slide-in-right');
    content.classList.remove('slide-out-right');
    void content.offsetWidth; 
    content.classList.add('slide-in-right');
}


function closeAddContactLayer() {
    let contentLayer = document.getElementById('add-contact-layer');
    let content = document.getElementById('add-contact-inner-layer');

    content.classList.remove('slide-out-right');
    void content.offsetWidth; 
    content.classList.add('slide-out-right');
    
    content.removeEventListener('animationend', handleAnimationEnd);
    content.addEventListener('animationend', handleAnimationEnd, { once: true });
}


function handleAnimationEnd() {
    document.getElementById('add-contact-layer').classList.add('d-none');
}