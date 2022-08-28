var express = require('express');
var router = express.Router();

var novedadesModel = require('./../../models/novedadesModel');//unidad 6
const { route } = require('./login');

var util = require('util');
const pool = require('../../models/bd');
var cloudinary = require('cloudinary').v2; //aca puede cambiar dependiendo de la version que hay en el momento, actualmente esta la 2
const uploader = util.promisify(cloudinary.uploader.upload);
const destroy = util.promisify(cloudinary.uploader.destroy);

router.get('/', async function (req, res, next) {  //funcion async no esta en el pdf
    var novedades = await novedadesModel.getNovedades(); //unidad 6

    novedades = novedades.map(novedad => {
        if (novedad.img_id) {
            const imagen = cloudinary.image(novedad.img_id, {
                width: 100,
                height: 100,
                crop: 'fill' //puedp isar pad en lugar de fill 
            });
            return {
                ...novedad,
                imagen
            }
        } else {
            return {
                ...novedad,
                imagen: ''
            }
        }
    });


    res.render('admin/novedades', {
        layout: 'admin/layout',
        usuario: req.session.nombre,//en el video pone persona y no usuario
        novedades //unidad 6
    });
});


router.get('/agregar', (req, res, next) => {
    res.render('admin/agregar', {
        layout: 'admin/layout'
    })
})
module.exports = router;


router.post('/agregar', async (req, res, next) => {

    try {

        var img_id = '';
        console.log(req.files.imagen);
        if (req.files && Object.keys(req.files).length > 0) {
            imagen = req.files.imagen;
            img_id = (await uploader(imagen.tempFilePath)).public_id;
        }

        if (req.body.producto != "" && req.body.descripcion != "" && req.body.valor != "") {
            await novedadesModel.insertNovedad({
                ...req.body,
                img_id
            });
            res.redirect('/admin/novedades')
        } else {
            res.render('admin/agregar', {
                layout: 'admin/layout',
                error: true,
                message: 'Todos los campos son requeridos'
            })
        }
    } catch (error) {
        console.log(error)
        res.render('admin/agregar', {
            layout: 'admin/layout',
            error: true,
            message: 'No se cargo la novedad'
        })
    }
})

router.get('/eliminar/:id', async (req, res, next) => {
    var id = req.params.id;

    let novedad = await novedadesModel.getNovedadesById(id)
    if(novedad.img_id){
        await(destroy(novedad.img_id));
    }

    await novedadesModel.delateNovedadesById(id);
    res.redirect('/admin/novedades');
});
router.get('/modificar/:id', async (req, res, next) => {
    var id = req.params.id;
    console.log(req.params.id);
    var novedad = await novedadesModel.getNovedadesById(id);

    res.render('admin/modificar', {
        layout: 'admin/layout',
        novedad
    })
});

router.post('/modificar', async (req, res, next) => {
    try {

        let img_id = req.body.img_original;
        let borrar_img_vieja = false;
        if(req.body.img_delete === "1"){
            img_id = null;
            borrar_img_vieja = true;
        }else{
            if(req.files && Object.keys(req.files).length > 0){
                imagen = req.files.imagen;
                img_id = (await uploader(imagen.tempFilePath)).public_id;
                borrar_img_vieja = true;
            }
        }
        if(borrar_img_vieja && req.body.img_original){
            await(destroy(req.body.img_original));
        }


        var obj = {
            producto: req.body.producto,
            descripcion: req.body.descripcion,
            valor: req.body.valor,
            img_id
        }
        console.log(obj)


        await novedadesModel.modificarNovedadesById(obj, req.body.id);
        res.redirect('/admin/novedades');


    } catch (error) {
        console.log(error)
        res.render('admin/modificar', {
            layout: 'admin/layout',
            error: true,
            message: 'No se modifico la novedad'
        })
    }
})



