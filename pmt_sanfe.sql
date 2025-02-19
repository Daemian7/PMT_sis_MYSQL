-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 19-02-2025 a las 07:12:29
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `pmt_sanfe`
--

DELIMITER $$
--
-- Procedimientos
--
CREATE DEFINER=`root`@`localhost` PROCEDURE `AddMultaDetalle` (IN `id_articulo` INT)   BEGIN
    DECLARE UlmID INT;

    -- Obtener el último ID registrado en la tabla multa
    SELECT MAX(id_multa) INTO UlmID FROM multa;

    INSERT INTO multa_detalle (id_multa, id_articulo)
    VALUES (UlmID, id_articulo);
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `CreateSession` (IN `p_usuario` VARCHAR(100), IN `p_passw` VARCHAR(50))   BEGIN
    INSERT INTO session_init (usuario, passw)
    VALUES (p_usuario, p_passw);
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `GetSession` (IN `p_id_sess` INT)   BEGIN
    SELECT id_sess, usuario, passw
    FROM session_init
    WHERE id_sess = p_id_sess;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `InsertarBoletaVehiculo` (IN `tipo_placa` INT, IN `placa_cod` VARCHAR(8), IN `id_vehiculo` INT, IN `nit_prop` INT, IN `tarjeta_circ` VARCHAR(100), IN `marca` VARCHAR(100), IN `color` VARCHAR(100), IN `tipo_licencia` INT, IN `no_licencia` VARCHAR(100), IN `dpi` VARCHAR(13), IN `extendida` INT, IN `nombre` VARCHAR(255), IN `no_boleta` INT)   BEGIN
    -- Insertar datos en la tabla boleta_vehiculo
    INSERT INTO boleta_vehiculo (
        tipo_placa,
        placa_cod,
        id_vehiculo,
        nit_prop,
        tarjeta_circ,
        marca,
        color,
        tipo_licencia,
        no_licencia,
        dpi,
        extendida,
        nombre,
        no_boleta
    ) VALUES (
        tipo_placa,
        placa_cod,
        id_vehiculo,
        nit_prop,
        tarjeta_circ,
        marca,
        color,
        tipo_licencia,
        no_licencia,
        dpi,
        extendida,
        nombre,
        no_boleta
    );

    -- Devolver el ID generado
    SELECT LAST_INSERT_ID() AS id_boleta;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_ActualizarArticulo` (IN `id_artic` INT, IN `numero_artic` VARCHAR(200), IN `detalle` VARCHAR(1200), IN `precio` DECIMAL(10,2))   BEGIN
    UPDATE articulos
    SET numero_artic = numero_artic,
        detalle = detalle,
        precio = precio
    WHERE id_artic = id_artic;

    SELECT ROW_COUNT() AS filas_actualizadas; -- Devuelve la cantidad de filas actualizadas
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_ActualizarBoletaFinal` (IN `id_boletafin` INT, IN `id_boleta` INT, IN `id_info_boleta` INT, IN `id_multa` INT, IN `estado` INT, IN `imagen` LONGBLOB)   BEGIN
    UPDATE boleta_final
    SET id_boleta = id_boleta,
        id_info_boleta = id_info_boleta,
        id_multa = id_multa,
        estado = estado,
        imagen = imagen
    WHERE id_boletafin = id_boletafin;

    SELECT 'Registro actualizado correctamente' AS Mensaje;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_ActualizarFirma` (IN `id_firma` INT, IN `tipo_firma` VARCHAR(350))   BEGIN
    UPDATE firma
    SET tipo_firma = tipo_firma
    WHERE id_firma = id_firma;

    SELECT 'Registro actualizado correctamente' AS Mensaje;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_ActualizarPlaca` (IN `id_placa` INT, IN `placa` VARCHAR(250), IN `placa_inicial` VARCHAR(3))   BEGIN
    UPDATE placa
    SET placa = placa,
        placa_inicial = placa_inicial
    WHERE id_placa = id_placa;

    SELECT ROW_COUNT() AS filas_actualizadas; -- Devolver el número de filas actualizadas
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_AddInfoBoleta` (IN `ubicacion` VARCHAR(300), IN `fecha` DATE, IN `hora` TIME, IN `id_usuario` INT, IN `observaciones` VARCHAR(500), IN `id_firma` INT, IN `id_infrac` INT)   BEGIN
    DECLARE UltimoID INT;

    -- Obtener el último ID registrado en la tabla boleta_vehiculo
    SELECT MAX(id_boleta) INTO UltimoID FROM boleta_vehiculo;

    -- Insertar los datos en info_boleta usando UltimoID para id_boleta
    INSERT INTO info_boleta (ubicacion, fecha, hora, id_usuario, observaciones, id_firma, id_infrac, id_boleta)
    VALUES (ubicacion, fecha, hora, id_usuario, observaciones, id_firma, id_infrac, UltimoID);

    -- Opcional: Devolver el ID insertado
    SELECT LAST_INSERT_ID() AS NuevoID;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_AddMulta` (IN `total` DECIMAL(10,2))   BEGIN
    DECLARE UlID INT;

    -- Obtener el último ID registrado en la tabla boleta_vehiculo
    SELECT MAX(id_boleta) INTO UlID FROM boleta_vehiculo;

    -- Validar si hay un ID disponible
    IF UlID IS NULL THEN
        SELECT 'Error: No hay registros en la tabla boleta_vehiculo.' AS Mensaje;
    ELSE
        -- Insertar en la tabla multa con el total proporcionado
        INSERT INTO multa (id_boleta, total)
        VALUES (UlID, total);

        -- Retornar el ID de la multa recién insertada
        SELECT LAST_INSERT_ID() AS NuevoID;
    END IF;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_AddMultaDetalle` (IN `id_articulo` INT)   BEGIN
    DECLARE UlmID INT;

    -- Obtener el último ID registrado en la tabla multa
    SELECT MAX(id_multa) INTO UlmID FROM multa;

    -- Validar si se obtuvo un ID válido
    IF UlmID IS NULL THEN
        SELECT 'Error: No hay registros en la tabla multa.' AS Mensaje; -- Imprime un mensaje en lugar de PRINT
    ELSE
        -- Insertar el nuevo detalle en la tabla multa_detalle
        INSERT INTO multa_detalle (id_multa, id_articulo)
        VALUES (UlmID, id_articulo);

        -- Confirmar la inserción
        SELECT CONCAT('Registro insertado en multa_detalle con id_multa: ', UlmID) AS Mensaje; -- Imprime un mensaje usando SELECT
    END IF;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_DeleteMulta` (IN `id_multa` INT)   BEGIN
    IF NOT EXISTS (SELECT 1 FROM multa WHERE id_multa = id_multa) THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'No se encontró la multa.';
    END IF;

    DELETE FROM multa WHERE id_multa = id_multa;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_DeleteUsuario` (IN `Id_user` INT)   BEGIN
    DELETE FROM Usuarios
    WHERE Id_user = Id_user;

    IF ROW_COUNT() = 0 THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'No se encontró el usuario con el ID especificado.';  -- Manejo de error
    END IF;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_DeleteVehiculo` (IN `id_vehiculo` INT)   BEGIN
    DELETE FROM vehiculos
    WHERE id_vehiculo = id_vehiculo;

    IF ROW_COUNT() = 0 THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'No se encontró el vehículo con el ID especificado.';
    END IF;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_GetAllEstados` ()   BEGIN
    SELECT
        id_estado,
        estado
    FROM estados;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_GetBoletas` ()   BEGIN
    SELECT
        BV.no_boleta,
        p.placa_inicial,
        BV.placa_cod,
        v.nombre AS tipo_vehiculo,
        BV.nit_prop,
        BV.tarjeta_circ,
        BV.marca,
        BV.color,
        l.tipo_licen,
        BV.no_licencia,
        BV.no_doc_licencia,
        BV.dpi,
        e.ubicacion,
        BV.nombre,
        es.estado,
        SUM(a.precio) AS total_precio
    FROM boleta_vehiculo BV
    INNER JOIN placa p ON p.id_placa = BV.tipo_placa
    INNER JOIN vehiculos v ON v.id_vehiculo = BV.id_vehiculo
    INNER JOIN extendida e ON e.id_exten = BV.extendida
    INNER JOIN boleta_final bf ON bf.id_boleta = BV.id_boleta
    INNER JOIN estados es ON es.id_estado = bf.estado
    INNER JOIN licencia l ON l.id_licen = BV.tipo_licencia
    INNER JOIN multa m ON m.id_boleta = BV.id_boleta
    INNER JOIN multa_detalle dm ON dm.id_multa = m.id_multa
    INNER JOIN articulos a ON a.id_artic = dm.id_articulo
    GROUP BY
        BV.no_boleta,
        p.placa_inicial,
        BV.placa_cod,
        v.nombre,
        BV.nit_prop,
        BV.tarjeta_circ,
        BV.marca,
        BV.color,
        l.tipo_licen,
        BV.no_licencia,
        BV.no_doc_licencia,
        BV.dpi,
        e.ubicacion,
        BV.nombre,
        es.estado;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_GetExtendidaById` (IN `id_exten` INT)   BEGIN
    SELECT id_exten, ubicacion
    FROM extendida
    WHERE id_exten = id_exten;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_GetExtendidas` ()   BEGIN
    SELECT id_exten, ubicacion
    FROM extendida;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_GetInfoBoletas` (IN `id_info` INT)   BEGIN
    IF id_info IS NULL THEN
        SELECT *
        FROM info_boleta;
    ELSE
        SELECT *
        FROM info_boleta
        WHERE id_info = id_info;
    END IF;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_GetInfraccionById` (IN `id_ifrac` INT)   BEGIN
    SELECT id_ifrac, tipo_infrac
    FROM infraccion
    WHERE id_ifrac = id_ifrac;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_GetInfracciones` ()   BEGIN
    SELECT id_ifrac, tipo_infrac
    FROM infraccion;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_GetLicenciaById` (IN `id_licen` INT)   BEGIN
    SELECT id_licen, tipo_licen
    FROM licencia
    WHERE id_licen = id_licen;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_GetLicencias` ()   BEGIN
    SELECT id_licen, tipo_licen
    FROM licencia;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_GetMultaById` (IN `id_multa` INT)   BEGIN
    SELECT * FROM multa WHERE id_multa = id_multa;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_GetMultaDetalleById` (IN `id_detalle` INT)   BEGIN
    SELECT
        id_detalle,
        id_multa,
        id_articulo
    FROM multa_detalle
    WHERE id_detalle = id_detalle;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_GetMultaDetalles` ()   BEGIN
    SELECT
        id_detalle,
        id_multa,
        id_articulo
    FROM multa_detalle;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_GetMultas` ()   BEGIN
    SELECT * FROM multa;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_GetUsuarioById` (IN `Id_user` INT)   BEGIN
    SELECT Id_user, name_user, chapa
    FROM Usuarios
    WHERE Id_user = Id_user;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_GetUsuarios` ()   BEGIN
    SELECT Id_user, name_user, chapa
    FROM Usuarios;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_GetVehiculoById` (IN `id_vehiculo` INT)   BEGIN
    SELECT id_vehiculo, nombre
    FROM vehiculos
    WHERE id_vehiculo = id_vehiculo;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_GetVehiculos` ()   BEGIN
    SELECT id_vehiculo, nombre
    FROM vehiculos;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_InsertarArticulo` (IN `numero_artic` VARCHAR(200), IN `detalle` VARCHAR(1200), IN `precio` DECIMAL(10,2))   BEGIN
    INSERT INTO articulos (numero_artic, detalle, precio)
    VALUES (numero_artic, detalle, precio);

    SELECT LAST_INSERT_ID() AS id_artic; -- Devuelve el ID generado
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_InsertarBoletaFinal` (IN `id_boleta` INT, IN `id_info_boleta` INT, IN `id_multa` INT, IN `estado` INT, IN `imagen` LONGBLOB)   BEGIN
    INSERT INTO boleta_final (id_boleta, id_info_boleta, id_multa, estado, imagen)
    VALUES (id_boleta, id_info_boleta, id_multa, estado, imagen);

    SELECT LAST_INSERT_ID() AS id_boletafin; -- Devuelve el ID generado
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_InsertarFirma` (IN `tipo_firma` VARCHAR(350))   BEGIN
    INSERT INTO firma (tipo_firma)
    VALUES (tipo_firma);

    SELECT LAST_INSERT_ID() AS id_firma; -- Devuelve el ID generado
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_InsertarPlaca` (IN `placa` VARCHAR(250), IN `placa_inicial` VARCHAR(3))   BEGIN
    INSERT INTO placa (placa, placa_inicial)
    VALUES (placa, placa_inicial);

    SELECT LAST_INSERT_ID() AS id_placa; -- Devuelve el ID generado
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_InsertBoletaFinal` (IN `Vencimiento` DATE)   BEGIN
    DECLARE UltimoIDBoleta INT;
    DECLARE UltimoIDInfoBoleta INT;
    DECLARE UltimoIDMulta INT;
    DECLARE Estado INT DEFAULT 1; -- Se declara e inicializa la variable Estado

    -- Obtener el último ID registrado en cada tabla
    SELECT MAX(id_boleta) INTO UltimoIDBoleta FROM boleta_vehiculo;
    SELECT MAX(id_info) INTO UltimoIDInfoBoleta FROM info_boleta;
    SELECT MAX(id_multa) INTO UltimoIDMulta FROM multa;

    -- Insertar en la tabla boleta_final con la fecha de vencimiento proporcionada
    INSERT INTO boleta_final (id_boleta, id_info_boleta, id_multa, estado, vencimiento)
    VALUES (UltimoIDBoleta, UltimoIDInfoBoleta, UltimoIDMulta, Estado, Vencimiento);
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_InsertEstado` (IN `estado` VARCHAR(10))   BEGIN
    INSERT INTO estados (estado)
    VALUES (estado);
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_InsertExtendida` (IN `ubicacion` VARCHAR(200))   BEGIN
    INSERT INTO extendida (ubicacion)
    VALUES (ubicacion);

    SELECT LAST_INSERT_ID() AS NewExtendidaId; -- Devuelve el ID de la nueva entrada
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_InsertInfoBoleta` (IN `ubicacion` VARCHAR(300), IN `fecha` DATE, IN `hora` TIME, IN `id_usuario` INT, IN `observaciones` VARCHAR(500), IN `id_firma` INT, IN `id_infrac` INT, IN `id_boleta` INT)   BEGIN
    INSERT INTO info_boleta (ubicacion, fecha, hora, id_usuario, observaciones, id_firma, id_infrac, id_boleta)
    VALUES (ubicacion, fecha, hora, id_usuario, observaciones, id_firma, id_infrac, id_boleta);

    SELECT LAST_INSERT_ID() AS id_info; -- Devuelve el ID del nuevo registro
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_InsertInfraccion` (IN `tipo_infrac` VARCHAR(150))   BEGIN
    INSERT INTO infraccion (tipo_infrac)
    VALUES (tipo_infrac);

    SELECT LAST_INSERT_ID() AS NewInfraccionId; -- Devuelve el ID de la nueva infracción
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_InsertLicencia` (IN `tipo_licen` VARCHAR(100))   BEGIN
    INSERT INTO licencia (tipo_licen)
    VALUES (tipo_licen);

    SELECT LAST_INSERT_ID() AS NewLicenciaId; -- Devuelve el ID de la nueva licencia
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_InsertMulta` (IN `id_boleta` INT, IN `total` DECIMAL(10,2))   BEGIN
    INSERT INTO multa (id_boleta, total)
    VALUES (id_boleta, total);

    SELECT LAST_INSERT_ID() AS NewMultaId;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_InsertMultaDetalle` (IN `id_multa` INT, IN `id_articulo` INT)   BEGIN
    INSERT INTO multa_detalle (id_multa, id_articulo)
    VALUES (id_multa, id_articulo);

    SELECT LAST_INSERT_ID() AS NewDetalleId;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_InsertUsuario` (IN `name_user` VARCHAR(400), IN `chapa` INT)   BEGIN
    INSERT INTO Usuarios (name_user, chapa)
    VALUES (name_user, chapa);

    SELECT LAST_INSERT_ID() AS NewUserId;  -- ID del nuevo usuario
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_InsertVehiculo` (IN `nombre` VARCHAR(200))   BEGIN
    INSERT INTO vehiculos (nombre)
    VALUES (nombre);

    SELECT LAST_INSERT_ID() AS NewVehiculoId;  -- ID del nuevo vehículo
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_ObtenerArticulos` (IN `id_artic` INT)   BEGIN
    IF id_artic IS NULL THEN
        SELECT * FROM articulos; -- Devuelve todos los registros
    ELSE
        SELECT * FROM articulos WHERE id_artic = id_artic; -- Devuelve un registro por ID
    END IF;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_ObtenerBoletaFinalPorId` (IN `id_boletafin` INT)   BEGIN
    SELECT id_boletafin, id_boleta, id_info_boleta, id_multa, estado, imagen
    FROM boleta_final
    WHERE id_boletafin = id_boletafin;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_ObtenerBoletasFinales` ()   BEGIN
    SELECT id_boletafin, id_boleta, id_info_boleta, id_multa, estado, imagen
    FROM boleta_final;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_ObtenerFirmaPorId` (IN `id_firma` INT)   BEGIN
    SELECT id_firma, tipo_firma
    FROM firma
    WHERE id_firma = id_firma;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_ObtenerFirmas` ()   BEGIN
    SELECT id_firma, tipo_firma
    FROM firma;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_ObtenerPlacas` (IN `id_placa` INT)   BEGIN
    IF id_placa IS NULL THEN
        SELECT * FROM placa; -- Devuelve todos los registros
    ELSE
        SELECT * FROM placa WHERE id_placa = id_placa; -- Devuelve un registro por ID
    END IF;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_UpdateEstado` (IN `id_estado` INT, IN `estado` VARCHAR(10))   BEGIN
    UPDATE estados
    SET estado = estado
    WHERE id_estado = id_estado;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_UpdateExtendida` (IN `id_exten` INT, IN `ubicacion` VARCHAR(200))   BEGIN
    UPDATE extendida
    SET ubicacion = ubicacion
    WHERE id_exten = id_exten;

    IF ROW_COUNT() = 0 THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'No se encontró la entrada con el ID especificado.';
    END IF;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_UpdateInfoBoleta` (IN `id_info` INT, IN `ubicacion` VARCHAR(300), IN `fecha` DATE, IN `hora` TIME, IN `id_usuario` INT, IN `observaciones` VARCHAR(500), IN `id_firma` INT, IN `id_infrac` INT, IN `id_boleta` INT)   BEGIN
    UPDATE info_boleta
    SET ubicacion = ubicacion,
        fecha = fecha,
        hora = hora,
        id_usuario = id_usuario,
        observaciones = observaciones,
        id_firma = id_firma,
        id_infrac = id_infrac,
        id_boleta = id_boleta
    WHERE id_info = id_info;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_UpdateInfraccion` (IN `id_ifrac` INT, IN `tipo_infrac` VARCHAR(150))   BEGIN
    UPDATE infraccion
    SET tipo_infrac = tipo_infrac
    WHERE id_ifrac = id_ifrac;

    IF ROW_COUNT() = 0 THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'No se encontró la infracción con el ID especificado.';
    END IF;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_UpdateLicencia` (IN `id_licen` INT, IN `tipo_licen` VARCHAR(100))   BEGIN
    UPDATE licencia
    SET tipo_licen = tipo_licen
    WHERE id_licen = id_licen;

    IF ROW_COUNT() = 0 THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'No se encontró la licencia con el ID especificado.';
    END IF;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_UpdateMulta` (IN `id_multa` INT, IN `id_boleta` INT, IN `total` DECIMAL(10,2))   BEGIN
    IF NOT EXISTS (SELECT 1 FROM multa WHERE id_multa = id_multa) THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'No se encontró la multa.';
    END IF;

    UPDATE multa
    SET id_boleta = id_boleta,
        total = total
    WHERE id_multa = id_multa;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_UpdateMultaDetalle` (IN `id_detalle` INT, IN `id_multa` INT, IN `id_articulo` INT)   BEGIN
    IF EXISTS (SELECT 1 FROM multa_detalle WHERE id_detalle = id_detalle) THEN
        UPDATE multa_detalle
        SET id_multa = id_multa,
            id_articulo = id_articulo
        WHERE id_detalle = id_detalle;
    ELSE
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'No se encontró el detalle de multa con el ID especificado.';
    END IF;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_UpdateMultaTotal` (IN `id_multa` INT)   BEGIN
    DECLARE total_subtotales DECIMAL(10, 2);  -- Usar DECIMAL para cantidades monetarias

    SELECT SUM(sub_total) INTO total_subtotales  -- Usar INTO para asignar el resultado
    FROM multa_detalle
    WHERE id_multa = id_multa;

    UPDATE multa
    SET total = total_subtotales
    WHERE id_multa = id_multa;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_UpdateUsuario` (IN `Id_user` INT, IN `name_user` VARCHAR(400), IN `chapa` INT)   BEGIN
    UPDATE Usuarios
    SET name_user = name_user,
        chapa = chapa
    WHERE Id_user = Id_user;

    IF ROW_COUNT() = 0 THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'No se encontró el usuario con el ID especificado.';  -- Manejo de error
    END IF;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_UpdateVehiculo` (IN `id_vehiculo` INT, IN `nombre` VARCHAR(200))   BEGIN
    UPDATE vehiculos
    SET nombre = nombre
    WHERE id_vehiculo = id_vehiculo;

    IF ROW_COUNT() = 0 THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'No se encontró el vehículo con el ID especificado.';
    END IF;
END$$

DELIMITER ;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `articulos`
--

CREATE TABLE `articulos` (
  `id_artic` int(11) NOT NULL,
  `numero_artic` varchar(200) DEFAULT NULL,
  `detalle` varchar(1200) DEFAULT NULL,
  `precio` double DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `articulos`
--

INSERT INTO `articulos` (`id_artic`, `numero_artic`, `detalle`, `precio`) VALUES
(1, '180.1', 'Por no tener las bicicletas y motocicletas el equipamento basico en optimas comiciones', 100),
(2, '180.2', 'Por no respetar las señales de transito', 100),
(3, '180.3', 'Por no circular en el arcen sin causa justificada', 100),
(4, '180.4', 'Por no facilitar la incorporacion al transito de otros vehiculos ', 100),
(5, '180.5', 'Por no utilizar las señales de transito correspondientes al virar', 100),
(6, '180.6', 'Por no respetar el derecho preferente a rebasar', 100),
(7, '180.7', 'Por utilizar en casos no previstos en el presente reglamento, advertencias auditivas o avisos luminosos', 100),
(8, '180.8', 'Por conducir utilizando audiculares conectados y aparatos receptores o reproductores de sonido o utilizando telefonos ', 100),
(9, '181.1', 'Por circular sin importar la tarjeta de circulacion o fotocopia autentificada de la misma', 200),
(10, '181.2', 'Por portar las placas de circulacion en lugares no autorizados', 200),
(11, '181.3', 'Por no portar licencia de conducir', 200),
(12, '181.4', 'Por no tener los vehiculos automotores, con excepcion de las motocicletas, el equipamento basico', 200),
(13, '181.5', 'Por utilizar un vehiculo de aprendizaje o pruebas practicas, sin las especificaciones que se establece', 200),
(14, '181.6', 'Por producir sonidos o ruidos estridentes exagerados o innecesarios, por medio de los propios vehiculos, escapes o bocinas', 200),
(15, '181.7', 'Por transportar carga en forma inadecuada y peligrosa; o por transportarla contituyendo obstaculo para los demas usuarios', 200),
(16, '181.8', 'Por no señalizar la carga que se transporte y que sobresale, de dia y de noche', 200),
(17, '181.9', 'Por no portar identificacion vigente, el conductor de transporte colectivo', 200),
(18, '181.10', 'Por circular en carriles no permitidos para el transporte publico', 200),
(19, '181.11', 'Por parar un vehiculo de transporte colectivo, no paralelo a la acera o a mas de 30 cm de la misma', 200),
(20, '181.12', 'Por parar un vehiculo de transporte de pasajeros, a mas distancia del punto de parada autorizada', 200),
(21, '181.13', 'Por circular un vehiculo de transporte de carga por la izquierda o carriles no permitidos', 200),
(22, '181.14', 'Por no respetar las señales de transito', 200),
(23, '181.15', 'Por circular en contra de la via señalizada o autorizada', 200),
(24, '181.16', 'Por comenzar la marcha o reemprenderla forzando con esto al vehiculo que lleva prioridad a modificar bruscamente su trayectoria o velocidad', 200),
(25, '181.17', 'Por no observar las normas de prioridad de paso', 200),
(26, '181.18', 'Por no respetar el turno en una fila de espera', 200),
(27, '181.19', 'Por incorporarse a la circulacion sin observar las normas respectivas', 200),
(28, '181.20', 'Por virar o girar sin observar las normas de pocisionamiento y maniobra reglamentarias', 200),
(29, '181.21', 'Por cambiar de un carril a otro carril, sin respetar la prioridad del vehiculo que ya circula en uno de los carriles', 200),
(30, '181.22', 'Por retroceder en cualquier via publica, excepto los casos de fuerza mayor o por evidente necesidad', 200),
(31, '181.23', 'Por rebasar por la derecha, salvo en casos permitidos', 200),
(32, '181.24', 'Por rebasar e integrarse a su carril, obligando a otros usuarios a modificar su trayectoria o velocidad', 200),
(33, '181.25', 'Por estacionarse en contra de la via del carril mas proximo', 200),
(34, '181.26', 'Por estacionarse a mas de 25 cm del bordillo o banqueta correspondiente', 200),
(35, '181.27', 'Por estacionarse o parar un vehiculo, obstaculizando la circulacion o constituyendo cierto peligro para los usuarios de la via', 200),
(36, '181.28', 'Por circular sin luz baja durante el dia en los casos previstos de este reglamento', 200),
(37, '181.29', 'Por no utilizar las luces de pocision para iluminar vehiculos automotores inmovilizos en vias insuficientemente iluminadas', 200),
(38, '181.30', 'Por no utilizar luces de emergencia, en casos previstos en el presente Reglamento', 200),
(39, '181.31', 'Por no utilizar las luces de posición y bajas en los túneles o en condiciones atmosféricas o físicas que disminuya la visibilidad. Si se trata de un vehículo pesado o de remolque, en los lugares indicados, además llevará las luces de gálibo', 200),
(40, '181.33', 'Por no respetar el orden jerárquico prevaleciente entre señales y normas de tránsito', 200),
(41, '181.34', 'Por circular sin cinturones de seguridad, salvo los casos de excepción previstos en el presente Reglamento', 200),
(42, '181.35', 'Por remolcar a otro vehículo por medios o en lugares prohibidos', 200),
(43, '181.36', 'Por circular en vehículos que tengan el silenciador o escape inadecuado, incompleto, deteriorado o con tubos resonadores', 200),
(44, '181.37', 'Por circular con llantas lisas o con rotura', 200),
(45, '181.38', 'Por permanecer en la vía pública, efectuando reparaciones técnicas, más de dos horas en áreas urbanas y doce en áreas extraurbanas', 200),
(46, '181.39', 'Por circular sin poseer permiso de aprendizaje o con permiso de aprendizaje vencido', 200),
(47, '181.40', 'Por efectuar reparaciones de emergencia en vías urbanas importantes, cuando la autoridad lo prohiba.', 200),
(48, '181.41', 'Por negarse a recibir la boleta de aviso, requerimiento de pa; y de citación', 200),
(49, '182.1', 'Por conducir con licencia vencida', 300),
(50, '182.2', 'Por no tener el vehículo de transporte colectivo, identificación del conductor', 300),
(51, '182.3', 'Por tirar o lanzar basura u otros objetos en la vía pública, desde un vehículo estacionado o en marcha. El conductor pagará el monto de esta multa', 300),
(52, '182.4', 'Por circular con vehículo sin escape o sin silenciador', 300),
(53, '182.5', 'Por producir sonidos o ruidos estridentes exagerados o innece- sarios por medio de los propios vehículos, bocinas, altavoces u otros aditamentos, en áreas residenciales, hospitales y sanatorios o en horas de la noche', 300),
(54, '182.6', 'Por utilizar bocinas o sirenas propias de los vehículos de emergencia', 300),
(55, '182.7', 'Por rebasar a un vehículo que se detuvo ante un paso peatonal', 300),
(56, '182.8', 'Por circular por espacios peatonales con cualquier vehículo automotor, si no está autorizado por la señalización del lugar', 300),
(57, '182.9', 'Por ubicar ventas callejeras u otros objetos o elementos no autorizados, sobre los espacios peatonales, pasarelas o la vía pública', 300),
(58, '182.10', 'Por arrojar, depositar o abandonar sobre la vía pública, materia que puede entorpecer la circulación', 300),
(59, '182.11', 'Por realizar operaciones de carga y descarga, sin contar con autorización de la autoridad de tránsito correspondiente, de acuerdo con las normas del presente Reglamento', 300),
(60, '182.12', 'Por no cumplir los límites de velocidad máxima', 300),
(61, '182.13', 'Por bloquear una intersección, salvo en los casos permitidos', 300),
(62, '182.14', 'Por no respetar las señales en los cruces de ferrocarril', 300),
(63, '182.15', 'Por efectuar un viraje o giro continúo a la derecha donde no esté permitido o hacerlo en un lugar permitido sin ceder el paso al tránsito transversal', 300),
(64, '182.16', 'Por cambiar de carril, en o justo antes de una intersección, o no seguir la dirección indicada para el carril que ocupa', 300),
(65, '182.17', 'Por efectuar cambios de sentido en lugares prohibidos', 300),
(66, '182.18', 'Por rebasar en lugares prohibidos', 300),
(67, '182.19', 'Por no ceder el paso a los peatones cuando tengan la prioridad; y ', 300),
(68, '182.20', 'Por no ceder el paso a los ciclistas cuando tengan la prioridad', 300),
(69, '183.1', 'Por conducir sin tener licencia', 400),
(70, '183.2', 'Por circular utilizando luces exclusivas para los vehículos de emergencia y de mantenimiento vial y urbano', 400),
(71, '183.3', 'Por rebasar a otras unidades del transporte público para efectuar una parada justo frente a éstas', 400),
(72, '183.4', 'Por conducir un vehículo automotor con licencia que no corresponda al mismo', 400),
(73, '183.5', 'Por utilizar carriles especiales diseñados para la circulación de otro medio de transporte', 400),
(74, '183.6', 'Por no ceder el paso a escolares dentro de la zona escolar y los horarios establecidos', 400),
(75, '183.7', 'Por circular vehículos automotores con un lado frontal completamente no iluminado', 400),
(76, '183.8', 'Por no señalizar un obstáculo sobre la vía pública', 400),
(77, '183.9', 'Por instalar objetos o cosas similares, que sean o parezcan seña- les de tránsito; confundan o inciten a comportamientos antirregla- mentarios', 400),
(78, '183.10', 'Por no comportarse en la forma que establece el presente Reglamento, al detener un vehículo por accidentes, emergencias o averías', 400),
(79, '183.11', 'Por estacionarse en determinado lugar, simulando una falla mecánica', 400),
(80, '183.12', 'Por retroceder en autopistas y vías rápidas', 400),
(81, '183.13', 'Por tirar, lanzar o abandonar en la vía pública basura y objetos que pueden entorpecer la circulación', 400),
(82, '183.14', 'Por efectuar en la vía pública, reparaciones del vehículo que no sean de emergencia', 400),
(83, '184.1', 'Por circular sin placas de circulación', 500),
(84, '184.2', 'Por no tener tarjeta de circulación', 500),
(85, '184.3', 'Por circular en la vía pública cuando exista restricción dispuesta por la autoridad', 500),
(86, '184.4', 'Por circular con vehículo de carga en horarios o rutas prohibidas', 500),
(87, '184.5', 'A los propietarios de talleres que reparen vehículos en la vía pública, por cada vehículo', 500),
(88, '184.6', 'Por estacionar en lugar señalizado con prohibición y los especificados en los artículos 152 y 153', 500),
(89, '184.7', 'Por transportar a más personas que las plazas correspondientes a cada vehículo', 500),
(90, '184.8', 'Por transportar personas en lugares exteriores de las unidades de transporte público', 500),
(91, '184.9', 'Por recoger o dejar pasajeros o acompañantes, efectuando parada en lugar no autorizado para el efecto', 500),
(92, '184.10', 'Cuando los conductores de motocicletas o motobicicletas y sus acompañantes, no cumplan con la obligación de portar el casco protector y el chaleco, que se refieren en el artículo 48 TER de éste Reglamento', 500),
(93, '184.11', 'A los conductores de motocicletas y motobicicletas que transiten en las aceras o banquetas, pasos peatonales, ciclo vías, vías exclusivas para transporte colectivo u otras señaladas por la Ley y el presente Reglamento', 500),
(94, '184.12', 'A los conductores de motocicletas y motobicicletas que circulen entre carriles o hagan paradas entre carriles y zigzaguear en la vía pública', 500),
(95, '185.a.1', 'Retirar, dañar, alterar o cubrir señales de tránsito', 1000),
(96, '185.a.2', 'Faltar el respeto, ofender, agredir o insultar a la autoridad de tránsito. En caso que el hecho pudiera ser constitutivo de delito o falta, se certificará lo conducente al órgano jurisdiccional correspondiente', 1000),
(97, '185.b', 'Quien altere la seguridad del tránsito, mediante la colocación de obstáculos imprevisibles o por cualquier otro medio en la vía pública para facilitar carreras, concursos o actividades similares, sin el permiso correspondiente', 5000),
(98, '185.c.1', 'Por utilizar la vía pública, para carreras, concursos o actividades similares, sin el permiso correspondiente por cada conductor que participe', 25000),
(99, '185.c.2', 'Quienes no atiendan los requerimientos de los vehículos de emergencia, según se establece el artículo 127 del presente Reglamento', 25000);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `boleta_eliminada`
--

CREATE TABLE `boleta_eliminada` (
  `id_boleta_elim` int(11) NOT NULL,
  `id_boleta` int(11) NOT NULL,
  `id_info_boleta` int(11) NOT NULL,
  `id_multa` int(11) NOT NULL,
  `no_recibo` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `boleta_eliminada`
--

INSERT INTO `boleta_eliminada` (`id_boleta_elim`, `id_boleta`, `id_info_boleta`, `id_multa`, `no_recibo`) VALUES
(1, 5, 5, 1, 2),
(2, 7, 7, 3, 51),
(3, 8, 8, 4, 33),
(4, 9, 9, 5, 52);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `boleta_final`
--

CREATE TABLE `boleta_final` (
  `id_boletafin` int(11) NOT NULL,
  `id_boleta` int(11) NOT NULL,
  `id_info_boleta` int(11) NOT NULL,
  `id_multa` int(11) NOT NULL,
  `estado` int(11) NOT NULL,
  `vencimiento` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `boleta_final`
--

INSERT INTO `boleta_final` (`id_boletafin`, `id_boleta`, `id_info_boleta`, `id_multa`, `estado`, `vencimiento`) VALUES
(2, 6, 6, 2, 1, '2025-05-07');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `boleta_vehiculo`
--

CREATE TABLE `boleta_vehiculo` (
  `id_boleta` int(11) NOT NULL,
  `tipo_placa` int(11) NOT NULL,
  `placa_cod` varchar(8) DEFAULT NULL,
  `id_vehiculo` int(11) NOT NULL,
  `nit_prop` varchar(20) NOT NULL,
  `tarjeta_circ` varchar(100) DEFAULT NULL,
  `marca` varchar(100) DEFAULT NULL,
  `color` varchar(100) DEFAULT NULL,
  `tipo_licencia` int(11) NOT NULL,
  `no_licencia` varchar(100) DEFAULT NULL,
  `dpi` varchar(13) DEFAULT NULL,
  `extendida` int(11) NOT NULL,
  `nombre` varchar(255) NOT NULL,
  `no_boleta` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `boleta_vehiculo`
--

INSERT INTO `boleta_vehiculo` (`id_boleta`, `tipo_placa`, `placa_cod`, `id_vehiculo`, `nit_prop`, `tarjeta_circ`, `marca`, `color`, `tipo_licencia`, `no_licencia`, `dpi`, `extendida`, `nombre`, `no_boleta`) VALUES
(1, 1, '123abc', 2, '456789', '12345678', 'Toyota', 'blanco', 1, '234124', '1234543311105', 5, 'Carlos Prueba Prueba prueba', 331),
(2, 1, '123abc', 2, '456789', '12345678', 'Toyota', 'blanco', 1, '234124', '1234543311105', 5, 'Carlos Prueba Prueba prueba', 331),
(4, 1, '123abc', 2, '456789', '12345678', 'Toyota', 'blanco', 1, '234124', '1234543311105', 8, 'Pepe Este Prueba Sistema', 331),
(5, 1, '123abc', 2, '456789', '12345678', 'Toyota', 'blanco', 1, '234124', '1234543311105', 9, 'Carlos Prueba Prueba Prueba', 332),
(6, 6, '123abg', 5, '456789', '12345678', 'Toyota', 'blanco', 3, '234124', '1234544311108', 88, 'Pepe Prueba Este Sis', 555),
(7, 1, '456nbv', 2, '456789', '12345678', 'Hyundai', 'negro', 1, '234124', '1234543311103', 53, 'Carlos Prueba Carliños Prueba', 555),
(8, 5, '123atgh', 11, '456789', '12345678', 'Yamaha', 'negro', 4, '234124', '1234543311114', 67, 'Luis Prueba Este Sistema', 220),
(9, 1, '123abc', 2, '456789', '12345678', 'Toyota', 'blanco', 1, '234124', '1234543311102', 59, 'Carlos Prueba Prueba Prueba', 339);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `estados`
--

CREATE TABLE `estados` (
  `id_estado` int(11) NOT NULL,
  `estado` varchar(10) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `estados`
--

INSERT INTO `estados` (`id_estado`, `estado`) VALUES
(1, 'Activo'),
(2, 'Inactivo');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `extendida`
--

CREATE TABLE `extendida` (
  `id_exten` int(11) NOT NULL,
  `ubicacion` varchar(200) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `extendida`
--

INSERT INTO `extendida` (`id_exten`, `ubicacion`) VALUES
(1, 'Coatepeque'),
(2, 'Villanueva'),
(3, 'Almolonga'),
(4, 'Amatitlan'),
(5, 'Antigua Guatemala'),
(6, 'Cahabon'),
(7, 'Canilla'),
(8, 'Chahal'),
(9, 'Chajul'),
(10, 'Champerico'),
(11, 'Chicaman'),
(12, 'Chiche'),
(13, 'Chicastenan'),
(14, 'Chinique'),
(15, 'Chiquimulilla'),
(16, 'Chisec'),
(17, 'Coban'),
(18, 'Cubulco'),
(19, 'Cuilapa'),
(20, 'Cunen'),
(21, 'Dolores'),
(22, 'Esquipulas'),
(23, 'Flores'),
(24, 'Flores Costa Cuca'),
(25, 'Fray Bartolome'),
(26, 'Granados'),
(27, 'Guatemala'),
(28, 'Ipala'),
(29, 'Ixcan'),
(30, 'Iztapa'),
(31, 'Jalapa'),
(32, 'Jocotenan'),
(33, 'Joyabaj'),
(34, 'La Democracia'),
(35, 'Los Amates'),
(36, 'Melchor de Mencos'),
(37, 'Mixco'),
(38, 'Nebaj'),
(39, 'Pachalum'),
(40, 'Palin'),
(41, 'Panajachel'),
(42, 'Panzos'),
(43, 'Patzite'),
(44, 'Poptun'),
(45, 'Puerto Barrios'),
(46, 'Purulha'),
(47, 'Rabinal'),
(48, 'Quetzaltenan'),
(49, 'Sacapulas'),
(50, 'Salama'),
(51, 'Salcaja'),
(52, 'San Andres'),
(53, 'San Andres Itzapa'),
(54, 'San Andres Sajcabaja'),
(55, 'San Andres Semetabaj'),
(56, 'San Antonio Huista'),
(57, 'San Antonio Llotenan'),
(58, 'San Bartolome Jocotenan'),
(59, 'San Benito'),
(60, 'San Cristobal Verapaz'),
(61, 'San Francisco'),
(62, 'San Jeronimo'),
(63, 'San Jose'),
(64, 'San Jose Pinula'),
(65, 'San Juan Chamelco'),
(66, 'San Juan Cotzal'),
(67, 'San Luis'),
(68, 'San Marcos'),
(69, 'San Miguel Chicaj'),
(70, 'San Pablo'),
(71, 'San Pedro Ayampuc'),
(72, 'San Pedro Carcha'),
(73, 'San Pedro Jocopilas'),
(74, 'Santa Ana'),
(75, 'Santa Cruz Barillas'),
(76, 'Santa Cruz del Quiche'),
(77, 'Santa Cruz del Chol'),
(78, 'Santa Cruz Naranjo'),
(79, 'Santa Cruz Verapaz'),
(80, 'Santa Lucia Cotzulmalguapa'),
(81, 'Santiago Atitlan'),
(82, 'Santo Domingo Xenacoj'),
(83, 'Sanyaxche'),
(84, 'Senahu'),
(85, 'Sumpan'),
(86, 'Tactic'),
(87, 'Tamahu'),
(88, 'Taxisco'),
(89, 'Tiquisate'),
(90, 'Totonicapan'),
(91, 'Tucuru'),
(92, 'Uspantan'),
(93, 'Villa Canales'),
(94, 'Zacualpa'),
(95, 'Zunil'),
(96, 'Acatenan'),
(97, 'Ninguno');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `firma`
--

CREATE TABLE `firma` (
  `id_firma` int(11) NOT NULL,
  `tipo_firma` varchar(350) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `firma`
--

INSERT INTO `firma` (`id_firma`, `tipo_firma`) VALUES
(1, 'Firmo'),
(2, 'A la fuga'),
(3, 'Ausente'),
(4, 'Se nego');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `info_boleta`
--

CREATE TABLE `info_boleta` (
  `id_info` int(11) NOT NULL,
  `ubicacion` varchar(300) DEFAULT NULL,
  `fecha` date DEFAULT NULL,
  `hora` time DEFAULT NULL,
  `id_usuario` int(11) NOT NULL,
  `observaciones` varchar(500) DEFAULT NULL,
  `id_firma` int(11) NOT NULL,
  `id_infrac` int(11) NOT NULL,
  `id_boleta` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `info_boleta`
--

INSERT INTO `info_boleta` (`id_info`, `ubicacion`, `fecha`, `hora`, `id_usuario`, `observaciones`, `id_firma`, `id_infrac`, `id_boleta`) VALUES
(1, 'xyz', '2025-02-05', '09:46:00', 10, 'ninguna', 1, 1, 1),
(2, 'xyz', '2025-02-05', '09:46:00', 10, 'ninguna', 1, 1, 2),
(4, 'xyz', '2025-02-04', '17:05:00', 13, 'ninguna', 1, 1, 4),
(5, 'xyz', '2025-02-04', '07:00:00', 13, 'ninguna', 1, 1, 5),
(6, 'xyz', '2025-02-11', '11:24:00', 15, 'ninguna', 1, 1, 6),
(7, 'xyz', '2025-04-24', '14:55:00', 14, 'ninguna', 1, 1, 7),
(8, 'xyz', '2025-01-29', '17:47:00', 15, 'ninguna', 1, 1, 8),
(9, 'xyz', '2025-02-05', '12:10:00', 13, 'ninguna', 1, 1, 9);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `infraccion`
--

CREATE TABLE `infraccion` (
  `id_ifrac` int(11) NOT NULL,
  `tipo_infrac` varchar(150) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `infraccion`
--

INSERT INTO `infraccion` (`id_ifrac`, `tipo_infrac`) VALUES
(1, 'Requerimiento de Pago'),
(2, 'Boleta Preventiva'),
(3, 'Anulada por Agente');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `licencia`
--

CREATE TABLE `licencia` (
  `id_licen` int(11) NOT NULL,
  `tipo_licen` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `licencia`
--

INSERT INTO `licencia` (`id_licen`, `tipo_licen`) VALUES
(1, 'Tipo A'),
(2, 'Tipo B'),
(3, 'Tipo C'),
(4, 'Tipo M'),
(5, 'Tipo E'),
(6, 'N/A');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `multa`
--

CREATE TABLE `multa` (
  `id_multa` int(11) NOT NULL,
  `id_boleta` int(11) NOT NULL,
  `total` float DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `multa`
--

INSERT INTO `multa` (`id_multa`, `id_boleta`, `total`) VALUES
(1, 5, 300),
(2, 6, 200),
(3, 7, 200),
(4, 8, 200),
(5, 9, 200);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `multa_detalle`
--

CREATE TABLE `multa_detalle` (
  `id_detalle` int(11) NOT NULL,
  `id_multa` int(11) NOT NULL,
  `id_articulo` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `multa_detalle`
--

INSERT INTO `multa_detalle` (`id_detalle`, `id_multa`, `id_articulo`) VALUES
(1, 1, 12),
(2, 1, 3),
(3, 2, 14),
(4, 3, 12),
(5, 4, 11),
(6, 5, 14);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `placa`
--

CREATE TABLE `placa` (
  `id_placa` int(11) NOT NULL,
  `placa` varchar(250) NOT NULL,
  `placa_inicial` varchar(3) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `placa`
--

INSERT INTO `placa` (`id_placa`, `placa`, `placa_inicial`) VALUES
(1, 'Particular', 'P'),
(2, 'Tractor', 'TRC'),
(3, 'Comerciales', 'C'),
(4, 'Oficiales', 'O'),
(5, 'Motocicletas', 'M'),
(6, 'Alquiler', 'A'),
(7, 'Mision Internacional', 'MI'),
(8, 'Cuerpo Diplomatico', 'CD'),
(9, 'Trailer', 'TC'),
(10, 'Distribuidor', 'DIS'),
(11, 'Urbano', 'U'),
(12, 'Cuerpo Consular', 'CC'),
(13, 'Especiales', 'E'),
(14, 'Sin Placa', 'SP'),
(15, 'Ninguna', 'N/A');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `session_init`
--

CREATE TABLE `session_init` (
  `id_sess` int(11) NOT NULL,
  `usuario` varchar(100) DEFAULT NULL,
  `passw` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `session_init`
--

INSERT INTO `session_init` (`id_sess`, `usuario`, `passw`) VALUES
(1, 'admin_exp', 'test'),
(2, 'pmt_admin', '4Dm1n_PMT');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarios`
--

CREATE TABLE `usuarios` (
  `Id_user` int(11) NOT NULL,
  `name_user` varchar(400) NOT NULL,
  `chapa` varchar(4) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `usuarios`
--

INSERT INTO `usuarios` (`Id_user`, `name_user`, `chapa`) VALUES
(1, 'Monica Sanchez', '002'),
(2, 'Gilberto Batz', '008'),
(3, 'Jairo Cuc', '011'),
(4, 'Rodrigo Morales', '028'),
(5, 'Abda Calderon', '040'),
(6, 'Milton Chim', '015'),
(7, 'Griselda Hidalgo', '017'),
(8, 'Daniel Vasquez', '021'),
(9, 'Irene Samayoa', '025'),
(10, 'Vidal Villatoro', '033'),
(11, 'Angelica Mejia', '034'),
(12, 'Shirley Chanchavac', '035'),
(13, 'Sergio Hernandez', '036'),
(14, 'Maximo Perez', '037'),
(15, 'Berenice Chanchavac', '038'),
(16, 'Manuel Lopez', '039'),
(17, 'Luis Fernando Salazar', '006'),
(18, 'Claudia Veronica Cifuentes', '009'),
(19, 'Aylin Gonzalez', '003'),
(20, 'Diana Alvarado', '005'),
(21, 'Jose Garcia', '004'),
(22, 'Cristian Citalan', '010'),
(23, 'Fernando Chiricoc', '012'),
(24, 'Leslie Anahi Aguilar', '007'),
(25, 'Maynor Raul Garcia', '013'),
(26, 'Jorge Godinez', '014'),
(27, 'Esvin Custodio', '016'),
(28, 'Melvin Josue Molina', '018'),
(29, 'Emilio Palma', '019'),
(30, 'Esleiter Sanchez', '020'),
(31, 'Francisco Mazariegos', '022'),
(32, 'Andy Vasquez', '023'),
(33, 'Silvia Diaz', '024'),
(34, 'Vidal Villatoro', '026'),
(35, 'Lester Poncio', '027'),
(36, 'Pendiente', '029'),
(37, 'Abner Jhas', '030'),
(38, 'Danny Sopon', '031'),
(39, 'Rosa Escobar', '032'),
(40, 'Rafael Mendoza', '001A'),
(41, 'Monica Sanchez', '001B');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `vehiculos`
--

CREATE TABLE `vehiculos` (
  `id_vehiculo` int(11) NOT NULL,
  `nombre` varchar(200) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `vehiculos`
--

INSERT INTO `vehiculos` (`id_vehiculo`, `nombre`) VALUES
(1, 'No definido'),
(2, 'Automovil'),
(3, 'Jeep'),
(4, 'Pick-up'),
(5, 'Camionetilla'),
(6, 'Panel'),
(7, 'Bus Urbano'),
(8, 'Bus Escolar'),
(9, 'Bus Extraurbano'),
(10, 'Camion'),
(11, 'Moto'),
(12, 'Cabezal'),
(13, 'Camioneta'),
(14, 'Microbus');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `articulos`
--
ALTER TABLE `articulos`
  ADD PRIMARY KEY (`id_artic`);

--
-- Indices de la tabla `boleta_eliminada`
--
ALTER TABLE `boleta_eliminada`
  ADD PRIMARY KEY (`id_boleta_elim`),
  ADD KEY `fk_boleta` (`id_boleta`),
  ADD KEY `fk_info_boleta` (`id_info_boleta`),
  ADD KEY `fk_multa` (`id_multa`);

--
-- Indices de la tabla `boleta_final`
--
ALTER TABLE `boleta_final`
  ADD PRIMARY KEY (`id_boletafin`),
  ADD KEY `id_boleta` (`id_boleta`),
  ADD KEY `id_info_boleta` (`id_info_boleta`),
  ADD KEY `id_multa` (`id_multa`),
  ADD KEY `estado` (`estado`);

--
-- Indices de la tabla `boleta_vehiculo`
--
ALTER TABLE `boleta_vehiculo`
  ADD PRIMARY KEY (`id_boleta`),
  ADD KEY `idx_tipo_placa` (`tipo_placa`),
  ADD KEY `idx_id_vehiculo` (`id_vehiculo`),
  ADD KEY `idx_tipo_licencia` (`tipo_licencia`),
  ADD KEY `idx_extendida` (`extendida`),
  ADD KEY `idx_nit_prop` (`nit_prop`);

--
-- Indices de la tabla `estados`
--
ALTER TABLE `estados`
  ADD PRIMARY KEY (`id_estado`);

--
-- Indices de la tabla `extendida`
--
ALTER TABLE `extendida`
  ADD PRIMARY KEY (`id_exten`);

--
-- Indices de la tabla `firma`
--
ALTER TABLE `firma`
  ADD PRIMARY KEY (`id_firma`);

--
-- Indices de la tabla `info_boleta`
--
ALTER TABLE `info_boleta`
  ADD PRIMARY KEY (`id_info`),
  ADD KEY `id_usuario` (`id_usuario`),
  ADD KEY `id_firma` (`id_firma`),
  ADD KEY `id_infrac` (`id_infrac`),
  ADD KEY `id_boleta` (`id_boleta`);

--
-- Indices de la tabla `infraccion`
--
ALTER TABLE `infraccion`
  ADD PRIMARY KEY (`id_ifrac`);

--
-- Indices de la tabla `licencia`
--
ALTER TABLE `licencia`
  ADD PRIMARY KEY (`id_licen`);

--
-- Indices de la tabla `multa`
--
ALTER TABLE `multa`
  ADD PRIMARY KEY (`id_multa`),
  ADD KEY `id_boleta` (`id_boleta`);

--
-- Indices de la tabla `multa_detalle`
--
ALTER TABLE `multa_detalle`
  ADD PRIMARY KEY (`id_detalle`),
  ADD KEY `id_multa` (`id_multa`),
  ADD KEY `id_articulo` (`id_articulo`);

--
-- Indices de la tabla `placa`
--
ALTER TABLE `placa`
  ADD PRIMARY KEY (`id_placa`);

--
-- Indices de la tabla `session_init`
--
ALTER TABLE `session_init`
  ADD PRIMARY KEY (`id_sess`);

--
-- Indices de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`Id_user`);

--
-- Indices de la tabla `vehiculos`
--
ALTER TABLE `vehiculos`
  ADD PRIMARY KEY (`id_vehiculo`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `articulos`
--
ALTER TABLE `articulos`
  MODIFY `id_artic` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=100;

--
-- AUTO_INCREMENT de la tabla `boleta_eliminada`
--
ALTER TABLE `boleta_eliminada`
  MODIFY `id_boleta_elim` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de la tabla `boleta_final`
--
ALTER TABLE `boleta_final`
  MODIFY `id_boletafin` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de la tabla `boleta_vehiculo`
--
ALTER TABLE `boleta_vehiculo`
  MODIFY `id_boleta` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT de la tabla `estados`
--
ALTER TABLE `estados`
  MODIFY `id_estado` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `extendida`
--
ALTER TABLE `extendida`
  MODIFY `id_exten` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=98;

--
-- AUTO_INCREMENT de la tabla `firma`
--
ALTER TABLE `firma`
  MODIFY `id_firma` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de la tabla `info_boleta`
--
ALTER TABLE `info_boleta`
  MODIFY `id_info` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT de la tabla `infraccion`
--
ALTER TABLE `infraccion`
  MODIFY `id_ifrac` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `licencia`
--
ALTER TABLE `licencia`
  MODIFY `id_licen` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT de la tabla `multa`
--
ALTER TABLE `multa`
  MODIFY `id_multa` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de la tabla `multa_detalle`
--
ALTER TABLE `multa_detalle`
  MODIFY `id_detalle` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT de la tabla `placa`
--
ALTER TABLE `placa`
  MODIFY `id_placa` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT de la tabla `session_init`
--
ALTER TABLE `session_init`
  MODIFY `id_sess` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `Id_user` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=42;

--
-- AUTO_INCREMENT de la tabla `vehiculos`
--
ALTER TABLE `vehiculos`
  MODIFY `id_vehiculo` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `boleta_eliminada`
--
ALTER TABLE `boleta_eliminada`
  ADD CONSTRAINT `fk_boleta` FOREIGN KEY (`id_boleta`) REFERENCES `boleta_vehiculo` (`id_boleta`),
  ADD CONSTRAINT `fk_info_boleta` FOREIGN KEY (`id_info_boleta`) REFERENCES `info_boleta` (`id_info`),
  ADD CONSTRAINT `fk_multa` FOREIGN KEY (`id_multa`) REFERENCES `multa` (`id_multa`);

--
-- Filtros para la tabla `boleta_final`
--
ALTER TABLE `boleta_final`
  ADD CONSTRAINT `boleta_final_ibfk_1` FOREIGN KEY (`id_boleta`) REFERENCES `boleta_vehiculo` (`id_boleta`) ON DELETE NO ACTION,
  ADD CONSTRAINT `boleta_final_ibfk_2` FOREIGN KEY (`id_info_boleta`) REFERENCES `info_boleta` (`id_info`) ON DELETE NO ACTION,
  ADD CONSTRAINT `boleta_final_ibfk_3` FOREIGN KEY (`id_multa`) REFERENCES `multa` (`id_multa`) ON DELETE NO ACTION,
  ADD CONSTRAINT `boleta_final_ibfk_4` FOREIGN KEY (`estado`) REFERENCES `estados` (`id_estado`) ON DELETE NO ACTION;

--
-- Filtros para la tabla `boleta_vehiculo`
--
ALTER TABLE `boleta_vehiculo`
  ADD CONSTRAINT `boleta_vehiculo_ibfk_1` FOREIGN KEY (`tipo_placa`) REFERENCES `placa` (`id_placa`) ON DELETE CASCADE,
  ADD CONSTRAINT `boleta_vehiculo_ibfk_2` FOREIGN KEY (`id_vehiculo`) REFERENCES `vehiculos` (`id_vehiculo`) ON DELETE CASCADE,
  ADD CONSTRAINT `boleta_vehiculo_ibfk_3` FOREIGN KEY (`tipo_licencia`) REFERENCES `licencia` (`id_licen`) ON DELETE CASCADE,
  ADD CONSTRAINT `boleta_vehiculo_ibfk_4` FOREIGN KEY (`extendida`) REFERENCES `extendida` (`id_exten`) ON DELETE CASCADE;

--
-- Filtros para la tabla `info_boleta`
--
ALTER TABLE `info_boleta`
  ADD CONSTRAINT `info_boleta_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`Id_user`) ON DELETE CASCADE,
  ADD CONSTRAINT `info_boleta_ibfk_2` FOREIGN KEY (`id_firma`) REFERENCES `firma` (`id_firma`) ON DELETE CASCADE,
  ADD CONSTRAINT `info_boleta_ibfk_3` FOREIGN KEY (`id_infrac`) REFERENCES `infraccion` (`id_ifrac`) ON DELETE CASCADE,
  ADD CONSTRAINT `info_boleta_ibfk_4` FOREIGN KEY (`id_boleta`) REFERENCES `boleta_vehiculo` (`id_boleta`) ON DELETE CASCADE;

--
-- Filtros para la tabla `multa`
--
ALTER TABLE `multa`
  ADD CONSTRAINT `multa_ibfk_1` FOREIGN KEY (`id_boleta`) REFERENCES `boleta_vehiculo` (`id_boleta`) ON DELETE CASCADE;

--
-- Filtros para la tabla `multa_detalle`
--
ALTER TABLE `multa_detalle`
  ADD CONSTRAINT `multa_detalle_ibfk_1` FOREIGN KEY (`id_multa`) REFERENCES `multa` (`id_multa`) ON DELETE CASCADE,
  ADD CONSTRAINT `multa_detalle_ibfk_2` FOREIGN KEY (`id_articulo`) REFERENCES `articulos` (`id_artic`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
