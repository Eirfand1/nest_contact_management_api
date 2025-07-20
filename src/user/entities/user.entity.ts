import { Contacts } from '../../contact/entities/contact.entity';
import {
  Entity,
  Column,
  PrimaryColumn,
  OneToMany
} from 'typeorm'

@Entity()
export class Users {
  @PrimaryColumn({
    length: 100
  })
  username: string;

  @Column({
    length: 100
  })
  password: string;

  @Column({
    length: 100
  })
  name: string;

  @Column({
    length: 100,
    nullable: true
  })
  token: string;

  
  @OneToMany(() => Contacts, (contact) => contact.user)
  contacts: Contacts[]
}

