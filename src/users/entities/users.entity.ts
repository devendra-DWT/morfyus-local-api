import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Users {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ nullable: true, name: 'refresh_token' })
  refreshToken: string;

  @Column()
  role: string;

  @Column({ name: 'is_completed' })
  isCompleted: boolean;

  @Column({ nullable: true, name: 'confirm_email_token' })
  confirmEmailToken: string;

  @Column({ name: 'is_email_confirmed' })
  isEmailConfirmed: boolean;

  @Column({ nullable: true, name: 'reset_password_token' })
  resetPasswordToken: string;

  @Column({ nullable: true })
  cid: string;

  @Column({ nullable: true, unique: true })
  username: string;

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
    name: 'created_at',
  })
  public createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
    onUpdate: 'CURRENT_TIMESTAMP(6)',
    name: 'updated_at',
  })
  public updatedAt: Date;
}
