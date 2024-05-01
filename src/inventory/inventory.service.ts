import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Inventory } from '../schemas/inventory.schema';

@Injectable()
export class InventoryService {
  constructor(
    @InjectModel(Inventory.name) private readonly inventory: Model<Inventory>,
  ) {}

  async addNewProduct(product: Partial<Inventory>): Promise<Inventory> {
    product.lotIdsContainingProduct = [];
    const newProduct = await this.inventory.create(product);
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
  ): Promise<Inventory> {
    try {
      const product = await this.inventory.findById(id);
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
  ): Promise<Inventory> {
    const product = await this.inventory.findById(id);
    if (!product) throw new NotFoundException('Product not found');
    product.totalCurrentQuantity -= isSelling ? quantity : -1 * quantity;
    await product.save();
    return product;
  }

  async buyingInventory(
    id: string,
    quantity: number,
    newLotId: string,
  ): Promise<Inventory> {
    const product = await this.inventory.findById(id);
    if (!product) throw new NotFoundException('Product not found');
    if (quantity) {
      product.totalCurrentQuantity += quantity;
      product.lotIdsContainingProduct.push(newLotId);
    }
    await product.save();
    return product;
  }

  async sellingInventory(
    id: string,
    quantity: number,
    currentLotIdsRemaining: string[],
  ): Promise<Inventory> {
    const product = await this.inventory.findById(id);
    if (!product) throw new NotFoundException('Product not found');
    if (quantity) {
      product.totalCurrentQuantity = quantity;
      product.lotIdsContainingProduct = currentLotIdsRemaining;
    }
    await product.save();
    return product;
  }

  async updatePrice(id: string, newPrice: number): Promise<Inventory> {
    return await this.updateProduct(id, { currentPricePerUnit: newPrice });
  }
}
