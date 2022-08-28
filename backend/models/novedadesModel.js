var pool = require('./bd');


async function getNovedades(){
    
        var query = 'select * from novedades order by id desc'; //limit y un numero le pongo un limite
        //cuando hacer var filas(row)se conecta con la query, busca el selec, y cuando pase los
        //paranetros(user y pass) y al estar en el md5 la va a encriptar 
        var rows = await pool.query(query);
        return rows;
    


}

async function insertNovedad(obj){
    try{       
        var query = 'insert into novedades set ?';
            var rows = await pool.query(query, [obj]);
            return rows;
    }catch(error){
        console.log(error);
        throw error;
    }
}

async function delateNovedadesById(id){
    var query = 'delete from novedades where id = ?';
    var rows = await pool.query (query, [id]);
    return rows;
}

async function getNovedadesById(id){
    var query = 'select * from novedades where id = ?';
    var rows = await pool.query(query, [id]);
    return rows[0];
}

async function modificarNovedadesById(obj, id){
    try{
        var query = 'update novedades set ? where id = ?'
        var rows = await pool.query(query, [obj, id]);
        return rows;
    }catch(error){
        throw error;
    }
}


module.exports = {getNovedades, insertNovedad, delateNovedadesById, getNovedadesById, modificarNovedadesById}