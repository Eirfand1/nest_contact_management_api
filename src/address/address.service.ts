import { HttpException, Inject, Injectable, Logger } from '@nestjs/common';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Addresses } from './entities/address.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ValidationService } from 'common/validation.service';
import { Users } from 'user/entities/user.entity';
import { AddressValidation } from './address.validation';
import { ResponseAddressDto } from './dto/response-address.dto';
import { ContactService } from 'contact/contact.service';

@Injectable()
export class AddressService {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
    @InjectRepository(Addresses) private addressRepository: Repository<Addresses>,
    private validationService: ValidationService,
    private contactService: ContactService
  ) { }

  async create(user: Users, contactId: number , createAddressDto: CreateAddressDto): Promise<ResponseAddressDto> {
    this.logger.debug(`ContactService.create (${JSON.stringify(user)} ${JSON.stringify(createAddressDto)})`);
    const req: CreateAddressDto = this.validationService.validate(AddressValidation.CREATE, createAddressDto);

    await this.contactService.ContactIsExist(user.username, contactId);

    const result = await this.addressRepository.save({
      ...req,
      contact_id: contactId,
    });

    return result;
  }

  async AddressIsExist(contact: number, addressId: number): Promise<Addresses> {
    const address = await this.addressRepository.findOne({
      where: {
        id: addressId,
        contact_id: contact
      }
    });
    
    if (!address) {
      throw new HttpException("Address is Not found", 404);
    }

    return address;
  }
  async update(user: Users ,contactId: number, addressid: number, updateAddressDto: UpdateAddressDto): Promise<ResponseAddressDto> {
    this.logger.debug(`ContactService.update ${JSON.stringify(updateAddressDto)}`)
    const req: UpdateAddressDto = this.validationService.validate(AddressValidation.UPDATE, updateAddressDto);

    await this.contactService.ContactIsExist(user.username, contactId);

    let result = await this.AddressIsExist(contactId, addressid);

    result = await this.addressRepository.save({
      id: addressid,
      ...req,
      contact_id: contactId
    });

    return result;
  }

  async findAll(user: Users, contactId: number): Promise<ResponseAddressDto[]> {
    this.logger.debug(`ContactService.findAll ${JSON.stringify(user)}`);

    await this.contactService.ContactIsExist(user.username, contactId);

    const result = this.addressRepository.find({
      where: {
        contact_id: contactId
      }
    });

    return result
  }

  async findOne(user: Users, contactId: number, addressId: number): Promise<ResponseAddressDto> {
    this.logger.debug(`ContactService.findOne ${JSON.stringify(user)}`);
    await this.contactService.ContactIsExist(user.username, contactId);

    const result = await this.addressRepository.findOne({
      where: {
        id: addressId,
        contact_id: contactId
      }
    });
    if(!result) {
      throw new HttpException("Address Not Found", 404);
    }
    return result;
  }

  async remove(user: Users, addressId: number, contactId: number) {
    this.logger.debug(`ContactService.remove ${JSON.stringify(user)}`);
    await this.contactService.ContactIsExist(user.username, contactId);

    const address = await this.AddressIsExist(contactId, addressId);

    await this.addressRepository.delete({
      id: addressId,
      contact_id: contactId
    });

    return address
  }
}
