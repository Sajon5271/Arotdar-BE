import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { BuyLogs } from '../../schemas/buy-logs.schema';
import { Model } from 'mongoose';
import { InventoryService } from '../../inventory/inventory.service';
import { BuyProductDTO } from '../dtos/buy-products.dto';
import { ProductLotService } from './product-lot.service';

@Injectable()
export class BuyService {
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
    return await this.buyLogs.create({
      ...info,
      affectedLotIds: newLots,
      updatedBy: userId,
    });
  }

  async getAll() {
    return this.buyLogs.find({}).sort('-createdAt');
  }

  async getById(transactionId: string) {
    return this.buyLogs.findById(transactionId);
  }
  async getForPartner(partnerId: string) {
    return this.buyLogs.find({ partnerId }).sort('-createdAt');
  }
}
