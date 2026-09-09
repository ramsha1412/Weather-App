const input = document.getElementById("cityInput");
        const button = document.getElementById("getWeatherBtn");
        const answer = document.getElementById("answer");

        button.addEventListener("click", async () => {

            const city = input.value.trim();

            if (!city) {
                answer.textContent = "Enter a city.";
                return;
            }

            answer.textContent = "Fetching...";

            try {

                const locationResponse = await fetch(
                    `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`
                );

                if (!locationResponse.ok) {
                    throw new Error("Could not find location.");
                }

                const locationData = await locationResponse.json();

                if (!locationData.results || locationData.results.length === 0) {
                    answer.textContent = "City not found.";
                    return;
                }

                const location = locationData.results[0];

                const latitude = location.latitude;
                const longitude = location.longitude;
                const cityName = location.name;

                const weatherResponse = await fetch(
                    `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m`
                );

                if (!weatherResponse.ok) {
                    throw new Error("Weather API failed.");
                }

                const weatherData = await weatherResponse.json();

                answer.textContent =
                    `${cityName}: ${weatherData.current.temperature_2m}°C`;

            } catch (error) {

                answer.textContent = "Something went wrong.";
                console.error(error);

            }
        });