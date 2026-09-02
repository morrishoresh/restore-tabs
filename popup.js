const MAX_ITEMS = 20;

async function render() {
  const list = document.getElementById("list");
  list.innerHTML = "";

  const sessions = await browser.sessions.getRecentlyClosed({ maxResults: MAX_ITEMS });
  const tabSessions = sessions.filter(s => s.tab).slice(0, MAX_ITEMS);

  if (tabSessions.length === 0) {
    const li = document.createElement("li");
    li.className = "empty";
    li.textContent = "No closed tabs";
    list.appendChild(li);
    return;
  }

  for (const session of tabSessions) {
    const tab = session.tab;
    const li = document.createElement("li");

    const icon = document.createElement("img");
    icon.src = tab.favIconUrl || "icon.png";
    icon.onerror = () => { icon.style.visibility = "hidden"; };

    const span = document.createElement("span");
    span.textContent = tab.title || tab.url || "(untitled)";

    li.appendChild(icon);
    li.appendChild(span);
    li.title = tab.url;

    li.addEventListener("click", async () => {
      await browser.sessions.restore(tab.sessionId);
      window.close();
    });

    list.appendChild(li);
  }
}

render();
