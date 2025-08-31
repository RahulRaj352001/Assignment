const request = require('supertest');
const app = require('../../src/app');

// Mock the auth controller
jest.mock('../../src/controllers/auth.controller', () => ({
  signup: jest.fn(),
  login: jest.fn(),
  forgotPassword: jest.fn(),
  resetPassword: jest.fn()
}));

const authController = require('../../src/controllers/auth.controller');

describe('Auth Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/auth/signup', () => {
    it('should validate signup input and call controller', async () => {
      const userData = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123'
      };

      const mockResponse = {
        success: true,
        message: 'User registered successfully',
        data: {
          user: { id: '1', name: userData.name, email: userData.email },
          token: 'jwt-token'
        }
      };

      authController.signup.mockImplementation((req, res) => {
        res.json(mockResponse);
      });

      const response = await request(app)
        .post('/api/auth/signup')
        .send(userData)
        .expect(200);

      expect(authController.signup).toHaveBeenCalled();
      expect(response.body).toEqual(mockResponse);
    });

    it('should reject invalid email format', async () => {
      const invalidData = {
        name: 'Test User',
        email: 'invalid-email',
        password: 'password123'
      };

      const response = await request(app)
        .post('/api/auth/signup')
        .send(invalidData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Validation failed');
    });

    it('should reject short password', async () => {
      const invalidData = {
        name: 'Test User',
        email: 'test@example.com',
        password: '123'
      };

      const response = await request(app)
        .post('/api/auth/signup')
        .send(invalidData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Validation failed');
    });

    it('should reject short name', async () => {
      const invalidData = {
        name: 'A',
        email: 'test@example.com',
        password: 'password123'
      };

      const response = await request(app)
        .post('/api/auth/signup')
        .send(invalidData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Validation failed');
    });
  });

  describe('POST /api/auth/login', () => {
    it('should validate login input and call controller', async () => {
      const loginData = {
        email: 'test@example.com',
        password: 'password123'
      };

      const mockResponse = {
        success: true,
        message: 'Login successful',
        data: {
          user: { id: '1', email: loginData.email },
          token: 'jwt-token'
        }
      };

      authController.login.mockImplementation((req, res) => {
        res.json(mockResponse);
      });

      const response = await request(app)
        .post('/api/auth/login')
        .send(loginData)
        .expect(200);

      expect(authController.login).toHaveBeenCalled();
      expect(response.body).toEqual(mockResponse);
    });

    it('should reject invalid email format', async () => {
      const invalidData = {
        email: 'invalid-email',
        password: 'password123'
      };

      const response = await request(app)
        .post('/api/auth/login')
        .send(invalidData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Validation failed');
    });

    it('should reject empty password', async () => {
      const invalidData = {
        email: 'test@example.com',
        password: ''
      };

      const response = await request(app)
        .post('/api/auth/login')
        .send(invalidData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Validation failed');
    });
  });

  describe('POST /api/auth/forgot-password', () => {
    it('should validate email and call controller', async () => {
      const emailData = {
        email: 'test@example.com'
      };

      const mockResponse = {
        success: true,
        message: 'Password reset OTP sent',
        data: {
          message: 'Password reset OTP sent to your email',
          email: emailData.email,
          otp: '1234'
        }
      };

      authController.forgotPassword.mockImplementation((req, res) => {
        res.json(mockResponse);
      });

      const response = await request(app)
        .post('/api/auth/forgot-password')
        .send(emailData)
        .expect(200);

      expect(authController.forgotPassword).toHaveBeenCalled();
      expect(response.body).toEqual(mockResponse);
    });

    it('should reject invalid email format', async () => {
      const invalidData = {
        email: 'invalid-email'
      };

      const response = await request(app)
        .post('/api/auth/forgot-password')
        .send(invalidData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Validation failed');
    });
  });

  describe('POST /api/auth/reset-password', () => {
    it('should validate reset password input and call controller', async () => {
      const resetData = {
        email: 'test@example.com',
        otp: '1234',
        newPassword: 'newpassword123'
      };

      const mockResponse = {
        success: true,
        message: 'Password reset successful',
        data: {
          message: 'Password reset successfully',
          user: { id: '1', email: resetData.email }
        }
      };

      authController.resetPassword.mockImplementation((req, res) => {
        res.json(mockResponse);
      });

      const response = await request(app)
        .post('/api/auth/reset-password')
        .send(resetData)
        .expect(200);

      expect(authController.resetPassword).toHaveBeenCalled();
      expect(response.body).toEqual(mockResponse);
    });

    it('should reject short OTP', async () => {
      const invalidData = {
        email: 'test@example.com',
        otp: '123',
        newPassword: 'newpassword123'
      };

      const response = await request(app)
        .post('/api/auth/reset-password')
        .send(invalidData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Validation failed');
    });

    it('should reject short new password', async () => {
      const invalidData = {
        email: 'test@example.com',
        otp: '1234',
        newPassword: '123'
      };

      const response = await request(app)
        .post('/api/auth/reset-password')
        .send(invalidData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Validation failed');
    });
  });
});
