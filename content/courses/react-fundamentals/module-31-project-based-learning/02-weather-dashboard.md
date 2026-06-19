# Weather Dashboard

A weather dashboard is a practical React project for forms, API requests, loading states, error handling, effects, caching, and responsive UI.

The goal is to build an app that feels dependable even when the network, user input, or API response is imperfect.

## Project Goal

Build a dashboard where users can search for a city, view current weather, see a short forecast, and save favorite locations.

Use a public weather API or a mock API if you do not want to create an account.

## Core Requirements

Your app must support:

- searching by city name
- showing loading state during requests
- showing user-friendly errors
- showing current temperature, condition, humidity, wind, and location
- showing a multi-day forecast
- saving favorite cities
- selecting a favorite to refetch weather
- persisting favorites in `localStorage`
- preventing empty searches

## Suggested Component Architecture

```text
App
  WeatherSearchForm
  FavoriteCities
  WeatherStatus
  CurrentWeatherCard
  ForecastList
    ForecastCard
  WeatherError
```

Suggested state:

```js
const [query, setQuery] = useState("");
const [weather, setWeather] = useState(null);
const [forecast, setForecast] = useState([]);
const [favorites, setFavorites] = useState([]);
const [status, setStatus] = useState("idle");
const [error, setError] = useState(null);
```

`status` can be:

```text
idle | loading | success | error
```

## API Layer

Keep API logic outside the component when possible.

```js
export async function fetchWeather(city) {
  const response = await fetch(`/api/weather?city=${encodeURIComponent(city)}`);

  if (!response.ok) {
    throw new Error("Weather request failed");
  }

  return response.json();
}
```

This makes components easier to read and easier to test.

## Milestones

1. Build the static dashboard layout.
2. Add controlled search input.
3. Fetch weather for a hard-coded city.
4. Fetch weather from user input.
5. Add loading and error states.
6. Render current weather.
7. Render forecast cards.
8. Add favorites.
9. Persist favorites.
10. Add request cancellation or stale response handling.
11. Deploy and test with real network conditions.

## Acceptance Criteria

- Empty searches do not call the API.
- Loading state appears for slow requests.
- Failed requests show a message the user can understand.
- A later search cannot be overwritten by an older slower response.
- Favorite cities are not duplicated.
- Favorites remain after refresh.
- Forecast items have stable keys.
- The UI works on mobile and desktop widths.

## Handling Stale Responses

If a user searches "London" and quickly searches "Tokyo", the London request might finish after the Tokyo request. Do not let the old response replace the new result.

One option is `AbortController`:

```js
useEffect(() => {
  if (!city) return;

  const controller = new AbortController();

  async function loadWeather() {
    setStatus("loading");
    setError(null);

    try {
      const data = await fetchWeather(city, { signal: controller.signal });
      setWeather(data.current);
      setForecast(data.forecast);
      setStatus("success");
    } catch (error) {
      if (error.name === "AbortError") return;
      setError("Could not load weather. Try again.");
      setStatus("error");
    }
  }

  loadWeather();

  return () => controller.abort();
}, [city]);
```

## Common Mistakes

- Fetching on every keystroke without debounce or submit control.
- Ignoring failed responses.
- Showing raw API error messages to users.
- Keeping API keys in public frontend code when the provider requires secrecy.
- Forgetting to URL-encode city names.
- Rendering forecast lists with array indexes when API items have dates.
- Letting old responses overwrite newer searches.

## Edge Cases

Test these:

- city name with spaces
- unknown city
- API rate limit response
- offline browser
- very slow network
- favorite already exists
- empty forecast array
- temperature unit switch from Celsius to Fahrenheit

:::quiz
question: What problem does `AbortController` help solve in a weather search app?
options:
  - It prevents React from rendering JSX.
  - It can cancel an outdated fetch when the user starts a newer search.
  - It stores favorites in localStorage.
  - It makes API keys private in frontend code.
answer: 1
explanation: AbortController lets you cancel fetch requests, which helps prevent stale responses from updating the UI.
:::

## Practice Challenges

Beginner challenge:

- Add a unit toggle for Celsius and Fahrenheit.

Intermediate challenge:

- Cache the last successful result for each city during the session.

Advanced challenge:

- Add geolocation support with a permission-aware UI.
- Handle denied permission without treating it as an app crash.

## Extension Ideas

- hourly forecast chart
- severe weather warning banner
- recent searches
- skeleton loading UI
- offline fallback for last viewed city
- tests for loading, success, and error states

## Recap

A weather dashboard teaches real-world async UI. Strong solutions validate input, isolate API code, model loading and error states explicitly, guard against stale responses, and treat network failure as normal.
