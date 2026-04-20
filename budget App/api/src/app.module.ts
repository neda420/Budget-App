import { Module } from '@nestjs/common';
import { AuthModule } from './interface-adapters/rest/auth/auth.module';
import { CategoriesModule } from './interface-adapters/rest/categories/categories.module';
import { HealthModule } from './interface-adapters/rest/health/health.module';
import { ReceiptsModule } from './interface-adapters/rest/receipts/receipts.module';

@Module({
  imports: [HealthModule, AuthModule, ReceiptsModule, CategoriesModule],
})
export class AppModule {}
