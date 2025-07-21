import { Module } from '@nestjs/common';
import { AddressService } from './address.service';
import { AddressController } from './address.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Addresses } from './entities/address.entity';
import { ContactModule } from 'contact/contact.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Addresses]),
    ContactModule
  ],
  controllers: [AddressController],
  providers: [AddressService],
})
export class AddressModule { }
