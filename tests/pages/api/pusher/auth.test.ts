import { NextApiRequest, NextApiResponse } from 'next';
import handler from '@/pages/api/pusher/auth';
import { getServerSession } from 'next-auth';
import { pusherServer } from '@/app/libs/pusher';

jest.mock('next-auth', () => ({
  getServerSession: jest.fn(),
}));

jest.mock('@/app/libs/pusher', () => ({
  pusherServer: {
    authorizeChannel: jest.fn(),
  },
}));

describe('POST /api/pusher/auth', () => {
  it('should return 401 if no session is found', async () => {
    // Mock the getServerSession to return null (no session)
    (getServerSession as jest.Mock).mockResolvedValue(null);

    const req = {
      body: {
        socket_id: 'socket123',
        channel_name: 'private-channel',
      },
    } as NextApiRequest;
    
    const res = {
      status: jest.fn().mockReturnThis(),
      end: jest.fn(),
    } as unknown as NextApiResponse;

    await handler(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.end).toHaveBeenCalled();
  });

  it('should return 200 and the correct Pusher auth response if session is valid', async () => {
    // Mock a valid session
    (getServerSession as jest.Mock).mockResolvedValue({
      user: { email: 'user@example.com' },
    });

    // Mock the authorizeChannel method
    const mockAuthResponse = { auth: 'pusher-auth-string' };
    (pusherServer.authorizeChannel as jest.Mock).mockReturnValue(mockAuthResponse);

    const req = {
      body: {
        socket_id: 'socket123',
        channel_name: 'private-channel',
      },
    } as NextApiRequest;

    const res = {
      send: jest.fn(),
    } as unknown as NextApiResponse;

    await handler(req, res);

    expect(pusherServer.authorizeChannel).toHaveBeenCalledWith(
      'socket123',
      'private-channel',
      { user_id: 'user@example.com' }
    );
    expect(res.send).toHaveBeenCalledWith(mockAuthResponse);
  });

  it('should return 401 if session is invalid (missing email)', async () => {
    // Mock a session with no email
    (getServerSession as jest.Mock).mockResolvedValue({
      user: {},
    });

    const req = {
      body: {
        socket_id: 'socket123',
        channel_name: 'private-channel',
      },
    } as NextApiRequest;

    const res = {
      status: jest.fn().mockReturnThis(),
      end: jest.fn(),
    } as unknown as NextApiResponse;

    await handler(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.end).toHaveBeenCalled();
  });
});
