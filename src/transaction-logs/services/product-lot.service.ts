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
  async addMultipleNewLot(
    products: {
      productId: string;
      price: number;
      quantity: number;
      supplierId: string;
    }[],
  ) {
    return this.productLot.insertMany(
      products.map((p) => {
        return {
          lotProductId: p.productId,
          buyingPrice: p.price,
          quantityBought: p.quantity,
          quantityRemaining: p.quantity,
          supplierId: p.supplierId,
        };
      }),
    );
  }

  async getLotForProducts(productIds: string[]) {
    return this.productLot
      .find({
        lotProductId: { $in: productIds },
        quantityRemaining: { $gt: 0 },
      })
      .sort('-createdAt');
  }

  async getProductCountForSupplier(
    productId: string,
    supplierId: string,
  ): Promise<number> {
    const allProductsForSupplier = await this.productLot.find({
      lotProductId: productId,
      supplierId,
      quantityRemaining: { $gt: 0 },
    });
    if (!allProductsForSupplier) return 0;
    return allProductsForSupplier.reduce(
      (total, curr) => total + curr.quantityRemaining,
      0,
    );
  }

  async updateLotQuantity(id: string, newQuantity: number) {
    return this.productLot.findByIdAndUpdate(id, {
      quantityRemaining: newQuantity,
    });
  }
}
