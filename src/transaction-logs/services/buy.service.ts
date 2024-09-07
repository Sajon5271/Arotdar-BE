import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { BuyLogs } from '../../schemas/buy-logs.schema';
import { Model } from 'mongoose';
import { InventoryService } from '../../inventory/inventory.service';
import { BuyProductDTO } from '../dtos/buy-products.dto';
import { ProductLotService } from './product-lot.service';
import { TradedProduct } from '../../schemas/partials/TradedProduct.schema';
import { TradingPartnersService } from '../../trading-partners/trading-partners.service';

@Injectable()
export class BuyService {
  constructor(
    @InjectModel(BuyLogs.name) private readonly buyLogs: Model<BuyLogs>,
    private inventoryService: InventoryService,
    private productLotService: ProductLotService,
    private tradingPartnersService: TradingPartnersService,
  ) {}

  async buyProducts(info: BuyProductDTO, userId: string) {
    const allProducts = await this.inventoryService.getAllProduct();
    const allProductNameMap = allProducts.reduce((acc, curr) => {
      return { ...acc, [curr._id]: curr.productName };
    }, {});
    const lots = await this.productLotService.addMultipleNewLot(
      info.products.map((prod) => {
        return {
          price: prod.pricePerUnit,
          productId: prod.productId,
          quantity: prod.quantityTraded,
        };
      }),
      info.partnerId,
    );
    const lotIds = lots.map((lot) => lot._id);
    const lotProductMaps = lots.map((el) => {
      return {
        id: el.lotProductId,
        quantity: el.quantityBought,
        newLotId: el._id.toString(),
      };
    });
    await this.inventoryService.buyingMultipleInventory(
      lotProductMaps,
      info.partnerId,
    );
    const productsToSave: TradedProduct[] = [];
    info.products.forEach(async (product) => {
      productsToSave.push({
        ...product,
        productName: allProductNameMap[product.productId],
      });
    });

    await this.tradingPartnersService.updatePartnerWithNewTransaction(
      info.partnerId,
      info.products.reduce((a, c) => a + c.quantityTraded, 0),
      info.due,
      info.paid,
    );

    return await this.buyLogs.create({
      ...info,
      products: productsToSave,
      affectedLotIds: lotIds,
      updatedBy: userId,
    });
  }

  async getAll(sortBy: string = '-createdAt'): Promise<BuyLogs[]> {
    try {
      // TODO: Take care of sorting while caching
      return await this.buyLogs.find({}).sort(sortBy);
    } catch (error) {
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
