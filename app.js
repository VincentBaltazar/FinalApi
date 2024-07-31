const apiKey = 'b63bada404de269250f09afe486563a0'; // Weather API key
const apiUrl = 'https://api.openweathermap.org/data/2.5/weather';
const newsApiKey = '0d005a3d312650ffaba592e1490129a3'; // Replace with your GNews API key
const newsApiUrl = 'https://gnews.io/api/v4/search';

const locationInput = document.getElementById('locationInput');
const searchButton = document.getElementById('searchButton');
const locationElement = document.getElementById('location');
const temperatureElement = document.getElementById('temperature');
const descriptionElement = document.getElementById('description');
const newsList = document.getElementById('newsList');

searchButton.addEventListener('click', () => {
    const location = locationInput.value;
    if (location) {
        fetchWeather(location);
    }
});

function fetchWeather(location) {
    const url = `${apiUrl}?q=${location}&appid=${apiKey}&units=metric`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            console.log('Weather Data:', data); // Log weather data for debugging
            if (data.cod !== 200) {
                console.error('Error:', data.message); // Log the error message from the API
                locationElement.textContent = 'City not found';
                temperatureElement.textContent = '';
                descriptionElement.textContent = '';
                newsList.innerHTML = '';
                return;
            }
            locationElement.textContent = data.name;
            temperatureElement.textContent = `${Math.round(data.main.temp)}°C`;
            descriptionElement.textContent = data.weather[0].description;
            fetchWeatherNews(data.weather[0].main); // Fetch news based on weather condition
        })
        .catch(error => {
            console.error('Error fetching weather data:', error);
        });
}

function fetchWeatherNews(query, page = 1) {
    const encodedQuery = encodeURIComponent(query);
    // Adjust the URL to include pagination and page size
    const url = `${newsApiUrl}?q=${encodedQuery}&token=${newsApiKey}&lang=en&size=100&page=${page}`; // Increase size for more results

    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log('News Data:', data);
            if (data.articles && data.articles.length > 0) {
                displayNews(data.articles);
                // If there are more pages, you could handle pagination here
            } else {
                newsList.innerHTML = '<li>No news available for this weather condition.</li>';
            }
        })
        .catch(error => {
            console.error('Error fetching news data:', error);
            newsList.innerHTML = '<li>Error fetching news data.</li>'; // Display error message to user
        });
}

function displayNews(articles) {
    newsList.innerHTML = '';
    articles.forEach(article => {
        const listItem = document.createElement('li');
        listItem.innerHTML = `
            <div class="news-card">
                <a href="${article.url}" target="_blank">
                    <h3>${article.title}</h3>
                    <p>${article.description || 'No description available.'}</p>
                </a>
            </div>
        `;
        newsList.appendChild(listItem);
    });
}
