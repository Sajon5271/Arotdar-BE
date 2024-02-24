import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { InventoryModule } from '../inventory/inventory.module';
import {
  TransactionLogSchema,
  TransactionLogs,
} from '../schemas/transaction-logs.schema';
import { TransactionLogsController } from './transaction-logs.controller';
import { TransactionLogsService } from './transaction-logs.service';
import { TradingPartnersModule } from '../trading-partners/trading-partners.module';
import { BuyLogs, BuyLogsSchema } from '../schemas/buy-logs.schema';
import { SellLogSchema, SellLogs } from '../schemas/sell-logs.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: TransactionLogs.name, schema: TransactionLogSchema },
      { name: BuyLogs.name, schema: BuyLogsSchema },
      { name: SellLogs.name, schema: SellLogSchema },
    ]),
    InventoryModule,
    TradingPartnersModule,
  ],
  controllers: [TransactionLogsController],
  providers: [TransactionLogsService],
})
export class TransactionLogsModule {}
