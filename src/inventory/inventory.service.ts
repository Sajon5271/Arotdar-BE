import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { TransactionType } from '../enums/Transaction.enum';
import { InventoryLogType } from '../schemas/inventory-logs.schema';
import { Inventory } from '../schemas/inventory.schema';
import { InventoryLogsService } from './inventory-logs.service';

@Injectable()
export class InventoryService {
  constructor(
    @InjectModel(Inventory.name) private readonly inventory: Model<Inventory>,
    private inventoryLogsService: InventoryLogsService,
  ) {}

  async addNewProduct(
    product: Partial<Inventory>,
    updatedBy: string,
  ): Promise<Inventory> {
    product.lotIdsContainingProduct = [];
    const newProduct = await this.inventory.create(product);
    // await this.inventoryLogsService.createNewLog({
    //   productId: newProduct._id,
    //   productName: product.productName,
    //   transactionType: TransactionType.Buy,
    //   quantityTraded: product.totalQuantity,
    //   totalQuantity: product.totalQuantity,
    //   pricePerUnit: product.currentPricePerUnit,
    //   logType: InventoryLogType.Creation,
    //   updatedBy,
    // });
    return newProduct;
  }

  async getAllProduct(): Promise<Inventory[]> {
    return this.inventory.find({});
  }
  async getProductById(id: string): Promise<Inventory> {
    return this.inventory.findById(id);
  }

  async updateProduct(
    id: string,
    updatedValues: Partial<Inventory>,
    updatedBy: string,
  ): Promise<Inventory> {
    try {
      const product = await this.inventory.findById(id);
      const isSelling =
        updatedValues.quantity && updatedValues.quantity < product.quantity;
      await this.inventoryLogsService.createNewLog({
        productId: product._id,
        productName: product.productName,
        transactionType: isSelling ? TransactionType.Sell : TransactionType.Buy,
        quantityTraded: Math.abs(
          updatedValues.quantity || 0 - product.quantity,
        ),
        totalQuantity: isSelling
          ? product.quantity - updatedValues.quantity
          : product.quantity + updatedValues.quantity,
        pricePerUnit: product.currentPricePerUnit,
        logType:
          updatedValues.quantity && product.quantity !== updatedValues.quantity
            ? InventoryLogType.QuantityUpdate
            : updatedValues.currentPricePerUnit &&
                product.currentPricePerUnit !==
                  updatedValues.currentPricePerUnit
              ? InventoryLogType.PriceUpdate
              : InventoryLogType.GeneralUpdate,
        updatedBy,
      });
      if (!product) throw new Error();
      for (const key in Object.keys(updatedValues)) {
        product[key] = updatedValues[key];
      }
      await product.save();
      return product;
    } catch (err) {
      throw new NotFoundException('Could not find Product');
    }
  }

  async updateQuantity(
    id: string,
    quantity: number,
    isSelling: boolean,
    updatedBy: string,
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
      logType: InventoryLogType.QuantityUpdate,
      updatedBy,
    });
    product.quantity = isSelling
      ? product.quantity - quantity
      : product.quantity + quantity;
    await product.save();
    return product;
  }

  async updatePrice(
    id: string,
    newPrice: number,
    updatedBy: string,
  ): Promise<Inventory> {
    return await this.updateProduct(
      id,
      { currentPricePerUnit: newPrice },
      updatedBy,
    );
  }
}
