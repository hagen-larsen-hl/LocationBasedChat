import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class ChatRoom {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  roomkey: string;

  @Column()
  longitude: number;

  @Column()
  latitude: number;
}
