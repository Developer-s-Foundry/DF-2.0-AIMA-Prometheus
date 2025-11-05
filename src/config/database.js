import {DataSource} from "typeorm"
import { APP_CONFIGS } from "./index.js";

const {
  DATABASE_PASSWORD,
  DATABASE_HOST,
  DATABASE_NAME,
  DATABASE_PORT,
  DATABASE_USERNAME,
} = APP_CONFIGS;


export const databaseConfig = new DataSource({
  type: "postgres",
  host: `${DATABASE_HOST}`,
  port: parseInt(DATABASE_PORT),
  username: DATABASE_USERNAME,
  password: DATABASE_PASSWORD,
  database: DATABASE_NAME,
  logging: true,
  entities: ["src/models/*{.js}"],
  migrations: ["src/migrations/*{.js}"]
});

export const dbInstance = async () => {
  try {
    await databaseConfig.initialize();
    console.log("Database connection was successful");
  } catch (err) {
    console.log("Database connection failed with error: ", err)
  }
}