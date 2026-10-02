const KEY = "lre-history";

export function loadHistory() {
  try { return JSON.parse(localStorage.getItem(KEY) || "[]"); } catch { return []; }
}

export function saveResult(r) {
  try {
    const list = loadHistory();
    list.unshift({ id: Date.now(), ...r });
    localStorage.setItem(KEY, JSON.stringify(list.slice(0, 8)));
  } catch {}
}