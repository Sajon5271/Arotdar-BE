import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { ApiCookieAuth, ApiTags } from '@nestjs/swagger';
import { Roles } from '../decorators/roles/roles.decorator';
import { TradingPartner } from '../schemas/trading-partners.schema';
import { ParamDto } from '../shared/dtos/param.dto';
import {
  GenericArrayResponse,
  GenericNullResponse,
  GenericObjectResponse,
} from '../swagger/GenericResponseDecorator';
import { PartnerDetailsDto } from './dtos/partner-details.dto';
import { TradingPartnersService } from './trading-partners.service';

@ApiTags('Trading Partners info')
@ApiCookieAuth()
@Controller('trading-partners')
export class TradingPartnersController {
  constructor(private tradingPartnersService: TradingPartnersService) {}

  @Get('all-partners')
  @GenericArrayResponse(TradingPartner)
  @Roles(['admin', 'employee'])
  getAll() {
    return this.tradingPartnersService.getAll();
  }

  @Post('add-partner')
  @GenericObjectResponse(TradingPartner)
  @Roles(['admin'])
  addPartner(@Body() partnerDetails: PartnerDetailsDto) {
    return this.tradingPartnersService.addPartner(partnerDetails);
  }

  // @Delete(['remove/:id', '/remove'])
  @Delete('remove/:id')
  @GenericNullResponse()
  @Roles(['admin'])
  removePartner(@Param() param: ParamDto) {
    return this.tradingPartnersService.deletePartner(param.id);
  }
}
