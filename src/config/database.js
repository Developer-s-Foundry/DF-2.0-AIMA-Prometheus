import {DataSource} from "typeorm"
import { APP_CONFIGS } from "./index";
import { join } from "path";

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
  entities: APP_CONFIGS.IS_PRODUCTION
    ? [join(__dirname,"../../models/**/*{.js}")]
    : ["src/models/**/*{.js}"],
  migrations: APP_CONFIGS.IS_PRODUCTION
    ? ["../../database/migrations/**/*{.js}"]
    : ["src/database/migrations/**/*{.js}"],
});

export const dbInstance = async () => {
  try {
    await databaseConfig.initialize();
    console.log("Database connection was successful");
  } catch (err) {
    console.log("Database connection failed with error: ", err)
  }
}