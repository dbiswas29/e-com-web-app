import usersData from '@/data/users.json';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

class LocalAuthService {
  private users: Array<User & { password: string }> = [];
  private storageKey = 'ecommerce_users';

  constructor() {
    this.loadUsers();
  }

  /**
   * Load users from localStorage or fallback to JSON file
   */
  private loadUsers(): void {
    if (typeof window !== 'undefined') {
      // Try to load from localStorage first (for registered users)
      const storedUsers = localStorage.getItem(this.storageKey);
      if (storedUsers) {
        try {
          const parsed = JSON.parse(storedUsers);
          this.users = parsed.users || [];
          return;
        } catch (error) {
          console.warn('Failed to parse stored users, falling back to default');
        }
      }
    }
    
    // Fallback to default users from JSON
    this.users = usersData.users;
  }

  /**
   * Save users to localStorage
   */
  private saveUsers(): void {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(this.storageKey, JSON.stringify({ users: this.users }));
      } catch (error) {
        console.error('Failed to save users to localStorage:', error);
      }
    }
  }

  /**
   * Generate a simple token (for demo purposes)
   */
  private generateToken(userId: string): string {
    const timestamp = Date.now();
    const randomStr = Math.random().toString(36).substring(2);
    return `local_token_${userId}_${timestamp}_${randomStr}`;
  }

  /**
   * Generate a simple refresh token
   */
  private generateRefreshToken(userId: string): string {
    const timestamp = Date.now();
    const randomStr = Math.random().toString(36).substring(2);
    return `local_refresh_${userId}_${timestamp}_${randomStr}`;
  }

  /**
   * Find user by email
   */
  private findUserByEmail(email: string): (User & { password: string }) | null {
    return this.users.find(user => user.email.toLowerCase() === email.toLowerCase()) || null;
  }

  /**
   * Find user by ID
   */
  private findUserById(id: string): User | null {
    const user = this.users.find(user => user.id === id);
    if (!user) return null;
    
    // Return user without password
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  /**
   * Authenticate user with email and password
   */
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    return new Promise((resolve, reject) => {
      // Simulate API delay
      setTimeout(() => {
        const { email, password } = credentials;
        
        // Find user by email
        const user = this.findUserByEmail(email);
        
        if (!user) {
          reject(new Error('User not found'));
          return;
        }

        // Check password (simple string comparison for demo)
        if (user.password !== password) {
          reject(new Error('Invalid password'));
          return;
        }

        // Remove password from user object
        const { password: _, ...userWithoutPassword } = user;

        // Generate tokens
        const accessToken = this.generateToken(user.id);
        const refreshToken = this.generateRefreshToken(user.id);

        resolve({
          user: userWithoutPassword,
          accessToken,
          refreshToken
        });
      }, 500); // 500ms delay to simulate network
    });
  }

  /**
   * Register a new user
   */
  async register(userData: RegisterData): Promise<AuthResponse> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const { email, password, firstName, lastName } = userData;

        // Check if user already exists
        const existingUser = this.findUserByEmail(email);
        if (existingUser) {
          reject(new Error('User with this email already exists'));
          return;
        }

        // Create new user
        const newUser = {
          id: `local-user-${Date.now()}`,
          email,
          password,
          firstName,
          lastName,
          role: 'USER',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };

        // Add to users array and persist
        this.users.push(newUser);
        this.saveUsers();

        // Remove password from response
        const { password: _, ...userWithoutPassword } = newUser;

        // Generate tokens
        const accessToken = this.generateToken(newUser.id);
        const refreshToken = this.generateRefreshToken(newUser.id);

        resolve({
          user: userWithoutPassword,
          accessToken,
          refreshToken
        });
      }, 500);
    });
  }

  /**
   * Get user profile by token
   */
  async getProfile(token: string): Promise<User> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          // Extract user ID from token (simple implementation)
          const parts = token.split('_');
          if (parts.length < 4 || parts[0] !== 'local' || parts[1] !== 'token') {
            reject(new Error('Invalid token'));
            return;
          }

          const userId = parts[2];
          const user = this.findUserById(userId);

          if (!user) {
            reject(new Error('User not found'));
            return;
          }

          resolve(user);
        } catch (error) {
          reject(new Error('Invalid token'));
        }
      }, 200);
    });
  }

  /**
   * Refresh access token
   */
  async refreshToken(refreshToken: string): Promise<{ accessToken: string }> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          // Extract user ID from refresh token
          const parts = refreshToken.split('_');
          if (parts.length < 4 || parts[0] !== 'local' || parts[1] !== 'refresh') {
            reject(new Error('Invalid refresh token'));
            return;
          }

          const userId = parts[2];
          const user = this.findUserById(userId);

          if (!user) {
            reject(new Error('User not found'));
            return;
          }

          const accessToken = this.generateToken(userId);
          resolve({ accessToken });
        } catch (error) {
          reject(new Error('Invalid refresh token'));
        }
      }, 200);
    });
  }

  /**
   * Validate token
   */
  async validateToken(token: string): Promise<boolean> {
    try {
      await this.getProfile(token);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Get all available test credentials
   */
  getTestCredentials(): Array<{ email: string; password: string; name: string }> {
    return this.users.map(user => ({
      email: user.email,
      password: user.password,
      name: `${user.firstName} ${user.lastName}`
    }));
  }
  /**
   * Get all registered users (for debugging/admin purposes)
   */
  getAllUsers(): User[] {
    return this.users.map(user => {
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    });
  }

  /**
   * Clear all stored users (reset to default)
   */
  resetUsers(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(this.storageKey);
      this.loadUsers();
    }
  }
}

export const localAuthService = new LocalAuthService();
