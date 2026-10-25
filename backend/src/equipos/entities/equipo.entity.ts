import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

export const ESTADOS_EQUIPO = ['Disponible', 'En uso', 'Mantención', 'Baja'];

@Entity('equipos')
export class Equipo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 50, unique: true })
  codigoInventario: string;

  @Column({ length: 100 })
  nombre: string;

  @Column({ length: 50 })
  tipo: string;

  @Column({ length: 50 })
  marca: string;

  @Column({ length: 50 })
  modelo: string;

  @Column({ length: 100 })
  ubicacion: string;

  @Column({ type: 'enum', enum: ESTADOS_EQUIPO, default: 'Disponible' })
  estado: string;

  @Column({ type: 'date' })
  fechaAdquisicion: string;

  @Column({ type: 'text', nullable: true })
  observaciones: string | null;
}
