import { Controller, Get, Post, Body, Patch, Param, Delete, Put, ParseIntPipe } from '@nestjs/common';
import { AddressService } from './address.service';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { Auth } from 'common/auth.decorators';
import { Users } from 'user/entities/user.entity';
import { WebResponse } from 'common/web-response.dto';
import { ResponseAddressDto } from './dto/response-address.dto';
import { ContactService } from 'contact/contact.service';
import { number } from 'zod';

@Controller('api/contacts/:contactId/addresses')
export class AddressController {
  constructor(
    private readonly addressService: AddressService,
  ) {}
  
  @Post()
  async create(
    @Auth() user: Users,
    @Param('contactId') contactId: number,
    @Body() createAddressDto: CreateAddressDto
  ): Promise<WebResponse<ResponseAddressDto>> {
    
    const result = await this.addressService.create(user, contactId, createAddressDto);
    
    return {
      success: true,
      data: result
    }
  }
  
  @Get()
  async findAll(
    @Auth() user: Users,
    @Param('contactId') contactId
  ) {
    const result = await this.addressService.findAll(user, contactId);
    return {
      success: true,
      data: result
    }
  }
  
  @Get(':addressId')
  async findOne(
    @Auth() user: Users,
    @Param('addressId') addressId: number,
    @Param('contactId') contactId: number
  ): Promise<WebResponse<ResponseAddressDto>> {
    const result = await this.addressService.findOne(user, contactId, addressId)
    return {
      success: true,
      data: result
    }
  }
  
  @Put(':addressId')
  async update(
    @Auth() user: Users,
    @Param('addressId', ParseIntPipe) addressId: number,
    @Param('contactId', ParseIntPipe) contactId: number,
    @Body() updateAddressDto: UpdateAddressDto
  ): Promise<WebResponse<ResponseAddressDto>> {
    
    const result = await this.addressService.update(user, +contactId, +addressId, updateAddressDto);
    return {
      success: true,
      data: result
    }
  }
  
  @Delete(':addressId')
  async remove(
    @Auth() user: Users,
    @Param('addressId') addressId: number,
    @Param('contactId') contactId: number,
  ): Promise<WebResponse<ResponseAddressDto>> {
    const result = await this.addressService.remove(user, addressId, contactId);
    return {
      success: true,
      data: result 
    }
  }
}
