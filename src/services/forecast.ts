import { StormGlass } from '@src/clients/stormGlass';
import { ForecastPoint } from '@src/clients/stormGlass.interfaces';
import { InternalError } from '@src/utils/errors/internalError';
import { Beach, BeachForecast, TimeForecast } from './forecast.interfaces';

export class ForecastProcessingIntenalError extends InternalError {
  constructor(message: string) {
    super(`Unexpected error during the forecast processing: ${message}`);
  }
}

export class Forecast {
  constructor(protected stormGlass: StormGlass = new StormGlass()) {}

  public async processForecastForBeaches(
    beaches: Array<Beach>
  ): Promise<Array<TimeForecast>> {
    try {
      const pointsWishCorrectSources: Array<BeachForecast> = [];
      for (const beach of beaches) {
        const points = await this.stormGlass.fetchPoints(beach.lat, beach.lng);
        const enrichedBeachData = this.enrichedBeachData(points, beach);

        pointsWishCorrectSources.push(...enrichedBeachData);
      }

      return this.mapForecastByTime(pointsWishCorrectSources);
    } catch (error) {
      throw new ForecastProcessingIntenalError(error.message);
    }
  }

  private enrichedBeachData(
    points: ForecastPoint[],
    beach: Beach
  ): BeachForecast[] {
    return points.map((point) => ({
      ...{
        lat: beach.lat,
        lng: beach.lng,
        name: beach.name,
        position: beach.position,
        rating: 1,
      },
      ...point,
    }));
  }

  private mapForecastByTime(forecast: BeachForecast[]): TimeForecast[] {
    const forecastByTime: TimeForecast[] = [];
    for (const point of forecast) {
      const timePoint = forecastByTime.find((cast) => cast.time === point.time);
      if (timePoint) {
        timePoint.forecast.push(point);
      } else {
        forecastByTime.push({
          time: point.time,
          forecast: [point],
        });
      }
    }

    return forecastByTime;
  }
}
