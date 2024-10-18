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

  async getAllOfTypeForDateRange(
    transactionType: TransactionType,
    dateFrom: string,
    dateTo: string,
    pageNumber: number = 0,
    pageSize: number = 10,
    order: SortOrder = 'desc',
  ): Promise<TransactionLogs[]> {
    return await this.transactionLogs
      .find({ transactionType, createdAt: { $gte: dateFrom, $lte: dateTo } })
      .sort({ createdAt: order })
      .skip(pageNumber * pageSize)
      .limit(pageSize);
  }

  async getAllofTypeForPartner(
    transactionType: TransactionType,
    partnerId: string,
    order: SortOrder = 'desc',
  ) {
    return await this.transactionLogs
      .find({ transactionType, partnerId })
      .sort({ createdAt: order });
  }
  async getAllofTypeForPartnerForDateRange(
    transactionType: TransactionType,
    partnerId: string,
    dateFrom: string,
    dateTo: string,
    pageNumber: number = 0,
    pageSize: number = 10,
    order: SortOrder = 'desc',
  ) {
    return await this.transactionLogs
      .find({
        transactionType,
        partnerId,
        createdAt: { $gte: dateFrom, $lte: dateTo },
      })
      .sort({ createdAt: order })
      .skip(pageNumber * pageSize)
      .limit(pageSize);
  }

  async addNewTransaction(data: NewTransactionDto, updatedBy: string) {
    // const product = await this.inventoryService.updateQuantity(
    //   data.productId,
    //   data.quantityTraded,
    //   data.transactionType === TransactionType.Sell,
    //   updatedBy,
    // );
    // const transactionLog: TransactionLogs = {
    //   ...data,
    //   productName: product.productName,
    //   updatedBy,
    // };
    // if (data.partnerId) {
    //   const partner =
    //     await this.tradingPartnersService.updatePartnerWithNewTransaction(
    //       data.partnerId,
    //       data.quantityTraded,
    //       data.due,
    //       data.paid,
    //     );
    //   transactionLog.partnerName = partner?.name;
    // }
    // this.
    // return await this.transactionLogs.create(transactionLog);
  }

  async addDueUpdateTransaction(data: UpdateDueOfPartners, updatedBy: string) {
    const partner = await this.tradingPartnersService.updatePartnerDue(
      data.partnerId,
      data.dueChange,
    );
    return await this.transactionLogs.create({
      transactionType: TransactionType.DuePayment,
      partnerType: partner.partnerType,
      customerType:
        partner.partnerType === PartnerType.Customer
          ? CustomerType.Regular
          : undefined,
      partnerId: partner._id.toString(),
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
