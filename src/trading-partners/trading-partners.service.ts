import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { TradingPartner } from '../schemas/trading-partners.schema';
import { Model } from 'mongoose';
import { PartnerType } from '../enums/UserTypes.enum';
import { ProductLotInfo } from '../schemas/product-lot.schema';
import { Inventory } from '../schemas/inventory.schema';

@Injectable()
export class TradingPartnersService {
  allTradingPartnersCache: TradingPartner[] | undefined;

  constructor(
    @InjectModel(TradingPartner.name)
    private readonly tradingPartners: Model<TradingPartner>,
    @InjectModel(ProductLotInfo.name)
    private readonly lotInfo: Model<ProductLotInfo>,
    @InjectModel(Inventory.name)
    private readonly inventory: Model<Inventory>,
  ) {}

  async getAll(): Promise<TradingPartner[]> {
    if (!this.allTradingPartnersCache) {
      this.allTradingPartnersCache = (await this.tradingPartners.find({})).map(
        (doc) => doc.toObject(),
      );
    }
    return this.allTradingPartnersCache;
  }
  async getPartnerById(id: string): Promise<TradingPartner> {
    return await this.tradingPartners.findById(id);
  }

  async getType(partnerType: PartnerType): Promise<TradingPartner[]> {
    return (await this.getAll()).filter((el) => el.partnerType === partnerType);
  }

  async addPartner(partnerDetails: Partial<TradingPartner>) {
    this.allTradingPartnersCache = undefined;
    const newPartner = new this.tradingPartners({
      ...partnerDetails,
      totalCurrentDue: 0,
      totalCurrentSalesQuantity: 0,
      totalTrades: 0,
      totalLifetimePaid: 0,
    });
    await newPartner.save();
    return newPartner;
  }

  async updatePartner(id: string, partnerDetails: Partial<TradingPartner>) {
    this.allTradingPartnersCache = undefined;
    const updatedPartner = await this.tradingPartners.findByIdAndUpdate(
      id,
      partnerDetails,
    );
    if (!updatedPartner) throw new NotFoundException('Partner not found');
    return updatedPartner;
  }

  async updatePartnerDue(id: string, dueChange: number) {
    this.allTradingPartnersCache = undefined;
    const partner = await this.tradingPartners.findById(id);
    if (!partner) throw new NotFoundException('Partner not found');
    partner.totalCurrentDue += dueChange;
    await partner.save();
    return partner;
  }

  async getSupplierWithQuantities() {
    const suppliers = await this.getType(PartnerType.Supplier);
    const allProducts = await this.inventory.find();
    const productInfoMap = allProducts.reduce<{
      [key: string]: { productId: string; productName: string };
    }>((acc, curr) => {
      return {
        ...acc,
        [curr._id]: { productId: curr._id, productName: curr.productName },
      };
    }, {});
    const lotsForSuppliersPromises = suppliers.map((el) => {
      return this.lotInfo.find({
        supplierId: el._id,
        // quantityRemaining: { $gt: 0 },
      });
    });
    const allLotData = await Promise.all(lotsForSuppliersPromises);

    return allLotData.map((lot, idx) => {
      return {
        ...suppliers[idx],
        productCurrentStock: Object.entries(
          lot.reduce<{ [key: string]: number }>((acc, curr) => {
            return {
              ...acc,
              [curr.lotProductId]:
                (acc[curr.lotProductId] || 0) + curr.quantityRemaining,
            };
          }, {}),
        ).map(([id, count]) => {
          return { ...productInfoMap[id], count };
        }),
      };
    });
  }

  async updatePartnerWithNewTransaction(
    id: string,
    quantityToAdd: number,
    newDueAmount: number,
    newPaidAmount: number,
  ) {
    this.allTradingPartnersCache = undefined;
    const partner = await this.tradingPartners.findById(id);
    if (!partner) throw new NotFoundException('Partner not found');
    partner.totalCurrentDue += newDueAmount;
    partner.totalCurrentSalesQuantity += quantityToAdd;
    partner.totalLifetimePaid += newPaidAmount;
    partner.totalTrades++;
    await partner.save();
    return partner;
  }

  async deletePartner(id: string) {
    this.allTradingPartnersCache = undefined;
    try {
      await this.tradingPartners.findByIdAndDelete(id);
    } catch (err) {
      console.log(err);
      // Not throwing error since it's a delete operation
    }
    return null;
  }
}
