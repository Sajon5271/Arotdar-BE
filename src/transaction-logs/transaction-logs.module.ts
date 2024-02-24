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
import { BuyService } from './services/buy.service';
import { SellService } from './services/sell.service';
import { ProductLotService } from './services/product-lot.service';
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
