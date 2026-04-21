import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './interface-adapters/rest/auth/auth.module';
import { CategoriesModule } from './interface-adapters/rest/categories/categories.module';
import { HealthModule } from './interface-adapters/rest/health/health.module';
import { ReceiptsModule } from './interface-adapters/rest/receipts/receipts.module';
import { PrismaModule } from './infrastructure/database/prisma.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    HealthModule,
    AuthModule,
    ReceiptsModule,
    CategoriesModule,
  ],
})
export class AppModule {}
