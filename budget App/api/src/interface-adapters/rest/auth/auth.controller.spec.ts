import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from '../../../infrastructure/auth/auth.service';

const mockAuthService = {
  register: jest.fn(),
  login: jest.fn(),
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
      tokenType: 'Bearer',
      expiresIn: 3600,
    };
    mockAuthService.login.mockResolvedValue(expected);
    const dto = { email: 'a@b.com', password: 'password1' };
    await expect(controller.login(dto)).resolves.toEqual(expected);
    expect(mockAuthService.login).toHaveBeenCalledWith(dto);
  });

  it('returns refresh message without calling AuthService', () => {
    const result = controller.refresh();
    expect(result).toEqual({
      message: 'Use login to obtain a new access token',
    });
    expect(mockAuthService.register).not.toHaveBeenCalled();
  });
});
