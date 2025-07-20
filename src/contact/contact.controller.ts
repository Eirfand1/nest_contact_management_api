import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, Put, ParseIntPipe, Query } from '@nestjs/common';
import { ContactService } from './contact.service';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';
import { Auth } from 'common/auth.decorators';
import { Users } from 'user/entities/user.entity';
import { WebResponse } from 'common/web-response.dto';
import { ContactResponse } from './dto/response-contact.dto';
import { SearchContactDto } from './dto/search-contact.dto';

@Controller('api/contacts')
export class ContactController {
  constructor(
    private readonly contactService: ContactService
  ) { }
  
  @Post()
  @HttpCode(201)
  async create(
    @Auth() user: Users,
    @Body() createContactDto: CreateContactDto
  ): Promise<WebResponse<ContactResponse>> {
    return {
      success: true,
      data: await this.contactService.create(user, createContactDto)
    }
  }
  
  @Get(':id')
  async findOne(@Auth() user: Users, @Param('id') id: string): Promise<WebResponse<ContactResponse>> {
    return {
      success: true,
      data: await this.contactService.findOne(user, +id)
    }
  }
  
  @Put(':contactId')
  async update(
    @Auth() user: Users,
    @Param('contactId', ParseIntPipe) contactId: number,
    @Body() updateContactDto: UpdateContactDto
  ): Promise<WebResponse<ContactResponse>> {
    
    updateContactDto.id = contactId;
    return {
      success: true,
      data: await this.contactService.update(user, updateContactDto)
    };
  }
  
  @Delete(':id')
  async remove(@Auth() user: Users,@Param('id') id: string): Promise<WebResponse<ContactResponse>> {
    return {
      success: true,
      data: await this.contactService.remove(user, +id)
    } 
  }

  @Get()
  async search(
    @Auth() user: Users,
    @Query('name') name?: string,
    @Query('email') email?: string,
    @Query('phone') phone?: string,
    @Query('page', new ParseIntPipe({optional: true})) page?: number,
    @Query('size', new ParseIntPipe({optional: true})) size?: number
  ): Promise<WebResponse<ContactResponse[]>> {
    const request: SearchContactDto = {
      name: name,
      email: email,
      phone: phone,
      page: page || 1,
      size: size || 10
    }

    return this.contactService.search(user, request);
  }
}
