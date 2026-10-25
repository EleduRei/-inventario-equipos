import { Transform, TransformFnParams } from 'class-transformer';
import {
  IsDateString,
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { ESTADOS_EQUIPO } from '../entities/equipo.entity';

// Quita espacios al inicio y al final: "   " pasa a "" y falla en IsNotEmpty
const limpiar = ({ value }: TransformFnParams) =>
  typeof value === 'string' ? value.trim() : value;

export class CreateEquipoDto {
  @Transform(limpiar)
  @IsString()
  @MinLength(3, {
    message: 'El código de inventario debe tener al menos 3 caracteres',
  })
  @MaxLength(50)
  codigoInventario: string;

  @Transform(limpiar)
  @IsString()
  @MinLength(3, { message: 'El nombre debe tener al menos 3 caracteres' })
  @MaxLength(100)
  nombre: string;

  @Transform(limpiar)
  @IsString()
  @IsNotEmpty({ message: 'El tipo es obligatorio' })
  @MaxLength(50)
  tipo: string;

  @Transform(limpiar)
  @IsString()
  @IsNotEmpty({ message: 'La marca es obligatoria' })
  @MaxLength(50)
  marca: string;

  @Transform(limpiar)
  @IsString()
  @IsNotEmpty({ message: 'El modelo es obligatorio' })
  @MaxLength(50)
  modelo: string;

  @Transform(limpiar)
  @IsString()
  @IsNotEmpty({ message: 'La ubicación es obligatoria' })
  @MaxLength(100)
  ubicacion: string;

  @IsIn(ESTADOS_EQUIPO, {
    message: 'El estado debe ser: Disponible, En uso, Mantención o Baja',
  })
  estado: string;

  // strict: true rechaza fechas imposibles como 2026-02-30
  @IsDateString(
    { strict: true },
    {
      message: 'La fecha de adquisición debe ser una fecha válida (AAAA-MM-DD)',
    },
  )
  fechaAdquisicion: string;

  @IsOptional()
  @IsString()
  observaciones?: string;
}
