import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { ApiCookieAuth, ApiTags } from '@nestjs/swagger';
import { Roles } from '../decorators/roles/roles.decorator';
import { PartnerType } from '../enums/UserTypes.enum';
import { TradingPartner } from '../schemas/trading-partners.schema';
import { PaginationDto } from '../shared/dtos/paginated.dto';
import { ParamDto } from '../shared/dtos/param.dto';
import {
  GenericArrayResponse,
  GenericNullResponse,
  GenericObjectResponse,
} from '../swagger/GenericResponseDecorator';
import { PaginatedResults } from './dtos/paginated-response.dto';
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
  async getAll() {
    return this.tradingPartnersService.getAll();
  }

  @Get('partners')
  @GenericObjectResponse(PaginatedResults<TradingPartner>)
  @Roles(['admin', 'employee'])
  async getAllPaginated(
    @Query() paginatedQuery: PaginationDto,
  ): Promise<PaginatedResults<TradingPartner>> {
    const allPartners = await this.getAll();

    const res = allPartners
      .toSorted((a, b) => {
        // TODO: Need to implement sorting
        return 0;
      })
      .slice(
        paginatedQuery.pageNumber * paginatedQuery.pageSize,
        (paginatedQuery.pageNumber + 1) * paginatedQuery.pageSize,
      );

    return {
      CurrentPage: paginatedQuery.pageNumber,
      PageSize: paginatedQuery.pageSize,
      Results: res,
      TotalPages: Math.ceil(allPartners.length / paginatedQuery.pageSize),
      TotalDataLength: allPartners.length,
    };
  }

  @Get('customers')
  @GenericArrayResponse(TradingPartner)
  @Roles(['admin', 'employee'])
  async getAllCustomers(
    @Query() paginatedQuery: PaginationDto,
  ): Promise<PaginatedResults<TradingPartner>> {
    try {
      const allCustomers = await this.tradingPartnersService.getType(
        PartnerType.Customer,
      );
      const res = allCustomers
        .toSorted((a, b) => {
          // TODO: Need to implement sorting
          return 0;
        })
        .slice(
          paginatedQuery.pageNumber * paginatedQuery.pageSize,
          (paginatedQuery.pageNumber + 1) * paginatedQuery.pageSize,
        );
      return {
        CurrentPage: paginatedQuery.pageNumber,
        PageSize: paginatedQuery.pageSize,
        Results: res,
        TotalPages: Math.ceil(allCustomers.length / paginatedQuery.pageSize),
        TotalDataLength: allCustomers.length,
      };
    } catch (error) {
      throw error;
    }
  }

  @Get('suppliers')
  @GenericArrayResponse(TradingPartner)
  @Roles(['admin'])
  async getAllSuppliers(
    @Query() paginatedQuery: PaginationDto,
  ): Promise<PaginatedResults<TradingPartner>> {
    try {
      const allSuppliers = await this.tradingPartnersService.getType(
        PartnerType.Supplier,
      );
      const res = allSuppliers
        .toSorted((a, b) => {
          // TODO: Need to implement sorting
          return 0;
        })
        .slice(
          paginatedQuery.pageNumber * paginatedQuery.pageSize,
          (paginatedQuery.pageNumber + 1) * paginatedQuery.pageSize,
        );
      return {
        CurrentPage: paginatedQuery.pageNumber,
        PageSize: paginatedQuery.pageSize,
        Results: res,
        TotalPages: Math.ceil(allSuppliers.length / paginatedQuery.pageSize),
        TotalDataLength: allSuppliers.length,
      };
    } catch (error) {
      throw error;
    }
  }

  @Get('suppliers-with-product-info')
  @Roles(['admin', 'employee', 'superadmin'])
  getSuppliersWithProductInfo() {
    return this.tradingPartnersService.getSupplierWithQuantities();
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
