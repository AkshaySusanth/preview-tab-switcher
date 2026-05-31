let tabs = [];
let selectedIndex = 1; // Default to selecting the PREVIOUS tab (index 1)

document.addEventListener('DOMContentLoaded', async () => {
  // Request tabs from background
  const response = await new Promise(resolve => {
    chrome.runtime.sendMessage({ action: 'getTabs' }, resolve);
  });
  
  tabs = response.tabs;
  const screenshots = response.screenshots;
  
  if (tabs.length === 0) return;
  
  // If we only have 1 tab, select it
  if (tabs.length === 1) {
    selectedIndex = 0;
  }
  
  // We don't want to show ALL tabs if there are too many, just recent ones
  const displayTabs = tabs.slice(0, 8); // show max 8 most recent
  
  const container = document.getElementById('tab-list');
  
  displayTabs.forEach((tab, index) => {
    const card = document.createElement('div');
    card.className = 'tab-card';
    if (index === selectedIndex) {
      card.classList.add('selected');
    }
    card.dataset.index = index;
    card.dataset.tabId = tab.id;
    
    // Preview
    const preview = document.createElement('div');
    preview.className = 'tab-preview';
    const screenshotKey = `screenshot_${tab.id}`;
    if (screenshots && screenshots[screenshotKey]) {
      preview.style.backgroundImage = `url(${screenshots[screenshotKey]})`;
    }
    
    // Info area
    const info = document.createElement('div');
    info.className = 'tab-info';
    
    // Favicon
    const favicon = document.createElement('img');
    favicon.className = 'tab-favicon';
    favicon.src = tab.favIconUrl || 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="40" fill="gray"/></svg>';
    favicon.onerror = () => {
      favicon.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="40" fill="gray"/></svg>';
    };
    
    // Title
    const title = document.createElement('div');
    title.className = 'tab-title';
    title.textContent = tab.title || tab.url;
    
    info.appendChild(favicon);
    info.appendChild(title);
    
    card.appendChild(preview);
    card.appendChild(info);
    
    // Click handling
    card.addEventListener('click', () => {
      switchTab(tab.id);
    });
    
    card.addEventListener('mouseenter', () => {
      updateSelection(index);
    });
    
    container.appendChild(card);
  });
});

function updateSelection(newIndex) {
  const cards = document.querySelectorAll('.tab-card');
  if (cards[selectedIndex]) {
    cards[selectedIndex].classList.remove('selected');
  }
  selectedIndex = newIndex;
  if (cards[selectedIndex]) {
    cards[selectedIndex].classList.add('selected');
  }
}

function switchTab(tabId) {
  chrome.runtime.sendMessage({ action: 'switchTab', tabId: tabId });
  window.close(); // Close the popup
}

// Keyboard handling
document.addEventListener('keydown', (e) => {
  const cards = document.querySelectorAll('.tab-card');
  if (cards.length === 0) return;
  
  if (e.key === 'Tab' || e.key === 'ArrowRight' || e.key === 'ArrowDown') {
    e.preventDefault();
    let newIndex = (selectedIndex + 1) % cards.length;
    updateSelection(newIndex);
  } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
    e.preventDefault();
    let newIndex = (selectedIndex - 1 + cards.length) % cards.length;
    updateSelection(newIndex);
  } else if (e.key === 'Enter') {
    e.preventDefault();
    const tabId = parseInt(cards[selectedIndex].dataset.tabId, 10);
    switchTab(tabId);
  }
});

document.addEventListener('keyup', (e) => {
  // If the user releases Alt/Control (the modifier they held to open the shortcut),
  // switch to the selected tab.
  if (e.key === 'Alt' || e.key === 'Control' || e.key === 'Meta') {
    const cards = document.querySelectorAll('.tab-card');
    if (cards.length > 0 && cards[selectedIndex]) {
       const tabId = parseInt(cards[selectedIndex].dataset.tabId, 10);
       switchTab(tabId);
    }
  }
});
