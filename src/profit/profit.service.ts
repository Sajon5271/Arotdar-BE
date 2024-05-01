import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { BuyLogs } from '../schemas/buy-logs.schema';
import { Model } from 'mongoose';
import { SellLogs } from '../schemas/sell-logs.schema';
import { ProductLotInfo } from '../schemas/product-lot.schema';

@Injectable()
export class ProfitService {
  constructor(
    @InjectModel(BuyLogs.name) private readonly buyLogs: Model<BuyLogs>,
    @InjectModel(SellLogs.name) private readonly sellLogs: Model<SellLogs>,
    @InjectModel(ProductLotInfo.name)
    private readonly productLot: Model<ProductLotInfo>,
  ) {}

  async getProfitForRange(from: Date, to: Date) {
    const allSellLogsInRange = await this.sellLogs.find({
      createdAt: { $gte: from, $lte: to },
    });
  }
}
