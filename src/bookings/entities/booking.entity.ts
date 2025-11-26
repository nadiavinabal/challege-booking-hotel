import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { Room } from '../../rooms/entities/room.entity';

@Entity()
export class Booking {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Room, (room) => room.bookings, { onDelete: 'CASCADE' })
  room: Room;

  @Column()
  roomId: number;

  @Column()
  guestName: string;

  @Column({ type: 'timestamptz' })
  checkIn: Date;

  @Column({ type: 'timestamptz' })
  checkOut: Date;

  @CreateDateColumn()
  createdAt: Date;

  @Column({ nullable: true })
  guestEmail?: string;

  @Column({ nullable: true })
  guestsCount?: number;
}
