import { POST } from '@/app/api/register/route';
import prisma from '@/app/libs/prismadb';
import bcrypt from 'bcrypt';

jest.mock('@/app/libs/prismadb', () => ({
  user: {
    create: jest.fn(),
  },
}));

jest.mock('bcrypt', () => ({
  hash: jest.fn(),
}));

describe('Register API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should create a new user and return the user object', async () => {
    const mockUser = {
      id: 1,
      name: 'John Doe',
      email: 'johndoe@example.com',
      hashedPassword: 'hashedpassword',
    };

    bcrypt.hash.mockResolvedValue('hashedpassword');
    prisma.user.create.mockResolvedValue(mockUser);

    const req = new Request('http://localhost', {
      method: 'POST',
      body: JSON.stringify({ name: 'John Doe', email: 'johndoe@example.com', password: 'password123' }),
      headers: { 'Content-Type': 'application/json' },
    });

    const res = await POST(req);
    const json = await res.json();

    expect(res.status).toBe(201);
    expect(json).toEqual(mockUser);
    expect(prisma.user.create).toHaveBeenCalledWith({
      data: {
        name: 'John Doe',
        email: 'johndoe@example.com',
        hashedPassword: 'hashedpassword',
      },
    });
  });

  it('should return an error if user data is missing', async () => {
    const req = new Request('http://localhost', {
      method: 'POST',
      body: JSON.stringify({ name: '', email: '', password: '' }),
      headers: { 'Content-Type': 'application/json' },
    });

    const res = await POST(req);
    const text = await res.text();

    expect(res.status).toBe(400);
    expect(text).toBe('Please fill all the fields!');
  });

  it('should return an error if user already exists', async () => {
    const error = { code: 'P2002', meta: { target: ['email'] } };
    prisma.user.create.mockRejectedValue(error);

    const req = new Request('http://localhost', {
      method: 'POST',
      body: JSON.stringify({ name: 'John Doe', email: 'johndoe@example.com', password: 'password123' }),
      headers: { 'Content-Type': 'application/json' },
    });

    const res = await POST(req);
    const text = await res.text();

    expect(res.status).toBe(409);
    expect(text).toBe('User already exists');
  });

  it('should return an error if internal server error occurs', async () => {
    const error = new Error('Some error');
    prisma.user.create.mockRejectedValue(error);

    const req = new Request('http://localhost', {
      method: 'POST',
      body: JSON.stringify({ name: 'John Doe', email: 'johndoe@example.com', password: 'password123' }),
      headers: { 'Content-Type': 'application/json' },
    });

    const res = await POST(req);
    const text = await res.text();

    expect(res.status).toBe(500);
    expect(text).toBe('Some error');
  });
});
