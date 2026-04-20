import { Result, ValidationError, CurrencyMismatchError } from './shared';

export class Email {
  private constructor(private readonly value: string) {}

  static create(email: string): Result<Email, ValidationError> {
    const normalized = email.trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(normalized)) {
      return Result.fail(new ValidationError('Invalid email format'));
    }
    return Result.ok(new Email(normalized));
  }

  getDomain(): string {
    return this.value.split('@')[1];
  }

  toString(): string {
    return this.value;
  }
}

export class Money {
  private constructor(
    public readonly amount: bigint,
    public readonly currency: string
  ) {}

  static create(amount: number, currency: string): Result<Money, ValidationError> {
    // Basic scaling to bigint assuming 4 decimal places for precision based on schema
    const scaledAmount = BigInt(Math.round(amount * 10000));
    return Result.ok(new Money(scaledAmount, currency.toUpperCase()));
  }

  add(other: Money): Result<Money, CurrencyMismatchError> {
    if (this.currency !== other.currency) {
      return Result.fail(new CurrencyMismatchError());
    }
    return Result.ok(new Money(this.amount + other.amount, this.currency));
  }

  multiply(factor: number): Money {
    const newAmount = BigInt(Math.round(Number(this.amount) * factor));
    return new Money(newAmount, this.currency);
  }

  toJSON(): { amount: string; currency: string } {
    return {
      amount: (Number(this.amount) / 10000).toString(),
      currency: this.currency,
    };
  }
}

export class ImageReference {
  private constructor(
    public readonly bucket: string,
    public readonly key: string,
    public readonly checksum: string,
    public readonly encryptionVersion: string
  ) {}

  static create(bucket: string, key: string, checksum: string, encryptionVersion: string): Result<ImageReference, Error> {
    return Result.ok(new ImageReference(bucket, key, checksum, encryptionVersion));
  }

  getUri(): string {
    return `s3://${this.bucket}/${this.key}`;
  }
}
