import { POST } from '@/app/api/profile/route';
import prisma from '@/app/libs/prismadb';
import getCurrentUser from '@/app/actions/getCurrentUser';

jest.mock('@/app/libs/prismadb', () => ({
  __esModule: true,
  default: {
    user: {
      update: jest.fn(),
    },
  },
}));

jest.mock('@/app/actions/getCurrentUser', () => ({
  __esModule: true,
  default: jest.fn(),
}));

const mockPrisma = prisma as jest.Mocked<typeof prisma>;

describe('Profile API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/profile', () => {
    it('should return 401 if the user is not authenticated', async () => {
      (getCurrentUser as jest.Mock).mockResolvedValue(null);

      const req = new Request('http://localhost', {
        method: 'POST',
        body: JSON.stringify({ name: 'John Doe', image: 'image_url' }),
      });

      const res = await POST(req as any);
      const json = await res.json();

      expect(res.status).toBe(401);
      expect(json).toBe('Unauthorized');
    });

    it('should update user profile and return the updated user', async () => {
      const mockUser = { id: 'user-1', name: 'John Doe', image: 'image_url' };
      (getCurrentUser as jest.Mock).mockResolvedValue(mockUser);

      const updatedUser = { ...mockUser, name: 'Jane Doe', image: 'new_image_url' };
      mockPrisma.user.update.mockResolvedValue(updatedUser);

      const req = new Request('http://localhost', {
        method: 'POST',
        body: JSON.stringify({ name: 'Jane Doe', image: 'new_image_url' }),
      });

      const res = await POST(req as any);
      const json = await res.json();

      expect(res.status).toBe(200);
      expect(json).toEqual(updatedUser);
    });

    it('should return 500 if there is an error during the update', async () => {
      const mockUser = { id: 'user-1', name: 'John Doe', image: 'image_url' };
      (getCurrentUser as jest.Mock).mockResolvedValue(mockUser);

      mockPrisma.user.update.mockRejectedValue(new Error('DB Error'));

      const req = new Request('http://localhost', {
        method: 'POST',
        body: JSON.stringify({ name: 'Jane Doe', image: 'new_image_url' }),
      });

      const res = await POST(req as any);
      const json = await res.json();

      expect(res.status).toBe(500);
      expect(json).toBe('Internal Server Error');
    });
  });
});
