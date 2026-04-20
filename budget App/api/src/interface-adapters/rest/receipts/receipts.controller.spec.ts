import { Test, TestingModule } from '@nestjs/testing';
import { ReceiptsController } from './receipts.controller';

describe('ReceiptsController', () => {
  let controller: ReceiptsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReceiptsController],
    }).compile();

    controller = module.get<ReceiptsController>(ReceiptsController);
  });

  it('returns scaffolded upload response', () => {
    expect(controller.uploadReceipt()).toEqual({
      id: 'scaffolded-receipt-id',
      status: 'UPLOADED',
    });
  });

  it('returns empty receipts list', () => {
    expect(controller.listReceipts()).toEqual([]);
  });

  it('returns scaffolded receipt by id', () => {
    expect(controller.getReceiptById('r-1')).toEqual({
      id: 'r-1',
      status: 'UPLOADED',
    });
  });

  it('returns scaffolded delete response', () => {
    expect(controller.deleteReceipt('r-1')).toEqual({
      id: 'r-1',
      deleted: true,
    });
  });

  it('returns scaffolded receipt status', () => {
    expect(controller.getReceiptStatus('r-1')).toEqual({
      id: 'r-1',
      status: 'UPLOADED',
    });
  });
});
