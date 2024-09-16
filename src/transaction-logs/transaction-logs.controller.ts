import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  StreamableFile,
} from '@nestjs/common';
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
import { PaginatedRangeDTO } from './dtos/paginated-range.dto';
import { IsMongoId } from 'class-validator';
import { readFile } from 'fs/promises';
import path from 'path';
import Handlebars from 'handlebars';
import puppeteer from 'puppeteer-core';

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
  @Post('sell-transaction-in-range')
  @GenericObjectResponse(PaginatedResults<BuyLogs>)
  async getSellTransactionsForRange(@Body() paginatedRange: PaginatedRangeDTO) {
    const allLogs = await (paginatedRange.partnerId
      ? this.sellService.getForPartner(paginatedRange.partnerId)
      : this.sellService.getAll());
    let inRangeLogs = allLogs;
    if (paginatedRange.from && paginatedRange.to) {
      const fromDateTime = DateTime.fromISO(paginatedRange.from).startOf('day');
      const toDateTime = DateTime.fromISO(paginatedRange.to).endOf('day');
      inRangeLogs = allLogs.filter((log) => {
        const logDate = DateTime.fromJSDate(log.createdAt);
        return logDate <= toDateTime && logDate >= fromDateTime;
      });
    }
    const res = inRangeLogs.slice(
      paginatedRange.pageNumber * paginatedRange.pageSize,
      (paginatedRange.pageNumber + 1) * paginatedRange.pageSize,
    );
    return {
      CurrentPage: paginatedRange.pageNumber,
      PageSize: paginatedRange.pageSize,
      Results: res,
      TotalPages: Math.ceil(inRangeLogs.length / paginatedRange.pageSize),
      TotalDataLength: inRangeLogs.length,
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

  @Post('buy-transaction-in-range')
  @GenericObjectResponse(PaginatedResults<BuyLogs>)
  async getBuyTransactionsForRange(@Body() paginatedRange: PaginatedRangeDTO) {
    const allLogs = await (paginatedRange.partnerId
      ? this.buyService.getForPartner(paginatedRange.partnerId)
      : this.buyService.getAll());
    let inRangeLogs = allLogs;
    if (paginatedRange.from && paginatedRange.to) {
      const fromDateTime = DateTime.fromISO(paginatedRange.from).startOf('day');
      const toDateTime = DateTime.fromISO(paginatedRange.to).endOf('day');
      inRangeLogs = allLogs.filter((log) => {
        const logDate = DateTime.fromJSDate(log.createdAt);
        return logDate <= toDateTime && logDate >= fromDateTime;
      });
    }
    const res = inRangeLogs.slice(
      paginatedRange.pageNumber * paginatedRange.pageSize,
      (paginatedRange.pageNumber + 1) * paginatedRange.pageSize,
    );
    return {
      CurrentPage: paginatedRange.pageNumber,
      PageSize: paginatedRange.pageSize,
      Results: res,
      TotalPages: Math.ceil(inRangeLogs.length / paginatedRange.pageSize),
      TotalDataLength: inRangeLogs.length,
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
  buyProduct(
    @Body() transactionInfo: BuyProductDTO,
    @CurrentUser() user: PublicUserProperties,
  ) {
    return this.buyService.buyProducts(transactionInfo, user._id);
  }

  @Post('sell-product')
  @GenericObjectResponse(SellLogs)
  @Roles(['admin', 'employee'])
  sellProduct(
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

  @Get('generate-receipt/:id')
  @Roles(['admin', 'employee', 'superadmin'])
  async getReceipt(@Param() param: { id: string }) {
    try {
      const sellLog = await this.sellService.getById(param.id);
      if (!sellLog) throw new Error('No sell log found');
      const fileToSend = await readFile(
        path.join(__dirname, '../static/receipt.hbs'),
        'utf-8',
      );
      const productsInfo = sellLog.products.map((el, idx) => ({
        serial: idx + 1,
        name: el.productName,
        quantity: el.quantityTraded,
        pricePerUnit: el.pricePerUnit,
        total: el.quantityTraded * el.pricePerUnit,
      }));
      const totalDiscount = sellLog.products.reduce(
        (acc, curr) => acc + (curr.discount || 0),
        0,
      );
      const totalPrice =
        productsInfo.reduce((acc, curr) => acc + curr.total, 0) +
        (sellLog.deliveryCharge || 0);
      const template = Handlebars.compile(fileToSend);
      const comiledHtml = template({
        sellId: (sellLog.serial || 0).toString().padStart(4, '0'),
        customerName: sellLog.partnerName,
        customerAddress: '',
        customerPhoneNumber: '',
        product: productsInfo,
        deliveryCharge: sellLog.deliveryCharge || 0,
        totalAmount: totalPrice,
        totalDiscount,
        totalDiscountedPrice: totalPrice - totalDiscount,
        totalPaid: sellLog.paid,
        due: sellLog.due,
      });
      if (!process.env.CHROME_BIN) {
        throw new Error('Cannot generate pdf');
      }
      const browser = await puppeteer.launch({
        args: [
          '--no-sandbox',
          '--headless',
          '--disable-gpu',
          '--disable-dev-shm-usage',
        ],
        executablePath: process.env.CHROME_BIN,
        headless: true,
      });
      const newPage = await browser.newPage();
      await newPage.setContent(comiledHtml);
      const pdf = await newPage.pdf({ format: 'A4' });
      await browser.close();
      return new StreamableFile(pdf, { type: 'application/pdf' });
    } catch (error) {
      console.log(error);
      throw new BadRequestException(error.message);
    }
  }
}
