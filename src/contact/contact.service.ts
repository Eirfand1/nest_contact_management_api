import { HttpException, Inject, Injectable, Logger } from '@nestjs/common';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { InjectRepository } from '@nestjs/typeorm';
import { Contacts } from './entities/contact.entity';
import { FindOptionsWhere, Like, Repository } from 'typeorm';
import { ValidationService } from 'common/validation.service';
import { ContactValidation } from './contact.validation';
import { Users } from 'user/entities/user.entity';
import { ContactResponse } from './dto/response-contact.dto';
import { SearchContactDto } from './dto/search-contact.dto';
import { WebResponse } from 'common/web-response.dto';

@Injectable()
export class ContactService {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
    @InjectRepository(Contacts) private contactRepository: Repository<Contacts>,
    private validationService: ValidationService
  ) { }
  
  async create(user: Users, createContactDto: CreateContactDto): Promise<ContactResponse> {
    this.logger.debug(`ContactService.create (${JSON.stringify(user)} ${JSON.stringify(createContactDto)})`);
    const req: CreateContactDto = this.validationService.validate(ContactValidation.CREATE, createContactDto)
    
    const result = await this.contactRepository.save({
      ...req,
      ...{ username: user.username }
    });
    
    return this.contactResponse(result);
  }
  
  
  async findOne(user: Users, id: number): Promise<ContactResponse> {
    this.logger.debug(`ContactService.create (${JSON.stringify(user)} ${JSON.stringify(id)})`);
    const result = await this.ContactIsExist(user.username, id);
    
    return this.contactResponse(result);
  }
  
  async ContactIsExist(username: string, contactId: number): Promise<Contacts> {
    const contact = await this.contactRepository.findOne({
      where: {
        id: contactId,
        username: username
      }
    });
    
    if (!contact) {
      throw new HttpException('Contact is Not found', 404);
    }
    
    return contact;
  }
  
  contactResponse(contact: Contacts) {
    const { username, ...response } = contact;
    return response;
  }
  
  async update(user: Users, updateContactDto: UpdateContactDto): Promise<ContactResponse> {
    this.logger.debug(`ContactService.create ${JSON.stringify(updateContactDto)}`);
    const req = this.validationService.validate(
      ContactValidation.UPDATE,
      updateContactDto
    )
    let result = await this.ContactIsExist(user.username, req.id);
    
    result = await this.contactRepository.save({
      ...req,
    });
    
    return this.contactResponse(result);
    
  }
  
  async remove(user: Users,id: number) {
    const contactExist = await this.ContactIsExist(user.username, id);
    
    await this.contactRepository.delete({
      id: id,
      username: user.username
    });
    
    return this.contactResponse(contactExist);
  }
  
  async search(user: Users, request: SearchContactDto): Promise<WebResponse<ContactResponse[]>> {
    const searchRequest: SearchContactDto = this.validationService.validate(
      ContactValidation.SEARCH,
      request
    );
    
    const queryBuilder = await this.contactRepository.createQueryBuilder('contact')
    .where("username = :username", { username: user.username });
    
    if(searchRequest.name){
       queryBuilder.where("first_name LIKE :name OR last_name LIKE :name", { name : `%${searchRequest.name}%` })
    } 1
    
    if(searchRequest.email){
       queryBuilder.where("email LIKE :email", { email:  `%${searchRequest.email}%` })
    }

    if(searchRequest.phone){
       queryBuilder.where("phone LIKE :phone", { phone:  `%${searchRequest.phone}%` });
    }
    
    const skip = (searchRequest.page - 1) * searchRequest.size

    const contacts = await queryBuilder.skip(skip).take(searchRequest.size).getMany()
    const total = await queryBuilder.skip(skip).take(searchRequest.size).getCount();
    
    return {
      success: true,
      data: contacts.map(contact => this.contactResponse(contact)),
      paging: {
        current_page: searchRequest.page,
        size: searchRequest.size,
        total_page: Math.ceil(total / searchRequest.size)
      }
    }
  }
}
