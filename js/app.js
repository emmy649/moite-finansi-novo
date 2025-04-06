// === Смяна на таб ===
function switchTab(tabId) {
    document.querySelectorAll('.tab').forEach(tab => tab.classList.add('hidden'));
    document.getElementById(tabId).classList.remove('hidden');
  }
  
  // === МЕСЕЧНИ РАЗХОДИ ===
  const monthlyItems = JSON.parse(localStorage.getItem('monthlyItems')) || [];
  
  function saveMonthly() {
    localStorage.setItem('monthlyItems', JSON.stringify(monthlyItems));
  }
  
  function renderMonthly() {
    const list = document.getElementById('monthlyList');
    const totalSpan = document.getElementById('monthlyTotal');
    list.innerHTML = '';
  
    let total = 0;

     const sortedItems = [...monthlyItems].sort((a, b) => new Date(a.date) - new Date(b.date));
     sortedItems.forEach((item, index) => {

    if (!item.paid) {
      total += parseFloat(item.amount);
    }

  
      const li = document.createElement('li');
      li.innerHTML = `
        <span>${item.text} – ${item.amount} лв – ${formatDate(item.date)}</span>
        <div class="item-actions">
          <input type="checkbox" ${item.paid ? 'checked' : ''} onchange="togglePaid(${index})" title="Отметни като платено" />
          <button class="delete" onclick="deleteMonthly(${index})">X</button>
        </div>
      `;
      li.classList.toggle('completed', item.paid);
      list.appendChild(li);
    });
  
    totalSpan.textContent = total.toFixed(2);
  }
  
  function addMonthly() {
    const text = document.getElementById('monthlyText').value.trim();
    const amount = document.getElementById('monthlyAmount').value;
    const date = document.getElementById('monthlyDate').value;
  
    if (text && amount && date) {
      monthlyItems.push({ text, amount, date, paid: false });
      saveMonthly();
      renderMonthly();
      document.getElementById('monthlyText').value = '';
      document.getElementById('monthlyAmount').value = '';
      document.getElementById('monthlyDate').value = '';
    }
  }
  
  function togglePaid(index) {
    monthlyItems[index].paid = !monthlyItems[index].paid;
    saveMonthly();
    renderMonthly();
  }
  
  function deleteMonthly(index) {
    monthlyItems.splice(index, 1);
    saveMonthly();
    renderMonthly();
  }
  
  function formatDate(dateStr) {
    const date = new Date(dateStr);
    return date.toLocaleDateString('bg-BG', {
      day: '2-digit',
      month: '2-digit',
      year: '2-digit'
    });
  }
  
  renderMonthly();

  // === ПРИХОДИ И РАЗХОДИ ===
const flowItems = JSON.parse(localStorage.getItem('flowItems')) || [];

function saveFlow() {
  localStorage.setItem('flowItems', JSON.stringify(flowItems));
}

function renderFlow() {
  const list = document.getElementById('flowList');
  const balanceSpan = document.getElementById('flowBalance');
  list.innerHTML = '';

  let balance = 0;

  flowItems.forEach((item, index) => {
    const amount = parseFloat(item.amount);
    balance += item.type === 'income' ? amount : -amount;

    const li = document.createElement('li');
    li.innerHTML = `
      <span>${item.text} – ${item.amount} лв – ${formatDate(item.date)}</span>
      <button class="delete" onclick="deleteFlow(${index})">X</button>
    `;

    li.classList.add(item.type === 'income' ? 'income' : 'expense');
    list.appendChild(li);
  });

  balanceSpan.textContent = balance.toFixed(2);
}

function addFlow() {
  const type = document.getElementById('flowType').value;
  const text = document.getElementById('flowText').value.trim();
  const amount = document.getElementById('flowAmount').value;
  const date = document.getElementById('flowDate').value;

  if (text && amount && date) {
    flowItems.push({ type, text, amount, date });
    saveFlow();
    renderFlow();

    document.getElementById('flowType').value = 'income';
    document.getElementById('flowText').value = '';
    document.getElementById('flowAmount').value = '';
    document.getElementById('flowDate').value = '';
  }
}

function deleteFlow(index) {
  flowItems.splice(index, 1);
  saveFlow();
  renderFlow();
}

renderFlow();

// === БЕЛЕЖКИ ===
const notes = JSON.parse(localStorage.getItem('notes')) || {};

function saveNotes() {
  localStorage.setItem('notes', JSON.stringify(notes));
}

function renderNotes() {
  const notesList = document.getElementById('notesList');
  notesList.innerHTML = '';

  Object.keys(notes).forEach(date => {
    const section = document.createElement('div');
    const heading = document.createElement('h3');
    heading.textContent = date;
    section.appendChild(heading);

    notes[date].forEach((text, index) => {
      const note = document.createElement('p');
      note.textContent = text;

      const delBtn = document.createElement('button');
      delBtn.textContent = 'X';
      delBtn.className = 'delete';
      delBtn.onclick = () => {
        notes[date].splice(index, 1);
        if (notes[date].length === 0) delete notes[date];
        saveNotes();
        renderNotes();
      };

      note.appendChild(delBtn);
      section.appendChild(note);
    });

    notesList.appendChild(section);
  });
}

function addNote() {
  const noteInput = document.getElementById('noteInput');
  const text = noteInput.value.trim();
  if (!text) return;

  const today = new Date();
  const date = today.toLocaleDateString('bg-BG', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  if (!notes[date]) notes[date] = [];
  notes[date].push(text);

  saveNotes();
  renderNotes();
  noteInput.value = '';
}

renderNotes();

  
