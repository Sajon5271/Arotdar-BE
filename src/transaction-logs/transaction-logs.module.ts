import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { InventoryModule } from '../inventory/inventory.module';
import {
  TransactionLogSchema,
  TransactionLogs,
} from '../schemas/transaction-logs.schema';
import { TransactionLogsController } from './transaction-logs.controller';
import { TransactionLogsService } from './transaction-logs.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: TransactionLogs.name, schema: TransactionLogSchema },
    ]),
    InventoryModule,
  ],
  controllers: [TransactionLogsController],
  providers: [TransactionLogsService],
})
export class TransactionLogsModule {}
