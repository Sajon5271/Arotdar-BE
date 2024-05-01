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
  allTradingPartnersCache: TradingPartner[] | undefined;
  allCustomersPartnersCache: TradingPartner[] | undefined;
  allSupplierPartnersCache: TradingPartner[] | undefined;

  constructor(private tradingPartnersService: TradingPartnersService) {}

  @Get('all-partners')
  @GenericArrayResponse(TradingPartner)
  @Roles(['admin', 'employee'])
  async getAll() {
    try {
      if (!this.allTradingPartnersCache) {
        this.allTradingPartnersCache =
          await this.tradingPartnersService.getAll();
      }
      return this.allTradingPartnersCache;
    } catch (err) {
      this.allTradingPartnersCache = undefined;
      throw err;
    }
  }

  @Get('partners')
  @GenericObjectResponse(PaginatedResults<TradingPartner>)
  @Roles(['admin', 'employee'])
  async getAllPaginated(
    @Query() paginatedQuery: PaginationDto,
  ): Promise<PaginatedResults<TradingPartner>> {
    if (!this.allTradingPartnersCache) {
      await this.getAll();
    }

    const res = this.allTradingPartnersCache
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
      TotalPages: Math.ceil(
        this.allTradingPartnersCache.length / paginatedQuery.pageSize,
      ),
      TotalDataLength: this.allTradingPartnersCache.length,
    };
  }

  @Get('customers')
  @GenericArrayResponse(TradingPartner)
  @Roles(['admin', 'employee'])
  async getAllCustomers(
    @Query() paginatedQuery: PaginationDto,
  ): Promise<PaginatedResults<TradingPartner>> {
    try {
      if (!this.allCustomersPartnersCache) {
        this.allCustomersPartnersCache =
          await this.tradingPartnersService.getType(PartnerType.Customer);
      }
      const res = this.allCustomersPartnersCache
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
        TotalPages: Math.ceil(
          this.allCustomersPartnersCache.length / paginatedQuery.pageSize,
        ),
        TotalDataLength: this.allCustomersPartnersCache.length,
      };
    } catch (error) {
      this.allCustomersPartnersCache = undefined;
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
      if (!this.allSupplierPartnersCache) {
        this.allSupplierPartnersCache =
          await this.tradingPartnersService.getType(PartnerType.Supplier);
      }
      const res = this.allSupplierPartnersCache
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
        TotalPages: Math.ceil(
          this.allSupplierPartnersCache.length / paginatedQuery.pageSize,
        ),
        TotalDataLength: this.allSupplierPartnersCache.length,
      };
    } catch (error) {
      this.allSupplierPartnersCache = undefined;
      throw error;
    }
  }

  @Post('add-partner')
  @GenericObjectResponse(TradingPartner)
  @Roles(['admin'])
  addPartner(@Body() partnerDetails: PartnerDetailsDto) {
    this.allTradingPartnersCache = undefined;
    this.allCustomersPartnersCache = undefined;
    this.allSupplierPartnersCache = undefined;
    return this.tradingPartnersService.addPartner(partnerDetails);
  }

  // @Delete(['remove/:id', '/remove'])
  @Delete('remove/:id')
  @GenericNullResponse()
  @Roles(['admin'])
  removePartner(@Param() param: ParamDto) {
    this.allTradingPartnersCache = undefined;
    this.allCustomersPartnersCache = undefined;
    this.allSupplierPartnersCache = undefined;
    return this.tradingPartnersService.deletePartner(param.id);
  }
}
