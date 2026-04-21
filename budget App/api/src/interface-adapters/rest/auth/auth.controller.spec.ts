import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from '../../../infrastructure/auth/auth.service';

const mockAuthService = {
  register: jest.fn(),
  login: jest.fn(),
  refresh: jest.fn(),
};

describe('AuthController', () => {
  let controller: AuthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{ provide: AuthService, useValue: mockAuthService }],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    jest.clearAllMocks();
  });

  it('delegates register to AuthService', async () => {
    const expected = { id: 'user-1' };
    mockAuthService.register.mockResolvedValue(expected);
    const dto = { email: 'a@b.com', password: 'password1', name: 'Alice' };
    await expect(controller.register(dto)).resolves.toEqual(expected);
    expect(mockAuthService.register).toHaveBeenCalledWith(dto);
  });

  it('delegates login to AuthService', async () => {
    const expected = {
      accessToken: 'jwt',
      refreshToken: 'refresh-token',
      tokenType: 'Bearer',
      expiresIn: 3600,
      refreshExpiresIn: 2592000,
    };
    mockAuthService.login.mockResolvedValue(expected);
    const dto = { email: 'a@b.com', password: 'password1' };
    await expect(controller.login(dto)).resolves.toEqual(expected);
    expect(mockAuthService.login).toHaveBeenCalledWith(dto);
  });

  it('delegates refresh to AuthService', async () => {
    const expected = {
      accessToken: 'jwt',
      refreshToken: 'refresh-token-next',
      tokenType: 'Bearer',
      expiresIn: 3600,
      refreshExpiresIn: 2592000,
    };
    mockAuthService.refresh.mockResolvedValue(expected);
    const dto = { refreshToken: 'refresh-token' };
    await expect(controller.refresh(dto)).resolves.toEqual(expected);
    expect(mockAuthService.refresh).toHaveBeenCalledWith(dto.refreshToken);
  });
});
