import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from './entities/task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepo: Repository<Task>,
  ) {}

  async findAll(): Promise<Task[]> {
    return this.taskRepo.find({
      order: { position: 'ASC', created_at: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Task> {
    const task = await this.taskRepo.findOne({ where: { id } });
    if (!task) throw new NotFoundException(`Task with id ${id} not found`);
    return task;
  }

  async create(dto: CreateTaskDto): Promise<Task> {
    const task = this.taskRepo.create({
      title: dto.title,
      description: dto.description ?? null,
      status: dto.status ?? 'TODO',
      priority: dto.priority ?? 'MEDIUM',
      due_date: dto.due_date ?? null,
      labels: dto.labels ?? [],
      project: dto.project ?? null,
      assignee: dto.assignee ?? null,
      position: dto.position ?? 0,
    });
    return this.taskRepo.save(task);
  }

  async update(id: string, dto: UpdateTaskDto): Promise<Task> {
    const task = await this.findOne(id);
    Object.assign(task, dto);
    return this.taskRepo.save(task);
  }

  async remove(id: string): Promise<void> {
    const task = await this.findOne(id);
    await this.taskRepo.remove(task);
  }

  async seedIfEmpty(): Promise<void> {
    const count = await this.taskRepo.count();
    if (count > 0) return;

    const seeds = [
      {
        title: 'Review Figma Design',
        description:
          'Study the provided Figma file and note layout, spacing, colors, and components for the task board.',
        status: 'TODO',
        priority: 'HIGH',
        due_date: '2026-08-22',
        labels: ['design', 'figma'],
        project: 'AbleSpace Assessment',
        assignee: 'Guest',
        position: 0,
      },
      {
        title: 'Connect Task API',
        description:
          'Wire the Next.js frontend to the NestJS REST endpoints for CRUD operations.',
        status: 'TODO',
        priority: 'HIGH',
        due_date: '2026-08-24',
        labels: ['frontend', 'api'],
        project: 'AbleSpace Assessment',
        assignee: 'Guest',
        position: 1,
      },
      {
        title: 'Prepare README',
        description: 'Write a clear README covering setup, endpoints, and architecture.',
        status: 'TODO',
        priority: 'MEDIUM',
        due_date: '2026-08-25',
        labels: ['docs'],
        project: 'AbleSpace Assessment',
        assignee: 'Guest',
        position: 2,
      },
      {
        title: 'Implement Guest Login',
        description: 'Build the guest login screen and POST /auth/guest flow.',
        status: 'IN_PROGRESS',
        priority: 'HIGH',
        due_date: '2026-08-21',
        labels: ['auth', 'frontend'],
        project: 'AbleSpace Assessment',
        assignee: 'Guest',
        position: 0,
      },
      {
        title: 'Test Responsive Layout',
        description:
          'Verify the dashboard across desktop, tablet, and mobile breakpoints.',
        status: 'IN_PROGRESS',
        priority: 'MEDIUM',
        due_date: '2026-08-23',
        labels: ['testing', 'ui'],
        project: 'AbleSpace Assessment',
        assignee: 'Guest',
        position: 1,
      },
      {
        title: 'Seed Demo Tasks',
        description:
          'Add realistic sample tasks so the reviewer sees a useful dashboard immediately.',
        status: 'IN_PROGRESS',
        priority: 'LOW',
        due_date: '2026-08-20',
        labels: ['data'],
        project: 'AbleSpace Assessment',
        assignee: 'Guest',
        position: 2,
      },
      {
        title: 'Set Up NestJS Backend',
        description: 'Scaffold the NestJS project with TypeORM and SQLite configuration.',
        status: 'COMPLETED',
        priority: 'HIGH',
        due_date: '2026-08-19',
        labels: ['backend', 'setup'],
        project: 'AbleSpace Assessment',
        assignee: 'Guest',
        position: 0,
      },
      {
        title: 'Configure CORS',
        description:
          'Allow the Next.js frontend origin to call the NestJS backend during local dev.',
        status: 'COMPLETED',
        priority: 'MEDIUM',
        due_date: '2026-08-19',
        labels: ['backend', 'config'],
        project: 'AbleSpace Assessment',
        assignee: 'Guest',
        position: 1,
      },
    ];

    const entities = seeds.map((s) => this.taskRepo.create(s));
    await this.taskRepo.save(entities);
    console.log('Seeded demo tasks.');
  }
}
