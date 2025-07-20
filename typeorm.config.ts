import { DataSource } from "typeorm";
import 'dotenv/config'
// import { TypeOrmLogger } from "./src/common/logger";


export default new DataSource({
  type: 'postgres',
  host: process.env.POSTGRES_HOST,
  port: parseInt(process.env.POSTGRES_PORT ?? '5432'),
  password: process.env.POSTGRES_PASSWORD ?? '',
  username: process.env.POSTGRES_USER,
  entities: ['dist/**/entities/*.entity{.ts,.js}'],
  migrations: ['dist/src/migrations/*{.ts,.js}'],
  database: process.env.POSTGRES_DATABASE,
  synchronize: false,
  logging: true,
  // logger: new TypeOrmLogger()
})
