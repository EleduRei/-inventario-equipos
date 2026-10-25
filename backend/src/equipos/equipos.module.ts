import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EquiposService } from './equipos.service';
import { EquiposController } from './equipos.controller';
import { Equipo } from './entities/equipo.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Equipo])], // habilita el Repository<Equipo>
  controllers: [EquiposController],
  providers: [EquiposService],
})
export class EquiposModule {}
