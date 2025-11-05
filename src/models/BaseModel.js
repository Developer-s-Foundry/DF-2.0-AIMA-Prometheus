import { Column, CreateDateColumn, DeleteDateColumn, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

export default class BaseModel {
  @PrimaryGeneratedColumn("increment")
  id;

  @CreateDateColumn()
  created_at;

  @UpdateDateColumn({nullable: true})
  updated_at;

  @DeleteDateColumn({ nullable: true })
  deleted_at;
}