const low = require('lowdb')
const db = low(__dirname+'/user.json')

var systemdb = {
    init:init,
    set:set,
    get:get,
    state:db.getState()
}

function init(key,value){
    var str = "{\""+key+"\":"+JSON.stringify(value)+"}"
    db.defaults(JSON.parse(str))
    .write()
}

function set(key,value){
    db.set(key, value)
  .write()
}


function get(key){
    return db.get(key).value()
}

module.exports = systemdb