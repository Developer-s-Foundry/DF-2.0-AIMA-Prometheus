import { databaseConfig } from "../config/database.js";
export default class ProjectRepository {
  constructor(datasource = databaseConfig) {
    this.datasource = datasource;
  }

  async create(creationData) {
    const entity = this.datasource.query(`INSERT INTO projects 
        (name, description, base_url, prometheus_metric_url, team_id, owner_id)
        VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`, [
        creationData.name,
        creationData.description,
        creationData.base_url,
        creationData.prometheus_metric_url,
        creationData.team_id,
        creationData.owner_id,
        ]);
    return entity.save();
  }

  async update(updateData) {
    const entity = this.datasource.query(`UPDATE projects SET 
        name = $1,
        description = $2,
        base_url = $3,
        prometheus_metric_url = $4,
        team_id = $5,
        owner_id = $6
        WHERE id = $7 RETURNING *`, [
        updateData.name,
        updateData.description,
        updateData.base_url,
        updateData.prometheus_metric_url,
        updateData.team_id,
        updateData.owner_id,
        updateData.id,
        ])
    
  }

  async delete({id}) {
    const entity = this.datasource.query(`DELETE FROM projects WHERE id = $1 RETURNING *`, [
      id,
    ])
  }
}