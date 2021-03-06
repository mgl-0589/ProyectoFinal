const express = require('express');
const router = express.Router();

const pool = require('../database'); // Conection to database

const { isLoggedIn, isAdmin } = require('../lib/access');
const { benefValidationRules, validate } = require('../lib/validator');

//modulos para extrer datos de archivos
const xlsx = require('xlsx');
const csv = require('csvtojson');
const converter =csv({
    nullObject: true
});
const fs = require('fs');

//getting files from directory
const path = require('path');

// variables para subir archivos a base de datos 
let info = []; 
let filename = "";
const temp = './src/files/temp/';

// Render all the users registered
router.get('/allusers', isLoggedIn, isAdmin, async (req, res) => {
    const users = await pool.query('SELECT usuarios.ID_USUARIO, usuarios.NOMBRE, usuarios.APELLIDO_PATERNO, usuarios.CORREO, cat_perfiles.PERFIL FROM usuarios RIGHT JOIN cat_perfiles ON usuarios.ID_PERFIL = cat_perfiles.ID_PERFIL');
    const allUsers = await pool.query('SELECT COUNT(ID_USUARIO) AS TOTAL_USUARIOS FROM usuarios');
    res.render('links/allusers', {users, allUser: allUsers[0]});
});

// Process to delete an user selected
router.get('/deleteuser/:ID_USUARIO', isLoggedIn, isAdmin, async (req, res) => {
    const { ID_USUARIO } = req.params;
    /* console.log(ID_USUARIO); */ // Validates the value received
    await pool.query('SET FOREIGN_KEY_CHECKS=OFF');
    await pool.query('DELETE FROM usuarios WHERE ID_USUARIO = ?', [ID_USUARIO]);
    await pool.query('SET FOREIGN_KEY_CHECKS=ON');
    req.flash('success', 'Usuario eliminado'); // add message to indicates that a process is done
    res.redirect('/links/allusers');
});

// Render all the beneficiaries in list
router.get('/allbenef', isLoggedIn, async (req, res) => {
    const beneficiarios = await pool.query('SELECT * FROM beneficiarios');
    const allBenefs = await pool.query('SELECT COUNT(ID_BENEFICIARIO) AS TOTAL_BENEFICIARIOS FROM beneficiarios');
    res.render('links/allbenef', { beneficiarios, allBenef: allBenefs[0] });
});

// Render the list of beneficiarios to add new beneficiaries
router.get('/addbenef', isLoggedIn, (req, res) => {
    res.render('links/addbenef');
});

// Receive the new data to add new beneficiaries
router.post('/addbenef', isLoggedIn, async (req, res) => {
    const { ID_BENEFICIARIO,
            CURP,
            NOMBRE,
            APELLIDO_PATERNO,
            APELLIDO_MATERNO,
            TEL_CASA,
            TEL_CELULAR,
            CORREO,
            PROGRAMA,
            CALLE,
            NUM_EXT,
            NUM_INT,
            COLONIA,
            CODIGO_POSTAL,
            MUNICIPIO,
            ESTADO,
            SEXO
        } = req.body;

        const newBeneficiario = {
            ID_BENEFICIARIO,
            CURP,
            NOMBRE,
            APELLIDO_PATERNO,
            APELLIDO_MATERNO,
            TEL_CASA,
            TEL_CELULAR,
            CORREO,
            PROGRAMA,
            CALLE,
            NUM_EXT,
            NUM_INT,
            COLONIA,
            CODIGO_POSTAL,
            MUNICIPIO,
            ESTADO,
            SEXO
        };
    /* console.log(newBeneficiario); */ // Validates values received
    await pool.query('INSERT INTO beneficiarios set ?', [newBeneficiario]);
    req.flash('success', 'Beneficiario agregado'); // add message to indicates that a process is done
    res.redirect('/links/listbenef');
});

// Render the total of beneficiaries in database
router.get('/listbenef', isLoggedIn, async (req, res) => {
    /* const beneficiarios = await pool.query('SELECT * FROM beneficiarios'); */
    /* const registro_llamadas = await pool.query('SELECT * FROM registro_llamadas ORDER BY ID_LLAMADA'); */
    const beneficiarios = await pool.query('SELECT beneficiarios.ID_BENEFICIARIO, beneficiarios.CURP, beneficiarios.NOMBRE, beneficiarios.APELLIDO_PATERNO, beneficiarios.APELLIDO_MATERNO, beneficiarios.TEL_CASA, beneficiarios.TEL_CELULAR, beneficiarios.CORREO, registro_llamadas.ID_LLAMADA, registro_llamadas.RESULTADO_LLAMADA, registro_llamadas.CONFIRMACION, registro_llamadas.FECHA_LLAMADA FROM beneficiarios LEFT JOIN registro_llamadas ON beneficiarios.ID_BENEFICIARIO = registro_llamadas.ID_BENEFICIARIO WHERE registro_llamadas.ID_LLAMADA = (SELECT MAX(ID_LLAMADA) FROM registro_llamadas WHERE registro_llamadas.ID_BENEFICIARIO = beneficiarios.ID_BENEFICIARIO)');
    const confirms = await pool.query('SELECT COUNT(CONFIRMACION) AS CONFIRMACION FROM registro_llamadas WHERE CONFIRMACION = "CONFIRMA ASISTENCIA"');
    /* console.log(beneficiarios); */ // Validates values received
    /* console.log(confirms[0]); */ // Validates values from COUNT(CONFIRMADOS)
    res.render('links/listbenef', { beneficiarios, confirm: confirms[0] });
});

// Render the form to register benefciaries phone calls
router.get('/addcalls/:ID_BENEFICIARIO', isLoggedIn, async (req, res) => {
    const { ID_BENEFICIARIO } = req.params;
    /* console.log(ID_BENEFICIARIO); */ // Validates the id received
    const newLinkCalls = await pool.query('SELECT * FROM registro_llamadas WHERE ID_BENEFICIARIO = ? ORDER BY ID_LLAMADA DESC LIMIT 1', ID_BENEFICIARIO);
    const newLinkBenef = await pool.query('SELECT * FROM beneficiarios WHERE ID_BENEFICIARIO = ?', [ID_BENEFICIARIO]);
    /* console.log(newLinkBenef[0], newLinkCalls[0]); */ // Validates values from both querys
    res.render('links/addcalls', {newLinksBenef: newLinkBenef[0], newLinksCalls: newLinkCalls[0]});
});

// Receive the new data to add new phone calls and data of beneficiaries
router.post('/addcalls/:ID_BENEFICIARIO', isLoggedIn, async (req, res) => {
    const { ID_BENEFICIARIO } = req.params;
    const { ID_USUARIO } = req.user;
    const { 
        CURP,
        NOMBRE,
        APELLIDO_PATERNO,
        APELLIDO_MATERNO,
        TEL_CASA,
        TEL_CELULAR,
        CORREO,
        PROGRAMA,
        CALLE,
        NUM_EXT,
        NUM_INT,
        COLONIA,
        CODIGO_POSTAL,
        SEXO,
        RESULTADO_LLAMADA,
        CONFIRMACION
    } = req.body;

    const updateBenef = {
        ID_BENEFICIARIO,
        CURP,
        NOMBRE,
        APELLIDO_PATERNO,
        APELLIDO_MATERNO,
        TEL_CASA,
        TEL_CELULAR,
        CORREO,
        PROGRAMA,
        CALLE,
        NUM_EXT,
        NUM_INT,
        COLONIA,
        CODIGO_POSTAL,
        SEXO
    };

    const newCall = {
        ID_BENEFICIARIO,
        RESULTADO_LLAMADA,
        CONFIRMACION,
        ID_USUARIO
    };

    /* console.log(ID_USUARIO); */ // Validates id of user
    /* console.log(ID_BENEFICIARIO, updateBenef, newCall); */ // Validates values received
    await pool.query('UPDATE beneficiarios set ? WHERE ID_BENEFICIARIO = ?', [updateBenef, ID_BENEFICIARIO]);
    await pool.query('INSERT INTO registro_llamadas set ?', [newCall]);
    // await pool.query('UPDATE registro_llamadas SET RESULTADO_LLAMADA = ?, CONFIRMACION = ? WHERE ID_BENEFICIARIO = ? ORDER BY ID_LLAMADA DESC LIMIT 1', [updateCall.RESULTADO_LLAMADA, updateCall.CONFIRMACION, ID_BENEFICIARIO]); // delete
    /* console.log(ID_BENEFICIARIO, updateBenef, updateCall.RESULTADO_LLAMADA, updateCall.CONFIRMACION); */ // Validates values received for updating tables
    req.flash('success', 'Llamada registrada');
    res.redirect('/links/allbenef');
});

// Render the form to search beneficiaries
router.get('/searchbenef', isLoggedIn, async (req, res) => {
    const allAssists = await pool.query('SELECT COUNT(ASISTENCIA) AS ASISTENCIA FROM registro_asistencias WHERE ASISTENCIA = "PRESENTE"');
    const allDeliverys = await pool.query('SELECT COUNT(ESTATUS_ENTREGA) AS ESTATUS_ENTREGA FROM registro_entregas WHERE ESTATUS_ENTREGA = "ENTREGADO"');
    res.render('links/searchbenef', { allAssist: allAssists[0], allDelivery: allDeliverys[0]});
});

// Receive the data to initialize a search of beneficiaries
router.post('/searchbenef', isLoggedIn, async (req, res) => {
    try {
        const {
            CURP,
            NOMBRE,
            APELLIDO_PATERNO,
            APELLIDO_MATERNO,
            TEL_CASA,
            TEL_CELULAR,
            CORREO
        } = req.body;
    
        /* const newSearchBenef = {
            CURP,
            NOMBRE,
            APELLIDO_PATERNO,
            APELLIDO_MATERNO,
            TEL_CASA,
            TEL_CELULAR,
            CORREO
        }; */
        
        /* console.log(newSearchBenef.CURP, newSearchBenef.NOMBRE); */ // Validates values received
        if (CURP != '') {
            const listBenef = await pool.query('SELECT * FROM beneficiarios WHERE CURP = ?', [CURP]);
            res.render('links/searchbenef', {listBenef});
        }

        else if (TEL_CASA != '') {
            const listBenef = await pool.query('SELECT * FROM beneficiarios WHERE TEL_CASA = ?', [TEL_CASA]);
            res.render('links/searchbenef', {listBenef});
        }

        else if (TEL_CELULAR != '') {
            const listBenef = await pool.query('SELECT * FROM beneficiarios WHERE TEL_CELULAR = ?', [TEL_CELULAR]);
            res.render('links/searchbenef', {listBenef});
        }

        else if (CORREO != '') {
            const listBenef = await pool.query('SELECT * FROM beneficiarios WHERE CORREO = ?', [CORREO]);
            res.render('links/searchbenef', {listBenef});
        }
        
        else if (NOMBRE != '' || APELLIDO_PATERNO != '' || APELLIDO_MATERNO != '') {
            const listBenef = await pool.query('SELECT * FROM beneficiarios WHERE NOMBRE = ? OR APELLIDO_PATERNO = ? OR APELLIDO_MATERNO', [NOMBRE, APELLIDO_PATERNO, APELLIDO_MATERNO]);
            res.render('links/searchbenef', {listBenef});
        }
    }
    
    catch(e) {
        console.log(e);
    }
});

// Render the form to search specific beneficiarie
router.get('/modifbenef/:ID_BENEFICIARIO', isLoggedIn, async (req, res) => {
    const { ID_BENEFICIARIO } = req.params;
    const newLinkBenef = await pool.query('SELECT * FROM beneficiarios WHERE ID_BENEFICIARIO = ?', [ID_BENEFICIARIO]);
    /* console.log(newLinkBenef[0]); */ // Validates values from both querys
    res.render('links/modifbenef', {newLinksBenef: newLinkBenef[0]});
});

// Receives the new data to update specific beneficiarie
router.post('/modifbenef/:ID_BENEFICIARIO', isLoggedIn, async (req, res) => {
    const { ID_BENEFICIARIO } = req.params;
    const {
        CURP,
        NOMBRE,
        APELLIDO_PATERNO,
        APELLIDO_MATERNO,
        TEL_CASA,
        TEL_CELULAR,
        CORREO,
        PROGRAMA,
        CALLE,
        NUM_EXT,
        NUM_INT,
        COLONIA,
        CODIGO_POSTAL,
        SEXO,
        ASISTENCIA
    } = req.body;

    const updateBenef = {
        ID_BENEFICIARIO,
        CURP,
        NOMBRE,
        APELLIDO_PATERNO,
        APELLIDO_MATERNO,
        TEL_CASA,
        TEL_CELULAR,
        CORREO,
        PROGRAMA,
        CALLE,
        NUM_EXT,
        NUM_INT,
        COLONIA,
        CODIGO_POSTAL,
        SEXO
    };

    const newAssist = { 
        ID_BENEFICIARIO,
        ASISTENCIA,
    };
    /* console.log(updateBenef[0]); */ // Validates values received
    await pool.query('UPDATE beneficiarios set ? WHERE ID_BENEFICIARIO = ?', [updateBenef, ID_BENEFICIARIO]);
    await pool.query('INSERT INTO registro_asistencias set ?', [newAssist]);
    req.flash('success', 'Beneficiario actualizado y asistencia registrada');
    res.redirect('/links/searchbenef');
});

// Render the form to add assistances of beneficiaries
router.get('/addassist/:ID_BENEFICIARIO', isLoggedIn, async (req, res) => {
    const { ID_BENEFICIARIO } = req.params;
    const newLinkAssist = await pool.query('SELECT * FROM registro_asistencias WHERE ID_BENEFICIARIO = ? ORDER BY ID_ASISTENCIA DESC LIMIT 1', ID_BENEFICIARIO);
    const newLinkBenef = await pool.query('SELECT * FROM beneficiarios WHERE ID_BENEFICIARIO = ?', [ID_BENEFICIARIO]);
    /* console.log(newLinkBenef[0], newLinkAssist[0]); */ // Validates values from both querys
    res.render('links/addassist', {newLinksBenef: newLinkBenef[0], newLinksAssist: newLinkAssist[0]});
});

// Receives the new data to add assistance of beneficiaries
router.post('/addassist/:ID_BENEFICIARIO', isLoggedIn, async (req, res) => {
    const { ID_BENEFICIARIO } = req.params;
    const { ID_USUARIO } = req.user;
    const { ASISTENCIA } = req.body;

    const newAsistance = {
        ID_BENEFICIARIO,
        ASISTENCIA,
        ID_USUARIO
    };
    /* console.log(ID_BENEFICIARIO, newAsistance); */ // Validates values received
    await pool.query('INSERT INTO registro_asistencias set ?', [newAsistance]);
    req.flash('success', 'Asistencia registrada');
    res.redirect('/links/searchbenef');
});

// Render the form to add deliveries of kits
router.get('/adddelivery/:ID_BENEFICIARIO', isLoggedIn, async (req, res) => {
    const { ID_BENEFICIARIO } = req.params;
    const newLinkDelivery = await pool.query('SELECT * FROM registro_entregas WHERE ID_BENEFICIARIO = ? ORDER BY ID_ENTREGA DESC LIMIT 1', ID_BENEFICIARIO);
    const newLinkBenef = await pool.query('SELECT * FROM beneficiarios WHERE ID_BENEFICIARIO = ?', [ID_BENEFICIARIO]);
    /* console.log(newLinkBenef[0], newLinkAssist[0]); */ // Validates values from both querys
    res.render('links/adddelivery', {newLinksBenef: newLinkBenef[0], newLinksDelivery: newLinkDelivery[0]});
});

// Receives the new data to add a delivery
router.post('/adddelivery/:ID_BENEFICIARIO', isLoggedIn, async (req, res) => {
    const { ID_BENEFICIARIO } = req.params;
    const { ID_USUARIO } = req.user;
    const { ESTATUS_ENTREGA } = req.body;

    const newDelivery = {
        ID_BENEFICIARIO,
        ESTATUS_ENTREGA,
        ID_USUARIO
    };
    /* console.log(newDelivery); */ // Validates values received
    await pool.query('INSERT INTO registro_entregas set ?', [newDelivery]);
    req.flash('success', 'Entrega registrada');
    res.redirect('/links/searchbenef');
});

//vistas para importar datos a db

router.get('/dbimpexp',  isLoggedIn, isAdmin, (req,res) => {
    info = []; 
    console.log(info);
    res.render('links/dbimpexp');
});

router.post('/dbimpexp', isLoggedIn, isAdmin, (req, res) => {
    //move the file to the temp folder 
    if(req.files){
        const file = req.files.filename;
        filename = file.name; 
        file.mv(temp+filename, (err) => {
            if(err){
                res.redirect('links/dbimpex');
                req.flash('message', 'El documento no pudo ser cargado correctamente' + err);
            } else {
                res.redirect('links/confirmdb'); 
            }
        });
        console.log(req.files);
    }  else {
        req.flash('message','Favor de seleccionar un archivo a importar.');
        res.redirect('links/dbimpexp');
    }
});
    //preview data before importing it to database 
router.get('/confirmdb', isLoggedIn, isAdmin, (req,res) => {
    let ext = path.extname(temp+filename);
    console.log(ext);
    if(ext == '.xlsx' || ext == '.xls'){
        let wb = xlsx.readFile(temp+filename);
        let sheet = wb.Sheets['Sheet1'];
        let excel = xlsx.utils.sheet_to_json(sheet);

        for (var i = 0; excel.length > i; i++){
            
            info.push([
                excel[i].CURP.toUpperCase(),
                excel[i].NOMBRE.toUpperCase(),
                excel[i].APELLIDO_PATERNO.toUpperCase(),
                excel[i].APELLIDO_MATERNO.toUpperCase(),
                excel[i].TEL_CASA.toUpperCase(),
                excel[i].TEL_CELULAR.toUpperCase(),
                excel[i].CORREO.toUpperCase(),
                excel[i].PROGRAMA.toUpperCase(),
                excel[i].CALLE.toUpperCase(),
                excel[i].NUM_EXT.toUpperCase(),
                excel[i].NUM_INT.toUpperCase(),
                excel[i].COLONIA.toUpperCase(),
                excel[i].CODIGO_POSTAL.toUpperCase(),
                excel[i].COLONIA.toUpperCase(),
                excel[i].ESTADO.toUpperCase(),
                excel[i].SEXO.toUpperCase()
            ]);
        } 

        let data = excel;
        res.render('links/confirmdb', { data });
    } else if(ext == '.csv') {
        
        csv()
        .fromFile(temp+filename)
        .then((jsonObj) => {
            let keys = Object.getOwnPropertyNames(jsonObj);
            for (var i = 0; jsonObj.length > i; i++){
                info.push([
                    jsonObj[i].CURP.toUpperCase(),
                    jsonObj[i].NOMBRE.toUpperCase(),
                    jsonObj[i].APELLIDO_PATERNO.toUpperCase(),
                    jsonObj[i].APELLIDO_MATERNO.toUpperCase(),
                    jsonObj[i].TEL_CASA.toUpperCase(),
                    jsonObj[i].TEL_CELULAR.toUpperCase(),
                    jsonObj[i].CORREO.toUpperCase(),
                    jsonObj[i].PROGRAMA.toUpperCase(),
                    jsonObj[i].CALLE.toUpperCase(),
                    jsonObj[i].NUM_EXT,
                    jsonObj[i].NUM_INT,
                    jsonObj[i].COLONIA.toUpperCase(),
                    jsonObj[i].CODIGO_POSTAL,
                    jsonObj[i].MUNICIPIO.toUpperCase(),
                    jsonObj[i].ESTADO.toUpperCase(),
                    jsonObj[i].SEXO.toUpperCase()
                ]);
                
            } 
            let data = jsonObj;
            console.log(info);
            res.render('links/confirmdb', { data, keys });
        })
    }   else {
        req.flash('message', 'Hubo un problema al cargar la información desde el archivo cargado.');
        res.redirect('links/dbimpexp');
    }
});
    //insert data to database

router.post('/confirmdb', isLoggedIn, isAdmin, async (req, res) => {
    const newPath = './src/files/import/';
    fs.rename(temp+filename, newPath+filename, function (err) {
        if (err){
            throw err 
        } else {
            console.log('file moved')
        }
    });
    await pool.query('INSERT INTO beneficiarios (CURP, NOMBRE, APELLIDO_PATERNO, APELLIDO_MATERNO, TEL_CASA, TEL_CELULAR, CORREO, PROGRAMA, CALLE, NUM_EXT, NUM_INT, COLONIA,CODIGO_POSTAL, MUNICIPIO, ESTADO, SEXO) VALUES ?',
                    [info], function (err, result){
        if(err){
            res.send('Error ' + err);
        } else {
            req.flash('success', 'Informacion agregada a la base datos exitosamente');
            res.redirect('./dbimpexp');
        }
    });   
});
// Finalizan vistas para importar archivos

//Vistas para crear respaldo de tabla beneficiarios


router.get('/backup',isLoggedIn, isAdmin, async (req,res) =>{
    const exportPath = './src/files/export/';
    let today = new Date();
    let d = today.getDate(),
        m = today.getMonth()+1,
        y = today.getFullYear();
    const date = d + '-' + m + '-'+ y;
    let n = 0;

    try {
        //Creacion de archivo excel para respaldo
        const title = 'Respaldo_v'+(n+1)+'-'+date;
  
        let [ databenef, registroLlamadas, registroAsistencia , registroEntregas ] = 
            await Promise.all([
                pool.query('SELECT * FROM beneficiarios'), 
                pool.query('SELECT * FROM registro_llamadas'),
                pool.query('SELECT * FROM registro_asistencias'),
                pool.query('SELECT * FROM registro_entregas')
            ]);
        let data = databenef;
        //,   ,
        let calls = registroLlamadas;
        let attend = registroAsistencia;
        let deliver = registroEntregas;
        
        let wb = xlsx.utils.book_new();
        wb.Props = {
            title: title
        }

        let ws = xlsx.utils.json_to_sheet(data);
        let ws2 = xlsx.utils.json_to_sheet(calls);
        let ws3 = xlsx.utils.json_to_sheet(attend);
        let ws4 = xlsx.utils.json_to_sheet(deliver);

        xlsx.utils.book_append_sheet(wb, ws, 'Beneficiarios');
        xlsx.utils.book_append_sheet(wb,ws2, 'Llamadas');
        xlsx.utils.book_append_sheet(wb,ws3, 'Asistencias');
        xlsx.utils.book_append_sheet(wb,ws4, 'Entregas');


        
        xlsx.writeFile(wb, title+'.xlsx');
        //mueve archivo creado a carpeta export 
        fs.rename('./'+title+'.xlsx', exportPath+title+'.xlsx', function (err) {
            if (err){
                throw err 
            } else {
                console.log('file moved')
            }
        });
        let res_path = exportPath, 
        res_name =  title;
        //inserta path del archivo en base de datos 
        const newBackUp = {
            res_path,
            res_name
        };

        await pool.query('INSERT INTO rutas_respaldos SET ?', [newBackUp]);

        req.flash('success', 'Base de datos: beneficiarios ha sido respaldada.');
        res.redirect('./dbimpexp');

    } catch (err) {
        req.flash('Ocurrio un problema al intentar realizar el respaldo.' + err);
        res.redirect('./dbimpexp');
    } 
    
});
//finaliza vistas respaldo 

//Vista para generar descargas de respaldos 
router.get('/downloads',isLoggedIn, isAdmin,  async (req,res) => {

    const downloads = await pool.query('SELECT * FROM rutas_respaldos');

    res.render('links/downloads', {downloads});
});

router.post('/downloads', isLoggedIn, isAdmin, async (req, res) => {
    let items = req.body;
    items = items.downloadItem;
    const inputPath = './src/files/export/';

    const item = await pool.query('SELECT res_name FROM rutas_respaldos WHERE id=?', [items]);
    let title = item[0].res_name;
    
    res.download(inputPath+title+'.xlsx', function (err) {
        console.log(err);
    });
});

//finaliza descarga de respaldos


router.get('/dashboard', isLoggedIn, isAdmin, async (req, res) => {
    const calls = await pool.query('SELECT COUNT(DISTINCT ID_BENEFICIARIO) AS "TOTAL_LLAMADAS" FROM registro_llamadas');
    const callsAnswer = await pool.query('SELECT COUNT(RESULTADO_LLAMADA) AS "CONTESTARON" FROM registro_llamadas WHERE RESULTADO_LLAMADA = "CONTESTÓ"');
    const callsNotAnswer = await pool.query('SELECT COUNT(DISTINCT ID_BENEFICIARIO) AS "NO_CONTESTARON" FROM registro_llamadas WHERE RESULTADO_LLAMADA = "NO CONTESTÓ"');
    const callsAnswerAssist = await pool.query('SELECT COUNT(CONFIRMACION) AS "CONFIRMAN_ASISTENCIA" FROM registro_llamadas WHERE CONFIRMACION = "CONFIRMA ASISTENCIA"');
    const callsAnswerNotSure = await pool.query('SELECT COUNT(CONFIRMACION) AS "NO_ES_SEGURO" FROM registro_llamadas WHERE CONFIRMACION = "NO ESTÁ SEGURO"');
    const callsAnswerNotAssist = await pool.query('SELECT COUNT(CONFIRMACION) AS "NO_ASISTEN" FROM registro_llamadas WHERE CONFIRMACION = "NO ASISTE"');
    const callsAnswerDelete = await pool.query('SELECT COUNT(CONFIRMACION) AS "DAR_DE_BAJA" FROM registro_llamadas WHERE CONFIRMACION = "ELIMINAR DE PADRÓN"');
    const benefsPresent = await pool.query('SELECT COUNT(ASISTENCIA) AS "PRESENTES" FROM registro_asistencias');
    const benefs = await pool.query('SELECT COUNT(ID_BENEFICIARIO) AS "TOTAL_DE_BENEFICIARIOS" FROM beneficiarios');

    res.render('links/dashboard', { totalCall: calls[0],
                                    callAnswer: callsAnswer[0], 
                                    callNotAnswer: callsNotAnswer[0],
                                    callAnswerAssist: callsAnswerAssist[0],
                                    callAnswerNotSure: callsAnswerNotSure[0],
                                    callAnswerNotAssist: callsAnswerNotAssist[0],
                                    callAnswerDelete: callsAnswerDelete[0],
                                    benefPresent: benefsPresent[0],
                                    allBenef: benefs[0]
                                });
});


module.exports = router;
