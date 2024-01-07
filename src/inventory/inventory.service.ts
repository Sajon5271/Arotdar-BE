import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { TransactionType } from '../enums/Transaction.enum';
import { Inventory } from '../schemas/inventory.schema';
import { InventoryLogsService } from './inventory-logs.service';

@Injectable()
export class InventoryService {
  constructor(
    @InjectModel(Inventory.name) private inventory: Model<Inventory>,
    private inventoryLogsService: InventoryLogsService,
  ) {}

  async addNewProduct(product: Inventory): Promise<Inventory> {
    const newProduct = await this.inventory.create(product);
    await this.inventoryLogsService.createNewLog({
      productId: newProduct._id,
      productName: product.productName,
      transactionType: TransactionType.Buy,
      quantityTraded: product.quantity,
      totalQuantity: product.quantity,
      pricePerUnit: product.currentPricePerUnit,
    });
    return newProduct;
  }

  async getAllProduct(): Promise<Inventory[]> {
    return this.inventory.find({});
  }

  async updateProduct(
    id: string,
    updatedValues: Partial<Inventory>,
  ): Promise<Inventory> {
    try {
      const updatedProduct = await this.inventory.findByIdAndUpdate(
        id,
        updatedValues,
      );
      if (!updatedProduct) throw new Error();
      return updatedProduct;
    } catch (err) {
      throw new NotFoundException('Could not find Product');
    }
  }

  async updateQuantity(
    id: string,
    quantity: number,
    isSelling: boolean,
  ): Promise<Inventory> {
    const product = await this.inventory.findById(id);
    if (!product) throw new NotFoundException('Product not found');
    await this.inventoryLogsService.createNewLog({
      productId: product._id,
      productName: product.productName,
      transactionType: isSelling ? TransactionType.Sell : TransactionType.Buy,
      quantityTraded: quantity,
      totalQuantity: isSelling
        ? product.quantity - quantity
        : product.quantity + quantity,
      pricePerUnit: product.currentPricePerUnit,
    });
    product.quantity = isSelling
      ? product.quantity - quantity
      : product.quantity + quantity;
    return await product.save();
  }

  async updatePrice(id: string, newPrice: number): Promise<Inventory> {
    return await this.updateProduct(id, { currentPricePerUnit: newPrice });
  }
}
