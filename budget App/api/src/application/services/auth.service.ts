import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  async validateOAuthLogin(profile: any): Promise<string> {
    try {
      // In a real application, you'd check whether a user exists with this GitHub ID 
      // or email in the database (via User repository).
      // If none, create a new User.
      // For MVP Auth scaffolding: Mock the user retrieval
      const payload = {
        sub: profile.id, // Subject could map to our User.id 
        email: profile.emails?.[0]?.value || 'no-email@github.com',
        username: profile.username || profile.displayName
      };

      // Generate the JWT token
      const jwt = this.jwtService.sign(payload);
      return jwt;
    } catch (err) {
      throw new UnauthorizedException('OAuth login failed', `${err}`);
    }
  }

  async validateJwtPayload(payload: any) {
    // Look up the user here if needed, or just return the payload structure
    return payload;
  }
}
