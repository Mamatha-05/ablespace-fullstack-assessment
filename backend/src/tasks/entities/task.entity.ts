import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('tasks')
export class Task {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text', nullable: false })
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string | null;

  @Column({ type: 'text', default: 'TODO' })
  status: string;

  @Column({ type: 'text', default: 'MEDIUM' })
  priority: string;

  @Column({ type: 'date', nullable: true })
  due_date: string | null;

  @Column({ type: 'simple-array', default: '' })
  labels: string[];

  @Column({ type: 'text', nullable: true })
  project: string | null;

  @Column({ type: 'text', nullable: true })
  assignee: string | null;

  @Column({ type: 'integer', default: 0 })
  position: number;

  @CreateDateColumn({ type: 'datetime' })
  created_at: Date;

  @UpdateDateColumn({ type: 'datetime' })
  updated_at: Date;
}
