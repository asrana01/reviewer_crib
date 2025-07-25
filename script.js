// Sample address data
const addresses = [
    "123 Main St, Seattle",
    "456 Park Ave, NY",
    "789 Elm Rd, Austin",
    "77 Sunset Blvd, LA",
    "10 Downing St, London"
];

const searchInput = document.getElementById('searchInput');
const suggestions = document.getElementById('suggestions');
const clearBtn = document.getElementById('clearBtn');
const locateBtn = document.getElementById('locateBtn');
const hamburger = document.querySelector('.hamburger');
const navRight = document.querySelector('.nav-right');
const darkToggle = document.getElementById('darkToggle');

let currentIndex = -1;

// Navigation toggle
hamburger.addEventListener('click', () => {
    const expanded = hamburger.getAttribute('aria-expanded') === 'true';
    hamburger.setAttribute('aria-expanded', !expanded);
    navRight.classList.toggle('show');
});

// Dark mode toggle
darkToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark');
});

// Clear search
clearBtn.addEventListener('click', () => {
    searchInput.value = '';
    renderSuggestions([]);
    searchInput.focus();
});

// Use my location (simulated)
locateBtn.addEventListener('click', () => {
    alert('Location feature coming soon!');
});

// Populate search from chip
for (const chip of document.querySelectorAll('.chip')) {
    chip.addEventListener('click', () => {
        searchInput.value = chip.textContent;
        renderSuggestions([]);
    });
}

// Filter and show suggestions
searchInput.addEventListener('input', () => {
    const value = searchInput.value.toLowerCase();
    if (!value) {
        renderSuggestions([]);
        return;
    }
    const filtered = addresses.filter(addr => addr.toLowerCase().includes(value));
    renderSuggestions(filtered, value);
});

// Keyboard navigation
searchInput.addEventListener('keydown', (e) => {
    const items = suggestions.querySelectorAll('li');
    if (e.key === 'ArrowDown') {
        e.preventDefault();
        currentIndex = Math.min(currentIndex + 1, items.length - 1);
        highlightItem(items);
    } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        currentIndex = Math.max(currentIndex - 1, 0);
        highlightItem(items);
    } else if (e.key === 'Enter') {
        if (currentIndex >= 0 && items[currentIndex]) {
            selectItem(items[currentIndex]);
        }
    }
});

// Click outside to close suggestions
document.addEventListener('click', (e) => {
    if (!document.querySelector('.search-container').contains(e.target)) {
        renderSuggestions([]);
    }
});

function renderSuggestions(list, highlight = '') {
    suggestions.innerHTML = '';
    currentIndex = -1;
    if (!list.length) {
        suggestions.style.display = 'none';
        if (highlight && searchInput.value) {
            const li = document.createElement('li');
            li.textContent = `No results found for "${searchInput.value}"`;
            suggestions.appendChild(li);
            suggestions.style.display = 'block';
        }
        return;
    }
    list.forEach(addr => {
        const li = document.createElement('li');
        li.setAttribute('role', 'option');
        li.innerHTML = highlightText(addr, highlight);
        li.addEventListener('mousedown', () => selectItem(li));
        suggestions.appendChild(li);
    });
    suggestions.style.display = 'block';
}

function highlightItem(items) {
    items.forEach((el, idx) => {
        if (idx === currentIndex) {
            el.classList.add('highlighted');
        } else {
            el.classList.remove('highlighted');
        }
    });
}

function selectItem(item) {
    searchInput.value = item.textContent;
    renderSuggestions([]);
}

function highlightText(text, query) {
    if (!query) return text;
    const regex = new RegExp(`(${query})`, 'gi');
    return text.replace(regex, '<strong>$1</strong>');
}
