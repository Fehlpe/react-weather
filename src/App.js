import {
  UilSearch,
  UilLocationPinAlt,
  UilTemperature,
  UilTear,
  UilWind,
} from "@iconscout/react-unicons";
import { useEffect, useRef, useState } from "react";

function App() {
  const cities = [
    {
      id: 0,
      name: "São Paulo",
    },
    {
      id: 1,
      name: "Nova Iorque",
    },
    {
      id: 2,
      name: "Tokyo",
    },
    {
      id: 3,
      name: "Paris",
    },
    {
      id: 4,
      name: "Sydney",
    },
  ];

  const API_KEY = "USE YOUR KEY HERE";
  const IMG_URL = "http://openweathermap.org/img/wn/";

  const searchInput = useRef();

  const [lat, setLat] = useState(null);
  const [lon, setLon] = useState(null);
  const [coord, setCoord] = useState(false);
  const [count, setCount] = useState(0);
  const [city, setCity] = useState(null);
  const [searchCity, setSearchCity] = useState("São Paulo");
  const [country, setCountry] = useState(null);
  const [temp, setTemp] = useState(null);
  const [weather, setWeather] = useState(null);
  const [feels, setFeels] = useState(null);
  const [humidity, setHumidity] = useState(null);
  const [wind, setWind] = useState(null);
  const [imgCode, setImgCode] = useState(null);

  const getWeatherData = async () => {
    if (coord) {
      const apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}&lang=pt_br`;

      const res = await fetch(apiUrl);
      const data = await res.json();

      setCoord(false);

      return data;
    }
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${searchCity}&units=metric&appid=${API_KEY}&lang=pt_br`;

    const res = await fetch(apiUrl);
    const data = await res.json();

    return data;
  };

  const showWeatherData = async () => {
    const dataRes = await getWeatherData();

    setCity(dataRes.name);
    setCountry(dataRes.sys.country);
    setTemp(parseInt(dataRes.main.temp));
    setWeather(dataRes.weather[0].description);
    setFeels(parseInt(dataRes.main.feels_like));
    setHumidity(dataRes.main.humidity);
    setWind(parseInt(dataRes.wind.speed));
    setImgCode(dataRes.weather[0].icon);

    searchInput.current.value = "";
  };

  useEffect(() => {
    showWeatherData();
  }, []);

  useEffect(() => {
    showWeatherData();
  }, [count]);

  return (
    <div className=" h-screen bg-slate-100 flex justify-center items-center">
      <div
        className="mx-auto max-w-screen-lg px-32 py-8 bg-gradient-to-br from-red-700 to-orange-600 h-fit
      shadow-lg shadow-orange-800"
      >
        <div className="flex mt-2 justify-center items-center">
          {cities.map((c) => {
            return (
              <button
                key={c.id}
                className="text-white transition ease-out mx-6 hover:scale-105 text-lg font-medium"
                onClick={(e) => {
                  e.preventDefault();
                  setSearchCity(c.name);
                  setCount(count + 1);
                }}
              >
                {c.name}
              </button>
            );
          })}
        </div>
        <div className="flex flex-row justify-center my-6">
          <div className="flex flex-row w-3/4 items-center justify-center space-x-4">
            <input
              onChange={(e) => {
                setSearchCity(e.currentTarget.value);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  setCount(count + 1);
                }
              }}
              ref={searchInput}
              type="text"
              placeholder="busque por uma cidade..."
              className="text-xl placeholder:lowercase capitalize font-light p-2 w-full shadow-xl focus:outline-none"
            />
            <button
              onClick={(e) => {
                e.preventDefault();
                showWeatherData();
              }}
            >
              <UilSearch
                size={25}
                className="text-white cursor-pointer transition ease-out hover:scale-125"
              />
            </button>
            <button
              onClick={(e) => {
                e.preventDefault();
                if (navigator.geolocation) {
                  navigator.geolocation.getCurrentPosition((position) => {
                    const { latitude, longitude } = position.coords;
                    setLat(latitude);
                    setLon(longitude);
                    setCoord(true);
                    setCount(count + 1);
                  });
                } else {
                  alert("Geolocation is not supported by this browser.");
                }
              }}
            >
              <UilLocationPinAlt
                size={25}
                className="text-white cursor-pointer transition ease-out hover:scale-125"
              />
            </button>
          </div>
        </div>
        <div>
          <div className="flex items-center justify-center my-3">
            <p className="text-white text-3xl font-medium">
              {city}, {country}
            </p>
          </div>

          <div className="flex capitalize items-center justify-center py-6 text-xl text-white font-bold">
            <p>{weather}</p>
          </div>

          <div className="flex flex-row items-center justify-between text-white py-3">
            <img src={IMG_URL + imgCode + ".png"} className="w-20" alt="" />
            <p className=" ml-24 text-5xl">{temp}°</p>
            <div className="flex flex-col space-y-2">
              <div className="flex font-light text-sm items-center justify-center">
                <UilTemperature size={18} className="mr-1" />
                Sensação térmica:
                <span className="font-medium ml-1">{feels}°</span>
              </div>
              <div className="flex  font-light text-sm items-center justify-center">
                <UilTear size={18} className="mr-1" />
                Umidade:
                <span className="font-medium ml-1">{humidity}%</span>
              </div>
              <div className="flex font-light text-sm items-center justify-center">
                <UilWind size={18} className="mr-1" />
                Vento:
                <span className="font-medium ml-1">{wind}km/h</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
