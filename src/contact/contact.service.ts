import { HttpException, Inject, Injectable, Logger } from '@nestjs/common';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { InjectRepository } from '@nestjs/typeorm';
import { Contacts } from './entities/contact.entity';
import { Repository } from 'typeorm';
import { ValidationService } from 'common/validation.service';
import { ContactValidation } from './contact.validation';
import { Users } from 'user/entities/user.entity';
import { ContactResponse } from './dto/response-contact.dto';

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
      ...createContactDto,
      ...{ username: user.username }
    });

    return this.contactResponse(result);
  }

  async findAll(user: Users): Promise<ContactResponse[]> {
    const data = await this.contactRepository.find({
      where: {
        username: user.username
      }
    });

    data.map(contact => this.contactResponse(contact));
    return data;
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

  remove(id: number) {
    return `This action removes a #${id} contact`;
  }
}
