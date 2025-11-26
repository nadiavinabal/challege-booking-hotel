import { Room } from '../../rooms/entities/room.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Hotel {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  city: string;

  @Column({ nullable: true })
  address: string;

  @OneToMany(() => Room, (room) => room.hotel)
  rooms: Room[];
}
