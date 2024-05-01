import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { InventoryService } from '../../inventory/inventory.service';
import { SellTradeProduct } from '../../schemas/partials/TradedProduct.schema';
import { SellLogs } from '../../schemas/sell-logs.schema';
import { SellProductDTO } from '../dtos/sell-product.dto';
import { ProductLotService } from './product-lot.service';

@Injectable()
export class SellService {
  allSellLogsCache: SellLogs[] | undefined;

  constructor(
    @InjectModel(SellLogs.name) private readonly sellLogs: Model<SellLogs>,
    private inventoryService: InventoryService,
    private productLotService: ProductLotService,
  ) {}

  async sellProduct(info: SellProductDTO, userId: string) {
    const allLotsToUpdate = await this.productLotService.getLotForProducts(
      info.products.map((el) => el.productId),
    );
    const productsToSave: SellTradeProduct[] = [];
    const allProducts = await this.inventoryService.getAllProduct();
    const allProductNameMap = allProducts.reduce((acc, curr) => {
      return { ...acc, [curr._id]: curr.productName };
    }, {});
    info.products.forEach((item) => {
      const lotForProduct = allLotsToUpdate.filter(
        (lot) => lot.lotProductId === item.productId,
      );
      let productRemainingToCalc = item.quantityTraded;
      const buyingPrices = [];
      for (const lot of lotForProduct) {
        if (!productRemainingToCalc) break;
        const newQuantity =
          productRemainingToCalc < lot.quantityRemaining
            ? lot.quantityRemaining - productRemainingToCalc
            : 0;
        productRemainingToCalc =
          productRemainingToCalc - (lot.quantityRemaining - newQuantity);
        buyingPrices.push({
          id: lot._id,
          countSold: lot.quantityRemaining - newQuantity,
          boughtPricePerUnit: lot.buyingPrice,
        });
        if (newQuantity !== lot.quantityRemaining)
          this.productLotService.updateLotQuantity(lot._id, newQuantity);
        lot.quantityRemaining = newQuantity;
      }
      const remainingQuantity = lotForProduct.filter(
        (el) => el.quantityRemaining > 0,
      );
      productsToSave.push({
        ...item,
        productName: allProductNameMap[item.productId],
        buyingPrices,
      });
      this.inventoryService.sellingInventory(
        item.productId,
        remainingQuantity.reduce(
          (acc, curr) => acc + curr.quantityRemaining,
          0,
        ),
        remainingQuantity.map((el) => el._id),
      );
    });
    this.allSellLogsCache = undefined;
    return this.sellLogs.create({
      ...info,
      products: productsToSave,
      lotsUsedInTrade: allLotsToUpdate.map((lot) => lot._id),
      updatedBy: userId,
    });
  }

  async getAll(sortBy: string = '-createdAt'): Promise<SellLogs[]> {
    try {
      // TODO: Take care of sorting while caching
      if (!this.allSellLogsCache) {
        this.allSellLogsCache = await this.sellLogs.find({}).sort(sortBy);
      }
      return this.allSellLogsCache;
    } catch (error) {
      this.allSellLogsCache = undefined;
      throw error;
    }
  }

  async getById(transactionId: string) {
    return this.sellLogs.findById(transactionId);
  }
  async getForPartner(partnerId: string) {
    return this.sellLogs.find({ partnerId }).sort('-createdAt');
  }
}
