import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';

describe('AuthController', () => {
  let controller: AuthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('returns register scaffold response', () => {
    expect(controller.register()).toEqual({
      message: 'Registration endpoint scaffolded',
    });
  });

  it('returns login scaffold response with provider token', () => {
    expect(controller.login({ providerToken: 'token' })).toEqual({
      accessToken: 'token',
      tokenType: 'Bearer',
      expiresIn: 3600,
    });
  });

  it('returns login scaffold response without provider token', () => {
    expect(controller.login({})).toEqual({
      accessToken: null,
      tokenType: 'Bearer',
      expiresIn: 3600,
    });
  });

  it('returns refresh scaffold response', () => {
    expect(controller.refresh()).toEqual({
      message: 'Refresh endpoint scaffolded',
    });
  });
});
