import { POST, getUserImageByEmail } from '@/app/api/location/route';
import { NextRequest } from 'next/server';
import prisma from '@/app/libs/prismadb';
import { pusherServer } from '@/app/libs/pusher';

jest.mock('@/app/libs/prismadb', () => ({
  __esModule: true,
  default: {
    user: {
      findUnique: jest.fn(),
    },
    $disconnect: jest.fn(),
  },
}));

jest.mock('@/app/libs/pusher', () => ({
  pusherServer: {
    trigger: jest.fn(),
  },
}));

const mockPrisma = prisma as jest.Mocked<typeof prisma>;

describe('getUserImageByEmail', () => {
  it('should return image if user exists with image', async () => {
    mockPrisma.user.findUnique.mockResolvedValue({ image: 'http://image.url' });

    const result = await getUserImageByEmail('test@example.com');

    expect(result).toBe('http://image.url');
    expect(mockPrisma.user.findUnique).toHaveBeenCalledWith({
      where: { email: 'test@example.com' },
      select: { image: true },
    });
  });

  it('should return null if user not found or image missing', async () => {
    mockPrisma.user.findUnique.mockResolvedValue(null);

    const result = await getUserImageByEmail('missing@example.com');
    expect(result).toBeNull();
  });

  it('should handle error gracefully', async () => {
    mockPrisma.user.findUnique.mockRejectedValue(new Error('DB error'));

    const result = await getUserImageByEmail('error@example.com');
    expect(result).toBeNull();
  });
});

describe('POST /api/location', () => {
  it('should return success and call pusher with image', async () => {
    mockPrisma.user.findUnique.mockResolvedValue({ image: 'http://image.url' });

    const mockBody = {
      userId: 'test@example.com',
      location: { lat: 123, lon: 456 },
    };

    const req = new Request('http://localhost', {
      method: 'POST',
      body: JSON.stringify(mockBody),
    }) as unknown as NextRequest;

    const res = await POST(req);
    const json = await res.json();

    expect(json.message).toBe('Location broadcasted successfully');
    expect(pusherServer.trigger).toHaveBeenCalledWith('location', 'update', {
      userId: 'test@example.com',
      location: { lat: 123, lon: 456, image: 'http://image.url' },
    });
  });

  it('should handle null userId and still succeed', async () => {
    const mockBody = {
      userId: null,
      location: { lat: 123, lon: 456 },
    };

    const req = new Request('http://localhost', {
      method: 'POST',
      body: JSON.stringify(mockBody),
    }) as unknown as NextRequest;

    const res = await POST(req);
    const json = await res.json();

    expect(json.message).toBe('Location broadcasted successfully');
    expect(pusherServer.trigger).toHaveBeenCalledWith('location', 'update', {
      userId: null,
      location: { lat: 123, lon: 456, image: null },
    });
  });

  it('should return 500 if something throws', async () => {
    mockPrisma.user.findUnique.mockRejectedValue(new Error('fail'));

    const req = new Request('http://localhost', {
      method: 'POST',
      body: JSON.stringify({
        userId: 'test@example.com',
        location: { lat: 0, lon: 0 },
      }),
    }) as unknown as NextRequest;

    const res = await POST(req);
    const json = await res.json();

    expect(res.status).toBe(500);
    expect(json.message).toBe('Internal Server Error');
  });
});
