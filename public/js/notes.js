// Wait for DOM to fully load before executing any JavaScript,
// to ensure all HTML elements are available for manipulation.
document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM fully loaded and parsed');
  
  const form = document.getElementById('note-form');
  const notesList = document.getElementById('notes-list');
  const noteTitleInput = document.getElementById('note-title');
  const noteInput = document.getElementById('note-input');
  const noteDateInput = document.getElementById('note-date');
  const logoutButton = document.getElementById('logout-button');

  // Check if elements exist before proceeding
  if (form && notesList && noteTitleInput && noteInput && noteDateInput && logoutButton) {

    // Add note event
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const noteTitle = noteTitleInput.value.trim();
      const noteText = noteInput.value.trim();
      const noteDate = noteDateInput.value;

      if (!noteTitle || !noteText || !noteDate) return;

      // Send the new note to the server
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
          // Create and append the note element
          const noteElement = createNoteElement(data._id, noteTitle, noteText, noteDate);
          notesList.appendChild(noteElement);
        })
        .catch(error => {
          console.error('Error saving note:', error);
        });

      // Clear the input fields after submission
      noteTitleInput.value = '';
      noteInput.value = '';
      noteDateInput.value = '';
    });

    // Delegate events to the container
    notesList.addEventListener('click', (event) => {
      const target = event.target;
      const noteElement = target.closest('.note');

      if (!noteElement) return;

      const noteId = noteElement.dataset.id;
      const noteTitleElement = noteElement.querySelector('.note-title');
      const noteDateElement = noteElement.querySelector('.note-date');

      if (target.classList.contains('edit-btn')) {
        toggleEditMode(noteElement, noteTitleElement, noteDateElement, target);
      } else if (target.classList.contains('done-btn')) {
        toggleDone(noteElement);
      } else if (target.classList.contains('delete-btn')) {
        deleteNote(noteId, noteElement);
      }
    });

    // Function to create a note element
    function createNoteElement(noteId, noteTitle, noteText, noteDate) {
      const note = document.createElement('div');
      note.classList.add('note');
      note.dataset.id = noteId;

      note.innerHTML = `
        <h3 class="note-title">${noteTitle}</h3>
        <p class="note-date">Date: ${new Date(noteDate).toLocaleDateString()}</p>
        <span class="note-text">${noteText}</span>
        <div class="note-actions">
          <button class="edit-btn">Edit</button>
          <button class="done-btn">Done</button>
          <button class="delete-btn">Delete</button>
        </div>
      `;

      return note;
    }

    function toggleEditMode(noteElement, noteTitleElement, noteDateElement, editButton) {
      let noteTextElement = noteElement.querySelector('.note-text');

      // Helper function to replace an element with an input element
      function replaceWithInput(oldElement, inputValue, inputType = 'text') {
        const input = document.createElement(inputType === 'date' ? 'input' : 'textarea');
        input.classList.add(inputType === 'date' ? 'edit-input' : 'edit-textarea');
        if (inputType === 'date') {
          input.type = 'date';
          input.value = new Date(inputValue.split('Date: ')[1]).toISOString().split('T')[0];
        } else {
          input.value = inputValue;
        }
        oldElement.replaceWith(input);
        return input;
      }

      if (editButton.textContent === 'Edit') {
        const noteTextContent = noteTextElement ? noteTextElement.textContent : '';
        const noteTitleContent = noteTitleElement ? noteTitleElement.textContent : '';
        const noteDateContent = noteDateElement ? noteDateElement.textContent : '';

        // Replace title with input
        noteTitleElement = replaceWithInput(noteTitleElement, noteTitleContent);

        // Replace text with textarea
        noteTextElement = replaceWithInput(noteTextElement, noteTextContent, 'textarea');

        // Replace date with input
        noteDateElement = replaceWithInput(noteDateElement, noteDateContent, 'date');

        editButton.textContent = 'Save';
      } else {
        // Save mode
        const titleInput = noteElement.querySelector('.edit-input');
        const textInput = noteElement.querySelector('.edit-textarea');
        const dateInput = noteElement.querySelector('input[type="date"]');

        if (titleInput) {
          const newTitleElement = document.createElement('h3');
          newTitleElement.classList.add('note-title');
          newTitleElement.textContent = titleInput.value;
          titleInput.replaceWith(newTitleElement); // Replace input with the new title
          noteTitleElement = newTitleElement; // Update reference
        }

        if (textInput) {
          const newTextElement = document.createElement('span');
          newTextElement.classList.add('note-text');
          newTextElement.textContent = textInput.value;
          textInput.replaceWith(newTextElement); // Replace textarea with the new text
          noteTextElement = newTextElement; // Update reference
        }

        if (dateInput) {
          const newDateElement = document.createElement('p');
          newDateElement.classList.add('note-date');
          newDateElement.textContent = `Date: ${new Date(dateInput.value).toLocaleDateString()}`;
          dateInput.replaceWith(newDateElement); // Replace date input with the new date
          noteDateElement = newDateElement; // Update reference
        }

        editButton.textContent = 'Edit';
      }

      // Send updated note to the server
      const updatedTitle = noteTitleElement.textContent;
      const updatedContent = noteTextElement.textContent;
      const updatedDate = dateInput ? dateInput.value : '';

      fetch(`/notes/${noteElement.dataset.id}`, {
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
        .catch(error => {
          console.error('Error updating note:', error);
        });
    }

    // Toggle done state
    function toggleDone(noteElement) {
      const noteTextElement = noteElement.querySelector('.note-text');
      noteTextElement.classList.toggle('done');
    }

    // Delete note
    function deleteNote(noteId, noteElement) {
      fetch(`/notes/${noteId}`, {
        method: 'DELETE',
      })
        .then(() => {
          noteElement.remove(); // Remove the note from the DOM
        })
        .catch(error => {
          console.error('Error deleting note:', error);
        });
    }

    // Logout button event listener
    logoutButton.addEventListener('click', () => {
      sessionStorage.clear();
      localStorage.clear();
      window.location.href = './login';
    });

  } else {
    console.error('One or more elements are missing in the DOM.');
  }
});
