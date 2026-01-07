import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

export async function getReadableLocation(lat, lon) {
    const apiKey = process.env.OPENCAGE_API_KEY;
    const url = `https://api.opencagedata.com/geocode/v1/json?q=${lat}+${lon}&key=${apiKey}`;

    const res = await axios.get(url);
    const components = res.data.results[0]?.components;

    return `${components.city || components.town || components.village}, ${
        components.country
    }`;
}
