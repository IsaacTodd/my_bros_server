const database = require('./database');


const db_meta = {
    TYPES: {
        NULL:"NULL",
        INT:"INTEGER",
        FLOAT:"REAL",
        STRING:"TEXT",

    },
    CONST: {
        P_KEY:"PRIMARY KEY",
        NOT_NULL: "NOT NULL",
        UNIQUE: "UNIQUE",
        DEFAULT: (D)=> `DEFAULT ${D}`
        //CHECK and FOREIGN KEY is not yet supported.
    }
}


class TableCreationFail extends Error {}


class SQLTablePrototype {
    #query = "";
    constructor (table_name) {
        this.#query +=`CREATE TABLE IF NOT EXISTS ${table_name}(\n`
    }

    column(name, type, constr="") {
        if(this.#query.endsWith("(\n"))  this.#query += `${name} ${type} ${constr}`
        else this.#query += `,\n${name} ${type} ${constr}`;
        return this;
    }

    build() {
        this.#query += `\n);`
        database.exec(this.#query,(err)=>{
            if(err) throw new TableCreationFail(err);
        })

    }
}


function table(table_name) {
    return new SQLTablePrototype(table_name);
}

module.exports =  {
    table,
    db_meta
}