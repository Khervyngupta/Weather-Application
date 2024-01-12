import React, { useState, useEffect } from 'react';
import './App.css';
const WeatherForecast = () => {
  const [city, setCity] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  const [unit, setUnit] = useState('Celsius');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (city) {
        fetchWeatherData();
      }
    }, 1000);

    return () => clearTimeout(delayDebounceFn);
  }, [city]);

  const fetchWeatherData = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=API-KEY`);
      if (!response.ok) {
        throw new Error('Failed to fetch weather data');
      }
      const data = await response.json();
      setWeatherData(data);
    } catch (error) {
      console.error(error);
      setError('Could not fetch weather data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const convertToFahrenheit = (kelvin) => {
    return ((kelvin - 273.15) * 9/5) + 32;
  };

  const convertToCelsius = (kelvin) => {
    return kelvin - 273.15;
  };

  const handleUnitToggle = () => {
    setUnit(unit === 'Celsius' ? 'Fahrenheit' : 'Celsius');
  };

  const renderTemperature = (temperature) => {
    if (unit === 'Celsius') {
      const celc = convertToCelsius(temperature);
      return `${celc.toFixed(2)} °C`;
    } else {
      const fahrenheit = convertToFahrenheit(temperature);
      return `${fahrenheit.toFixed(2)} °F`;
    }
  };
  return (
    <div className="weather-container">
      <h1 className='app-heading'>Weather Application</h1>
      <div className="input-container">
        <input type="text" value={city} onChange={(e) => setCity(e.target.value)} placeholder="Enter city name" />
        {/* <button onClick={fetchWeatherData}>Get Weather</button> */}
      </div>

      {loading && <p>Loading...</p>}
      {error && <p className="error-message">{error}</p>}

      {weatherData && (
        <div className="weather-info">
          <h2>{weatherData.name}</h2>
          <p>Current Temperature: {renderTemperature(weatherData.main.temp)}</p>
          <p>Min Temperature: {renderTemperature(weatherData.main.temp_min)}</p>
          <p>Max Temperature: {renderTemperature(weatherData.main.temp_max)}</p>
          <p>Humidity: {weatherData.main.humidity}%</p>
          <p>Wind Speed: {weatherData.wind.speed} m/s</p>
          <p>Wind Direction: {weatherData.wind.deg}°</p>
          <p>Description: {weatherData.weather[0].description}</p>
          <img src={`https://openweathermap.org/img/w/${weatherData.weather[0].icon}.png`} alt="Weather Icon" />
        </div>
      )}

      <button onClick={handleUnitToggle} className="unit-toggle-btn">Toggle Unit</button>
    </div>
  );
};

export default WeatherForecast;
