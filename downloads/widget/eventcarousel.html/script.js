let websocket = null;
let scrollSpeed = 25; // Adjust speed here (lower = slower)
let selectedEvents = new Set();
let allEventsData = []; // Store all event data
let eventTypes = new Set(); // Store unique event types


let debugMode = false;


document.addEventListener('DOMContentLoaded', () => {
    // Setup debug checkbox handler
    const debugCheckbox = document.getElementById('debugCheckbox');
    debugCheckbox.addEventListener('change', (e) => {
        debugMode = e.checked;
        document.getElementById('eventLogContainer').style.display = debugMode ? 'block' : 'none';
    });

    // Create initial event type filter
    updateEventTypeFilter();

    // Start connection
    connect();
});

function connect() {
    if (websocket) return;

    websocket = new WebSocket("ws://localhost:21213/");

    websocket.onopen = () => {
        document.getElementById("status").textContent = "Connected";
    };

    websocket.onclose = () => {
        document.getElementById("status").textContent = "Disconnected";
        websocket = null;
        setTimeout(connect, 1000);
    };

    websocket.onerror = () => {
        document.getElementById("status").textContent = "Connection Failed";
        websocket = null;
        setTimeout(connect, 1000);
    };

    websocket.onmessage = (event) => {
        let parsedData = JSON.parse(event.data);
        console.log("Data received", parsedData);

        // Only log events if debug mode is enabled
        if (debugMode) {
            logEvent(parsedData);
        }
        
        // Handle different events based on their type
        if (parsedData.event === "config") {
            onConfigEvent(parsedData.data); // Call the dedicated function for config events
        }
    };
}

// Function to log events in the debug panel
function logEvent(data) {
    // Add event type to our set of known types
    eventTypes.add(data.event);
    updateEventTypeFilter();
    
    // Check if this event type is currently filtered
    const selectedType = document.getElementById('eventTypeFilter').value;
    if (selectedType !== 'all' && data.event !== selectedType) return;
    
    const eventLog = document.getElementById('eventLog');
    const logEntry = document.createElement('div');
    logEntry.className = 'log-entry';
    logEntry.dataset.eventType = data.event; // Add event type as data attribute
    
    // Create header with dropdown toggle
    const header = document.createElement('div');
    header.className = 'log-header';
    header.innerHTML = `
        <span class="dropdown-arrow">▶</span>
        <strong>Event Type:</strong> ${data.event}
        <span class="timestamp">${new Date().toLocaleTimeString()}</span>
    `;
    
    // Create content container
    const content = document.createElement('div');
    content.className = 'log-content';
    content.innerHTML = `<pre>${JSON.stringify(data.data, null, 2)}</pre>`;
    
    // Add click handler for dropdown toggle
    header.addEventListener('click', () => {
        logEntry.classList.toggle('expanded');
    });
    
    logEntry.appendChild(header);
    logEntry.appendChild(content);
    eventLog.insertBefore(logEntry, eventLog.firstChild);
}

// Function to update event type filter dropdown
function updateEventTypeFilter() {
    const filterSelect = document.getElementById('eventTypeFilter');
    if (!filterSelect) {
        // Create filter if it doesn't exist
        const container = document.getElementById('eventLogContainer');
        const filterDiv = document.createElement('div');
        filterDiv.className = 'filter-container';
        filterDiv.innerHTML = `
            <select id="eventTypeFilter">
                <option value="all">All Events</option>
                ${Array.from(eventTypes).map(type => `<option value="${type}">${type}</option>`).join('')}
            </select>
        `;
        container.insertBefore(filterDiv, document.getElementById('eventLog'));
        
        // Add event listener to new filter
        document.getElementById('eventTypeFilter').addEventListener('change', function() {
            const selectedType = this.value;
            const logEntries = document.querySelectorAll('.log-entry');
            
            logEntries.forEach(entry => {
                if (selectedType === 'all' || entry.dataset.eventType === selectedType) {
                    entry.style.display = '';
                } else {
                    entry.style.display = 'none';
                }
            });
        });
    } else {
        // Update existing filter options
        const currentValue = filterSelect.value;
        filterSelect.innerHTML = `
            <option value="all">All Events</option>
            ${Array.from(eventTypes).map(type => `<option value="${type}">${type}</option>`).join('')}
        `;
        filterSelect.value = currentValue;
    }
}

// Function to handle the "config" event
function onConfigEvent(data) {
    // Cancel existing animation before updating
    if (currentAnimationFrame) {
        cancelAnimationFrame(currentAnimationFrame);
        currentAnimationFrame = null;
    }

    allEventsData = data.events.filter(event => event.trigger?.imageUrl && event.actions?.length);
    generateCarouselCards();
}

// Generate carousel cards (only unique gifts)
function generateCarouselCards() {
    const carousel = document.getElementById("carousel");
    carousel.innerHTML = "";

    let uniqueGifts = new Map();

    allEventsData.forEach(event => {
        let giftId = event.trigger.id;
        let actionNames = event.actions.map(action => action.name).join(", ");

        if (!uniqueGifts.has(giftId)) {
            uniqueGifts.set(giftId, {
                imageUrl: event.trigger.imageUrl,
                giftName: event.trigger.name,
                actions: new Set()
            });
        }

        event.actions.forEach(action => uniqueGifts.get(giftId).actions.add(action.name));
    });

    uniqueGifts.forEach(gift => {
        const newCard = document.createElement("div");
        newCard.classList.add("event-card");
        newCard.innerHTML = `
            <img src="${gift.imageUrl}" alt="${gift.giftName}">
            <div class="action">${Array.from(gift.actions).join(", ")}</div>
        `;
        carousel.appendChild(newCard);
    });

    // Calculate total width of cards and compare with screen width
    const cardWidth = 220; // Width of each card from CSS
    const totalCardsWidth = uniqueGifts.size * cardWidth;
    const screenWidth = window.innerWidth;

    if (totalCardsWidth > screenWidth) {
        duplicateCards(); // Enable scrolling when cards exceed screen width
    } else {
        // Center cards when they fit within screen
        carousel.style.justifyContent = "center";
        carousel.style.transform = "translateX(0)";
    }
}

// Duplicate cards for smooth infinite scrolling
function duplicateCards() {
    const carousel = document.getElementById("carousel");
    const originalCards = Array.from(carousel.children);

    // Reset any previous styles
    carousel.style.justifyContent = "flex-start";

    // Clone each card to ensure a seamless loop
    originalCards.forEach(card => {
        const clone = card.cloneNode(true);
        carousel.appendChild(clone);
    });

    startScrolling();
}

let currentAnimationFrame = null;

// **Smooth infinite scrolling animation**
function startScrolling() {
    const carousel = document.getElementById("carousel");
    let scrollPos = 0;
    let direction = 1; // 1 for forward, -1 for reverse

    // Cancel any existing animation
    if (currentAnimationFrame) {
        cancelAnimationFrame(currentAnimationFrame);
    }

    function scrollStep() {
        scrollPos += direction;
        carousel.style.transform = `translateX(-${scrollPos}px)`;

        // Check if we've reached either end of the scroll
        if (scrollPos >= carousel.scrollWidth / 2) {
            direction = -1; // Start scrolling backwards
        } else if (scrollPos <= 0) {
            direction = 1; // Start scrolling forwards
        }

        currentAnimationFrame = requestAnimationFrame(scrollStep);
    }

    scrollStep();
}




let lastConfigData = null;

// Check if page loaded in an iframe
if (window.self !== window.top) {
    if (document.querySelector('.status-container'))
        document.querySelector('.status-container').style.display = "none";

    // Listen for messages from parent window
    window.addEventListener("message", (event) => {
        if (typeof event.data === "object" && event.data.type) {
            switch (event.data.type) {
                case "config":
                    if (JSON.stringify(event.data.configData) !== JSON.stringify(lastConfigData)) {
                        lastConfigData = event.data.configData;
                        onConfigEvent(event.data.configData);
                    }
            }
        }
    });
} else {
    // Connect WebSocket when window loads
    window.addEventListener("load", connect);
}