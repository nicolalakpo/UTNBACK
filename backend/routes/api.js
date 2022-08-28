var express = require('express');
var router = express.Router();

var novedadesModel = require('./../models/novedadesModel');
var cloudinary = require('cloudinary').v2;

var nodemiler = require('nodemailer');


router.get('/novedades', async function(req, res, next){
    let novedades = await novedadesModel.getNovedades();

    novedades = novedades.map(novedades =>{
        if(novedades.img_id){
            const imagen = cloudinary.url(novedades.img_id, {
                width: 1000,
                height: 600,
                crop: 'fill'
            });
            return{
                ...novedades,
                imagen
            }
        }else{
            return{
                ...novedades,
                imagen: ''
            }
        }
    });
    res.json(novedades);
});


router.post('/contacto', async(req, res)=> {
    // res.send(res)
    const mail = {
        to: 'lehmanncakesandcookies@gamil.com',
        subject: 'Contacto web',
        html: `${req.body.nombre} se conecto a traves de
        la web y quiere más informacion a este correo : 
        ${req.body.mails} <br> Ademas, hizo el siguiente 
        comentario : ${req.body.mensaje} <br> Su tel es: 
        ${req.body.telefono}`        
    }


    const transport = nodemiler.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS
        }
    });
    
    await transport.sendMail(mail)
    res.status(201).json({
        error:false,
        message: 'mensaje enviado'
        
    });
});

module.exports = router;