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

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Inventory.name, schema: InventorySchema },
      { name: InventoryLogs.name, schema: InventoryLogsSchema },
    ]),
  ],
  controllers: [InventoryController],
  providers: [InventoryService, InventoryLogsService],
  exports: [InventoryService, InventoryLogsService],
})
export class InventoryModule {}
