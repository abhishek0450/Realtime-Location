// Client-side code
const socket = io();

// Check for geolocation support
if (navigator.geolocation) {
    navigator.geolocation.watchPosition(
        (position) => {
            const { latitude, longitude } = position.coords;
            socket.emit("send-location", { latitude, longitude });
        },
        (error) => {
            console.error("Error fetching location:", error);
        },
        {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 3000,
        }
    );
}

// Initialize Leaflet map with a default view
const map = L.map("map").setView([0, 0], 16);
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: "Map data © OpenStreetMap contributors"
}).addTo(map);

const markers = {};

// Listen for location updates
socket.on("receive-location", (data) => {
    const { id, latitude, longitude } = data;

    // Update map center to the latest location
    map.setView([latitude, longitude]);

    if (markers[id]) {
        // Move existing marker
        markers[id].setLatLng([latitude, longitude]);
    } else {
        // Add a new marker
        markers[id] = L.marker([latitude, longitude]).addTo(map);
    }
});

// Remove marker if a user disconnects
socket.on("user-disconnected", (id) => {
    if (markers[id]) {
        map.removeLayer(markers[id]);
        delete markers[id];
    }
});
