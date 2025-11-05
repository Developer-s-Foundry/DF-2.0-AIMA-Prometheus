import 'reflect-metadata';
import { Column, Entity } from "typeorm";
import BaseModel from "./BaseModel.js";

@Entity("projects")
export default class ProjectModel extends BaseModel {
  @Column()
  name;

  @Column()
  description;

  @Column({ unique: true })
  base_url;

  @Column({ unique: true })
  prometheus_metric_url;

  @Column()
  team_id

  @Column()
  owner_id
}