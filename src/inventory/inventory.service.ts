import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Inventory, UpdateInventory } from '../schemas/inventory.schema';
import { ProductDto, UpdateProductDto } from './dtos/product.dto';
import { ProductLotInfo } from '../schemas/product-lot.schema';

@Injectable()
export class InventoryService {
  constructor(
    @InjectModel(Inventory.name) private readonly inventory: Model<Inventory>,
    @InjectModel(ProductLotInfo.name)
    private readonly productLot: Model<ProductLotInfo>,
  ) {}

  async addNewProduct(product: ProductDto): Promise<Inventory> {
    const productToCreate: Inventory = {
      currentPricePerUnit: product.currentPricePerUnit,
      lotIdsContainingProduct: [],
      supplierId: product.supplierId,
      supplierName: product.supplierName,
      productName: product.productName,
      totalCurrentQuantity: product.totalCurrentQuantity || 0,
      productDescription: product.productDescription,
    };
    const newProduct = await this.inventory.create(productToCreate);
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
    updatedValues: UpdateInventory,
  ): Promise<Inventory> {
    try {
      const product = await this.inventory.findById(id);
      if (!product) throw new Error();
      for (const key of Object.keys(updatedValues)) {
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

  async buyingMultipleInventory(
    products: { id: string; quantity: number; newLotId: string }[],
    supplier: string,
  ): Promise<Inventory[]> {
    const productsToUpdate = await this.inventory.find({
      _id: { $in: products.map((el) => el.id) },
    });

    const promisesToSave: Promise<Inventory>[] = [];

    if (!productsToUpdate || !productsToUpdate.length)
      throw new NotFoundException('Products not found');
    productsToUpdate.forEach((product) => {
      const info = products.find((el) => el.id);
      if (!info) return;
      if (info.quantity) {
        product.totalCurrentQuantity += info.quantity;
        product.lotIdsContainingProduct.push(info.newLotId);
      }
      promisesToSave.push(product.save());
    });
    const allUpdatedProducts = await Promise.all(promisesToSave);
    return allUpdatedProducts;
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

  async syncWithLots() {
    const allLots = await this.productLot.find({
      quantityRemaining: { $gt: 0 },
    });
    const allProducts = await this.getAllProduct();

    const inventoryUpdateMap = new Map<string, UpdateInventory>();
    allLots.forEach((lot) => {
      const currentMapVal = inventoryUpdateMap.get(lot.lotProductId);
      if (currentMapVal) {
        currentMapVal.totalCurrentQuantity += lot.quantityRemaining;
        currentMapVal.lotIdsContainingProduct.push(lot._id.toString());
      } else {
        inventoryUpdateMap.set(lot.lotProductId, {
          totalCurrentQuantity: lot.quantityRemaining,
          lotIdsContainingProduct: [lot._id.toString()],
        });
      }
    });
    const inventoryUpdatePromises = [];
    allProducts.forEach((val) => {
      inventoryUpdatePromises.push(
        this.updateProduct(
          val._id,
          inventoryUpdateMap.get(val._id.toString()) || {
            lotIdsContainingProduct: [],
            totalCurrentQuantity: 0,
          },
        ),
      );
    });
    await Promise.all(inventoryUpdatePromises);
  }
}
