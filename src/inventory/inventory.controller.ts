import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiCookieAuth, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../decorators/CurrentUser.decorator';
import { Roles } from '../decorators/roles/roles.decorator';
import { Inventory } from '../schemas/inventory.schema';
import { ParamDto } from '../shared/dtos/param.dto';
import {
  GenericArrayResponse,
  GenericObjectResponse,
} from '../swagger/GenericResponseDecorator';
import { ProductLotService } from '../transaction-logs/services/product-lot.service';
import { PublicUserProperties } from '../users/public-user-properties';
import { ProductAvailablityDto } from './dtos/product-availability.dto';
import {
  ProductDto,
  UpdatePriceDto,
  UpdateProductDto,
} from './dtos/product.dto';
import { UpdateQuantityDto } from './dtos/update-quantity.dto';
import { InventoryService } from './inventory.service';

@ApiTags('Inventory Management')
@ApiCookieAuth()
@Controller('inventory')
@Roles(['admin', 'superadmin'])
export class InventoryController {
  constructor(
    private inventoryService: InventoryService,
    private productLotService: ProductLotService,
  ) {}

  @Post('add-product')
  @GenericObjectResponse(Inventory)
  addNewProduct(
    @Body() productInfo: ProductDto,
    @CurrentUser() user: PublicUserProperties,
  ) {
    return this.inventoryService.addNewProduct(productInfo);
  }

  @Post('product-available-count')
  getProductCountForPartner(@Body() queries: ProductAvailablityDto) {
    if (!queries.partnerId || !queries.productId) return 0;

    return this.productLotService.getProductCountForSupplier(
      queries.productId,
      queries.partnerId,
    );
  }

  @Get('all-products')
  @GenericArrayResponse(Inventory)
  getAllProducts() {
    return this.inventoryService.getAllProduct();
  }

  @Post('update-product/:id')
  @Roles(['superadmin'])
  @GenericObjectResponse(Inventory)
  updateProduct(
    @Param() param: ParamDto,
    @Body() updates: UpdateProductDto,
    @CurrentUser() user: PublicUserProperties,
  ) {
    return this.inventoryService.updateProduct(param.id, updates);
  }

  @Post('update-quantity/:id')
  @GenericObjectResponse(Inventory)
  updateQuantity(
    @Param() param: ParamDto,
    @Body() data: UpdateQuantityDto,
    @CurrentUser() user: PublicUserProperties,
  ) {
    return this.inventoryService.updateQuantity(
      param.id,
      data.quantity,
      data.isSelling,
    );
  }

  @Post('update-price/:id')
  @GenericObjectResponse(Inventory)
  updatePrice(
    @Param() param: ParamDto,
    @Body() data: UpdatePriceDto,
    @CurrentUser() user: PublicUserProperties,
  ) {
    return this.inventoryService.updatePrice(
      param.id,
      data.currentPricePerUnit,
    );
  }

  // @Get('product-history/:id')
  // @GenericArrayResponse(InventoryLogs)
  // getProductHistory(@Param() param: ParamDto) {
  //   return this.inventoryLogsService.getLogsForProduct(param.id);
  // }

  // @Get('all-product-history')
  // @GenericArrayResponse(InventoryLogs)
  // getAllProductHistory() {
  //   return this.inventoryLogsService.getLogsForAllProduct();
  // }
}
