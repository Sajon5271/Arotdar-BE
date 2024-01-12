import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { TradingPartner } from '../schemas/trading-partners.schema';
import { Model } from 'mongoose';
import { PartnerType } from '../enums/UserTypes.enum';

@Injectable()
export class TradingPartnersService {
  constructor(
    @InjectModel(TradingPartner.name)
    private readonly tradingPartners: Model<TradingPartner>,
  ) {}

  async getAll(): Promise<TradingPartner[]> {
    return await this.tradingPartners.find({});
  }
  async getPartnerById(id: string): Promise<TradingPartner> {
    return await this.tradingPartners.findById(id);
  }

  async getType(type: PartnerType): Promise<TradingPartner[]> {
    return await this.tradingPartners.find({ type });
  }

  async addPartner(partnerDetails: Partial<TradingPartner>) {
    const newPartner = new this.tradingPartners({
      ...partnerDetails,
      totalCurrentDue: 0,
      totalCurrentSalesQuantity: 0,
      totalTrades: 0,
    });
    await newPartner.save();
    return newPartner;
  }

  async updatePartner(id: string, partnerDetails: Partial<TradingPartner>) {
    const updatedPartner = await this.tradingPartners.findByIdAndUpdate(
      id,
      partnerDetails,
    );
    if (!updatedPartner) throw new NotFoundException('Partner not found');
    return updatedPartner;
  }

  async uodatePartnerDue(id: string, dueChange: number) {
    const partner = await this.tradingPartners.findById(id);
    if (!partner) throw new NotFoundException('Partner not found');
    partner.totalCurrentDue += dueChange;
    await partner.save();
    return partner;
  }

  async updatePartnerWithNewTransaction(
    id: string,
    quantityToAdd: number,
    newDueAmount: number,
    newPaidAmount: number,
  ) {
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
    try {
      await this.tradingPartners.findByIdAndDelete(id);
    } catch (err) {
      console.log(err);
      // Not throwing error since it's a delete operation
    }
    return null;
  }
}
