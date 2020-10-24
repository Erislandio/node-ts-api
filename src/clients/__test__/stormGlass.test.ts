import { StormGlass } from '@src/clients/stormGlass';
import stormGlassWeatherMockData from '@test/fixtures/storglass_weather_3_hours.json';
import stormGlassWeatherMockDataNormalizeResponse from '@test/fixtures/storglass_weather_3_hours_normalize_response.json';
import axios from 'axios';

jest.mock('axios');

describe('StormGlass client', () => {
  it('Should return the normalize forecast from the stormGlass service', async () => {
    const lat = -33.792726;
    const lng = 151.289824;

    axios.get = jest.fn().mockResolvedValue(stormGlassWeatherMockData);

    const stormGlass = new StormGlass(axios);
    const response = await stormGlass.fetchPoints(lat, lng);
    expect(response).toEqual(stormGlassWeatherMockDataNormalizeResponse);
  });
});
