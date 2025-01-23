document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM fully loaded and parsed');

  // Create and append the mock note element to the DOM
  const mockNoteElement = document.createElement('div');
  mockNoteElement.classList.add('note');
  mockNoteElement.innerHTML = `
    <h3 class="note-title">Test Note</h3>
    <span class="note-text">This is a test note.</span>
    <div class="note-actions">
      <button class="edit-btn">Edit</button>
      <button class="done-btn">Done</button>
      <button class="delete-btn">Delete</button>
    </div>
  `;

  // Append the mock note element to the document body
  // document.body.appendChild(mockNoteElement);

  // --- Test Cases Start Here ---

  // Simulate "Edit" button click
  const editButton = mockNoteElement.querySelector('.edit-btn');
  editButton.dispatchEvent(new MouseEvent('click'));

  // Assert that the title is replaced with an input element
  const titleInput = mockNoteElement.querySelector('.edit-input');
  console.assert(titleInput !== null, 'Title should be replaced with an input element');

  // Assert that the button text has changed to "Save"
  console.assert(editButton.textContent === 'Save', 'Edit button text should change to "Save"');

  // Update inputs and simulate the "Save" button click
  titleInput.value = 'Updated Note Title';
  const textarea = mockNoteElement.querySelector('.edit-textarea');
  textarea.value = 'Updated note text';
  editButton.dispatchEvent(new MouseEvent('click'));

  // Assert that the title and text are updated
  const updatedTitle = mockNoteElement.querySelector('.note-title');
  const updatedText = mockNoteElement.querySelector('.note-text');
  console.assert(updatedTitle.textContent === 'Updated Note Title', 'Title should be updated');
  console.assert(updatedText.textContent === 'Updated note text', 'Text should be updated');

  // Simulate "Done" button click
  const doneButton = mockNoteElement.querySelector('.done-btn');
  doneButton.dispatchEvent(new MouseEvent('click'));

  // Assert that the "done" class is toggled on the note text
  console.assert(updatedText.classList.contains('done'), 'Note text should have the "done" class after clicking "Done"');

  // Simulate "Delete" button click
  const deleteButton = mockNoteElement.querySelector('.delete-btn');
  deleteButton.dispatchEvent(new MouseEvent('click'));

  // Assert that the note is removed from the DOM
  console.assert(document.body.contains(mockNoteElement) === false, 'Note should be removed from the DOM after deletion');

  // --- Test Cases End Here ---

  // Clean up the DOM
  document.body.innerHTML = '';
});