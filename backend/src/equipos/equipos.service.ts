import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateEquipoDto } from './dto/create-equipo.dto';
import { UpdateEquipoDto } from './dto/update-equipo.dto';
import { Equipo } from './entities/equipo.entity';

@Injectable()
export class EquiposService {
  constructor(
    @InjectRepository(Equipo)
    private readonly equiposRepository: Repository<Equipo>,
  ) {}

  async create(dto: CreateEquipoDto): Promise<Equipo> {
    await this.verificarCodigoUnico(dto.codigoInventario);
    const equipo = this.equiposRepository.create(dto); // arma el objeto
    return this.equiposRepository.save(equipo); // INSERT en MySQL
  }

  findAll(): Promise<Equipo[]> {
    return this.equiposRepository.find({ order: { id: 'ASC' } }); // SELECT *
  }

  async findOne(id: number): Promise<Equipo> {
    const equipo = await this.equiposRepository.findOneBy({ id });
    if (!equipo) {
      throw new NotFoundException(`No existe un equipo con id ${id}`); // 404
    }
    return equipo;
  }

  async update(id: number, dto: UpdateEquipoDto): Promise<Equipo> {
    const equipo = await this.findOne(id); // si no existe, ya lanza 404
    if (
      dto.codigoInventario &&
      dto.codigoInventario !== equipo.codigoInventario
    ) {
      await this.verificarCodigoUnico(dto.codigoInventario);
    }
    this.equiposRepository.merge(equipo, dto); // copia solo los campos enviados
    return this.equiposRepository.save(equipo); // UPDATE en MySQL
  }

  async remove(id: number): Promise<void> {
    const equipo = await this.findOne(id);
    await this.equiposRepository.remove(equipo); // DELETE en MySQL
  }

  private async verificarCodigoUnico(codigo: string): Promise<void> {
    const existe = await this.equiposRepository.findOneBy({
      codigoInventario: codigo,
    });
    if (existe) {
      // 409 Conflict: el código de inventario ya está registrado
      throw new ConflictException(`Ya existe un equipo con el código ${codigo}`);
    }
  }
}
