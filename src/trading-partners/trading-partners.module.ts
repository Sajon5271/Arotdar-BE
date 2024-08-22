import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  TradingPartner,
  TradingPartnerSchema,
} from '../schemas/trading-partners.schema';
import { TradingPartnersController } from './trading-partners.controller';
import { TradingPartnersService } from './trading-partners.service';
import {
  ProductLotInfo,
  ProductLotSchema,
} from '../schemas/product-lot.schema';
import { Inventory, InventorySchema } from '../schemas/inventory.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: TradingPartner.name, schema: TradingPartnerSchema },
      { name: ProductLotInfo.name, schema: ProductLotSchema },
      { name: Inventory.name, schema: InventorySchema },
    ]),
  ],
  controllers: [TradingPartnersController],
  providers: [TradingPartnersService],
  exports: [TradingPartnersService],
})
export class TradingPartnersModule {}
