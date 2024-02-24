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

@ApiTags('Transactions')
@ApiCookieAuth()
@Controller('transaction')
@Roles(['admin'])
export class TransactionLogsController {
  constructor(private transactionLogsService: TransactionLogsService) {}

  @Get('all-transaction')
  @GenericArrayResponse(TransactionLogs)
  getAllLogs() {
    return this.transactionLogsService.getAll();
  }

  @Get('sell-transactions')
  @GenericArrayResponse(TransactionLogs)
  @Roles(['admin', 'employee'])
  getSellTransactions() {
    return this.transactionLogsService.getAllOfType(TransactionType.Sell);
  }

  @Get('buy-transactions')
  @GenericArrayResponse(TransactionLogs)
  getBuyTransactions() {
    return this.transactionLogsService.getAllOfType(TransactionType.Buy);
  }

  @Post('add-new')
  @GenericObjectResponse(TransactionLogs)
  @Roles(['admin', 'employee'])
  addNewTransaction(
    @Body() transactionInfo: NewTransactionDto,
    @CurrentUser() user: PublicUserProperties,
  ) {
    return this.transactionLogsService.addNewTransaction(
      transactionInfo,
      user._id,
    );
  }

  @Post('buy-product')
  @GenericObjectResponse(TransactionLogs)
  @Roles(['admin', 'employee'])
  buyProoduct(
    @Body() transactionInfo: NewTransactionDto,
    @CurrentUser() user: PublicUserProperties,
  ) {}

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
