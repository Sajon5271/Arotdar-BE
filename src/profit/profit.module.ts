import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  ProductLotInfo,
  ProductLotSchema,
} from '../schemas/product-lot.schema';
import { SellLogs, SellLogSchema } from '../schemas/sell-logs.schema';
import { ProfitController } from './profit.controller';
import { ProfitService } from './profit.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: SellLogs.name, schema: SellLogSchema },
      { name: ProductLotInfo.name, schema: ProductLotSchema },
    ]),
  ],
  controllers: [ProfitController],
  providers: [ProfitService],
})
export class ProfitModule {}
