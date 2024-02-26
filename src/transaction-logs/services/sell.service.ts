import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { InventoryService } from '../../inventory/inventory.service';
import { SellLogs } from '../../schemas/sell-logs.schema';
import { SellProductDTO } from '../dtos/sell-product.dto';
import { ProductLotService } from './product-lot.service';

@Injectable()
export class SellService {
  constructor(
    @InjectModel(SellLogs.name) private readonly sellLogs: Model<SellLogs>,
    private inventoryService: InventoryService,
    private productLotService: ProductLotService,
  ) {}

  async sellProduct(info: SellProductDTO, userId: string) {
    const allLotsToUpdate = await this.productLotService.getLotForProducts(
      info.products.map((el) => el.productId),
    );
    info.products.forEach((item) => {
      const lotForProduct = allLotsToUpdate.filter(
        (lot) => lot.lotProductId === item.productId,
      );
      let productRemainingToCalc = item.quantityTraded;
      for (const lot of lotForProduct) {
        if (!productRemainingToCalc) break;
        const newQuantity =
          productRemainingToCalc < lot.quantityRemaining
            ? lot.quantityRemaining - productRemainingToCalc
            : 0;
        productRemainingToCalc =
          productRemainingToCalc - (lot.quantityRemaining - newQuantity);
        if (newQuantity !== lot.quantityRemaining)
          this.productLotService.updateLotQuantity(lot._id, newQuantity);
        lot.quantityRemaining = newQuantity;
      }
      const remainingQuantity = lotForProduct.filter(
        (el) => el.quantityRemaining > 0,
      );
      this.inventoryService.sellingInventory(
        item.productId,
        remainingQuantity.reduce(
          (acc, curr) => acc + curr.quantityRemaining,
          0,
        ),
        remainingQuantity.map((el) => el._id),
      );
    });
    return this.sellLogs.create({
      ...info,
      lotsUsedInTrade: allLotsToUpdate.map((lot) => lot._id),
      updatedBy: userId,
    });
  }
}
