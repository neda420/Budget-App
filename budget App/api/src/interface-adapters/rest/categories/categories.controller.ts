import {
  Body,
  Controller,
  ConflictException,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../../infrastructure/auth/jwt-auth.guard';
import { PrismaService } from '../../../infrastructure/database/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';

interface AuthenticatedRequest {
  user: { id: string; email: string };
}

@UseGuards(JwtAuthGuard)
@Controller('categories')
export class CategoriesController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  async listCategories(@Request() req: AuthenticatedRequest) {
    const categories = await this.prisma.expenseCategory.findMany({
      where: {
        OR: [{ userId: req.user.id }, { type: 'SYSTEM' }],
      },
      orderBy: [{ type: 'asc' }, { name: 'asc' }],
    });

    return categories.map((c) => ({
      id: c.id,
      name: c.name,
      type: c.type === 'USER_DEFINED' ? 'USER_DEFINED' : 'SYSTEM',
    }));
  }

  @Post()
  async createCategory(
    @Request() req: AuthenticatedRequest,
    @Body() dto: CreateCategoryDto,
  ) {
    const existing = await this.prisma.expenseCategory.findFirst({
      where: { userId: req.user.id, name: dto.name },
    });
    if (existing) throw new ConflictException('Category already exists');

    const category = await this.prisma.expenseCategory.create({
      data: {
        userId: req.user.id,
        name: dto.name,
        type: 'USER_DEFINED',
      },
    });

    return {
      id: category.id,
      name: category.name,
      type: 'USER_DEFINED' as const,
    };
  }
}
