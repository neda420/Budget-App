import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException } from '@nestjs/common';
import { CategoriesController } from './categories.controller';
import { PrismaService } from '../../../infrastructure/database/prisma.service';

const mockUser = { id: 'user-1', email: 'a@b.com' };
const mockRequest = { user: mockUser };

const mockPrisma = {
  expenseCategory: {
    findMany: jest.fn(),
    findFirst: jest.fn(),
    create: jest.fn(),
  },
};

describe('CategoriesController', () => {
  let controller: CategoriesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CategoriesController],
      providers: [{ provide: PrismaService, useValue: mockPrisma }],
    }).compile();

    controller = module.get<CategoriesController>(CategoriesController);
    jest.clearAllMocks();
  });

  it('returns categories for the authenticated user plus system categories', async () => {
    const categories = [
      { id: 'c-1', name: 'Food', type: 'USER_DEFINED' },
      { id: 'c-2', name: 'Travel', type: 'SYSTEM' },
    ];
    mockPrisma.expenseCategory.findMany.mockResolvedValue(categories);
    const result = await controller.listCategories(mockRequest);
    expect(result).toHaveLength(2);
  });

  it('creates a new user category', async () => {
    mockPrisma.expenseCategory.findFirst.mockResolvedValue(null);
    mockPrisma.expenseCategory.create.mockResolvedValue({
      id: 'c-new',
      name: 'Food',
      type: 'USER_DEFINED',
    });
    const result = await controller.createCategory(mockRequest, {
      name: 'Food',
    });
    expect(result).toEqual({ id: 'c-new', name: 'Food', type: 'USER_DEFINED' });
  });

  it('throws ConflictException when category name already exists', async () => {
    mockPrisma.expenseCategory.findFirst.mockResolvedValue({
      id: 'c-1',
      name: 'Food',
    });
    await expect(
      controller.createCategory(mockRequest, { name: 'Food' }),
    ).rejects.toThrow(ConflictException);
  });
});
