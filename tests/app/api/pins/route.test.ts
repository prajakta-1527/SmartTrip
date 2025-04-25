import { POST, GET, DELETE } from '@/app/api/pins/route';
import prisma from '@/app/libs/prismadb';

jest.mock('@/app/libs/prismadb', () => ({
  __esModule: true,
  default: {
    pinnedLocation: {
      create: jest.fn(),
      findMany: jest.fn(),
      delete: jest.fn(),
    },
  },
}));

const mockPrisma = prisma as jest.Mocked<typeof prisma>;

describe('Pins API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/pins', () => {
    it('should return 400 if required fields are missing', async () => {
      const req = new Request('http://localhost', {
        method: 'POST',
        body: JSON.stringify({}),
      });

      const res = await POST(req as any);
      const json = await res.json();

      expect(res.status).toBe(400);
      expect(json.error).toBe('Missing fields');
    });

    it('should create a pin successfully', async () => {
      const pinData = {
        name: 'Hotel',
        address: '123 Street',
        userEmail: 'test@example.com',
        lat: 12.34,
        lon: 56.78,
        conversationId: 'conv-1',
      };

      const mockPin = { ...pinData, id: 'pin-1' };
      mockPrisma.pinnedLocation.create.mockResolvedValue(mockPin);

      const req = new Request('http://localhost', {
        method: 'POST',
        body: JSON.stringify(pinData),
      });

      const res = await POST(req as any);
      const json = await res.json();

      expect(res.status).toBe(200);
      expect(json.success).toBe(true);
      expect(json.pinned).toEqual(mockPin);
    });

    it('should handle internal errors', async () => {
      mockPrisma.pinnedLocation.create.mockRejectedValue(new Error('DB Error'));

      const req = new Request('http://localhost', {
        method: 'POST',
        body: JSON.stringify({
          name: 'Hotel',
          address: '123 Street',
          userEmail: 'test@example.com',
          lat: 12.34,
          lon: 56.78,
          conversationId: 'conv-1',
        }),
      });

      const res = await POST(req as any);
      const json = await res.json();

      expect(res.status).toBe(500);
      expect(json.error).toBe('DB Error');
    });
  });

  describe('GET /api/pins', () => {
    it('should return 400 if conversationId is missing', async () => {
      const req = new Request('http://localhost/api/pins');
      const res = await GET(req as any);
      const json = await res.json();

      expect(res.status).toBe(400);
      expect(json.error).toBe('Missing conversationId');
    });

    it('should fetch pins by conversationId', async () => {
      const mockPins = [{ id: 'pin-1' }, { id: 'pin-2' }];
      mockPrisma.pinnedLocation.findMany.mockResolvedValue(mockPins);

      const req = new Request('http://localhost/api/pins?conversationId=conv-1');

      const res = await GET(req as any);
      const json = await res.json();

      expect(res.status).toBe(200);
      expect(json.pins).toEqual(mockPins);
    });

    it('should return 500 on DB error', async () => {
      mockPrisma.pinnedLocation.findMany.mockRejectedValue(new Error('DB Error'));

      const req = new Request('http://localhost/api/pins?conversationId=conv-1');
      const res = await GET(req as any);
      const json = await res.json();

      expect(res.status).toBe(500);
      expect(json.error).toBe('Database error');
    });
  });

  describe('DELETE /api/pins', () => {
    it('should delete a pin and return success', async () => {
      mockPrisma.pinnedLocation.delete.mockResolvedValue({});

      const req = new Request('http://localhost', {
        method: 'DELETE',
        body: JSON.stringify({ id: 'pin-1' }),
      });

      const res = await DELETE(req as any);
      const json = await res.json();

      expect(res.status).toBe(200);
      expect(json.success).toBe(true);
    });

    it('should return 500 if delete fails', async () => {
      mockPrisma.pinnedLocation.delete.mockRejectedValue(new Error('Delete failed'));

      const req = new Request('http://localhost', {
        method: 'DELETE',
        body: JSON.stringify({ id: 'pin-1' }),
      });

      const res = await DELETE(req as any);
      const json = await res.json();

      expect(res.status).toBe(500);
      expect(json.success).toBe(false);
    });
  });
});
