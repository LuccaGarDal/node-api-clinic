export const getRainForecast = async (city, date) => {
    const targetDate = new Date(date);
    const today = new Date();

    const diffDays = (targetDate - today) / (1000 * 60 * 60 * 24);

    if (diffDays < 0 || diffDays > 5) {
        return null;
    }

    const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${process.env.WEATHER_API_KEY}&units=metric&lang=pt_br`;

    const response = await fetch(url);

    if (!response.ok) {
        throw new Error("Erro ao buscar clima");
    }

    const data = await response.json();

    const forecasts = data.list.filter(f => {
        const forecastDate = new Date(f.dt_txt);

        return (
            forecastDate.getFullYear() === targetDate.getFullYear() &&
            forecastDate.getMonth() === targetDate.getMonth() &&
            forecastDate.getDate() === targetDate.getDate()
        );
    });

    const willRain = forecasts.some(f =>
        f.weather.some(w => w.main.toLowerCase().includes("rain"))
    );

    return {
        rain: willRain,
        message: willRain
            ? "Há previsão de chuva neste dia."
            : "Não há previsão de chuva."
    };
};