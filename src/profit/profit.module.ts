import { Module } from '@nestjs/common';
import { ProfitController } from './profit.controller';
import { ProfitService } from './profit.service';
import { MongooseModule } from '@nestjs/mongoose';
import {
  TransactionLogs,
  TransactionLogSchema,
} from '../schemas/transaction-logs.schema';
import { BuyLogs, BuyLogsSchema } from '../schemas/buy-logs.schema';
import { SellLogs, SellLogSchema } from '../schemas/sell-logs.schema';
import {
  ProductLotInfo,
  ProductLotSchema,
} from '../schemas/product-lot.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: TransactionLogs.name, schema: TransactionLogSchema },
      { name: BuyLogs.name, schema: BuyLogsSchema },
      { name: SellLogs.name, schema: SellLogSchema },
      { name: ProductLotInfo.name, schema: ProductLotSchema },
    ]),
  ],
  controllers: [ProfitController],
  providers: [ProfitService],
})
export class ProfitModule {}
