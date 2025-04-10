const initialAuthData = localStorage.getItem('authData');
if (!initialAuthData) {
    window.location.href = './index.html';
}

setInterval(() => {
    const authData = JSON.parse(localStorage.getItem('authData'));
    if (!authData) {
        window.location.href = './index.html';
        return;
    }

    const currentTime = new Date().getTime();
    const thirtyMinutes = 30 * 60 * 1000;

    if (currentTime - authData.timestamp > thirtyMinutes) {
        localStorage.removeItem('authData');
        window.location.href = './index.html';
    }
}, 30000); // 30 seconds

function logout() {
    localStorage.removeItem('authData');
    window.location.href = './index.html';
}

// Function to create the weight progress chart
function createWeightChart(data) {
    const ctx = document.getElementById('progress-data').getContext('2d');
    
    // Extract dates and weights from data
    const dates = data.map(day => day.date);
    const weights = data.map(day => day.progress.weight);

    const chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: dates,
            datasets: [{
                label: 'Weight Progress (kg)',
                data: weights,
                borderColor: '#007bff',
                backgroundColor: 'rgba(0, 123, 255, 0.1)',
                borderWidth: 2,
                fill: true,
                tension: 0.4, // Makes the line curved
                pointBackgroundColor: '#007bff',
                pointBorderColor: '#ffffff',
                pointBorderWidth: 2,
                pointRadius: 4,
                pointHoverRadius: 6
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                },
                tooltip: {
                    mode: 'index',
                    intersect: false,
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    titleColor: '#ffffff',
                    bodyColor: '#ffffff',
                    borderColor: '#007bff',
                    borderWidth: 1,
                    padding: 10,
                    displayColors: false,
                    callbacks: {
                        label: function(context) {
                            return `Weight: ${context.raw} kg`;
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: false,
                    grid: {
                        color: 'rgba(0, 0, 0, 0.1)'
                    },
                    ticks: {
                        callback: function(value) {
                            return parseFloat(value).toFixed(2) + ' kg';
                        }
                    }
                },
                x: {
                    grid: {
                        color: 'rgba(0, 0, 0, 0.1)'
                    }
                }
            }
        }
    });

    return chart;
}

function populateWeightStats(image, date) {
    const container = document.createElement('div');
    container.classList.add('item', 'weight-item');

    let progressImage = document.createElement('img');
    progressImage.src = image;

    let progressWeight = document.createElement('span');
    progressWeight.textContent = date;

    container.appendChild(progressImage);
    container.appendChild(progressWeight);

    return container;
}

function displayWeightStats(data) {
    const container = document.getElementById('weight-container');
    data.forEach(day => {
        const weightItem = populateWeightStats(day.progress.image, day.date);
        container.appendChild(weightItem);
    });
}

// Modified loadAndPopulateData function
async function populateProgress(data) {
    try {
        createWeightChart(data);
        displayWeightStats(data);
    } catch (error) {
        console.error('Error:', error);
        document.getElementById('progress-container').innerHTML = 
            '<p>Error loading data. Please try again later.</p>';
    }
}

async function loadData() {
    const response = await fetch('./data.json');
    const data = await response.json();
    return data;
}

document.addEventListener('DOMContentLoaded', async () => {
    data = await loadData();
    populateProgress(data);
});