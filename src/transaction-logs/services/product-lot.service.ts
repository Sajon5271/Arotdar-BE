import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ProductLotInfo } from '../../schemas/product-lot.schema';
import { Model } from 'mongoose';

@Injectable()
export class ProductLotService {
  constructor(
    @InjectModel(ProductLotInfo.name)
    private readonly productLot: Model<ProductLotInfo>,
  ) {}

  async addNewLot(productId: string, price: number, quantity: number) {
    return this.productLot.create({
      lotProductId: productId,
      buyingPrice: price,
      quantityBought: quantity,
      quantityRemaining: quantity,
    });
  }

  async getLotForProducts(productIds: string[]) {
    return this.productLot
      .find({
        lotProductId: { $in: productIds },
        quantityRemaining: { $gt: 0 },
      })
      .sort('-createdAt');
  }

  async updateLotQuantity(id: string, newQuantity: number) {
    return this.productLot.findByIdAndUpdate(id, {
      quantityRemaining: newQuantity,
    });
  }
}
