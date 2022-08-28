//todas las interaciones que tengamos en la base de datos con respecto a la tabla de 
//usuario la va a venir a buscar aca

var pool = require('./bd');
var md5 =  require('md5');
//funcion asincronica quiere decir que es una funciona que va a ser usada cuando sea necesario
async function getUserByUsernameAndPassword(user, password){
    try{
        var query = 'select * from usuarios where usuario = ? and password = ? limit 1';
        //cuando hacer var filas(row)se conecta con la query, busca el selec, y cuando pase los
        //paranetros(user y pass) y al estar en el md5 la va a encriptar 
        var rows = await pool.query(query, [user, md5(password)]);
        return rows[0];
    }catch(error){
        console.log(error);
    
    }


}

module.exports = {getUserByUsernameAndPassword}