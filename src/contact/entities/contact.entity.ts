import { Addresses } from '../../address/entities/address.entity';
import { Users } from '../../user/entities/user.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  OneToMany
} from 'typeorm'

@Entity()
export class Contacts {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    length: 100
  })
  first_name: string;

  @Column({
    length: 100
  })
  last_name: string;

  @Column({
    length: 100
  })
  email: string;

  @Column({
    length: 20
  })
  phone: string;

  @ManyToOne(() => Users, (user) => user.contacts)
  @JoinColumn({ name: 'username' })
  user: Users;

  @Column({
    length: 100
  })
  username: string;

  @OneToMany(() => Addresses, (address) => address.contact)
  addresses: Addresses[]
}
