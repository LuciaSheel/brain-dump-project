const form = document.getElementById('note-form');
const notesList = document.getElementById('notes-list');
const noteTitleInput = document.getElementById('note-title');
const noteInput = document.getElementById('note-input');
const noteDateInput = document.getElementById('note-date');
const logoutButton = document.getElementById('logout-button')

// Function to create a note element
function createNoteElement(title, text, date) {
  const note = document.createElement('div');
  note.classList.add('note');

  const noteTitle = document.createElement('h3');
  noteTitle.classList.add('note-title');
  noteTitle.textContent = title;

   // Date
   const noteDate = document.createElement('p');
   noteDate.classList.add('note-date');
  //  const currentDate = new Date().toLocaleDateString();
   noteDate.textContent = date;

  const noteText = document.createElement('span');
  noteText.classList.add('note-text');
  noteText.textContent = text;

  // Action buttons container
  const actions = document.createElement('div');
  actions.classList.add('note-actions');

  // Edit button
  const editButton = document.createElement('button');
  editButton.textContent = 'Edit';
  editButton.addEventListener('click', () => 
    toggleEditMode(note, noteTitle, noteText, editButton));

  // Done button
  const doneButton = document.createElement('button');
  doneButton.textContent = 'Done';
  doneButton.addEventListener('click', () => toggleDone(noteText));

  // Delete button
  const deleteButton = document.createElement('button');
  deleteButton.textContent = 'Delete';
  deleteButton.addEventListener('click', () => deleteNote(note));

  // Write like this? actions.append(editButton, doneButton, deleteButton);
  actions.appendChild(editButton);
  actions.appendChild(doneButton);
  actions.appendChild(deleteButton);

  // Write like this? note.append(noteTitle, noteDate, noteText, actions);
  note.appendChild(noteTitle);
  note.appendChild(noteDate); // Append the date to the note
  note.appendChild(noteText);
  note.appendChild(actions);

  return note;
}

// Add note event
form.addEventListener('submit', (e) => {
  e.preventDefault();

  const noteTitle = noteTitleInput.value.trim();
  const noteText = noteInput.value.trim();
  const noteDate = noteDateInput.value; // Get the selected date

  if (!noteTitle || !noteText || !noteDate) return;

  const noteElement = createNoteElement(noteTitle, noteText, noteDate);
  notesList.appendChild(noteElement);

  noteTitleInput.value = '';
  noteInput.value = ''; // Clear input
  noteDateInput.value = ''; // Clear date input
});

// Logout button event listener
logoutButton.addEventListener('click', () => {
  sessionStorage.clear(); // Clear all session storage data
  localStorage.clear();  // Clear all local storage data

  // Redirect user to the login page
  window.location.href = './login.html';
});

// Toggle edit mode
function toggleEditMode(note, noteText, editButton) {
  if (editButton.textContent === 'Edit') {
    // Switch to edit mode
    const textarea = document.createElement('textarea');
    textarea.classList.add('edit-textarea');
    textarea.value = noteText.textContent;
    note.replaceChild(textarea, noteText);
    editButton.textContent = 'Save';
  } else {
    // Save changes
    const textarea = note.querySelector('.edit-textarea');
    noteText.textContent = textarea.value
    note.replaceChild(noteText, textarea);
    editButton.textContent = 'Edit';
  }
}

// Toggle done state
function toggleDone(noteText) {
  noteText.classList.toggle('done');
}

// Delete note with slide off page effect
function deleteNote(note) {
  note.classList.add('deleted');
  
  // Wait for the animation to finish before removing the note
  setTimeout(() => {
    note.remove(); // Remove the note from the DOM after animation
  }, 600); // Match the duration of the animation (0.5s)
}


