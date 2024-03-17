// renderer.js
const { ipcRenderer } = require('electron')
const textarea = document.querySelector('#write-section textarea');

document.getElementById('note-form').addEventListener('submit', (evt) => {
  evt.preventDefault()
  let noteHeader = document.getElementById('note-header-input').value
  let note = document.getElementById('note-input').value
  if (evt.target.dataset.action === 'modify') {
    ipcRenderer.send('edit-note', { id: evt.target.dataset.id, header: noteHeader, text: note })
    evt.target.dataset.action = 'add'
    document.getElementById('add-button').textContent = 'Add Note'
    document.getElementById('cancel-button').style.display = 'none'
  } else {
    ipcRenderer.send('add-note', { header: noteHeader, text: note, created_at: new Date().toISOString() })
  }
  document.getElementById('note-header-input').value = ''
  document.getElementById('note-input').value = ''
})

ipcRenderer.on('add-note-reply', (event, arg) => {
  getNotes()
})
// Notları temsil eden HTML elemanlarını seçin
let notes = document.querySelectorAll('.note');

// Her bir not için bir tıklama olayı işleyicisi ekleyin
notes.forEach(note => {
  note.addEventListener('click', function() {
    // Önceden seçili olan notun sınıfını kaldırın
    let activeNote = document.querySelector('.active-note');
    if (activeNote) {
      activeNote.classList.remove('active-note');
    }

    // Tıklanan nota 'active-note' sınıfını ekleyin
    this.classList.add('active-note');
  });
});

function getNotes() {
  ipcRenderer.send('get-notes')
}

ipcRenderer.on('get-notes-reply', (event, arg) => {
  let notesDiv = document.getElementById('notes')
  notesDiv.innerHTML = ''
  arg.forEach(note => {
    let noteElement = document.createElement('div')
    noteElement.textContent = note.header + ' (' + new Date(note.created_at).toLocaleDateString() + ')'
    noteElement.addEventListener('click', () => {
      document.querySelectorAll('#notes div').forEach(note => note.classList.remove('selected-note'));
      noteElement.classList.add('selected-note');
      document.getElementById('note-header-input').value = note.header
      document.getElementById('note-input').value = note.text
      document.getElementById('note-form').dataset.action = 'modify'
      document.getElementById('note-form').dataset.id = note._id
      document.getElementById('add-button').textContent = 'Düzenlemeyi bitir'
      document.getElementById('cancel-button').style.display = 'inline'
      
    })

    notesDiv.appendChild(noteElement)
    let deleteButton = document.createElement('img');
    deleteButton.src = 'delete.png'; // Replace with the path to your delete icon image
    deleteButton.alt = 'Delete';
    deleteButton.style.cursor = 'pointer';

    deleteButton.addEventListener('click', (event) => {
  event.stopPropagation();
  ipcRenderer.send('delete-note', note._id);
});

    noteElement.appendChild(deleteButton)
    notesDiv.appendChild(noteElement)
  })
})

ipcRenderer.on('delete-note-reply', (event, arg) => {
  getNotes()
})

ipcRenderer.on('edit-note-reply', (event, arg) => {
  getNotes()
})



let timer;
let timeLeft;
let isPaused = true;
let alarmSound = document.getElementById('timer-sound');

document.getElementById('start-button').addEventListener('click', function() {
  if (isPaused) {
    let hours = document.getElementById('hour-input').value;
    let minutes = document.getElementById('minute-input').value;
    if (!timeLeft) {
      timeLeft = hours * 60 * 60 + minutes * 60;
    }
    timer = setInterval(updateTimer, 1000);
    isPaused = false;
  }
});

document.getElementById('pause-button').addEventListener('click', function() {
  clearInterval(timer);
  isPaused = true;
});

document.getElementById('reset-button').addEventListener('click', function() {
  clearInterval(timer);
  document.getElementById('timer-display').textContent = '00:00';
  timeLeft = null;
  isPaused = true;
});

function updateTimer() {
  if (timeLeft <= 0) {
    clearInterval(timer);
    document.getElementById('timer-sound').play(); // play the sound
    alert('Zaman doldu!');
    setTimeout(() => {
      alarmSound.pause(); // stop the sound
      alarmSound.currentTime = 0; // rewind the sound
    }, 1000); // 2 seconds delay
  }

   else {
    let hours = Math.floor(timeLeft / 3600);
    let minutes = Math.floor((timeLeft % 3600) / 60);
    let seconds = timeLeft % 60;
    document.getElementById('timer-display').textContent = `${hours}:${minutes}:${seconds}`;
    timeLeft--;
  }
}




function applyDarkMode(isDarkMode) {
  const body = document.body;
  const notes = document.querySelectorAll('.note');

  if (isDarkMode) {
    body.classList.add('dark-mode');
    notes.forEach(note => note.classList.add('dark-mode'));
  } else {
    body.classList.remove('dark-mode');
    notes.forEach(note => note.classList.remove('dark-mode'));
  }
}

// When the dark mode button is clicked, toggle dark mode
document.getElementById('dark-mode-toggle').addEventListener('click', () => {
  const isDarkMode = localStorage.getItem('darkMode') === 'dark';
  localStorage.setItem('darkMode', isDarkMode ? 'light' : 'dark');
  applyDarkMode(!isDarkMode);
});

// When the page loads, apply the current dark mode setting
document.addEventListener('DOMContentLoaded', () => {
  const isDarkMode = localStorage.getItem('darkMode') === 'dark';
  applyDarkMode(isDarkMode);
});
document.getElementById('dark-mode-toggle').addEventListener('click', () => {
  // Toggle dark mode state in local storage
  darkMode = darkMode === 'dark' ? 'light' : 'dark';
  localStorage.setItem('darkMode', darkMode);

  // Toggle dark mode class on body
  document.body.classList.toggle('dark-mode');

  const notes = document.querySelectorAll('.note');
  notes.forEach(note => note.classList.toggle('dark-mode'));
});

let noteElement = document.createElement('div');
noteElement.classList.add('note');

getNotes()