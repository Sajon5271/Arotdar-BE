import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, SortOrder } from 'mongoose';
import { InventoryLogs } from '../schemas/inventory-logs.schema';

@Injectable()
export class InventoryLogsService {
  constructor(
    @InjectModel(InventoryLogs.name)
    private inventoryLogs: Model<InventoryLogs>,
  ) {}

  async createNewLog(log: InventoryLogs): Promise<InventoryLogs> {
    return await this.inventoryLogs.create(log);
  }

  async getLogsForAllProduct(
    sortOrder: SortOrder = 'asc',
  ): Promise<InventoryLogs[]> {
    return await this.inventoryLogs.find({}).sort({ createdAt: sortOrder });
  }

  async getLogsForProduct(
    productId: string,
    sortOrder: SortOrder = 'asc',
  ): Promise<InventoryLogs[]> {
    return await this.inventoryLogs
      .find({ productId })
      .sort({ createdAt: sortOrder });
  }
}
