import { POST } from '@/app/api/conversations/route';
import getCurrentUser from '@/app/actions/getCurrentUser';
import prisma from '@/app/libs/prismadb';
import { pusherServer } from '@/app/libs/pusher';

jest.mock('@/app/actions/getCurrentUser');
jest.mock('@/app/libs/prismadb', () => ({
  conversation: {
    create: jest.fn(),
    findMany: jest.fn(),
  },
}));
jest.mock('@/app/libs/pusher', () => ({
  pusherServer: {
    trigger: jest.fn(),
  },
}));

describe('POST /api/conversations', () => {
  const mockUser = { id: 'user123', email: 'user@example.com' };

  beforeEach(() => {
    jest.clearAllMocks();
    (getCurrentUser as jest.Mock).mockResolvedValue(mockUser);
  });

  it('should return 401 if user is unauthorized', async () => {
    (getCurrentUser as jest.Mock).mockResolvedValue(null);

    const req = new Request('http://localhost', {
      method: 'POST',
      body: JSON.stringify({}),
    });

    const res = await POST(req);
    expect(res.status).toBe(401);
  });

  it('should return 400 for invalid group data', async () => {
    const req = new Request('http://localhost', {
      method: 'POST',
      body: JSON.stringify({ isGroup: true, members: [], name: '' }),
    });

    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it('should create a group conversation', async () => {
    const groupBody = {
      isGroup: true,
      name: 'Trip Gang',
      members: [{ value: 'u1' }, { value: 'u2' }],
    };

    const mockConversation = { id: 'group123', users: [{ email: 'a@test.com' }] };
    (prisma.conversation.create as jest.Mock).mockResolvedValue(mockConversation);

    const req = new Request('http://localhost', {
      method: 'POST',
      body: JSON.stringify(groupBody),
    });

    const res = await POST(req);
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.id).toBe('group123');
  });

  it('should return existing single conversation', async () => {
    (prisma.conversation.findMany as jest.Mock).mockResolvedValue([{ id: 'existingConv' }]);

    const req = new Request('http://localhost', {
      method: 'POST',
      body: JSON.stringify({ isGroup: false, userId: 'u456' }),
    });

    const res = await POST(req);
    const json = await res.json();

    expect(json.id).toBe('existingConv');
  });

  it('should create new single conversation if none exists', async () => {
    (prisma.conversation.findMany as jest.Mock).mockResolvedValue([]);
    const mockNewConv = { id: 'newConv', users: [{ email: 'x@test.com' }] };
    (prisma.conversation.create as jest.Mock).mockResolvedValue(mockNewConv);

    const req = new Request('http://localhost', {
      method: 'POST',
      body: JSON.stringify({ isGroup: false, userId: 'u789' }),
    });

    const res = await POST(req);
    const json = await res.json();

    expect(json.id).toBe('newConv');
  });
});
