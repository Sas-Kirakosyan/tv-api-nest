import { DataSource } from "typeorm";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: "postgres",
  password: "MySt0ngDBP@ss",
  database: "novatv",
  entities: [__dirname + "/**/*.entity{.ts,.js}"],
  migrations: [__dirname + "/migrations/*{.ts,.js}"],
  synchronize: true,
  // autoLoadEntities: true, // Automatically load entities
  ssl: {
    rejectUnauthorized: false, // Required for Supabase
  },
});
