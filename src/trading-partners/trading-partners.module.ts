import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  TradingPartner,
  TradingPartnerSchema,
} from '../schemas/trading-partners.schema';
import { TradingPartnersController } from './trading-partners.controller';
import { TradingPartnersService } from './trading-partners.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: TradingPartner.name, schema: TradingPartnerSchema },
    ]),
  ],
  controllers: [TradingPartnersController],
  providers: [TradingPartnersService],
  exports: [],
})
export class TradingPartnersModule {}
