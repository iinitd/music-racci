var mango = require('mango')
var fs = require('fs')

var docs = fs.readFileSync("./songs-l.txt")
    .toString('utf-8')
    .split("\n")
    .map((doc, pos) => {
        var obj = JSON.parse(doc).result
        obj.doc_id = pos
        return obj
    })

var parser = mango.Parser.init("full",docs,"doc_id",["lyrics","singer","composer",'songwritter','album'],[1,20,3,2,1])

var idx_singer = mango.Parser.field_idx("singer",docs,"doc_id",["singer"],"commit_count")

var idx_composer = mango.Parser.field_idx("composer",docs,"doc_id",["composer"],"commit_count")

var idx_writer = mango.Parser.field_idx("writer",docs,"doc_id",["songwritter"],"commit_count")

