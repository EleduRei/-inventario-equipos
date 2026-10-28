-- Datos de prueba para el Sistema de Inventario de Equipamiento Tecnológico
-- Ejecutar DESPUÉS de iniciar el backend al menos una vez (TypeORM crea la tabla).
-- INSERT IGNORE: si un código de inventario ya existe, esa fila se omite y no da error.

USE inventario_tecnologico;

INSERT IGNORE INTO equipos
  (codigoInventario, nombre, tipo, marca, modelo, ubicacion, estado, fechaAdquisicion, observaciones)
VALUES
  ('NB-001',  'Notebook Laboratorio 1',     'Notebook',  'Lenovo',  'ThinkPad E14',   'Laboratorio 1',        'Disponible', '2025-03-15', 'Incluye cargador'),
  ('PC-001',  'PC Secretaría Académica',    'PC',        'HP',      'ProDesk 400 G7', 'Secretaría Académica', 'En uso',     '2024-08-20', NULL),
  ('MON-001', 'Monitor Sala de Profesores', 'Monitor',   'Samsung', 'S24R350',        'Sala de Profesores',   'En uso',     '2024-05-10', '24 pulgadas'),
  ('PRY-001', 'Proyector Sala 204',         'Proyector', 'Epson',   'PowerLite X49',  'Sala 204',             'Mantención', '2023-11-02', 'Lámpara con bajo brillo'),
  ('NB-002',  'Notebook Dirección',         'Notebook',  'Dell',    'Latitude 3420',  'Dirección',            'Disponible', '2025-01-08', NULL),
  ('IMP-001', 'Impresora Biblioteca',       'Impresora', 'Brother', 'HL-L5100DN',     'Biblioteca',           'Baja',       '2019-06-14', 'Pendiente de retiro');

SELECT COUNT(*) AS total_equipos FROM equipos;
