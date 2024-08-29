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
      { name: ProductLotInfo.name, schema: ProductLotSchema },
    ]),
    MongooseModule.forFeatureAsync([
      {
        name: SellLogs.name,
        useFactory: () => {
          const schema = SellLogSchema;
          schema.pre('save', {}, async function () {
            const latestDocWithSerial = await this.model()
              .find({})
              .sort('-serial')
              .limit(1);
            this.serial = (latestDocWithSerial[0]?.serial || 0) + 1;
          });
          return schema;
        },
      },
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
