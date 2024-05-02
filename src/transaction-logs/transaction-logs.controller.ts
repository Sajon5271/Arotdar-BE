import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ApiCookieAuth, ApiTags } from '@nestjs/swagger';
import { DateTime } from 'luxon';
import { CurrentUser } from '../decorators/CurrentUser.decorator';
import { Roles } from '../decorators/roles/roles.decorator';
import { BuyLogs } from '../schemas/buy-logs.schema';
import { SellLogs } from '../schemas/sell-logs.schema';
import { TransactionLogs } from '../schemas/transaction-logs.schema';
import { PaginationDto } from '../shared/dtos/paginated.dto';
import { GenericObjectResponse } from '../swagger/GenericResponseDecorator';
import { PaginatedResults } from '../trading-partners/dtos/paginated-response.dto';
import { PublicUserProperties } from '../users/public-user-properties';
import { BuyProductDTO } from './dtos/buy-products.dto';
import { SellProductDTO } from './dtos/sell-product.dto';
import { UpdateDueOfPartners } from './dtos/update-due-amount.dto';
import { BuyService } from './services/buy.service';
import { SellService } from './services/sell.service';
import { TransactionLogsService } from './transaction-logs.service';

@ApiTags('Transactions')
@ApiCookieAuth()
@Controller('transaction')
@Roles(['admin'])
export class TransactionLogsController {
  constructor(
    private transactionLogsService: TransactionLogsService,
    private buyService: BuyService,
    private sellService: SellService,
  ) {}

  @Get('all-transaction')
  @GenericObjectResponse(PaginatedResults<SellLogs>)
  async getAllLogs(@Query() paginatedQuery: PaginationDto) {
    const buyLogs = await this.buyService.getAll();
    const sellLogs = await this.sellService.getAll();
    const allLogs = [...buyLogs, ...sellLogs].sort((a, b) => {
      const aTime = DateTime.fromJSDate(new Date(a.createdAt));
      const bTime = DateTime.fromJSDate(new Date(b.createdAt));
      return aTime < bTime ? 1 : aTime > bTime ? -1 : 0;
    });
    const res = allLogs.slice(
      paginatedQuery.pageNumber * paginatedQuery.pageSize,
      (paginatedQuery.pageNumber + 1) * paginatedQuery.pageSize,
    );
    return {
      CurrentPage: paginatedQuery.pageNumber,
      PageSize: paginatedQuery.pageSize,
      Results: res,
      TotalPages: Math.ceil(allLogs.length / paginatedQuery.pageSize),
      TotalDataLength: allLogs.length,
    };
  }

  @Get('sell-transactions')
  @GenericObjectResponse(PaginatedResults<SellLogs>)
  @Roles(['admin', 'employee'])
  async getSellTransactions(@Query() paginatedQuery: PaginationDto) {
    const allLogs = await this.sellService.getAll();
    const res = allLogs.slice(
      paginatedQuery.pageNumber * paginatedQuery.pageSize,
      (paginatedQuery.pageNumber + 1) * paginatedQuery.pageSize,
    );
    return {
      CurrentPage: paginatedQuery.pageNumber,
      PageSize: paginatedQuery.pageSize,
      Results: res,
      TotalPages: Math.ceil(allLogs.length / paginatedQuery.pageSize),
      TotalDataLength: allLogs.length,
    };
  }

  @Get('dummy-single-sell-transaction')
  @GenericObjectResponse(SellLogs)
  @Roles(['admin', 'employee'])
  async dummy1() {
    return null;
  }

  @Get('buy-transactions')
  @GenericObjectResponse(PaginatedResults<BuyLogs>)
  async getBuyTransactions(@Query() paginatedQuery: PaginationDto) {
    const allLogs = await this.buyService.getAll();
    const res = allLogs.slice(
      paginatedQuery.pageNumber * paginatedQuery.pageSize,
      (paginatedQuery.pageNumber + 1) * paginatedQuery.pageSize,
    );
    return {
      CurrentPage: paginatedQuery.pageNumber,
      PageSize: paginatedQuery.pageSize,
      Results: res,
      TotalPages: Math.ceil(allLogs.length / paginatedQuery.pageSize),
      TotalDataLength: allLogs.length,
    };
  }

  @Get('dummy-single-buy-transaction')
  @GenericObjectResponse(BuyLogs)
  @Roles(['admin', 'employee'])
  async dummy2() {
    return null;
  }

  // @Post('add-new')
  // @GenericObjectResponse(TransactionLogs)
  // @Roles(['admin', 'employee'])
  // addNewTransaction(
  //   @Body() transactionInfo: NewTransactionDto,
  //   @CurrentUser() user: PublicUserProperties,
  // ) {
  //   return this.transactionLogsService.addNewTransaction(
  //     transactionInfo,
  //     user._id,
  //   );
  // }

  @Post('buy-product')
  @GenericObjectResponse(BuyLogs)
  @Roles(['admin', 'employee'])
  buyProoduct(
    @Body() transactionInfo: BuyProductDTO,
    @CurrentUser() user: PublicUserProperties,
  ) {
    return this.buyService.buyProducts(transactionInfo, user._id);
  }

  @Post('sell-product')
  @GenericObjectResponse(SellLogs)
  @Roles(['admin', 'employee'])
  sellProoduct(
    @Body() transactionInfo: SellProductDTO,
    @CurrentUser() user: PublicUserProperties,
  ) {
    return this.sellService.sellProduct(transactionInfo, user._id);
  }

  @Post('update-dues')
  @GenericObjectResponse(TransactionLogs)
  @Roles(['admin'])
  updateDueAmount(
    @Body() data: UpdateDueOfPartners,
    @CurrentUser() user: PublicUserProperties,
  ) {
    return this.transactionLogsService.addDueUpdateTransaction(data, user._id);
  }
}
