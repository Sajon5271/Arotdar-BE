import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { TradingPartner } from '../schemas/trading-partners.schema';
import { Model } from 'mongoose';

@Injectable()
export class TradingPartnersService {
  constructor(
    @InjectModel(TradingPartner.name)
    private readonly tradingPartners: Model<TradingPartner>,
  ) {}

  async getAll(): Promise<TradingPartner[]> {
    return await this.tradingPartners.find({});
  }

  async addPartner(partnerDetails: TradingPartner) {
    const newPartner = new this.tradingPartners(partnerDetails);
    return await newPartner.save();
  }

  async updatePartner(id: string, partnerDetails: Partial<TradingPartner>) {
    const updatedPartner = await this.tradingPartners.findByIdAndUpdate(
      id,
      partnerDetails,
    );
    if (!updatedPartner) throw new NotFoundException('Partner not found');
    return updatedPartner;
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
