import { Contacts } from '../../contact/entities/contact.entity';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'

@Entity()
export class Addresses {
  @PrimaryGeneratedColumn()
  id: number;
  
  @Column({
    length: 255
  })
  street: string
  
  @Column({
    length: 100
  })
  city: string
  
  @Column({
    length: 100
  })
  province: string
  
  @Column({
    length: 100
  })
  country: string
  
  @Column({
    length: 10
  })
  postal_code: string
  
  @Column()
  contact_id: number;
  
  @ManyToOne(() => Contacts, (contact) => contact.addresses)
  @JoinColumn({ name: 'contact_id' })
  contact: Contacts
}
