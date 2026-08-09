/* =========================================================
         ✅a Code Overview (JavaScript Part)
         ---------------------------------------------------------
         ✅ Goal:
            - Convert city name → coordinates (lat/lon)
            - Fetch weather using coordinates
            - Update the UI safely (loading, error, results)

         ✅ Why AbortController?
            - If user searches quickly many times:
              old request may finish after new request
              and overwrite the UI with wrong results
            - AbortController cancels old request to prevent that ✅
         ========================================================= */

// =========================================================
// ✅ 1) API Endpoints (Open-Meteo)
// =========================================================
// ✅ Geocoding: city name → lat/lon
const GEO_URL = "https://geocoding-api.open-meteo.com/v1/search";

// ✅ Forecast: lat/lon → current + daily forecast
const FC_URL = "https://api.open-meteo.com/v1/forecast";

// =========================================================
// ✅ 2) DOM References (UI object)
// ---------------------------------------------------------
// ✅ Instead of writing document.getElementById(...) everywhere,
//    we store them once inside UI for easy reuse.
// =========================================================
const UI = {
  // Search controls
  city: document.getElementById("city"),
  btnSearch: document.getElementById("btnSearch"),
  btnclear: document.getElementById("btnclear"),
  btnUseDubai: document.getElementById("btnUseDubai"),

  // UI state areas
  loading: document.getElementById("loading"),
  error: document.getElementById("error"),
  results: document.getElementById("results"),

  // Current weather display
  placeName: document.getElementById("placeName"),
  placeMeta: document.getElementById("placeMeta"),
  tempNow: document.getElementById("tempNow"),
  humidityPill: document.getElementById("humidityPill"),
  windPill: document.getElementById("windPill"),
  timeMeta: document.getElementById("timeMeta"),

  // Forecast table body
  forecastBody: document.getElementById("forecastBody"),
};

// =========================================================
// ✅ 3) App State
// ---------------------------------------------------------
// ✅ We keep the latest AbortController here so we can cancel
//    any previous request if user searches again quickly.
// =========================================================
let currentController = null;

// =========================================================
// ✅ 4) UI Helpers (Loading + Error)
// =========================================================

// ✅ Show/hide loading spinner and disable buttons while loading
function setLoading(isLoading) {
  UI.loading.style.display = isLoading ? "flex" : "none";
  UI.btnSearch.disabled = isLoading;
  UI.btnUseDubai.disabled = isLoading;
}

// ✅ Show/hide error message box
function setError(message) {
  // ✅ If message is empty/null → hide error box
  if (!message) {
    UI.error.style.display = "none";
    UI.error.textContent = "";
    return;
  }

  // ✅ Else show it
  UI.error.style.display = "block";
  UI.error.textContent = message;
}

// =========================================================
// ✅ 5) Fetch Helper (JSON + HTTP error checking)
// ---------------------------------------------------------
// ✅ fetch() only throws for network failures (no internet, etc.)
// ✅ But if server responds 404/500, fetch() still "succeeds"
//    so we must check res.ok manually ✅
// =========================================================
async function apiFetchJson(url, signal) {
  const res = await fetch(url, { signal });

  // ✅ Throw a readable error for HTTP failures
  if (!res.ok) throw new Error(`HTTP ${res.status} (${res.statusText})`);

  // ✅ Return JSON response body
  return res.json();
}

// =========================================================
// ✅ 6) Step 1: Geocode (City → lat/lon)
// ---------------------------------------------------------
// ✅ We request:
//   name=CityName
//   count=1 → only the best match
//   language=en
// =========================================================
async function geocodeCity(name, signal) {
  const url = new URL(GEO_URL);

  // ✅ Build query parameters safely
  url.searchParams.set("name", name);
  url.searchParams.set("count", "1");
  url.searchParams.set("language", "en");
  url.searchParams.set("format", "json");

  // ✅ Call API
  const data = await apiFetchJson(url, signal);

  // ✅ If no results → show a meaningful error
  if (!data.results || data.results.length === 0) {
    throw new Error(`City not found: ${name}`);
  }

  // ✅ Return the first match (best match)
  return data.results[0];
}

// =========================================================
// ✅ 7) Step 2: Forecast (lat/lon → weather data)
// ---------------------------------------------------------
// ✅ We request:
//   current: temperature + humidity + wind
//   daily: min/max temp + precipitation
//   timezone=auto (so times match the city local time)
// =========================================================
async function getForecast(lat, lon, signal) {
  const url = new URL(FC_URL);

  // ✅ Coordinates
  url.searchParams.set("latitude", String(lat));
  url.searchParams.set("longitude", String(lon));

  // ✅ Current weather fields
  url.searchParams.set(
    "current",
    "temperature_2m,relative_humidity_2m,wind_speed_10m",
  );

  // ✅ 7-day daily summary fields
  url.searchParams.set(
    "daily",
    "temperature_2m_min,temperature_2m_max,precipitation_sum",
  );

  // ✅ API returns local time based on coordinates
  url.searchParams.set("timezone", "auto");

  // ✅ Call API and return JSON
  return apiFetchJson(url, signal);
}

// =========================================================
// ✅ 8) Render (Put results into the UI)
// =========================================================
function render(place, data) {
  // ✅ Show results section
  UI.results.style.display = "grid";

  // ✅ City name + country
  UI.placeName.textContent = `${place.name}, ${place.country}`;

  // ✅ Show coordinates for transparency/debugging
  UI.placeMeta.textContent = `Lat/Lon: ${place.latitude}, ${place.longitude}`;

  // ✅ Current temperature + its unit (°C, °F)
  const t = data.current.temperature_2m;
  const tUnit = data.current_units.temperature_2m;
  UI.tempNow.textContent = `${t}${tUnit}`;

  // ✅ Humidity pill (includes unit %)
  UI.humidityPill.textContent = `Humidity: ${data.current.relative_humidity_2m}${data.current_units.relative_humidity_2m}`;

  // ✅ Wind pill (includes unit like km/h)
  UI.windPill.textContent = `Wind: ${data.current.wind_speed_10m} ${data.current_units.wind_speed_10m}`;

  // ✅ Current local time of city (from API)
  UI.timeMeta.textContent = `Local time: ${data.current.time} (${data.timezone})`;

  // ✅ Build forecast table rows from daily arrays
  const days = data.daily.time;

  UI.forecastBody.innerHTML = days
    .map((day, i) => {
      // ✅ Each index i represents same day across arrays
      const min = data.daily.temperature_2m_min[i];
      const max = data.daily.temperature_2m_max[i];
      const rain = data.daily.precipitation_sum[i];

      // ✅ Units (usually °C, mm)
      const minU = data.daily_units.temperature_2m_min;
      const maxU = data.daily_units.temperature_2m_max;
      const rainU = data.daily_units.precipitation_sum;

      // ✅ Return table row HTML
      return `
          <tr>
            <td>${day}</td>
            <td>${min}${minU}</td>
            <td>${max}${maxU}</td>
            <td>${rain} ${rainU}</td>
          </tr>
        `;
    })
    .join("");
}

// =========================================================
// ✅ 9) Main Search Action (The "Controller" function)
// ---------------------------------------------------------
// ✅ This is the main function that runs when user searches.
// It connects everything:
//   cancel old request → loading on → geocode → forecast → render → loading off
// =========================================================
async function runSearch(cityName) {
  // ✅ Cancel previous request if it exists
  // This prevents old results overwriting new ones
  if (currentController) currentController.abort();

  // ✅ Create a new AbortController for this new search
  currentController = new AbortController();

  // ✅ Reset UI state
  setError("");
  setLoading(true);

  try {
    // ✅ 1) City name → place object (lat/lon/country)
    const place = await geocodeCity(cityName, currentController.signal);

    // ✅ 2) lat/lon → weather data
    const data = await getForecast(
      place.latitude,
      place.longitude,
      currentController.signal,
    );

    // ✅ 3) Render results to UI
    render(place, data);
  } catch (err) {
    // ✅ AbortError means we canceled the request on purpose (not a real failure)
    if (err.name === "AbortError") return;

    // ✅ Show error message
    setError(`❌ ${err.message}`);

    // ✅ Hide results if error happens (so old results don't remain visible)
    UI.results.style.display = "none";
  } finally {
    // ✅ Always stop loading spinner (success OR failure)
    setLoading(false);
  }
}

// =========================================================
// ✅ 10) Wire UI Events (Buttons + Enter Key)
// =========================================================

// ✅ Search button click
UI.btnSearch.addEventListener("click", () => {
  const name = UI.city.value.trim();

  // ✅ Simple validation: city must not be empty
  if (!name) return setError("❌ Please enter a city name.");

  runSearch(name);
});

// ✅ Pressing Enter in the input triggers search
UI.city.addEventListener("keydown", (e) => {
  if (e.key === "Enter") UI.btnSearch.click();
});

// ✅ Quick demo button: instantly search for Amman
UI.btnUseDubai.addEventListener("click", () => {
  UI.city.value = "Dubai";
  runSearch("Dubai");
});

btnclear.addEventListener("click", () => {
  let name = UI.city.value.trim();

  // ✅ Simple validation: city must not be empty
  if (!name) return setError("❌ There is Nothing to clear.");

  UI.city.value = "";
  console.log("fhbdkgh");
});
// =========================================================
// ✅ 11) Auto-run (Initial Demo on Page Load)
// =========================================================
UI.city.value = "Sharjah";
runSearch("Sharjah");
