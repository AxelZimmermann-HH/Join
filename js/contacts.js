const CONTACTS_URL =
  "https://join-database-3d39f-default-rtdb.europe-west1.firebasedatabase.app/contacts/";

let contactsData = {}; 
let contactsArray = [];
let contactsKeys = [];


async function contactsInit() {
  await fetchDataJson();
  createContactsList();
  generateInitials();
  return true;
}


async function fetchDataJson() {
  try {
    let response = await fetch(CONTACTS_URL + ".json");
    let responseToJson = await response.json();
    contactsData = responseToJson || {};
    contactsArray = Object.values(contactsData);
    contactsKeys = Object.keys(contactsData);
    

    // Kontakte und Schlüssel gemeinsam sortieren
    const sortedContacts = contactsArray.map((contact, index) => ({ contact, key: contactsKeys[index] }))
                                        .sort((a, b) => a.contact.name.split(' ')[0].localeCompare(b.contact.name.split(' ')[0]));

    // Sortierte Kontakte und Schlüssel zuweisen
    contactsArray = sortedContacts.map(item => item.contact);
    contactsKeys = sortedContacts.map(item => item.key);

  } catch (error) {
    console.error("Error fetching data:", error);
    return false; 
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

      content.innerHTML += generateDirectory(key, initials, contact);
  }
}


async function postData(path = "", data = {}) {
  try {
    let response = await fetch(CONTACTS_URL + path + ".json", {
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
  let color = getRandomColor(); // Zufällige Farbe generieren


  let newContact = {email: mail, name: name, phone: phone, color: color};
  let postResponse = await postData("", newContact);

  let dataFetched = await contactsInit(); // Warten bis die Kontaktliste aktualisiert wurde
  if (dataFetched) {
    document.getElementById("add-contact-name").value = '';
    document.getElementById("add-contact-mail").value = '';
    document.getElementById("add-contact-phone").value = '';

    closeAddContactLayer();

    // Finden Sie den Schlüssel des neuen Kontakts
    let newKey = Object.keys(contactsData).find(key => contactsData[key].email === newContact.email && contactsData[key].name === newContact.name);
    let initials = newContact.name.split(' ')[0][0] + newContact.name.split(' ')[1][0];
    showContact(initials, newContact, newKey); // Verwenden Sie den richtigen Schlüssel des neuen Kontakts
  } else {
    console.error('Failed to fetch updated contact data.');
  }
}


async function deleteContact(key) {
  try {
    let response = await fetch(CONTACTS_URL + key + ".json", {
      method: "DELETE",
    });
    await response.json();
    await contactsInit(); // Kontaktliste aktualisieren

    document.getElementById('contact-profile').innerHTML = '';

  } catch (error) {
    console.error("Error deleting contact:", error);
  }
}


async function saveContact() {
  let key = document.getElementById('edit-contact-key').value;
  let name = document.getElementById('edit-contact-name').value;
  let email = document.getElementById('edit-contact-mail').value;
  let phone = document.getElementById('edit-contact-phone').value;

  // Die vorhandene Farbe des Kontakts beibehalten
  let currentContact = contactsData[key];
  let color = currentContact.color;

  let updatedContact = { email, name, phone, color };

  try {
    await updateContact(key, updatedContact);
    await contactsInit(); // Kontaktliste aktualisieren

    closeEditContactLayer();

    let initials = name.split(' ')[0][0] + name.split(' ')[1][0];
    showContact(initials, updatedContact, key);

  } catch (error) {
    console.error("Error updating contact:", error);
  }
}


async function updateContact(key, updatedContact) {
  try {
    let response = await fetch(CONTACTS_URL + key + ".json", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedContact),
    });
    return await response.json();
  } catch (error) {
    console.error("Error updating contact:", error);
    throw error;
  }
}


function showContact(initials, contact, key) {
  highlightContact(key);

  let content = document.getElementById('contact-profile');
  let content2 = document.getElementById('contacts-library');
  content.innerHTML = '';
  
  // IF display.with < XY
  content2.classList.add('d-none');

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


function openAddContactLayer() {
    document.getElementById('add-contact-layer').classList.remove('d-none');
    let content = document.getElementById('add-contact-inner-layer');

    content.classList.remove('slide-in-right');
    content.classList.remove('slide-out-right');
    void content.offsetWidth; 
    content.classList.add('slide-in-right');
}


function openEditContactLayer(key, name, email, phone) {
  document.getElementById('edit-contact-layer').classList.remove('d-none');
    let content = document.getElementById('edit-contact-inner-layer');

    content.classList.remove('slide-in-right');
    content.classList.remove('slide-out-right');
    void content.offsetWidth; 
    content.classList.add('slide-in-right');

    // Eingabefelder mit den Kontaktdaten füllen
    document.getElementById('edit-contact-key').value = key;
    document.getElementById('edit-contact-name').value = name;
    document.getElementById('edit-contact-mail').value = email;
    document.getElementById('edit-contact-phone').value = phone;
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


function closeEditContactLayer() {
  let contentLayer = document.getElementById('edit-contact-layer');
  let content = document.getElementById('edit-contact-inner-layer');

  content.classList.remove('slide-out-right');
  void content.offsetWidth; 
  content.classList.add('slide-out-right');
  
  content.removeEventListener('animationend', handleAnimationEnd);
  content.addEventListener('animationend', handleAnimationEnd, { once: true });
}


function handleAnimationEnd() {
    document.getElementById('add-contact-layer').classList.add('d-none');
    document.getElementById('edit-contact-layer').classList.add('d-none');
    
    
}


function generateContactHTML(initials, contact, key) {
  return `
      <div class="contact-profile-firstrow">
        <div class="contact-letters-big" style="background-color: ${contact.color}">${initials}</div>
        <div class="contact-profile-firstrow-right">
          <h3>${contact.name}</h3>
          <div class="contact-actions">
            <a onclick='openEditContactLayer("${key}", "${contact.name}", "${contact.email}", "${contact.phone}")' class="contact-links">
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


function generateDirectory(key, initials, contact) {
  return `
          <div id="contact${key}" onclick='showContact("${initials}", ${JSON.stringify(contact)}, "${key}")' class="contact">
              <div class="contact-letters" style="background-color: ${contact.color};">${initials}</div>
              <div class="contact-data">
                  <div class="contact-name">${contact.name}</div>
                  <div class="contact-mail">${contact.email}</div>
              </div>
          </div>
      `;
}


function getRandomColor() {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}