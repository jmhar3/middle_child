import { Flex, Image, Text } from "@mantine/core";
import { fetchWeatherApi } from "openmeteo";

interface WeatherCode {
  code: string;
  image: string;
}

const weatherCodes: WeatherCode[] = [
  {
    code: "0",
    image: "http://openweathermap.org/img/wn/01d@2x.png",
  },
  {
    code: "1",
    image: "http://openweathermap.org/img/wn/01d@2x.png",
  },
  {
    code: "2",
    image: "http://openweathermap.org/img/wn/02d@2x.png",
  },
  {
    code: "3",
    image: "http://openweathermap.org/img/wn/03d@2x.png",
  },
  {
    code: "45",
    image: "http://openweathermap.org/img/wn/50d@2x.png",
  },
  {
    code: "48",
    image: "http://openweathermap.org/img/wn/50d@2x.png",
  },
  {
    code: "51",
    image: "http://openweathermap.org/img/wn/09d@2x.png",
  },
  {
    code: "53",
    image: "http://openweathermap.org/img/wn/09d@2x.png",
  },
  {
    code: "55",
    image: "http://openweathermap.org/img/wn/09d@2x.png",
  },
  {
    code: "56",
    image: "http://openweathermap.org/img/wn/09d@2x.png",
  },
  {
    code: "57",
    image: "http://openweathermap.org/img/wn/09d@2x.png",
  },
  {
    code: "61",
    image: "http://openweathermap.org/img/wn/10d@2x.png",
  },
  {
    code: "63",
    image: "http://openweathermap.org/img/wn/10d@2x.png",
  },
  {
    code: "65",
    image: "http://openweathermap.org/img/wn/10d@2x.png",
  },
  {
    code: "66",
    image: "http://openweathermap.org/img/wn/10d@2x.png",
  },
  {
    code: "67",
    image: "http://openweathermap.org/img/wn/10d@2x.png",
  },
  {
    code: "71",
    image: "http://openweathermap.org/img/wn/13d@2x.png",
  },
  {
    code: "73",
    image: "http://openweathermap.org/img/wn/13d@2x.png",
  },
  {
    code: "75",
    image: "http://openweathermap.org/img/wn/13d@2x.png",
  },
  {
    code: "77",
    image: "http://openweathermap.org/img/wn/13d@2x.png",
  },
  {
    code: "80",
    image: "http://openweathermap.org/img/wn/09d@2x.png",
  },
  {
    code: "81",
    image: "http://openweathermap.org/img/wn/09d@2x.png",
  },
  {
    code: "82",
    image: "http://openweathermap.org/img/wn/09d@2x.png",
  },
  {
    code: "85",
    image: "http://openweathermap.org/img/wn/13d@2x.png",
  },
  {
    code: "86",
    image: "http://openweathermap.org/img/wn/13d@2x.png",
  },
  {
    code: "95",
    image: "http://openweathermap.org/img/wn/11d@2x.png",
  },
  {
    code: "96",
    image: "http://openweathermap.org/img/wn/11d@2x.png",
  },
  {
    code: "99",
    image: "http://openweathermap.org/img/wn/11d@2x.png",
  },
];

const params = {
  latitude: -37.7724,
  longitude: 144.8844,
  current: ["temperature_2m", "weather_code", "apparent_temperature"],
};

const url = "https://api.open-meteo.com/v1/forecast";
const responses = await fetchWeatherApi(url, params);

function Weather() {
  const response = responses[0];
  const current = response.current();

  const weatherData = current && {
    temperature: current.variables(0)?.value(),
    weatherCode: current.variables(1)?.value(),
    feelsLike: current.variables(2)?.value(),
  };

  const weatherCode = weatherCodes.find(
    ({ code }) => code === weatherData?.weatherCode?.toString(),
  );

  return (
    weatherData?.temperature && (
      <Flex gap="0" align="center">
        <Text fw="600" w="fit-content" variant="transparent" c="darkslategray">
          {Math.round(weatherData?.temperature)}°C
        </Text>
        <Image h="30px" w="30px" p="0" src={weatherCode?.image} />
      </Flex>
    )
  );
}

export default Weather;
