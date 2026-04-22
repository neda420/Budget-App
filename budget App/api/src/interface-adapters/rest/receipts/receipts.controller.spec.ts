import { Test, TestingModule } from '@nestjs/testing';
import {
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { ReceiptsController } from './receipts.controller';
import { PrismaService } from '../../../infrastructure/database/prisma.service';

const mockUser = { id: 'user-1', email: 'a@b.com' };
const mockRequest = { user: mockUser };

const mockReceipt = {
  id: 'r-1',
  userId: 'user-1',
  status: 'UPLOADED',
  merchantName: null,
  totalAmount: null,
  currency: null,
  issuedAt: null,
  categoryId: null,
};

const mockPrisma = {
  receipt: {
    create: jest.fn(),
    findMany: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn(),
  },
};

describe('ReceiptsController', () => {
  let controller: ReceiptsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReceiptsController],
      providers: [{ provide: PrismaService, useValue: mockPrisma }],
    }).compile();

    controller = module.get<ReceiptsController>(ReceiptsController);
    jest.clearAllMocks();
  });

  it('returns 400 when no file uploaded', async () => {
    await expect(
      controller.uploadReceipt(mockRequest, undefined),
    ).rejects.toThrow(BadRequestException);
  });

  it('creates a receipt when file is provided', async () => {
    mockPrisma.receipt.create.mockResolvedValue(mockReceipt);
    const file = {
      originalname: 'receipt.jpg',
      buffer: Buffer.from(''),
      mimetype: 'image/jpeg',
    } as Express.Multer.File;
    const result = await controller.uploadReceipt(mockRequest, file);
    expect(result.id).toBe('r-1');
    expect(result.status).toBe('UPLOADED');
  });

  it('returns receipts list for the authenticated user', async () => {
    mockPrisma.receipt.findMany.mockResolvedValue([mockReceipt]);
    const result = await controller.listReceipts(mockRequest);
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('r-1');
  });

  it('returns a receipt by id for the owner', async () => {
    mockPrisma.receipt.findUnique.mockResolvedValue(mockReceipt);
    const result = await controller.getReceiptById(mockRequest, 'r-1');
    expect(result.id).toBe('r-1');
  });

  it('throws NotFoundException when receipt does not exist', async () => {
    mockPrisma.receipt.findUnique.mockResolvedValue(null);
    await expect(
      controller.getReceiptById(mockRequest, 'r-999'),
    ).rejects.toThrow(NotFoundException);
  });

  it('throws ForbiddenException when accessing another user receipt', async () => {
    mockPrisma.receipt.findUnique.mockResolvedValue({
      ...mockReceipt,
      userId: 'other-user',
    });
    await expect(controller.getReceiptById(mockRequest, 'r-1')).rejects.toThrow(
      ForbiddenException,
    );
  });

  it('soft-deletes a receipt owned by the user', async () => {
    mockPrisma.receipt.findUnique.mockResolvedValue(mockReceipt);
    mockPrisma.receipt.update.mockResolvedValue({
      ...mockReceipt,
      status: 'DELETED',
    });
    const result = await controller.deleteReceipt(mockRequest, 'r-1');
    expect(result).toEqual({ id: 'r-1', deleted: true });
  });

  it('returns receipt status', async () => {
    mockPrisma.receipt.findUnique.mockResolvedValue({
      id: 'r-1',
      status: 'COMPLETED',
      userId: 'user-1',
    });
    const result = await controller.getReceiptStatus(mockRequest, 'r-1');
    expect(result).toEqual({ id: 'r-1', status: 'COMPLETED' });
  });
});
