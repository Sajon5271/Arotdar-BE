import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  InventoryLogs,
  InventoryLogsSchema,
} from '../schemas/inventory-logs.schema';
import { Inventory, InventorySchema } from '../schemas/inventory.schema';
import { InventoryLogsService } from './inventory-logs.service';
import { InventoryController } from './inventory.controller';
import { InventoryService } from './inventory.service';
import { ProductLotService } from '../transaction-logs/services/product-lot.service';
import {
  ProductLotInfo,
  ProductLotSchema,
} from '../schemas/product-lot.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Inventory.name, schema: InventorySchema },
      { name: InventoryLogs.name, schema: InventoryLogsSchema },
      { name: ProductLotInfo.name, schema: ProductLotSchema },
    ]),
  ],
  controllers: [InventoryController],
  providers: [InventoryService, InventoryLogsService, ProductLotService],
  exports: [InventoryService, InventoryLogsService],
})
export class InventoryModule {}
