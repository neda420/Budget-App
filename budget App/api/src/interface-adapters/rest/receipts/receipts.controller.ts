import { Controller, Delete, Get, Param, Post } from '@nestjs/common';

@Controller('receipts')
export class ReceiptsController {
  @Post()
  uploadReceipt() {
    return {
      id: 'scaffolded-receipt-id',
      status: 'UPLOADED',
    };
  }

  @Get()
  listReceipts() {
    return [];
  }

  @Get(':id')
  getReceiptById(@Param('id') id: string) {
    return { id, status: 'UPLOADED' };
  }

  @Delete(':id')
  deleteReceipt(@Param('id') id: string) {
    return { id, deleted: true };
  }

  @Get(':id/status')
  getReceiptStatus(@Param('id') id: string) {
    return { id, status: 'UPLOADED' };
  }
}
