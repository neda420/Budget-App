import { Body, Controller, Post } from '@nestjs/common';

interface AuthRequest {
  providerToken?: string;
}

@Controller('auth')
export class AuthController {
  @Post('register')
  register() {
    return { message: 'Registration endpoint scaffolded' };
  }

  @Post('login')
  login(@Body() body: AuthRequest) {
    return {
      accessToken: body.providerToken ?? null,
      tokenType: 'Bearer',
      expiresIn: 3600,
    };
  }

  @Post('refresh')
  refresh() {
    return { message: 'Refresh endpoint scaffolded' };
  }
}
