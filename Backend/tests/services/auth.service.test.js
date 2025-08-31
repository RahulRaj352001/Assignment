const authService = require('../../src/services/auth.service');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Mock dependencies
jest.mock('../../src/repositories/user.repo');
jest.mock('bcrypt');
jest.mock('jsonwebtoken');

const mockUserRepo = require('../../src/repositories/user.repo');

describe('Auth Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('signup', () => {
    it('should create a new user successfully', async () => {
      const userData = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
        role: 'user'
      };

      const hashedPassword = 'hashedPassword123';
      const mockUser = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        name: userData.name,
        email: userData.email,
        role: userData.role
      };

      const mockToken = 'jwt-token-123';

      // Mock bcrypt hash
      bcrypt.hash.mockResolvedValue(hashedPassword);
      
      // Mock user repository
      mockUserRepo.findByEmail.mockResolvedValue(null);
      mockUserRepo.createUser.mockResolvedValue(mockUser);
      
      // Mock JWT sign
      jwt.sign.mockReturnValue(mockToken);

      const result = await authService.signup(userData);

      expect(bcrypt.hash).toHaveBeenCalledWith(userData.password, 10);
      expect(mockUserRepo.findByEmail).toHaveBeenCalledWith(userData.email);
      expect(mockUserRepo.createUser).toHaveBeenCalledWith({
        ...userData,
        password: hashedPassword
      });
      expect(jwt.sign).toHaveBeenCalledWith(
        { id: mockUser.id, email: mockUser.email, role: mockUser.role },
        expect.any(String),
        { expiresIn: '1h' }
      );
      expect(result).toEqual({
        user: mockUser,
        token: mockToken
      });
    });

    it('should throw error if user already exists', async () => {
      const userData = {
        name: 'Test User',
        email: 'existing@example.com',
        password: 'password123'
      };

      mockUserRepo.findByEmail.mockResolvedValue({ id: '1', email: userData.email });

      await expect(authService.signup(userData)).rejects.toThrow('User already exists with this email');
      expect(mockUserRepo.findByEmail).toHaveBeenCalledWith(userData.email);
    });
  });

  describe('login', () => {
    it('should login user successfully', async () => {
      const loginData = {
        email: 'test@example.com',
        password: 'password123'
      };

      const mockUser = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        name: 'Test User',
        email: loginData.email,
        password: 'hashedPassword123',
        role: 'user'
      };

      const mockToken = 'jwt-token-123';

      mockUserRepo.findByEmail.mockResolvedValue(mockUser);
      bcrypt.compare.mockResolvedValue(true);
      jwt.sign.mockReturnValue(mockToken);

      const result = await authService.login(loginData);

      expect(mockUserRepo.findByEmail).toHaveBeenCalledWith(loginData.email);
      expect(bcrypt.compare).toHaveBeenCalledWith(loginData.password, mockUser.password);
      expect(jwt.sign).toHaveBeenCalledWith(
        { id: mockUser.id, email: mockUser.email, role: mockUser.role },
        expect.any(String),
        { expiresIn: '1h' }
      );
      
      const { password, ...userWithoutPassword } = mockUser;
      expect(result).toEqual({
        user: userWithoutPassword,
        token: mockToken
      });
    });

    it('should throw error for invalid email', async () => {
      const loginData = {
        email: 'nonexistent@example.com',
        password: 'password123'
      };

      mockUserRepo.findByEmail.mockResolvedValue(null);

      await expect(authService.login(loginData)).rejects.toThrow('Invalid email or password');
    });

    it('should throw error for invalid password', async () => {
      const loginData = {
        email: 'test@example.com',
        password: 'wrongpassword'
      };

      const mockUser = {
        id: '1',
        email: loginData.email,
        password: 'hashedPassword123'
      };

      mockUserRepo.findByEmail.mockResolvedValue(mockUser);
      bcrypt.compare.mockResolvedValue(false);

      await expect(authService.login(loginData)).rejects.toThrow('Invalid email or password');
    });
  });

  describe('forgotPassword', () => {
    it('should handle forgot password request', async () => {
      const email = 'test@example.com';
      const mockUser = {
        id: '1',
        email,
        name: 'Test User'
      };

      mockUserRepo.findByEmail.mockResolvedValue(mockUser);

      const result = await authService.forgotPassword(email);

      expect(mockUserRepo.findByEmail).toHaveBeenCalledWith(email);
      expect(result).toEqual({
        message: 'Password reset OTP sent to your email',
        email,
        otp: '1234'
      });
    });

    it('should throw error for non-existent user', async () => {
      const email = 'nonexistent@example.com';

      mockUserRepo.findByEmail.mockResolvedValue(null);

      await expect(authService.forgotPassword(email)).rejects.toThrow('User not found with this email');
    });
  });

  describe('resetPassword', () => {
    it('should reset password successfully', async () => {
      const email = 'test@example.com';
      const otp = '1234';
      const newPassword = 'newpassword123';

      const mockUser = {
        id: '1',
        email,
        name: 'Test User'
      };

      const hashedPassword = 'newHashedPassword';
      const updatedUser = {
        id: '1',
        name: 'Test User',
        email,
        role: 'user'
      };

      mockUserRepo.findByEmail.mockResolvedValue(mockUser);
      bcrypt.hash.mockResolvedValue(hashedPassword);
      mockUserRepo.updateUser.mockResolvedValue(updatedUser);

      const result = await authService.resetPassword(email, otp, newPassword);

      expect(bcrypt.hash).toHaveBeenCalledWith(newPassword, 10);
      expect(mockUserRepo.updateUser).toHaveBeenCalledWith(mockUser.id, {
        password: hashedPassword
      });
      expect(result).toEqual({
        message: 'Password reset successfully',
        user: updatedUser
      });
    });

    it('should throw error for invalid OTP', async () => {
      const email = 'test@example.com';
      const otp = '9999';
      const newPassword = 'newpassword123';

      await expect(authService.resetPassword(email, otp, newPassword)).rejects.toThrow('Invalid OTP');
    });
  });
});
