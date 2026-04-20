import { Email } from './value-objects';

export enum SubscriptionLevel {
  FREE = 'FREE',
  PRO = 'PRO',
  ENTERPRISE = 'ENTERPRISE'
}

export class User {
  private constructor(
    public readonly id: string,
    public readonly email: Email,
    public subscription: SubscriptionLevel,
    public defaultCurrency: string,
    public readonly createdAt: Date,
    public updatedAt: Date
  ) {}

  static create(id: string, email: Email, subscription: SubscriptionLevel, currency: string = 'USD'): User {
    return new User(id, email, subscription, currency, new Date(), new Date());
  }

  changeSubscription(newLevel: SubscriptionLevel): void {
    this.subscription = newLevel;
    this.updatedAt = new Date();
  }

  canProcessReceipts(): boolean {
    return true; // Simplified for MVP
  }

  getReceiptQuota(): number {
    switch (this.subscription) {
      case SubscriptionLevel.FREE: return 50;
      case SubscriptionLevel.PRO: return 500;
      case SubscriptionLevel.ENTERPRISE: return 5000;
      default: return 50;
    }
  }
}
