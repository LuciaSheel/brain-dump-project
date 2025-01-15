const form = document.getElementById('note-form');
const notesList = document.getElementById('notes-list');
const noteTitleInput = document.getElementById('note-title');
const noteInput = document.getElementById('note-input');
const noteDateInput = document.getElementById('note-date');
const logoutButton = document.getElementById('logout-button');

// Function to create a note element
function createNoteElement(noteId, noteTitle, noteText, noteDate) {
  const note = document.createElement('div');
  note.classList.add('note');
  note.dataset.id = noteId;  // Set the note's ID as a data attribute

  const noteTitleElement = document.createElement('h3');
  noteTitleElement.classList.add('note-title');
  noteTitleElement.textContent = noteTitle;

  const noteDateElement = document.createElement('p');
  noteDateElement.classList.add('note-date');
  noteDateElement.textContent = `Date: ${new Date(noteDate).toLocaleDateString()}`;

  const noteTextElement = document.createElement('span');
  noteTextElement.classList.add('note-text');
  noteTextElement.textContent = noteText;

  // Action buttons container
  const actions = document.createElement('div');
  actions.classList.add('note-actions');

  // Edit button
  const editButton = document.createElement('button');
  editButton.textContent = 'Edit';
  editButton.addEventListener('click', () => toggleEditMode(note, noteTextElement, editButton, noteTitleElement, noteDateElement));

  // Done button
  const doneButton = document.createElement('button');
  doneButton.textContent = 'Done';
  doneButton.addEventListener('click', () => toggleDone(noteTextElement));

  // Delete button
  const deleteButton = document.createElement('button');
  deleteButton.textContent = 'Delete';
  deleteButton.addEventListener('click', () => deleteNote(note));

  actions.appendChild(editButton);
  actions.appendChild(doneButton);
  actions.appendChild(deleteButton);

  note.appendChild(noteTitleElement);
  note.appendChild(noteDateElement);
  note.appendChild(noteTextElement);
  note.appendChild(actions);

  return note;
}

// Add note event
form.addEventListener('submit', (e) => {
  e.preventDefault();

  const noteTitle = noteTitleInput.value.trim();
  const noteText = noteInput.value.trim();
  const noteDate = noteDateInput.value;

  if (!noteTitle || !noteText || !noteDate) return;

  // Add the note to the DOM
  const noteElement = createNoteElement(null, noteTitle, noteText, noteDate);
  notesList.appendChild(noteElement);

  // Send the new note to the server via POST request
  fetch('/notes', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      title: noteTitle,
      content: noteText,
      date: noteDate,
    }),
  })
  .then(response => response.json())
  .then(data => {
    console.log('Note saved:', data);
    // Update the note element with the ID from the server after successful creation
    noteElement.dataset.id = data._id; // Assuming the server returns the note with an _id field
  })
  .catch(error => {
    console.error('Error saving note:', error);
  });

  // Clear the input fields after submission
  noteTitleInput.value = '';
  noteInput.value = '';
  noteDateInput.value = '';
});

// Logout button event listener
logoutButton.addEventListener('click', () => {
  sessionStorage.clear();
  localStorage.clear();
  window.location.href = './login.html';
});

// Toggle edit mode
function toggleEditMode(note, noteTextElement, editButton, noteTitleElement, noteDateElement) {
  if (editButton.textContent === 'Edit') {
    // Switch to edit mode
    const titleInput = document.createElement('input');
    titleInput.classList.add('edit-input');
    titleInput.value = noteTitleElement.textContent;
    note.replaceChild(titleInput, noteTitleElement);

    const textarea = document.createElement('textarea');
    textarea.classList.add('edit-textarea');
    textarea.value = noteTextElement.textContent;
    note.replaceChild(textarea, noteTextElement);

    const dateInput = document.createElement('input');
    dateInput.classList.add('edit-input');
    dateInput.type = 'date';
    dateInput.value = new Date(noteDateElement.textContent.split('Date: ')[1]).toISOString().split('T')[0]; // Format date
    note.replaceChild(dateInput, noteDateElement);

    editButton.textContent = 'Save';
  } else {
    // Save changes
    const titleInput = note.querySelector('.edit-input');
    noteTitleElement.textContent = titleInput.value;
    note.replaceChild(noteTitleElement, titleInput);

    const textarea = note.querySelector('.edit-textarea');
    noteTextElement.textContent = textarea.value;
    note.replaceChild(noteTextElement, textarea);

    const dateInput = note.querySelector('.edit-input');
    noteDateElement.textContent = `Date: ${new Date(dateInput.value).toLocaleDateString()}`;
    note.replaceChild(noteDateElement, dateInput);

    editButton.textContent = 'Edit';

    // Send updated note to the server
    const noteId = note.dataset.id;
    const updatedTitle = noteTitleElement.textContent;
    const updatedContent = textarea.value;
    const updatedDate = dateInput.value;

    fetch(`/notes/${noteId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: updatedTitle,
        content: updatedContent,
        date: updatedDate,
      }),
    })
    .then(response => response.json())
    .then(data => {
      console.log('Note updated:', data);
    })
    .catch(error => {
      console.error('Error updating note:', error);
    });
  }
}

// Toggle done state
function toggleDone(noteTextElement) {
  noteTextElement.classList.toggle('done');
}

// Delete note
function deleteNote(note) {
  const noteId = note.dataset.id;

  fetch(`/notes/${noteId}`, {
    method: 'DELETE',
  })
  .then(response => response.json())
  .then(data => {
    console.log('Note deleted:', data);
    note.remove(); // Remove the note from the DOM
  })
  .catch(error => {
    console.error('Error deleting note:', error);
  });
}
