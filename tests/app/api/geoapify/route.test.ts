import { POST } from '@/app/api/geoapify/route';
import axios from 'axios';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

const mockGeoRes = {
  data: {
    results: [
      {
        formatted: 'Indore, MP, India',
        city: 'Indore',
        county: 'Indore',
        state: 'MP',
        lat: 22.7196,
        lon: 75.8577,
      },
    ],
  },
};

const mockPlacesRes = {
  data: {
    features: [
      { properties: { rating: 4.5 } },
      { properties: { rating: 2.5 } },
      { properties: { rating: 1.0 } },
    ],
  },
};

describe('POST /api/geoapify', () => {
  const env = process.env;

  beforeEach(() => {
    jest.clearAllMocks();
    process.env = { ...env, GEOAPIFY_API_KEY: 'test-key' };
  });

  afterAll(() => {
    process.env = env;
  });

  it('should return error if API key is missing', async () => {
    delete process.env.GEOAPIFY_API_KEY;

    const req = new Request('http://localhost', {
      method: 'POST',
      body: JSON.stringify({ location: 'Indore' }),
    });

    const res = await POST(req);
    const json = await res.json();

    expect(res.status).toBe(500);
    expect(json.error).toBe('Missing API Key');
  });

  it('should resolve location and fetch places without lat/lon', async () => {
    mockedAxios.get.mockImplementation((url) => {
      if (url.includes('geocode/search')) {
        return Promise.resolve(mockGeoRes);
      }
      if (url.includes('places')) {
        return Promise.resolve(mockPlacesRes);
      }
      return Promise.reject(new Error('Unexpected call'));
    });

    const req = new Request('http://localhost', {
      method: 'POST',
      body: JSON.stringify({ location: 'Indore', minRating: '2' }),
    });

    const res = await POST(req);
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.features.length).toBe(2); // Ratings 4.5 and 2.5 pass
    expect(json.resolvedLocation).toBe('Indore, MP, India');
  });

  it('should resolve location using lat/lon and fetch places', async () => {
    mockedAxios.get.mockImplementation((url) => {
      if (url.includes('geocode/reverse')) {
        return Promise.resolve({ data: { results: [{ formatted: 'Mocked Location' }] } });
      }
      if (url.includes('places')) {
        return Promise.resolve(mockPlacesRes);
      }
      return Promise.reject(new Error('Unexpected call'));
    });

    const req = new Request('http://localhost', {
      method: 'POST',
      body: JSON.stringify({ latitude: '22.72', longitude: '75.86', minRating: '1' }),
    });

    const res = await POST(req);
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.features.length).toBe(3);
    expect(json.resolvedLocation).toBe('Mocked Location');
  });

  it('should return 400 if no geocode result is found', async () => {
    mockedAxios.get.mockResolvedValue({ data: { results: [] } });

    const req = new Request('http://localhost', {
      method: 'POST',
      body: JSON.stringify({ location: 'Nowhere' }),
    });

    const res = await POST(req);
    const json = await res.json();

    expect(res.status).toBe(400);
    expect(json.error).toBe('Invalid location');
  });

  it('should handle API errors gracefully', async () => {
    mockedAxios.get.mockRejectedValue(new Error('Network error'));

    const req = new Request('http://localhost', {
      method: 'POST',
      body: JSON.stringify({ location: 'Indore' }),
    });

    const res = await POST(req);
    const json = await res.json();

    expect(res.status).toBe(500);
    expect(json.error).toBe('Failed to fetch places');
  });
});
