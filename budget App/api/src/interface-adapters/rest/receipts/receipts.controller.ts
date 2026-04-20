import { Controller, Delete, Get, Param, Post } from '@nestjs/common';

@Controller('receipts')
export class ReceiptsController {
  private getScaffoldedReceipt(id: string) {
    return { id, status: 'UPLOADED' };
  }

  @Post()
  uploadReceipt() {
    return this.getScaffoldedReceipt('scaffolded-receipt-id');
  }

  @Get()
  listReceipts() {
    return [];
  }

  @Get(':id')
  getReceiptById(@Param('id') id: string) {
    return this.getScaffoldedReceipt(id);
  }

  @Delete(':id')
  deleteReceipt(@Param('id') id: string) {
    return { id, deleted: true };
  }

  @Get(':id/status')
  getReceiptStatus(@Param('id') id: string) {
    const receipt = this.getScaffoldedReceipt(id);
    return { id: receipt.id, status: receipt.status };
  }
}
