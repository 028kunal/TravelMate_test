// Replace with your actual API key
const API_KEY = 'AIzaSyANhAaLi6TA732zRLOAxFxx7vJIhVR0958';
const API_ENDPOINT = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

const darkModeToggle = document.createElement('button');
darkModeToggle.textContent = 'Dark Mode';
darkModeToggle.classList.add('dark-mode-toggle');
document.body.appendChild(darkModeToggle);

const viewSavedButton = document.createElement('button');
viewSavedButton.textContent = 'View Saved Plans';
viewSavedButton.id = 'view-saved-button';
document.querySelector('.input-section').appendChild(viewSavedButton);

darkModeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    document.querySelector('.container').classList.toggle('dark-mode');
    darkModeToggle.classList.toggle('dark');
    if (document.body.classList.contains('dark-mode')) {
        darkModeToggle.textContent = 'Light Mode';
        localStorage.setItem('theme', 'dark');
    } else {







        
        darkModeToggle.textContent = 'Dark Mode';
        localStorage.setItem('theme', 'light');
    }
});

document.addEventListener('DOMContentLoaded', () => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-mode');
        document.querySelector('.container').classList.add('dark-mode');
        darkModeToggle.classList.add('dark');
        darkModeToggle.textContent = 'Light Mode';
    }
});

async function planTrip() {
    const placeInput = document.getElementById('place');
    const daysInput = document.getElementById('days');
    const inputSection = document.querySelector('.input-section');
    const tripPlanOutput = document.getElementById('trip-plan-output');
    const tripPlanSection = document.getElementById('trip-plan-section');
    const errorMessage = document.getElementById('error-message');
    const saveButton = document.createElement('button');
    saveButton.textContent = 'Save Plan';
    saveButton.classList.add('save-button');

    const place = placeInput.value.trim();
    const days = parseInt(daysInput.value);

    // Clear previous results and error messages
    tripPlanOutput.innerHTML = '';
    errorMessage.innerHTML = '';
    tripPlanSection.classList.add('hidden');
    if (saveButton.parentNode) {
        saveButton.parentNode.removeChild(saveButton);
    }

    if (!place || isNaN(days) || days <= 0) {
        errorMessage.textContent = 'Please enter a valid destination and a positive number of days.';
        return;
    }

    // Construct a more detailed prompt for the Gemini API
    const prompt = `Plan a ${days}-day trip to ${place}. Provide a daily itinerary including at least one major attraction or activity for each day. For each day, give a short description of the attraction or activity. Briefly suggest a mode of transport within the city for getting around. Describe the general climate and typical weather conditions during this time of year in ${place}. If possible, suggest some general types of accommodations (e.g., budget-friendly, mid-range, luxury) in the area.`;

    try {
        const response = await fetch(API_ENDPOINT + '?key=' + API_KEY, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }],
            }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Gemini API Error:', errorData);
            errorMessage.textContent = 'Failed to generate trip plan. Please try again later.';
            return;
        }

        const data = await response.json();
        if (data.candidates && data.candidates.length > 0 && data.candidates[0].content && data.candidates[0].content.parts && data.candidates[0].content.parts.length > 0) {
            const tripPlan = data.candidates[0].content.parts[0].text;
            tripPlanOutput.innerHTML = `<pre>${tripPlan}</pre>`;
            tripPlanSection.classList.remove('hidden');
            inputSection.classList.add('hidden');
            tripPlanSection.appendChild(saveButton);

            saveButton.addEventListener('click', () => {
                const newPlan = {
                    destination: place,
                    days: days,
                    plan: tripPlan
                };
                const savedPlansString = localStorage.getItem('savedTripPlans');
                let savedPlans = savedPlansString ? JSON.parse(savedPlansString) : [];
                savedPlans.push(newPlan);
                localStorage.setItem('savedTripPlans', JSON.stringify(savedPlans));
                window.location.href = 'saved_plan.html';
            });
        } else {
            errorMessage.textContent = 'Could not generate a trip plan at this time.';
        }

    } catch (error) {
        console.error('Fetch Error:', error);
        errorMessage.textContent = 'An error occurred while fetching the trip plan. Please check your internet connection and API key.';
    }
}

viewSavedButton.addEventListener('click', () => {
    window.location.href = 'saved_plan.html';
});