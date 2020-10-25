import { StormGlass } from '@src/clients/stormGlass';
import stormGlassWeatherMockData from '@test/fixtures/storglass_weather_3_hours.json';
import stormGlassWeatherMockDataNormalizeResponse from '@test/fixtures/storglass_weather_3_hours_normalize_response.json';
import * as HTTPUtil from '@src/utils/requestClient';
jest.mock('@src/utils/requestClient');

describe('StormGlass client', () => {
  const MockedRequestClass = HTTPUtil.RequestClient as jest.Mocked<
    typeof HTTPUtil.RequestClient
  >;

  const mockedRequest = new HTTPUtil.RequestClient() as jest.Mocked<
    HTTPUtil.RequestClient
  >;

  it('Should return the normalize forecast from the stormGlass service', async () => {
    const lat = -33.792726;
    const lng = 151.289824;

    mockedRequest.get.mockResolvedValue({
      data: stormGlassWeatherMockData,
    } as HTTPUtil.Response);

    const stormGlass = new StormGlass(mockedRequest);
    const response = await stormGlass.fetchPoints(lat, lng);
    expect(response).toEqual(stormGlassWeatherMockDataNormalizeResponse);
  });

  it('should exclude incomplete data points', async () => {
    const lat = -33.792726;
    const lng = 151.289824;
    const incompleteResponse = {
      hours: [
        {
          windDirection: {
            noaa: 300,
          },
          time: '2020-04-26T00:00:00+00:00',
        },
      ],
    };
    mockedRequest.get.mockResolvedValue({
      data: incompleteResponse,
    } as HTTPUtil.Response);

    const stormGlass = new StormGlass(mockedRequest);
    const response = await stormGlass.fetchPoints(lat, lng);

    expect(response).toEqual([]);
  });

  it('should get an StormGlassResponseError when the StormGlass service responds with error', async () => {
    const lat = -33.792726;
    const lng = 151.289824;

    MockedRequestClass.isRequestError.mockReturnValue(true);
    mockedRequest.get.mockRejectedValue({
      response: {
        status: 429,
        data: { errors: ['Rate Limit reached'] },
      },
    });

    const stormGlass = new StormGlass(mockedRequest);

    await expect(stormGlass.fetchPoints(lat, lng)).rejects.toThrow(
      'Unexpected error returned by the StormGlass service: Error: {"errors":["Rate Limit reached"]} Code: 429'
    );
  });
});
