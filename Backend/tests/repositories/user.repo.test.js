const userRepo = require('../../src/repositories/user.repo');

// Mock the database pool
jest.mock('../../src/config/db', () => ({
  query: jest.fn()
}));

const mockPool = require('../../src/config/db');

describe('User Repository', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createUser', () => {
    it('should create a user successfully', async () => {
      const userData = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'hashedPassword',
        role: 'user'
      };

      const expectedUser = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        name: userData.name,
        email: userData.email,
        role: userData.role,
        created_at: new Date()
      };

      mockPool.query.mockResolvedValueOnce({ rows: [expectedUser] });

      const result = await userRepo.createUser(userData);

      expect(mockPool.query).toHaveBeenCalledWith(
        expect.stringContaining('INSERT INTO users'),
        [userData.name, userData.email, userData.password, userData.role]
      );
      expect(result).toEqual(expectedUser);
    });
  });

  describe('findByEmail', () => {
    it('should find user by email', async () => {
      const email = 'test@example.com';
      const expectedUser = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        name: 'Test User',
        email,
        password: 'hashedPassword',
        role: 'user'
      };

      mockPool.query.mockResolvedValueOnce({ rows: [expectedUser] });

      const result = await userRepo.findByEmail(email);

      expect(mockPool.query).toHaveBeenCalledWith(
        'SELECT * FROM users WHERE email = $1',
        [email]
      );
      expect(result).toEqual(expectedUser);
    });

    it('should return undefined for non-existent email', async () => {
      const email = 'nonexistent@example.com';

      mockPool.query.mockResolvedValueOnce({ rows: [] });

      const result = await userRepo.findByEmail(email);

      expect(result).toBeUndefined();
    });
  });

  describe('getAllUsers', () => {
    it('should get all users with pagination', async () => {
      const limit = 10;
      const offset = 0;
      const expectedUsers = [
        { id: '1', name: 'User 1', email: 'user1@example.com', role: 'user' },
        { id: '2', name: 'User 2', email: 'user2@example.com', role: 'admin' }
      ];

      mockPool.query.mockResolvedValueOnce({ rows: expectedUsers });

      const result = await userRepo.getAllUsers(limit, offset);

      expect(mockPool.query).toHaveBeenCalledWith(
        expect.stringContaining('SELECT id, name, email, role, created_at'),
        [limit, offset]
      );
      expect(result).toEqual(expectedUsers);
    });
  });

  describe('updateUser', () => {
    it('should update user profile', async () => {
      const userId = '123e4567-e89b-12d3-a456-426614174000';
      const updates = {
        name: 'Updated Name',
        email: 'updated@example.com'
      };

      const expectedUser = {
        id: userId,
        name: updates.name,
        email: updates.email,
        role: 'user',
        created_at: new Date(),
        updated_at: new Date()
      };

      mockPool.query.mockResolvedValueOnce({ rows: [expectedUser] });

      const result = await userRepo.updateUser(userId, updates);

      expect(mockPool.query).toHaveBeenCalledWith(
        expect.stringContaining('UPDATE users'),
        [updates.name, updates.email, userId]
      );
      expect(result).toEqual(expectedUser);
    });

    it('should update user password', async () => {
      const userId = '123e4567-e89b-12d3-a456-426614174000';
      const updates = {
        password: 'newHashedPassword'
      };

      const expectedUser = {
        id: userId,
        name: 'Test User',
        email: 'test@example.com',
        role: 'user',
        created_at: new Date(),
        updated_at: new Date()
      };

      mockPool.query.mockResolvedValueOnce({ rows: [expectedUser] });

      const result = await userRepo.updateUser(userId, updates);

      expect(mockPool.query).toHaveBeenCalledWith(
        expect.stringContaining('UPDATE users'),
        [updates.password, userId]
      );
      expect(result).toEqual(expectedUser);
    });
  });
});
