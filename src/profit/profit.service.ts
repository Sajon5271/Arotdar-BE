import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ProductLotInfo } from '../schemas/product-lot.schema';
import { SellLogs } from '../schemas/sell-logs.schema';
import { DateRangeDto } from './dtos/date-range.dto';
import { DateTime } from 'luxon';

@Injectable()
export class ProfitService {
  constructor(
    @InjectModel(SellLogs.name) private readonly sellLogs: Model<SellLogs>,
    @InjectModel(ProductLotInfo.name)
    private readonly productLot: Model<ProductLotInfo>,
  ) {}

  getProfitForRange(from: string, to: string): Promise<SellLogs[]> {
    return this.sellLogs
      .find({
        createdAt: { $gte: from, $lte: to },
      })
      .sort('-createdAt');
  }

  async getProfitsForYearView(range: DateRangeDto) {
    const allLogs = await this.getProfitForRange(range.from, range.to);
    const monthProfitObj = {};
    let currTime = DateTime.now().startOf('year');
    while (currTime < DateTime.now().endOf('year')) {
      monthProfitObj[currTime.toFormat('LLL')] = null;
      currTime = currTime.plus({ month: 1 });
    }
    allLogs.forEach((sell) => {
      const profitForSell = sell.products.reduce((acc, curr) => {
        const buyingPrice = curr.buyingPrices.reduce((a, c) => {
          return a + c.countSold * c.boughtPricePerUnit;
        }, 0);
        return (
          acc +
          (curr.pricePerUnit * curr.quantityTraded -
            curr.discount -
            buyingPrice)
        );
      }, 0);
      const createdDateTime = DateTime.fromJSDate(sell.createdAt);
      const sellMonth = createdDateTime.toFormat('LLL');
      monthProfitObj[sellMonth] =
        monthProfitObj[sellMonth] || 0 + profitForSell;
    });
    return Object.values<number>(monthProfitObj);
  }

  async getProfitForCustomRange(range: DateRangeDto) {
    const allLogs = await this.getProfitForRange(range.from, range.to);
    let fromDateTime = DateTime.fromISO(range.from).startOf('day');
    const toDateTime = DateTime.fromISO(range.to).endOf('day');
    const profitObjForDays = {};
    while (fromDateTime <= toDateTime) {
      profitObjForDays[fromDateTime.toFormat('D')] = null;
      fromDateTime = fromDateTime.plus({ day: 1 });
    }
    allLogs.forEach((sell) => {
      const profitForSell = sell.products.reduce((acc, curr) => {
        const buyingPrice = curr.buyingPrices.reduce((a, c) => {
          return a + c.countSold * c.boughtPricePerUnit;
        }, 0);
        return (
          acc +
          (curr.pricePerUnit * curr.quantityTraded -
            curr.discount -
            buyingPrice)
        );
      }, 0);
      const createdDateTime = DateTime.fromJSDate(sell.createdAt);
      const sellDate = createdDateTime.toFormat('D');
      profitObjForDays[sellDate] =
        profitObjForDays[sellDate] || 0 + profitForSell;
    });
    return Object.values<number>(profitObjForDays);
  }
}
