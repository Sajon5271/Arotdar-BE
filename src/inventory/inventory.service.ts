import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Inventory } from '../schemas/inventory.schema';
import { Model, SortOrder } from 'mongoose';
import { InventoryLogs } from '../schemas/inventory-logs.schema';
import { TransactionType } from '../enums/Transaction.enum';

@Injectable()
export class InventoryService {
  constructor(
    @InjectModel(Inventory.name) private inventory: Model<Inventory>,
    @InjectModel(InventoryLogs.name)
    private inventoryLogs: Model<InventoryLogs>,
  ) {}

  async addNewProduct(product: Inventory): Promise<Inventory> {
    const newProduct = await this.inventory.create(product);
    await this.inventoryLogs.create({
      productId: newProduct._id,
      productName: product.productName,
      transactionType: TransactionType.Buy,
      quantityTraded: product.quantity,
      totalQuantity: product.quantity,
      pricePerUnit: product.currentPricePerUnit,
    });
    return newProduct;
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
    isASell: boolean,
  ): Promise<Inventory> {
    const product = await this.inventory.findById(id);
    if (!product) throw new NotFoundException('Product not found');
    await this.inventoryLogs.create({
      productId: product._id,
      productName: product.productName,
      transactionType: isASell ? TransactionType.Sell : TransactionType.Buy,
      quantityTraded: quantity,
      totalQuantity: isASell
        ? product.quantity - quantity
        : product.quantity + quantity,
      pricePerUnit: product.currentPricePerUnit,
    });
    return product;
  }

  async updatePrice(id: string, newPrice: number): Promise<Inventory> {
    return await this.updateProduct(id, { currentPricePerUnit: newPrice });
  }

  async getLogsForProduct(
    productId: string,
    sortOrder: SortOrder = 'asc',
  ): Promise<InventoryLogs[]> {
    return await this.inventoryLogs
      .find({ productId })
      .sort({ createdAt: sortOrder });
  }
}
