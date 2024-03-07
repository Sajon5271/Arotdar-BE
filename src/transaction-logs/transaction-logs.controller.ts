import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiCookieAuth, ApiTags } from '@nestjs/swagger';
import { Roles } from '../decorators/roles/roles.decorator';
import {
  GenericArrayResponse,
  GenericObjectResponse,
} from '../swagger/GenericResponseDecorator';
import { TransactionLogs } from '../schemas/transaction-logs.schema';
import { TransactionLogsService } from './transaction-logs.service';
import { TransactionType } from '../enums/Transaction.enum';
import { NewTransactionDto } from './dtos/new-transaction.dto';
import { CurrentUser } from '../decorators/CurrentUser.decorator';
import { PublicUserProperties } from '../users/public-user-properties';
import { UpdateDueOfPartners } from './dtos/update-due-amount.dto';
import { BuyProductDTO } from './dtos/buy-products.dto';
import { BuyLogs } from '../schemas/buy-logs.schema';
import { BuyService } from './services/buy.service';
import { SellService } from './services/sell.service';
import { SellProductDTO } from './dtos/sell-product.dto';
import { DateTime } from 'luxon';
import { SellLogs } from '../schemas/sell-logs.schema';

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
  @GenericArrayResponse(SellLogs)
  async getAllLogs() {
    const buyLogs = await this.buyService.getAll();
    const sellLogs = await this.sellService.getAll();
    const allLogs = [...buyLogs, ...sellLogs];
    return allLogs.toSorted((a, b) => {
      const aTime = DateTime.fromJSDate(new Date(a.createdAt));
      const bTime = DateTime.fromJSDate(new Date(b.createdAt));
      return aTime < bTime ? 1 : aTime > bTime ? -1 : 0;
    });
  }

  @Get('sell-transactions')
  @GenericArrayResponse(SellLogs)
  @Roles(['admin', 'employee'])
  getSellTransactions() {
    return this.sellService.getAll();
  }

  @Get('buy-transactions')
  @GenericArrayResponse(BuyLogs)
  getBuyTransactions() {
    return this.buyService.getAll();
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
