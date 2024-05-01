import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { BuyLogs } from '../../schemas/buy-logs.schema';
import { Model } from 'mongoose';
import { InventoryService } from '../../inventory/inventory.service';
import { BuyProductDTO } from '../dtos/buy-products.dto';
import { ProductLotService } from './product-lot.service';

@Injectable()
export class BuyService {
  allBuyLogsCache: BuyLogs[] | undefined;

  constructor(
    @InjectModel(BuyLogs.name) private readonly buyLogs: Model<BuyLogs>,
    private inventoryService: InventoryService,
    private productLotService: ProductLotService,
  ) {}

  async buyProducts(info: BuyProductDTO, userId: string) {
    const newLots = [];
    info.products.forEach(async (product) => {
      const lot = await this.productLotService.addNewLot(
        product.productId,
        product.pricePerUnit,
        product.quantityTraded,
      );
      await this.inventoryService.buyingInventory(
        product.productId,
        product.quantityTraded,
        lot._id,
      );
      newLots.push(lot._id);
    });
    this.allBuyLogsCache = undefined;
    return await this.buyLogs.create({
      ...info,
      affectedLotIds: newLots,
      updatedBy: userId,
    });
  }

  async getAll(sortBy: string = '-createdAt'): Promise<BuyLogs[]> {
    try {
      // TODO: Take care of sorting while caching
      if (!this.allBuyLogsCache) {
        this.allBuyLogsCache = await this.buyLogs.find({}).sort(sortBy);
      }
      return this.allBuyLogsCache;
    } catch (error) {
      this.allBuyLogsCache = undefined;
      throw error;
    }
  }

  async getById(transactionId: string) {
    return this.buyLogs.findById(transactionId);
  }
  async getForPartner(partnerId: string) {
    return this.buyLogs.find({ partnerId }).sort('-createdAt');
  }
}
