const {table, db_meta} = require('./db_schema');

function init_db(){

    table('user')
        .column('id',db_meta.TYPES.INT, db_meta.CONST.P_KEY)
        .column('username',db_meta.TYPES.STRING,db_meta.CONST.UNIQUE)
        .column ('password',db_meta.TYPES.STRING,db_meta.CONST.NOT_NULL)
        .column ('role',db_meta.TYPES.STRING,db_meta.CONST.DEFAULT('user'))
        .build();


}

module.exports = init_db;
