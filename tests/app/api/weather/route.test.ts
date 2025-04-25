import { GET } from '@/app/api/weather/route';
import { NextRequest, NextResponse } from 'next/server';

jest.mock('next/server', () => ({
  NextResponse: {
    json: jest.fn(),
  },
}));

describe('Weather API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return error if no locations are provided', async () => {
    const req = new Request('http://localhost?locations=', {
      method: 'GET',
    });

    const res = await GET(req);
    const json = await res.json();

    expect(res.status).toBe(400);
    expect(json.error).toBe('At least one location is required');
  });

  it('should return error if invalid locations format is provided', async () => {
    const req = new Request('http://localhost?locations={}', {
      method: 'GET',
    });

    const res = await GET(req);
    const json = await res.json();

    expect(res.status).toBe(400);
    expect(json.error).toBe('Invalid locations format');
  });

  it('should return error if missing API key', async () => {
    process.env.NEXT_PUBLIC_WEATHER_API_KEY = ''; // Simulate missing API key

    const req = new Request('http://localhost?locations=["{lat: 52.52, lon: 13.405}"]', {
      method: 'GET',
    });

    const res = await GET(req);
    const json = await res.json();

    expect(res.status).toBe(500);
    expect(json.error).toBe('API Key is missing');
  });

  it('should return weather data for valid locations', async () => {
    process.env.NEXT_PUBLIC_WEATHER_API_KEY = 'mock-api-key'; // Simulate valid API key

    const mockWeatherData = {
      coord: { lat: 52.52, lon: 13.405 },
      weather: [{ description: 'clear sky' }],
      main: { temp: 25, humidity: 60 },
      wind: { speed: 5 },
    };

    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockWeatherData),
      })
    ) as jest.Mock;

    const req = new Request('http://localhost?locations=[{"lat":52.52,"lon":13.405}]', {
      method: 'GET',
    });

    const res = await GET(req);
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.results).toHaveLength(1);
    expect(json.results[0]).toEqual({
      coords: { lat: 52.52, lon: 13.405 },
      description: [{ description: 'clear sky' }],
      temperature: 25,
      humidity: 60,
      wind_speed: 5,
    });
  });

  it('should return error if fetch fails for weather data', async () => {
    process.env.NEXT_PUBLIC_WEATHER_API_KEY = 'mock-api-key'; // Simulate valid API key

    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: false,
        json: () => Promise.resolve({ message: 'Not Found' }),
      })
    ) as jest.Mock;

    const req = new Request('http://localhost?locations=[{"lat":52.52,"lon":13.405}]', {
      method: 'GET',
    });

    const res = await GET(req);
    const json = await res.json();

    expect(res.status).toBe(500);
    expect(json.error).toBe('Error fetching weather data');
  });
});
