// Use global Tauri API (withGlobalTauri: true) — no bundler required
const invoke = window.__TAURI__.core.invoke;

const portsEl = document.getElementById('ports');
const portsErrorEl = document.getElementById('ports-error');
const refreshBtn = document.getElementById('refresh');

async function refreshPorts() {
  portsErrorEl.hidden = true;
  portsEl.innerHTML = '';
  refreshBtn.disabled = true;
  try {
    const ports = await invoke('list_serial_ports');
    if (!ports || ports.length === 0) {
      portsEl.innerHTML = '<li>No serial ports found</li>';
    } else {
      ports.forEach((p) => {
        const li = document.createElement('li');
        li.textContent = `${p.title || p.name} (${p.name})`;
        portsEl.appendChild(li);
      });
    }
  } catch (e) {
    portsErrorEl.textContent = String(e);
    portsErrorEl.hidden = false;
  } finally {
    refreshBtn.disabled = false;
  }
}

refreshBtn.addEventListener('click', refreshPorts);
refreshPorts();
