import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Redirect,
} from '@nestjs/common';
import { ApiCookieAuth, ApiTags } from '@nestjs/swagger';
import { Roles } from '../decorators/roles/roles.decorator';
import { ValidateOutgoing } from '../interceptors/transform-response.interceptor';
import { TradingPartner } from '../schemas/trading-partners.schema';
import {
  GenericArrayResponse,
  GenericNullResponse,
  GenericObjectResponse,
} from '../swagger/GenericResponseDecorator';
import { ParamDto } from '../shared/dtos/param.dto';
import { PartnerDetailsDto } from './dtos/partner-details.dto';
import { TradingPartnersService } from './trading-partners.service';

@ApiTags('Trading Partners info')
@ApiCookieAuth()
@Controller('trading-partners')
@ValidateOutgoing(TradingPartner)
export class TradingPartnersController {
  constructor(private tradingPartnersService: TradingPartnersService) {}

  @Get('all')
  @GenericArrayResponse(TradingPartner)
  @Roles(['admin', 'employee'])
  getAll() {
    return this.tradingPartnersService.getAll();
  }

  @Post('add')
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
