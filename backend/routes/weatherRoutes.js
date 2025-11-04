import express from "express";
import axios from "axios";

const router = express.Router();

router.get("/", async (req, res) => {
  const cities = ["Lahore", "Karachi", "Islamabad", "Quetta", "Peshawar"];
  const apiKey = process.env.WEATHER_API_KEY;

  try {
    const data = await Promise.all(
      cities.map(async (city) => {
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${city},PK&appid=${apiKey}&units=metric`;
        const response = await axios.get(url);
        return {
          city: city,
          temperature: response.data.main.temp,
          humidity: response.data.main.humidity,
          condition: response.data.weather[0].main,
          icon: response.data.weather[0].icon,
        };
      })
    );
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch weather data", error });
  }
});

export default router;
