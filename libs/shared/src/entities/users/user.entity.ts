import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  Generated,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'users' })
export class User extends BaseEntity {
  @PrimaryGeneratedColumn({ unsigned: true, type: 'int' })
  @Generated('increment')
  userId: number;

  @Column({ length: 255 })
  email: string;

  @Column({ length: 255 })
  firstname: string;

  @Column({ length: 255 })
  lastname: string;

  @Column('text')
  password: string;

  @CreateDateColumn()
  createDate: Date;

  @UpdateDateColumn()
  updateDate: Date;
}

