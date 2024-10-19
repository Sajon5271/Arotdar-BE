import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { InventoryService } from '../../inventory/inventory.service';
import { SellTradeProduct } from '../../schemas/partials/TradedProduct.schema';
import { SellLogs } from '../../schemas/sell-logs.schema';
import { SellProductDTO } from '../dtos/sell-product.dto';
import { ProductLotService } from './product-lot.service';
import { CustomerType } from '../../enums/UserTypes.enum';
import { TradingPartnersService } from '../../trading-partners/trading-partners.service';

@Injectable()
export class SellService {
  constructor(
    @InjectModel(SellLogs.name) private readonly sellLogs: Model<SellLogs>,
    private inventoryService: InventoryService,
    private productLotService: ProductLotService,
    private tradingPartnersService: TradingPartnersService,
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
        (lot) =>
          lot.lotProductId === item.productId &&
          lot.supplierId === item.supplierId,
      );
      const currentQuantity = lotForProduct.reduce(
        (total, curr) => total + curr.quantityRemaining,
        0,
      );
      if (currentQuantity < item.quantityTraded) {
        throw new BadRequestException('Not enough item available for sale');
      }
    });

    const updateLotPromises = [];
    info.products.forEach((item) => {
      const lotForProduct = allLotsToUpdate.filter(
        (lot) =>
          lot.lotProductId === item.productId &&
          lot.supplierId === item.supplierId,
      );
      let productRemainingToCalc = item.quantityTraded;
      const buyingPrices = [];
      for (const lot of lotForProduct) {
        if (!productRemainingToCalc) {
          break;
        }
        const newQuantity =
          productRemainingToCalc <= lot.quantityRemaining
            ? lot.quantityRemaining - productRemainingToCalc
            : 0;
        productRemainingToCalc =
          productRemainingToCalc - (lot.quantityRemaining - newQuantity);
        buyingPrices.push({
          id: lot._id.toString(),
          countSold: lot.quantityRemaining - newQuantity,
          boughtPricePerUnit: lot.buyingPrice,
        });
        if (newQuantity !== lot.quantityRemaining) {
          updateLotPromises.push(
            this.productLotService.updateLotQuantity(lot._id, newQuantity),
          );
        }
        lot.quantityRemaining = newQuantity;
      }
      productsToSave.push({
        ...item,
        productName: allProductNameMap[item.productId],
        buyingPrices,
      });
    });
    await Promise.all(updateLotPromises);
    await this.inventoryService.syncWithLots();
    if (info.partnerId) {
      await this.tradingPartnersService.updatePartnerWithNewTransaction(
        info.partnerId,
        info.products.reduce((a, c) => a + c.quantityTraded, 0),
        info.due,
        info.paid,
      );
    }
    return this.sellLogs.create({
      ...info,
      customerType: info.partnerId ? CustomerType.Regular : CustomerType.Normal,
      products: productsToSave,
      lotsUsedInTrade: allLotsToUpdate.map((lot) => lot._id),
      updatedBy: userId,
    });
  }

  async getAll(sortBy: string = '-createdAt'): Promise<SellLogs[]> {
    try {
      return await this.sellLogs.find({}).sort(sortBy);
    } catch (error) {
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
