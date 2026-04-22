import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { ReceiptsController } from './receipts.controller';

@Module({
  imports: [
    MulterModule.register({
      limits: { fileSize: 20 * 1024 * 1024 }, // 20 MB
    }),
  ],
  controllers: [ReceiptsController],
})
export class ReceiptsModule {}
