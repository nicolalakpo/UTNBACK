var express = require('express');
var router = express.Router();



router.get('/', function(req, res, next){
    console.log("entro todo");
    res.render('admin/login', {
        layout: 'admin/layout',
    });
});


////////////

router.get('/logout', function(req, res, next){
    req.session.destroy();
    debug.log("no hace nada o si?");
    res.render('admin/login', {
        layout: 'admin/layout'
    });
});

//////////////////////////
var usuariosModel = require ('./../../models/usuariosModel');



router.post('/', async (req, res, next) => {
    try{
        console.log("entro todo");
        var usuario = req.body.usuario;
        var password = req.body.password;

        var data = await
        usuariosModel.getUserByUsernameAndPassword(usuario, password);

        if(data != undefined){
            req.session.id_usuario = data.id;     //aca nose si tengo que poner solo id en base a como lo cree en la pagina
            req.session.nombre = data.usuario;
            res.redirect('/admin/novedades');
        }else{
            res.render('admin/login' , {
                layout: 'admin/layout' ,
                error : true
            });
        }
    }catch(error){
        console.log(error);
    }
})





module.exports = router;
