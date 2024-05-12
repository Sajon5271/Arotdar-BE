import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { InventoryModule } from '../inventory/inventory.module';
import { BuyLogs, BuyLogsSchema } from '../schemas/buy-logs.schema';
import {
  ProductLotInfo,
  ProductLotSchema,
} from '../schemas/product-lot.schema';
import { SellLogSchema, SellLogs } from '../schemas/sell-logs.schema';
import {
  TransactionLogSchema,
  TransactionLogs,
} from '../schemas/transaction-logs.schema';
import { TradingPartnersModule } from '../trading-partners/trading-partners.module';
import { BuyService } from './services/buy.service';
import { ProductLotService } from './services/product-lot.service';
import { SellService } from './services/sell.service';
import { TransactionLogsController } from './transaction-logs.controller';
import { TransactionLogsService } from './transaction-logs.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: TransactionLogs.name, schema: TransactionLogSchema },
      { name: BuyLogs.name, schema: BuyLogsSchema },
      { name: SellLogs.name, schema: SellLogSchema },
      { name: ProductLotInfo.name, schema: ProductLotSchema },
    ]),
    InventoryModule,
    TradingPartnersModule,
  ],
  controllers: [TransactionLogsController],
  providers: [
    TransactionLogsService,
    BuyService,
    SellService,
    ProductLotService,
  ],
})
export class TransactionLogsModule {}
