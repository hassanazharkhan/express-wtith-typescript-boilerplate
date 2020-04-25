import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, CreateDateColumn, UpdateDateColumn } from "typeorm";

import { ToDoItem } from "./ToDoItem";
import { User } from "./User";

@Entity()
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
