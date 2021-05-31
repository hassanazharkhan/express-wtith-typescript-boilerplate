import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';

import { ToDoItem } from './to-do-item';
import { User } from './users';

@Entity({ name: 'to-do-list' })
export class ToDoList {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @Column()
  title: string;

  @OneToMany(() => ToDoItem, toDoItem => toDoItem.toDoList)
  toDoItems: ToDoItem[];

  @ManyToOne(() => User)
  user: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
