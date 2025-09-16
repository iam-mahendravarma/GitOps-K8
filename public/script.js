async function fetchRecords() {
  const res = await fetch('api/credentials');
  const data = await res.json();
  const tbody = document.querySelector('#records tbody');
  tbody.innerHTML = '';
  for (const item of data) {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${escapeHtml(item.username)}</td>
      <td>${escapeHtml(item.password)}</td>
      <td>${escapeHtml(item.serverName)}</td>
      <td>${escapeHtml(item.serverIp)}</td>
      <td><a href="${escapeAttribute(item.serverUrl)}" target="_blank" rel="noopener noreferrer">${escapeHtml(item.serverUrl)}</a></td>
      <td>
        <button data-id="${item._id}" class="edit">Edit</button>
        <button data-id="${item._id}" class="delete">Delete</button>
      </td>
    `;
    tbody.appendChild(tr);
  }
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function escapeAttribute(str) {
  return String(str).replace(/"/g, '&quot;');
}

document.getElementById('credential-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const form = e.target;
  const payload = {
    username: form.username.value.trim(),
    password: form.password.value,
    serverName: form.serverName.value.trim(),
    serverIp: form.serverIp.value.trim(),
    serverUrl: form.serverUrl.value.trim(),
  };
  const id = form._id && form._id.value ? form._id.value : '';
  const isEdit = Boolean(id);
  const res = await fetch(isEdit ? ('api/credentials/' + id) : 'api/credentials', {
    method: isEdit ? 'PUT' : 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    alert('Failed to save. Please check inputs. ' + (err.message || ''));
    return;
  }
  form.reset();
  if (form._id) form._id.value = '';
  const btn = document.getElementById('submit-btn'); if (btn) btn.textContent = 'Save';
  const cancel = document.getElementById('cancel-edit'); if (cancel) cancel.style.display = 'none';
  await fetchRecords();
});

document.querySelector('#records tbody').addEventListener('click', async (e) => {
  if (e.target.matches('button.delete')) {
    const id = e.target.getAttribute('data-id');
    const res = await fetch('api/credentials/' + id, { method: 'DELETE' });
    if (!res.ok) {
      alert('Delete failed');
      return;
    }
    await fetchRecords();
  }
  if (e.target.matches('button.edit')) {
    const row = e.target.closest('tr');
    const cells = row.querySelectorAll('td');
    const form = document.getElementById('credential-form');
    form.username.value = cells[0].textContent;
    form.password.value = cells[1].textContent;
    form.serverName.value = cells[2].textContent;
    form.serverIp.value = cells[3].textContent;
    const link = row.querySelector('a');
    form.serverUrl.value = link ? link.getAttribute('href') : '';
    if (form._id) form._id.value = e.target.getAttribute('data-id');
    const btn = document.getElementById('submit-btn'); if (btn) btn.textContent = 'Update';
    const cancel = document.getElementById('cancel-edit'); if (cancel) cancel.style.display = '';
  }
});

const cancelBtn = document.getElementById('cancel-edit');
if (cancelBtn) {
  cancelBtn.addEventListener('click', () => {
    const form = document.getElementById('credential-form');
    form.reset();
    if (form._id) form._id.value = '';
    const btn = document.getElementById('submit-btn'); if (btn) btn.textContent = 'Save';
    cancelBtn.style.display = 'none';
  });
}

fetchRecords();


