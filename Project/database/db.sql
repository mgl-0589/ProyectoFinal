CREATE DATABASE prueba1;

USE prueba1;

-- CREATE USUARIOS TABLE --
DROP TABLE IF EXISTS `usuarios`;

CREATE TABLE `usuarios` (
  `ID_USUARIO` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `APELLIDO_PATERNO` varchar(50) NOT NULL,
  `APELLIDO_MATERNO` varchar(50) DEFAULT NULL,
  `NOMBRE` varchar(50) NOT NULL,
  `CORREO` varchar(50) NOT NULL,
  `PASSWORD` varchar(100) NOT NULL,
  `ID_PERFIL` int(2) DEFAULT NULL,

  PRIMARY KEY (`ID_USUARIO`)

) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- DESCRIBE USUARIOS --
DESCRIBE usuarios;

-- CREAT CAT_ESCOLARIDAD --
DROP TABLE IF EXISTS `cat_escolaridad`;

CREATE TABLE `cat_escolaridad` (
  `ID_ESCOLARIDAD` int(2) NOT NULL,
  `ESCOLARIDAD` varchar(50) NOT NULL,

  PRIMARY KEY (`ID_ESCOLARIDAD`)

) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- DESCRIBE CAT_ESCOLARIDAD --
DESCRIBE cat_escolaridad;

-- INSERT VALUES TO CAT_ESCOLARIDAD --
INSERT INTO `cat_escolaridad` VALUES 
  (0,''),
  (1,'SIN ESTUDIOS'),
  (2,'AUTODIDACTA'),
  (3,'ANALFABETA'),
  (4,'PREESCOLAR'),
  (5,'PRIMARIA INCOMPLETA'),
  (6,'PRIMARIA'),
  (7,'SECUNDARIA INCOMPLETA'),
  (8,'SECUNDARIA'),
  (9,'PREPARATORIA INCOMPLETA'),
  (10,'PREPARATORIA'),
  (11,'CARRERA TECNICA INCOMPLETA'),
  (12,'CARERRA TECNICA'),
  (13,'LICENCIATURA INCOMPLETA'),
  (14,'LICENCIATURA'),
  (15,'MAESTRIA'),
  (16,'DOCTORADO');

-- SHOW ESCOLARIDAD --
SELECT * FROM cat_escolaridad;

-- CREATE CAT_ESTADO_CIVIL --
DROP TABLE IF EXISTS `cat_estado_civil`;

CREATE TABLE `cat_estado_civil` (
  `ID_ESTADO_CIVIL` int(2) NOT NULL,
  `ESTADO_CIVIL` varchar(25) NOT NULL,

  PRIMARY KEY (`ID_ESTADO_CIVIL`)

) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- DESCRIBE CAT_ESTADO_CIVIL --
DESCRIBE cat_estado_civil;

-- INSERT VALUES TO CAT_ESTADO_CIVIL --
INSERT INTO `cat_estado_civil` VALUES 
(0,''),
(1,'INDETERMINADO(A)'),
(2,'SOLTERO(A)'),
(3,'CASADO(A)'),
(4,'UNION LIBRE'),
(5,'MADRE SOLETRA'),
(6,'PADRE SOLTERO'),
(7,'SEPARADO(A)'),
(8,'DIVORCIADO(A)'),
(9,'VIUDO(A)');

-- SHOW CAT_ESTADO_CIVIL --
SELECT * FROM cat_estado_civil;

-- CREATE CAT_OCUPACION TABLE --
DROP TABLE IF EXISTS `cat_ocupacion`;

CREATE TABLE `cat_ocupacion` (
  `ID_OCUPACION` int(2) NOT NULL,
  `OCUPACION` varchar(50) NOT NULL,

  PRIMARY KEY (`ID_OCUPACION`)

) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- DESCRIBE CAT_OCUPACION --
DESCRIBE cat_ocupacion;

-- INSERT VALUES TO CAT_OCUPACION --
INSERT INTO `cat_ocupacion` VALUES 
  (0,''),
  (1,'INDETERMINADO'),
  (2,'A. P. E.'),
  (3,'DESEMPLEADO'),
  (4,'EMPLEADO / OBRERO'),
  (5,'ESTUDIA Y TRABAJA'),
  (6,'ESTUDIANTE'),
  (7,'HOGAR'),
  (8,'JORNALERO / ALBAÑIL'),
  (9,'JUBILADO'),
  (10,'MULTIEMPLEADO'),
  (11,'OCUPACION EN SECTOR INFORMAL'),
  (12,'OTRO'),
  (13,'PROFESIONISTA'),
  (14,'TRABAJADOR INDEPENDIENTE'),
  (15,'TRABAJADOR SIN PAGA');

-- SHOW CAT_OCUPACION --
SELECT * FROM cat_ocupacion;

-- CREATE BENFICIARIOS TABLE --
DROP TABLE IF EXISTS `beneficiarios`;

CREATE TABLE `beneficiarios` (
  `ID_BENEFICIARIO` int(11) NOT NULL AUTO_INCREMENT,
  `CURP` varchar(18) NOT NULL,
  `NOMBRE` varchar(50) DEFAULT NULL,
  `APELLIDO_PATERNO` varchar(50) DEFAULT NULL,
  `APELLIDO_MATERNO` varchar(50) DEFAULT NULL,
  `TEL_CASA` varchar(15) DEFAULT NULL,
  `TEL_CELULAR` varchar(15) DEFAULT NULL,
  `CORREO` varchar(100) DEFAULT NULL,
  `PROGRAMA` varchar(100) DEFAULT NULL,

  `CALLE` varchar(200) DEFAULT NULL,
  `NUM_EXT` varchar(10) DEFAULT NULL,
  `NUM_INT` varchar(10) DEFAULT NULL,
  `COLONIA` varchar(100) DEFAULT NULL,
  `CODIGO_POSTAL` varchar(10) DEFAULT NULL,
  `MUNICIPIO` varchar(20) DEFAULT 'ZAPOPAN',
  `ESTADO` varchar(20) DEFAULT 'JALISCO',
  `SEXO` varchar(15) DEFAULT NULL,

  `ID_ESTADO_CIVIL` int(2) DEFAULT NULL,
  `ID_OCUPACION` int(2) DEFAULT NULL,
  `ID_ESCOLARIDAD` int(2) DEFAULT NULL,

  PRIMARY KEY (`ID_BENEFICIARIO`),

  KEY `ID_ESTADO_CIVIL_FK` (`ID_ESTADO_CIVIL`) USING BTREE,
  KEY `ID_OCUPACION_FK` (`ID_OCUPACION`) USING BTREE,
  KEY `ID_ESCOLARIDAD_FK` (`ID_ESCOLARIDAD`) USING BTREE

) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- DESCRIBE BENEFICIARIOS --
DESCRIBE beneficiarios;

-- CREATE REGISTRO_LLAMADAS --
DROP TABLE IF EXISTS `registro_llamadas`;

CREATE TABLE `registro_llamadas` (
  `ID_LLAMADA` int(11) NOT NULL AUTO_INCREMENT,
  `ID_BENEFICIARIO` int(11) NOT NULL,
  `RESULTADO_LLAMADA` enum('CONTESTÓ','PRIMER INTENTO','SEGUNDO INTENTO','NO CONTESTÓ') DEFAULT NULL,
  `CONFIRMACION` enum('','CONFIRMA ASISTENCIA','NO ESTÁ SEGURO','NO ASISTE','ELIMINAR DE PADRÓN') DEFAULT NULL,
  `FECHA_LLAMADA` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `ID_USUARIO` int(10) unsigned DEFAULT NULL,

  PRIMARY KEY (`ID_LLAMADA`),

  KEY `ID_BENEFICIARIO_FK` (`ID_BENEFICIARIO`) USING BTREE,
  KEY `ID_USUARIO` (`ID_USUARIO`) USING BTREE,

  CONSTRAINT `FK_registro_llamada_beneficiario` FOREIGN KEY (`ID_BENEFICIARIO`) REFERENCES `beneficiarios` (`ID_BENEFICIARIO`),
  CONSTRAINT `FK_registro_llamada_cat_usuarios` FOREIGN KEY (`ID_USUARIO`) REFERENCES `usuarios` (`ID_USUARIO`)

) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- DESCRIBE REGISTRO_LLAMADAS --
DESCRIBE registro_llamadas;

-- CREATE REGISTRO_ASISTENCIAS --
DROP TABLE IF EXISTS `registro_asistencias`;

CREATE TABLE `registro_asistencias` (
  `ID_ASISTENCIA` int(11) NOT NULL AUTO_INCREMENT,
  `ID_BENEFICIARIO` int(11) NOT NULL,
  `ASISTENCIA` enum('','PRESENTE') DEFAULT NULL,
  `FECHA_ASISTENCIA` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `ID_USUARIO` int(10) unsigned DEFAULT NULL,

  PRIMARY KEY (`ID_ASISTENCIA`),

  KEY `ID_BENEFICIARIO_FK` (`ID_BENEFICIARIO`) USING BTREE,
  KEY `ID_USUARIO` (`ID_USUARIO`) USING BTREE,

  CONSTRAINT `FK_registro_asistencias_beneficiario` FOREIGN KEY (`ID_BENEFICIARIO`) REFERENCES `beneficiarios` (`ID_BENEFICIARIO`),
  CONSTRAINT `FK_registro_asistencias_usuarios` FOREIGN KEY (`ID_USUARIO`) REFERENCES `usuarios` (`ID_USUARIO`)

) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- DESCRIBE REGISTRO_ASISTENCIAS --
DESCRIBE registro_asistencias;

-- CREATE REGISTRO_ENTREGAS --
DROP TABLE IF EXISTS `registro_entregas`;

CREATE TABLE `registro_entregas` (
  `ID_ENTREGA` int(11) NOT NULL AUTO_INCREMENT,
  `ID_BENEFICIARIO` int(11) NOT NULL,
  `ESTATUS_ENTREGA` enum('','ENTREGADO') DEFAULT NULL,
  `FECHA_ENTREGA` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `ID_USUARIO` int(10) unsigned DEFAULT NULL,

  PRIMARY KEY (`ID_ENTREGA`),

  KEY `ID_BENEFICIARIO_FK` (`ID_BENEFICIARIO`) USING BTREE,
  KEY `ID_USUARIO` (`ID_USUARIO`) USING BTREE,

  CONSTRAINT `FK_registro_entregas_beneficiario` FOREIGN KEY (`ID_BENEFICIARIO`) REFERENCES `beneficiarios` (`ID_BENEFICIARIO`),
  CONSTRAINT `FK_registro_entregas_usuarios` FOREIGN KEY (`ID_USUARIO`) REFERENCES `usuarios` (`ID_USUARIO`)

) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- DESCRIBE REGISTRO_ENTREGAS --
DESCRIBE registro_entregas;