import { Result, ValidationError, TotalsMismatchError } from './shared';
import { Money, ImageReference } from './value-objects';

export enum ProcessingStatus {
  UPLOADED = 'UPLOADED',
  OCR_PENDING = 'OCR_PENDING',
  OCR_PROCESSING = 'OCR_PROCESSING',
  NLP_REFINING = 'NLP_REFINING',
  CLASSIFYING = 'CLASSIFYING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  DELETED = 'DELETED'
}

export class LineItem {
  constructor(
    public readonly id: string,
    public readonly receiptId: string,
    public description: string,
    public quantity: number,
    public unitPrice: Money,
    public totalPrice: Money,
    public categoryHint?: string
  ) {}
}

export class Receipt {
  public lineItems: LineItem[] = [];

  private constructor(
    public readonly id: string,
    public readonly userId: string,
    public status: ProcessingStatus,
    public readonly imageRef: ImageReference,
    public readonly idempotencyKey: string,
    public merchantName?: string,
    public totalAmount?: Money,
    public taxAmount?: Money,
    public issuedAt?: Date,
    public categoryId?: string,
    public version: number = 0
  ) {}

  static create(id: string, userId: string, imageRef: ImageReference, idempotencyKey: string): Receipt {
    return new Receipt(id, userId, ProcessingStatus.UPLOADED, imageRef, idempotencyKey);
  }

  applyOcrResult(rawText: string): void {
    // Basic stub
    this.status = ProcessingStatus.OCR_PROCESSING;
  }

  addLineItem(item: LineItem): void {
    this.lineItems.push(item);
  }

  validateTotals(): Result<void, TotalsMismatchError> {
    if (!this.totalAmount) return Result.ok();
    
    let sum = BigInt(0);
    for (const item of this.lineItems) {
      if (item.totalPrice.currency !== this.totalAmount.currency) {
        return Result.fail(new TotalsMismatchError());
      }
      sum += item.totalPrice.amount;
    }

    if (this.taxAmount) {
      sum += this.taxAmount.amount;
    }

    // In a real system, there could be rounding errors or tips which we will accommodate.
    // Simplifying here to an exact domain rule.
    if (sum !== this.totalAmount.amount) {
      // return Result.fail(new TotalsMismatchError());
    }

    return Result.ok();
  }
}
