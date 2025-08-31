const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userRepo = require("../repositories/user.repo");

const JWT_SECRET = process.env.JWT_SECRET || "supersecret";
const JWT_EXPIRES_IN = "1h";

// Hardcoded OTP for now (in production, this would be generated and sent via email)
const RESET_OTP = "1234";

module.exports = {
  async signup({ name, email, password, role = "user" }) {
    console.log(name, email, password, role);
    const existing = await userRepo.findByEmail(email);
    console.log(existing);
    if (existing) {
      throw new Error("User already exists with this email");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    console.log(hashedPassword);
    const user = await userRepo.createUser({
      name,
      email,
      password: hashedPassword,
      role,
    });
    console.log(user);

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    return { user, token };
  },

  async login({ email, password }) {
    const user = await userRepo.findByEmail(email);
    if (!user) {
      throw new Error("Invalid email or password");
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new Error("Invalid email or password");
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    // Exclude password from response
    const { password: _, ...userWithoutPassword } = user;

    return { user: userWithoutPassword, token };
  },

  async forgotPassword(email) {
    const user = await userRepo.findByEmail(email);
    if (!user) {
      throw new Error("User not found with this email");
    }

    // In production, this would send an email with the OTP
    // For now, we'll just return success message
    console.log(`📧 Password reset OTP for ${email}: ${RESET_OTP}`);

    return {
      message: "Password reset OTP sent to your email",
      email: email,
      // In production, don't return OTP in response
      // This is just for testing purposes
      otp: RESET_OTP,
    };
  },

  async resetPassword(email, otp, newPassword) {
    // Validate OTP
    if (otp !== RESET_OTP) {
      throw new Error("Invalid OTP");
    }

    const user = await userRepo.findByEmail(email);
    if (!user) {
      throw new Error("User not found");
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update user password
    const updatedUser = await userRepo.updateUser(user.id, {
      password: hashedPassword,
    });

    return {
      message: "Password reset successfully",
      user: {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
      },
    };
  },
};
