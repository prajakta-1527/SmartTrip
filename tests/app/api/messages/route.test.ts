import { POST } from '@/app/api/messages/route';
import prisma from '@/app/libs/prismadb';
import { pusherServer } from '@/app/libs/pusher';
import getCurrentUser from '@/app/actions/getCurrentUser';

jest.mock('@/app/libs/prismadb', () => ({
  __esModule: true,
  default: {
    message: {
      create: jest.fn(),
    },
    conversation: {
      update: jest.fn(),
    },
  },
}));

jest.mock('@/app/libs/pusher', () => ({
  pusherServer: {
    trigger: jest.fn(),
  },
}));

jest.mock('@/app/actions/getCurrentUser');

const mockPrisma = prisma as jest.Mocked<typeof prisma>;
const mockGetCurrentUser = getCurrentUser as jest.Mock;

describe('POST /api/messages', () => {
  const mockUser = { id: 'user-1', email: 'user@example.com' };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return 401 if current user is not authenticated', async () => {
    mockGetCurrentUser.mockResolvedValue(null);

    const req = new Request('http://localhost', {
      method: 'POST',
      body: JSON.stringify({}),
    });

    const res = await POST(req);
    expect(res.status).toBe(401);
  });

  it('should create a new message and update conversation', async () => {
    mockGetCurrentUser.mockResolvedValue(mockUser);

    const mockMessage = {
      id: 'msg-1',
      body: 'Hello',
      image: null,
      sender: mockUser,
      seen: [mockUser],
    };

    const mockUpdatedConversation = {
      id: 'conv-1',
      users: [mockUser],
      messages: [
        {
          ...mockMessage,
          seen: [mockUser],
        },
      ],
    };

    mockPrisma.message.create.mockResolvedValue(mockMessage);
    mockPrisma.conversation.update.mockResolvedValue(mockUpdatedConversation);

    const req = new Request('http://localhost', {
      method: 'POST',
      body: JSON.stringify({
        message: 'Hello',
        image: null,
        conversationId: 'conv-1',
      }),
    });

    const res = await POST(req);
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json).toEqual(mockMessage);

    expect(prisma.message.create).toHaveBeenCalled();
    expect(prisma.conversation.update).toHaveBeenCalled();

    expect(pusherServer.trigger).toHaveBeenCalledWith('conv-1', 'messages:new', mockMessage);
    expect(pusherServer.trigger).toHaveBeenCalledWith(mockUser.email!, 'conversation:update', {
      id: 'conv-1',
      messages: [mockMessage],
    });
  });

  it('should return 500 on error', async () => {
    mockGetCurrentUser.mockResolvedValue(mockUser);
    mockPrisma.message.create.mockRejectedValue(new Error('DB error'));

    const req = new Request('http://localhost', {
      method: 'POST',
      body: JSON.stringify({
        message: 'Fail',
        image: null,
        conversationId: 'conv-error',
      }),
    });

    const res = await POST(req);
    const json = await res.text();

    expect(res.status).toBe(500);
    expect(json).toBe('Internal Server Error');
  });
});
