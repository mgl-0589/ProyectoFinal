CREATE DATABASE database_prueba1;

USE database_prueba1;

-- CREATING CAT_ESTADO CIVIL TABLE --
CREATE TABLE IF NOT EXISTS `cat_estado_civil` (
  `ID_ESTADO_CIVIL` int(2) NOT NULL AUTO_INCREMENT,
  `ESTADO_CIVIL` varchar(25) NOT NULL,
  PRIMARY KEY (`ID_ESTADO_CIVIL`)
  
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4;

-- DESCRIBING CAT_ESTADO_CIVIL TABLE --
DESCRIBE cat_estado_civil;

-- INSERT VALUES TO CAT_ESTADO_CIVIL --
INSERT INTO `cat_estado_civil` (`ID_ESTADO_CIVIL`, `ESTADO_CIVIL`) VALUES
  (0, ''),
	(1, 'INDETERMINADO(A)'),
	(2, 'SOLTERO(A)'),
	(3, 'CASADO(A)'),
	(4, 'UNION LIBRE'),
	(5, 'MADRE SOLTERA'),
	(6, 'PADRE SOLTERO'),
	(7, 'SEPARADO(A)'),
	(8, 'DIVORCIADO(A)'),
	(9, 'VIUDO(A)');
    
-- SHOW CAT_ESTADO_CIVIL --
SELECT * FROM cat_estado_civil;

-- CREATING OCUPACION TABLE --
CREATE TABLE IF NOT EXISTS `cat_ocupacion` (
  `ID_OCUPACION` int(2) NOT NULL AUTO_INCREMENT,
  `OCUPACION` varchar(50) NOT NULL,
  PRIMARY KEY (`ID_OCUPACION`)
  
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4;

-- DESCRIBING OCUPACION TABLE --
DESCRIBE cat_ocupacion;

-- INSERT VALUES TO OCUPACION --
INSERT INTO `cat_ocupacion` (`ID_OCUPACION`, `OCUPACION`) VALUES
  (0, ''),
	(1, 'IDETERMINADO(A)'),
	(2, 'A. P. E.'),
	(3, 'DESEMPLEADO'),
	(4, 'EMPLEADO / OBRERO'),
	(5, 'ESTUDIA Y TRABAJA'),
	(6, 'ESTUDIANTE'),
	(7, 'HOGAR'),
	(8, 'JORNALERO / ALBAÑIL'),
	(9, 'JUBILADO'),
	(10, 'MULTIEMPLEADO'),
	(11, 'OCUPACION EN EL SECTOR INFORMAL'),
	(12, 'OTRO'),
	(13, 'PROFESIONISTA'),
	(14, 'TRABAJADOR INDEPENDIENTE'),
	(15, 'TRABAJADOR SIN PAGA');
    
-- SHOW CAT_OCUPACION --
SELECT * FROM cat_ocupacion;
    
-- CREATING CAT_ESCOLARIDAD TABLE --
CREATE TABLE IF NOT EXISTS `cat_escolaridad` (
  `ID_ESCOLARIDAD` int(2) NOT NULL,
  `ESCOLARIDAD` varchar(50) NOT NULL,
  
  PRIMARY KEY (`ID_ESCOLARIDAD`)
  
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- DESCRIBE CAT_ESCOLARIDAD --
DESCRIBE cat_escolaridad;

-- INSERT VALUES TO CAT_ESCOLARIDAD --
INSERT INTO `cat_escolaridad` (`ID_ESCOLARIDAD`, `ESCOLARIDAD`) VALUES
	(0, ''),
  (1, 'SIN ESTUDIOS'),
	(2, 'AUTODIDACTA'),
	(3, 'ANALFABETA'),
	(4, 'PREESCOLAR'),
	(5, 'PRIMARIA INCOMPLETA'),
	(6, 'PRIMARIA'),
	(7, 'SECUNDARIA INCOMPLETA'),
	(8, 'SECUNDARIA'),
	(9, 'PREPARATORIA INCOMPLETA'),
	(10, 'PREPARATORIA'),
	(11, 'CARRERA TECNICA INCOMPLETA'),
	(12, 'CARRERA TECNICA'),
	(13, 'LICENCIATURA INCOMPLETA'),
	(14, 'LICENCIATURA'),
	(15, 'MAESTRIA'),
	(16, 'DOCTORADO');
    
-- SHOW CAT_ESCOLARIDAD --
SELECT * FROM cat_escolaridad;

-- CREATING BENEFICIARIOS TABLE --
CREATE TABLE IF NOT EXISTS `beneficiarios` (
  `ID_BENEFICIARIO` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `CURP` varchar(18) NOT NULL,
  `NOMBRE` varchar(50) DEFAULT NULL,
  `APELLIDO_PATERNO` varchar(50) DEFAULT NULL,
  `APELLIDO_MATERNO` varchar(50) DEFAULT NULL,
  `TEL_CASA` varchar(15) DEFAULT NULL,
  `TEL_CELULAR` varchar(15) DEFAULT NULL,
  `CORREO` varchar(100) DEFAULT NULL,
  `PROGRAMA` varchar(100) DEFAULT NULL,
  
  `CALLE` varchar(200) DEFAULT NULL,
  `NUM_EXT` varchar(10) DEFAULT,
  `NUM_INT` varchar(10) DEFAULT,
  `COLONIA` varchar(100) DEFAULT NULL,
  `CODIGO_POSTAL` varchar(10) DEFAULT,
  `MUNICIPIO` varchar(20) DEFAULT 'ZAPOPAN',
  `ESTADO` varchar(20) DEFAULT 'JALISCO',
  
  `SEXO` varchar(15) DEFAULT NULL,
  `ID_ESTADO_CIVIL` int(2) DEFAULT,
  `ID_OCUPACION` int(2) DEFAULT,
  `ID_ESCOLARIDAD` int(2) DEFAULT,
  
  PRIMARY KEY (`ID_BENEFICIARIO`),
  
  KEY `ID_ESTADO_CIVIL_FK` (`ID_ESTADO_CIVIL`) USING BTREE,
  KEY `ID_OCUPACION_FK` (`ID_OCUPACION`) USING BTREE,
  KEY `ID_ESCOLARIDAD_FK` (`ID_ESCOLARIDAD`) USING BTREE,
  
  CONSTRAINT `beneficiario_ibfk_3` FOREIGN KEY (`ID_ESTADO_CIVIL`) REFERENCES `cat_estado_civil` (`ID_ESTADO_CIVIL`),
  CONSTRAINT `beneficiario_ibfk_2` FOREIGN KEY (`ID_OCUPACION`) REFERENCES `cat_ocupacion` (`ID_OCUPACION`),
  CONSTRAINT `beneficiario_ibfk_1` FOREIGN KEY (`ID_ESCOLARIDAD`) REFERENCES `cat_escolaridad` (`ID_ESCOLARIDAD`)
  
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4;

-- DESCRIBING BENEFICIARIOS TABLE --
DESCRIBE beneficiarios;

-- CREATE cat_perfiles TABLE --
CREATE TABLE IF NOT EXISTS `cat_perfiles` (
  `ID_PERFIL` int(2) NOT NULL,
  `PERFIL` varchar(20) NOT NULL,
  
  PRIMARY KEY (`ID_PERFIL`)

) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- DESCRIBE CAT_PERFILES --
DESCRIBE cat_perfiles;

-- INSERT VALUES TO CAT_PERFILES --
INSERT INTO `cat_perfiles` (`ID_PERFIL`, `PERFIL`) VALUES
	(1, 'ADMINISTRADOR'),
    (2, 'APOYO');

-- SHOW CAT_PERFILES --
SELECT * FROM cat_perfiles;

-- CREATE USUARIOS TABLE --
CREATE TABLE IF NOT EXISTS `usuarios` (
  `ID_USUARIO` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `APELLIDO_PATERNO` varchar(50) NOT NULL,
  `APELLIDO_MATERNO` varchar(50) DEFAULT NULL,
  `NOMBRE` varchar(50) NOT NULL,
  `CORREO` varchar(50) NOT NULL,
  PASSWORD varchar(100) NOT NULL,
  `ID_PERFIL` int(2) NOT NULL,
  
  PRIMARY KEY (`ID_USUARIO`),
  
  KEY `ID_PERFIL_FK` (`ID_PERFIL`) USING BTREE,
  
  CONSTRAINT `FK_usuarios_cat_perfiles` FOREIGN KEY (`ID_PERFIL`) REFERENCES `cat_perfiles` (`ID_PERFIL`)
  
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- DESCRIBE usuarios --
DESCRIBE usuarios;

-- CREATE REGISTRO_ASISTENCIA TABLE --
CREATE TABLE IF NOT EXISTS `registro_asistencia` (
  `ID_LLAMADA` int(11) NOT NULL AUTO_INCREMENT,
  `ID_BENEFICIARIO` int(11) NOT NULL,
  `ASISTENCIA` ENUM('', 'PRESENTE') DEFAULT NULL,
  `FECHA_ASISTENCIA` TIMESTAMP NOT NULL DEFAULT current_timestamp,
  `ID_USUARIO` int(10) unsigned NOT NULL,
  
  PRIMARY KEY (`ID_LLAMADA`),
  
  KEY `ID_BENEFICIARIO_FK` (`ID_BENEFICIARIO`) USING BTREE,
  KEY `ID_USUARIO` (`ID_USUARIO`) USING BTREE,
  
  CONSTRAINT `FK_registro_asistencia_beneficiario` FOREIGN KEY (`ID_BENEFICIARIO`) REFERENCES `beneficiarios` (`ID_BENEFICIARIO`),
  CONSTRAINT `FK_registro_asistencia_usuarios` FOREIGN KEY (`ID_USUARIO`) REFERENCES `usuarios` (`ID_USUARIO`)
  
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- DESCRIBE REGISTRO_ASISTENCIA --
DESCRIBE registro_asistencia;

-- CREATE REGISTRO_ASISTENCIA TABLE --
CREATE TABLE IF NOT EXISTS `registro_entregas` (
  `ID_ENTREGA` int(11) NOT NULL AUTO_INCREMENT,
  `ID_BENEFICIARIO` int(11) NOT NULL,
  `ESTATUS_ENTREGA` ENUM('', 'ENTREGADO') DEFAULT NULL,
  `FECHA_ENTREGA` TIMESTAMP NOT NULL DEFAULT current_timestamp,
  `ID_USUARIO` int(10) unsigned NOT NULL,
  
  PRIMARY KEY (`ID_ENTREGA`),
  
  KEY `ID_BENEFICIARIO_FK` (`ID_BENEFICIARIO`) USING BTREE,
  KEY `ID_USUARIO` (`ID_USUARIO`) USING BTREE,
  
  CONSTRAINT `FK_registro_entregas_beneficiario` FOREIGN KEY (`ID_BENEFICIARIO`) REFERENCES `beneficiarios` (`ID_BENEFICIARIO`),
  CONSTRAINT `FK_registro_entregas_usuarios` FOREIGN KEY (`ID_USUARIO`) REFERENCES `usuarios` (`ID_USUARIO`)
  
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- DESCRIBE REGISTRO_ASISTENCIA --
DESCRIBE registro_entregas;

-- CREATE REGISTRO_LLAMADAS TABLE --
CREATE TABLE IF NOT EXISTS `registro_llamadas` (
  `ID_LLAMADA` int(11) NOT NULL AUTO_INCREMENT,
  `ID_BENEFICIARIO` int(11) NOT NULL,
  `RESULTADO_LLAMADA` ENUM('CONTESTÓ', 'PRIMER INTENTO', 'SEGUNDO INTENTO', 'NO CONTESTÓ') DEFAULT NULL,
  `CONFIRMACION` ENUM('', 'CONFIRMA ASISTENCIA', 'NO ESTÁ SEGURO', 'NO ASISTE', 'ELIMINAR DE PADRÓN') DEFAULT NULL,
  `FECHA_LLAMADA` TIMESTAMP NOT NULL DEFAULT current_timestamp,
  `ID_USUARIO` int(10) unsigned NOT NULL,
  
  PRIMARY KEY (`ID_LLAMADA`),
  
  KEY `ID_BENEFICIARIO_FK` (`ID_BENEFICIARIO`) USING BTREE,
  KEY `ID_USUARIO` (`ID_USUARIO`) USING BTREE,
  
  CONSTRAINT `FK_registro_llamada_beneficiario` FOREIGN KEY (`ID_BENEFICIARIO`) REFERENCES `beneficiarioS` (`ID_BENEFICIARIO`),
  CONSTRAINT `FK_registro_llamada_cat_usuarios` FOREIGN KEY (`ID_USUARIO`) REFERENCES `usuarios` (`ID_USUARIO`)
  
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- DESCRIBE REGISTRO_LLAMADAS --
describe registro_llamadas;
