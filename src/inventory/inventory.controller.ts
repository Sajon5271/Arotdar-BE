import { Body, Controller, Post } from '@nestjs/common';
import { Roles } from '../decorators/roles/roles.decorator';
import { ApiTags } from '@nestjs/swagger';
import { ProductDto } from './dtos/product.dto';

@ApiTags('Inventory Management')
@Controller('inventory')
@Roles(['admin', 'superadmin'])
export class InventoryController {
  @Post('add')
  addNewProduct(@Body() productInfo: ProductDto) {
    console.log('ad');
    return null;
  }
}
