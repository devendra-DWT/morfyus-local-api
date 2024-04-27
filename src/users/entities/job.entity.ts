import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Job {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'user_id' })
  userId: number;

  @Column()
  description: string;

  @Column()
  category: string;

  @Column({ name: 'payment_option' })
  paymentOption: string;

  @Column({ nullable: true, name: 'price_max' })
  priceMax: number;

  @Column({ nullable: true, name: 'price_min' })
  priceMin: number;

  @Column({ nullable: true, name: 'fix_price' })
  fixPrice: number;

  @Column()
  headline: string;

  @Column({ name: 'publication_cost' })
  publicationCost: string;

  @Column({ type: 'jsonb', nullable: true, default: [] })
  files: Record<string, any>;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @Column({ name: 'is_deleted', default: false })
  isDeleted: boolean;

  @Column({ name: 'is_admin_deleted', default: false })
  isAdminDeleted: boolean;

  @Column('jsonb', { nullable: true })
  skillsJob: { skillId: number }[];

  @Column({ name: 'deleted_reason', nullable: true })
  deletedReason: string;

  @Column({ type: 'timestamp', name: 'deleted_at', nullable: true })
  deletedAt: string;

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
