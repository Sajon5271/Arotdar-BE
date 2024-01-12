import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, SortOrder } from 'mongoose';
import { TransactionType } from '../enums/Transaction.enum';
import { InventoryService } from '../inventory/inventory.service';
import { TransactionLogs } from '../schemas/transaction-logs.schema';
import { TradingPartnersService } from '../trading-partners/trading-partners.service';
import { NewTransactionDto } from './dtos/new-transaction.dto';
import { UpdateDueOfPartners } from './dtos/update-due-amount.dto';
import { CustomerType, PartnerType } from '../enums/UserTypes.enum';

@Injectable()
export class TransactionLogsService {
  constructor(
    @InjectModel(TransactionLogs.name)
    private readonly transactionLogs: Model<TransactionLogs>,
    private inventoryService: InventoryService,
    private tradingPartnersService: TradingPartnersService,
  ) {}

  async getAll(): Promise<TransactionLogs[]> {
    return await this.transactionLogs.find({});
  }

  async getAllOfType(
    transactionType: TransactionType,
    order: SortOrder = 'desc',
  ): Promise<TransactionLogs[]> {
    return await this.transactionLogs
      .find({ transactionType })
      .sort({ createdAt: order });
  }

  async addNewTransaction(data: NewTransactionDto, updatedBy: string) {
    const product = await this.inventoryService.updateQuantity(
      data.productId,
      data.quantityTraded,
      data.transactionType === TransactionType.Sell,
      updatedBy,
    );
    const transactionLog: TransactionLogs = {
      ...data,
      productName: product.productName,
      updatedBy,
    };
    if (data.partnerId) {
      const partner =
        await this.tradingPartnersService.updatePartnerWithNewTransaction(
          data.partnerId,
          data.quantityTraded,
          data.due,
          data.paid,
        );
      transactionLog.partnerName = partner?.name;
    }
    // this.
    return await this.transactionLogs.create(transactionLog);
  }

  async addDueUpdateTransaction(data: UpdateDueOfPartners, updatedBy: string) {
    const partner = await this.tradingPartnersService.uodatePartnerDue(
      data.partnerId,
      data.dueChange,
    );
    return await this.transactionLogs.create({
      transactionType: TransactionType.DuePaymnet,
      partnerType: partner.type,
      customerType:
        partner.type === PartnerType.Customer
          ? CustomerType.Regular
          : undefined,
      partnerId: partner._id,
      partnerName: partner.name,
      quantityTraded: 0,
      pricePerUnit: 0,
      due: 0,
      paid: data.dueChange,
      finalPrice: 0,
      updatedBy,
    });
  }
}
