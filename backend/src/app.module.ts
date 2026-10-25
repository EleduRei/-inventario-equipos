import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EquiposModule } from './equipos/equipos.module';

@Module({
  imports: [
    // Lee el archivo .env y lo deja disponible en toda la app
    ConfigModule.forRoot({ isGlobal: true }),

    // Conexión a MySQL usando las variables de entorno
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'mysql',
        host: config.get<string>('DB_HOST'),
        port: Number(config.get('DB_PORT', 3306)),
        username: config.get<string>('DB_USERNAME'),
        password: config.get<string>('DB_PASSWORD'),
        database: config.get<string>('DB_DATABASE'),
        autoLoadEntities: true,
        synchronize: true,
        dateStrings: true,
      }),
    }),

    EquiposModule,
  ],
})
export class AppModule {}