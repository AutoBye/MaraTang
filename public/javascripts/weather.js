const API_KEY="f75064d7d0bdc64d3f23a4254cbaee65"

function onGeoOk(position){
    const lat= position.coords.latitude; 
    const lon= position.coords.longitude;
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric&lang=kr`;
    fetch(url)
        .then(response => response.json())
        .then(data =>{
            const weather = document.querySelector("#weather span:first-child")
            const city = document.querySelector("#weather span:last-child")
            const emoji = getWeatherEmoji(data.weather[0].main); // 이모티콘 가져오기
            city.innerText = getKoreanCityName(data.name);
            weather.innerText = `${emoji} ${data.main.temp}°C`; 
    });
}

function getWeatherEmoji(weatherCondition) {
    const emojis = {
        Clear: "☀️", // 맑음
        Clouds: "☁️", // 흐림
        Rain: "🌧️", // 비
        Drizzle: "🌦️", // 이슬비
        Thunderstorm: "⛈️", // 천둥번개
        Snow: "❄️", // 눈
        Mist: "🌫️", // 안개
        Fog: "🌁", // 안개
        Haze: "🌫️", // 연무
        Dust: "🌪️" // 먼지
    };

    return emojis[weatherCondition] || "🌈"; // 기본값으로 무지개 이모티콘
}

function onGeoError(){
    alert("Can't find you. No weather for you.");

}

navigator.geolocation.getCurrentPosition(onGeoOk, onGeoError);
 