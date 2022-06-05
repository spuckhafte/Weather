const API = city => `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&APPID=fcc8de7015bbb202209bbf0261babf4c`
const Capitalize = text => text.charAt(0).toUpperCase() + text.slice(1)


const Page = new Spuck({ type: 'main', parent: '#app', class: 'page' }).make()

const CityInput = new Spuck({ type: 'input', parent: '.page', class: 'city-inp' }).render();
const setCityInp = CityInput.$state('cityInp', 'New York');
CityInput.prop = { value: '$-cityInp' }
CityInput.attr = { placeholder: 'city name', autofocus: true, spellcheck: false };
CityInput.events = {
    input: event => setCityInp(event.target.value),
    keyup: event => handleCitySubmit(event)
}
CityInput.$effect(async () => {
    await handleCitySubmit({ keyCode: 13 })
    setCityInp('')
}, ['f'])
CityInput.make('re');

const CityDisplay = new Spuck({ type: 'div', parent: '.page', class: 'city' }).render();
const setCity = CityDisplay.$state('city', 'Location');
CityDisplay.prop = { text: '$-city' }
CityDisplay.make('re');

const DateDisplay = new Spuck({ type: 'div', parent: '.page', class: 'date' }).render();
const setDate = DateDisplay.$state('date', 'Wed, May 15');
DateDisplay.prop = { text: '$-date' }
DateDisplay.make('re');

const TempDisplay = new Spuck({ type: 'div', parent: '.page', class: 'temp' }).render();
const setTemp = TempDisplay.$state('temp', '0°C');
TempDisplay.prop = { text: '$-temp' }
TempDisplay.make('re');

const WeatherDisplay = new Spuck({ type: 'div', parent: '.page', class: 'weather' }).render();
const setWeather = WeatherDisplay.$state('weather', 'clear sky');
WeatherDisplay.prop = { text: '<img id="weather" src="https://openweathermap.org/img/wn/01d@2x.png"></img> $-weather' }
WeatherDisplay.make('re');

const HighLow = new Spuck({ type: 'div', parent: '.page', class: 'highlow' }).render();
const setHigh = HighLow.$state('high', '0°C');
const setLow = HighLow.$state('low', '0°C');
HighLow.prop = { text: '<div><b>Min:</b> $-low </div><div><b>Max:</b> $-high </div>' }
HighLow.make('re');


async function handleCitySubmit(e) {
    if (e.keyCode !== 13) return;
    try {

        const data = await (await fetch(API(CityInput.getState('cityInp')))).json();
        data.main.temp;

        setCity(Capitalize(CityInput.getState('cityInp')))

        let now = new Date();
        setDate(dateBuilder(now))

        setTemp(data.main.temp + "°C")

        setWeather(data.weather[0].description.toUpperCase())
        document.querySelector('#weather').setAttribute('src', `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`)

        setHigh(data.main.temp_max + "°C")
        setLow(data.main.temp_min + "°C")

    } catch (e) { return };
}

function dateBuilder(d) {
    let months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    let days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

    let day = days[d.getDay()];
    let date = d.getDate();
    let month = months[d.getMonth()];
    let year = d.getFullYear();

    return `${day} ${date} ${month} ${year}`;
}