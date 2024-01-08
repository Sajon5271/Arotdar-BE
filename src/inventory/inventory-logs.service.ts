import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, SortOrder } from 'mongoose';
import {
  InventoryLogType,
  InventoryLogs,
} from '../schemas/inventory-logs.schema';

@Injectable()
export class InventoryLogsService {
  constructor(
    @InjectModel(InventoryLogs.name)
    private inventoryLogs: Model<InventoryLogs>,
  ) {}

  async createNewLog(log: InventoryLogs): Promise<InventoryLogs> {
    return await this.inventoryLogs.create(log);
  }

  // For now, just returning the quantity update logs
  async getLogsForAllProduct(
    sortOrder: SortOrder = 'asc',
  ): Promise<InventoryLogs[]> {
    return await this.inventoryLogs
      .find({ logType: InventoryLogType.QuantityUpdate })
      .sort({ createdAt: sortOrder })
      .select({ logType: -1 });
  }

  // For now, just returning the quantity update logs
  async getLogsForProduct(
    productId: string,
    sortOrder: SortOrder = 'asc',
  ): Promise<InventoryLogs[]> {
    return await this.inventoryLogs
      .find({ productId, logType: InventoryLogType.QuantityUpdate })
      .sort({ createdAt: sortOrder })
      .select({ logType: -1 });
  }
}
