import { POST } from '@/app/api/auth/route';
import getCurrentUser from '@/app/actions/getCurrentUser';
import prisma from '@/app/libs/prismadb';
import { NextResponse } from 'next/server';

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

describe('POST /api/auth', () => {
  const mockUser = { id: 'user123', email: 'user@test.com' };

  beforeEach(() => {
    jest.clearAllMocks();
    (getCurrentUser as jest.Mock).mockResolvedValue(mockUser);
  });

  it('returns 401 if no current user', async () => {
    (getCurrentUser as jest.Mock).mockResolvedValue(null);

    const req = new Request('http://localhost', {
      method: 'POST',
      body: JSON.stringify({}),
    });

    const res = await POST(req);
    expect(res.status).toBe(401);
  });

  it('returns 400 for invalid group data', async () => {
    const req = new Request('http://localhost', {
      method: 'POST',
      body: JSON.stringify({ isGroup: true, members: [], name: '' }),
    });

    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it('creates new group conversation', async () => {
    const req = new Request('http://localhost', {
      method: 'POST',
      body: JSON.stringify({
        isGroup: true,
        members: [{ value: 'u1' }, { value: 'u2' }],
        name: 'My Group',
      }),
    });

    const mockConversation = { id: 'group1', users: [{ email: 'a@test.com' }] };
    (prisma.conversation.create as jest.Mock).mockResolvedValue(mockConversation);

    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data).toEqual(mockConversation);
  });

  it('returns existing conversation if found', async () => {
    (prisma.conversation.findMany as jest.Mock).mockResolvedValue([{ id: 'conv1' }]);

    const req = new Request('http://localhost', {
      method: 'POST',
      body: JSON.stringify({
        userId: 'user456',
        isGroup: false,
      }),
    });

    const res = await POST(req);
    const data = await res.json();

    expect(data.id).toBe('conv1');
  });
});
