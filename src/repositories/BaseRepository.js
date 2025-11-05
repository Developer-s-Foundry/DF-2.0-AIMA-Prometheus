import { DataSource, DeepPartial, FindOneOptions, FindOptionsWhere, ObjectLiteral, Repository } from "typeorm";


export class BaseRepository{
  constructor(
    model,
    datasource
  ) {
    this.repository = datasource.getRepository(model);
    this.datasource = datasource;
  }

  async create(creationData) {
    const entity = this.repository.create(creationData);
    return this.repository.save(entity);
  }

  async updateOne(
    conditions,
    fieldsToUpdate
  ) {
    await this.repository.update(conditions, fieldsToUpdate);
    const modelInUse = this.getRepo();
    return (await modelInUse.findOne({ where: conditions }));
  }

  async findByConditions(conditions){
    return this.repository.findOne({
      where: conditions,
    });
  }

  async findManyByConditions(conditions){
    return this.repository.find({
      where: conditions,
    });
  }

  getRepo(){
    return this.repository;
  }
}