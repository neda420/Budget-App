import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  Request,
  HttpCode,
  HttpStatus,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../../../infrastructure/auth/jwt-auth.guard';
import { PrismaService } from '../../../infrastructure/database/prisma.service';

interface AuthenticatedRequest {
  user: { id: string; email: string };
}

@UseGuards(JwtAuthGuard)
@Controller('receipts')
export class ReceiptsController {
  constructor(private readonly prisma: PrismaService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async uploadReceipt(
    @Request() req: AuthenticatedRequest,
    @UploadedFile() file: Express.Multer.File | undefined,
  ) {
    if (!file) {
      throw new BadRequestException('No file provided');
    }
    // The image will be stored to S3 in the full pipeline; we record the key here.
    const idempotencyKey = `${req.user.id}-${file.originalname}-${Date.now()}`;
    const imageKey = `receipts/${req.user.id}/${Date.now()}-${file.originalname}`;

    const receipt = await this.prisma.receipt.create({
      data: {
        userId: req.user.id,
        idempotencyKey,
        imageKey,
        imageBucket: process.env.S3_BUCKET ?? 'budgetlens-receipts',
        imageChecksum: idempotencyKey,
        encryptionKeyId: 'default',
      },
    });

    return {
      id: receipt.id,
      status: receipt.status,
      merchantName: receipt.merchantName ?? undefined,
      totalAmount: receipt.totalAmount
        ? {
            amount: receipt.totalAmount.toString(),
            currency: receipt.currency ?? 'USD',
          }
        : undefined,
      issuedAt: receipt.issuedAt?.toISOString(),
      categoryId: receipt.categoryId ?? undefined,
    };
  }

  @Get()
  async listReceipts(@Request() req: AuthenticatedRequest) {
    const receipts = await this.prisma.receipt.findMany({
      where: { userId: req.user.id, status: { not: 'DELETED' } },
      orderBy: { createdAt: 'desc' },
      take: 100,
    });

    return receipts.map((r) => ({
      id: r.id,
      status: r.status,
      merchantName: r.merchantName ?? undefined,
      totalAmount: r.totalAmount
        ? { amount: r.totalAmount.toString(), currency: r.currency ?? 'USD' }
        : undefined,
      issuedAt: r.issuedAt?.toISOString(),
      categoryId: r.categoryId ?? undefined,
    }));
  }

  @Get(':id')
  async getReceiptById(
    @Request() req: AuthenticatedRequest,
    @Param('id') id: string,
  ) {
    const receipt = await this.prisma.receipt.findUnique({ where: { id } });
    if (!receipt) throw new NotFoundException('Receipt not found');
    if (receipt.userId !== req.user.id) throw new ForbiddenException();

    return {
      id: receipt.id,
      status: receipt.status,
      merchantName: receipt.merchantName ?? undefined,
      totalAmount: receipt.totalAmount
        ? {
            amount: receipt.totalAmount.toString(),
            currency: receipt.currency ?? 'USD',
          }
        : undefined,
      issuedAt: receipt.issuedAt?.toISOString(),
      categoryId: receipt.categoryId ?? undefined,
    };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async deleteReceipt(
    @Request() req: AuthenticatedRequest,
    @Param('id') id: string,
  ) {
    const receipt = await this.prisma.receipt.findUnique({ where: { id } });
    if (!receipt) throw new NotFoundException('Receipt not found');
    if (receipt.userId !== req.user.id) throw new ForbiddenException();

    await this.prisma.receipt.update({
      where: { id },
      data: { status: 'DELETED' },
    });
    return { id, deleted: true };
  }

  @Get(':id/status')
  async getReceiptStatus(
    @Request() req: AuthenticatedRequest,
    @Param('id') id: string,
  ) {
    const receipt = await this.prisma.receipt.findUnique({
      where: { id },
      select: { id: true, status: true, userId: true },
    });
    if (!receipt) throw new NotFoundException('Receipt not found');
    if (receipt.userId !== req.user.id) throw new ForbiddenException();
    return { id: receipt.id, status: receipt.status };
  }
}
