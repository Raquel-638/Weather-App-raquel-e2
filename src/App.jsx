import { useEffect } from 'react';
import './App.css'
import { useState } from 'react';
import axios from 'axios';
import WeatherCard from './components/WeatherCard';

function App() {
 
 const [coords, setCoords] = useState(null);
 const [weather, setWeather] = useState(null);
 const [temp, setTemp] = useState();
 const [isLoading, setIsLoading] = useState(true);
 const [hasError, setHasError] = useState(false);
 const [showMessage, setShowMessage] = useState(false);
 const [city, setCity] = useState('');
 const [mesageError, setMesageError] = useState(false);
 const [background, setBackground] = useState('light intensity shower rain');

 useEffect(() => {
  setTimeout(() => {
    setShowMessage(true);
  }, 3000);
  const success = (position) => {
    setCoords({
      lat: position.coords.latitude,
      lon: position.coords.longitude
    })
  };

  const error = () => {
    setHasError(true)
    setIsLoading(false)
  }
  navigator.geolocation.getCurrentPosition(success, error);
 }, []);

 useEffect(() => {
  if (coords){

    const APY_KEY = 'aef05036ac689a435c255943a19d1335';

    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&lat=${coords.lat}&lon=${coords.lon}&appid=${APY_KEY}`;

    axios
    .get(url)
    .then((res) => {
      setWeather(res.data)
      const celsius = (res.data.main.temp - 273.15).toFixed(1);
      const fahrenheit = ((celsius * 9)/ 5 + 32).toFixed(1);
      setTemp({celsius, fahrenheit});
      setMesageError(false);
      setBackground(res.data.weather[0].description);
    })
    .catch((err) =>{ 
      console.error(err);
      setMesageError(true);
    })
    .finally(() => {
      setIsLoading(false);
    });
  }
 }, [coords, city]);

 const objStyles ={
    backgroundImage: `url('/img/${background}.jpg')`
 }

  return (
    <div style={objStyles} className='app flex-container'>
      {isLoading ? (
        <div>
          <div className="loader"></div>
          {showMessage && <p>Per favore activa la localización</p>}
        </div>
      ) : hasError ? (
        <h1>Si quieres ver la información del clima de tu ciudad, acepta los permisos y vuelve a cargar, per favore.</h1>
      ) : (
        <WeatherCard weather={weather} temp={temp} setCity={setCity} mesageError={mesageError} city={city}/>
      )}
    </div>
  );
}

export default App
