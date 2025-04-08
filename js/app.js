// === Смяна на таб ===
function switchTab(tabId) {
    document.querySelectorAll('.tab').forEach(tab => tab.classList.add('hidden'));
    document.getElementById(tabId).classList.remove('hidden');
  }
  
  // === Форматиране на датата ===
function formatDate(dateStr) {
  const date = new Date(dateStr);
  return date.toLocaleDateString('bg-BG', {
    day: '2-digit',
    month: '2-digit',
    year: '2-digit'
  });
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

  const sortedItems = [...monthlyItems].filter(item =>
    item.text && item.amount && item.date
  ).sort((a, b) => new Date(a.date) - new Date(b.date));

  sortedItems.forEach((item) => {
    if (!item.paid) {
      total += parseFloat(item.amount);
    }

    const li = document.createElement('li');
    li.innerHTML = `
      <span>${item.text} – ${item.amount} лв – ${formatDate(item.date)}</span>
      <div class="item-actions">
        <input type="checkbox"
          ${item.paid ? 'checked' : ''}
          onchange="togglePaidByTextAndDate('${item.text}', '${item.date}', '${item.amount}')"
          title="Отметни като платено"
        />
        <button class="delete" onclick="deleteMonthlyByTextAndDate('${item.text}', '${item.date}', '${item.amount}')">X</button>
      </div>
    `;
    if (item.paid) {
      li.classList.add('completed');
    }
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

// === Отмятане чрез текст и дата ===
function togglePaidByTextAndDate(text, date, amount) {
  const index = monthlyItems.findIndex(
    (item) => item.text === text && item.date === date && item.amount === amount
  );

  if (index !== -1) {
    monthlyItems[index].paid = !monthlyItems[index].paid;
    saveMonthly();
    renderMonthly();
  }
}

// === Изтриване по текст и дата ===
function deleteMonthlyByTextAndDate(text, date, amount) {
  const index = monthlyItems.findIndex(
    (item) => item.text === text && item.date === date && item.amount === amount
  );

  if (index !== -1) {
    monthlyItems.splice(index, 1);
    saveMonthly();
    renderMonthly();
  }
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

    // ако не е масив, пропускаме
    if (!Array.isArray(notes[date])) return;

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

const loans = JSON.parse(localStorage.getItem('loans')) || [];
const debts = JSON.parse(localStorage.getItem('debts')) || [];
const credits = JSON.parse(localStorage.getItem('credits')) || [];

function saveDebts() {
  localStorage.setItem('loans', JSON.stringify(loans));
  localStorage.setItem('debts', JSON.stringify(debts));
  localStorage.setItem('credits', JSON.stringify(credits));
}

function renderDebts() {
  const list = document.getElementById('debtCombinedList');
  const loanTotal = document.getElementById('loanTotal');
  const debtTotal = document.getElementById('debtTotal');
  const creditTotal = document.getElementById('creditTotal');

  list.innerHTML = '';

  let loanSum = 0;
  let debtSum = 0;
  let creditSum = 0;

  const allItems = [
    ...loans.map(item => ({ ...item, type: 'loan' })),
    ...debts.map(item => ({ ...item, type: 'debt' })),
    ...credits.map(item => ({ ...item, type: 'credit' }))
  ];

  allItems.forEach((item, index) => {
    const li = document.createElement('li');
    li.classList.add(item.type);

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = item.paid || false;
    checkbox.onchange = () => {
      item.paid = checkbox.checked;
      saveDebts();
      renderDebts();
    };

    const span = document.createElement('span');
    span.textContent = `${item.description} – ${item.amount} лв`;
    if (item.paid) span.classList.add('completed');

    const delBtn = document.createElement('button');
    delBtn.textContent = 'X';
    delBtn.className = 'delete';
    delBtn.onclick = () => {
      const arr = item.type === 'loan' ? loans : item.type === 'debt' ? debts : credits;
      const i = arr.findIndex(el => el.description === item.description && el.amount === item.amount);
      if (i !== -1) {
        arr.splice(i, 1);
        saveDebts();
        renderDebts();
      }
    };

    li.appendChild(checkbox);
    li.appendChild(span);
    li.appendChild(delBtn);
    list.appendChild(li);

    if (!item.paid) {
      if (item.type === 'loan') loanSum += parseFloat(item.amount);
      if (item.type === 'debt') debtSum += parseFloat(item.amount);
      if (item.type === 'credit') creditSum += parseFloat(item.amount);
    }
  });

  loanTotal.textContent = loanSum.toFixed(2);
  debtTotal.textContent = debtSum.toFixed(2);
  creditTotal.textContent = creditSum.toFixed(2);
}

function addEntry() {
  const type = document.getElementById('debtType').value;
  const description = document.getElementById('debtDescription').value.trim();
  const amount = document.getElementById('debtAmount').value;

  if (description && amount) {
    const item = { description, amount, paid: false };
    if (type === 'loan') loans.push(item);
    else if (type === 'debt') debts.push(item);
    else if (type === 'credit') credits.push(item);

    saveDebts();
    renderDebts();

    document.getElementById('debtDescription').value = '';
    document.getElementById('debtAmount').value = '';
  }
}

renderDebts();


 
Object.keys(notes).forEach(date => {
  if (!Array.isArray(notes[date])) {
    delete notes[date];
  }
});
saveNotes();