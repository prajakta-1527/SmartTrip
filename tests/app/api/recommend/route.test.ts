import { GET } from '@/app/api/recommend/route';
import axios from 'axios';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('Recommend API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/recommend', () => {
    it('should return a list of recommendations', async () => {
      const mockResponse = {
        data: {
          features: [
            {
              properties: { name: 'Berlin Hotel', formatted: 'Berlin, Germany', categories: ['tourism'] },
              geometry: { coordinates: [13.405, 52.52] },
            },
            {
              properties: { name: 'Berlin Restaurant', formatted: 'Berlin, Germany', categories: ['tourism'] },
              geometry: { coordinates: [13.405, 52.51] },
            },
          ],
        },
      };

      mockedAxios.get.mockResolvedValue(mockResponse);

      const req = new Request('http://localhost', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      const res = await GET(req as any);
      const json = await res.json();

      expect(res.status).toBe(200);
      expect(json).toEqual([
        { name: 'Berlin Hotel', address: 'Berlin, Germany', category: 'tourism', coordinates: [13.405, 52.52] },
        { name: 'Berlin Restaurant', address: 'Berlin, Germany', category: 'tourism', coordinates: [13.405, 52.51] },
      ]);
    });

    it('should return an error if the Geoapify API call fails', async () => {
      mockedAxios.get.mockRejectedValue(new Error('Geoapify API Error'));

      const req = new Request('http://localhost', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      const res = await GET(req as any);
      const json = await res.json();

      expect(res.status).toBe(500);
      expect(json).toEqual({ error: 'Failed to fetch data' });
    });
  });
});
