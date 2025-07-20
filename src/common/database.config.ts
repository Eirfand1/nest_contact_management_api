export default () => ({
  database: {
    type: 'postgres',
    host: process.env.POSTGRES_HOST,
    port: parseInt(process.env.POSTGRES_PORT || '5432', 10),
    username: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DATABASE,
    entities: ['dist/**/entities/*.entity{.ts,.js}'],
    migrations: ['dist/src/migrations/*{.ts,.js}'],
    synchronize: false,
    logging: true,
  }
});
