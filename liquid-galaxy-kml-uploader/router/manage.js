const express = require("express")
const manage = express.Router()
var path = require('path');
const kmlDir = path.join(require('os').homedir(),'/kmlApi');
var fs = require('fs');

var kmlList = []
var currentKml = 0;

function checkFolder(){
  kmlList = []
  return new Promise ((resolve,reject) => {
    fs.readdir(kmlDir, function (err, files) {
      files.forEach(function (file) {
        addKML(file)
      });
      resolve()
    });

  })
}
function addKML(kml){
  console.log(kml)
  kmlList.push({
    'id'    : kmlList.length,
    'name'  : kml.split(".js")[0],
    'path'  : path.join(kmlDir,kml)
    })
}

manage.get('/current',function(req,res){
  console.log("lel")
  res.send(currentKml)
})

manage.get('/list',function(req,res){
  res.send(kmlList)
})

manage.put('/:id',function(req,res){
  console.log(req.params)
  currentKml = req.params.id
  res.send("okay!")
})

manage.put('/',function(req,res){
  checkFolder().then(() => {
    console.log(kmlList[0])
    res.send(kmlList)
  })
})

manage.delete('/:id',function(req,res){
  console.log("lel")
  if(kmlList.length > 0){
    console.log(kmlList[req.params.id].path)
    fs.unlink(kmlList[req.params.id].path,function(err){
      console.log(err)
    })
    checkFolder().then(() => {
      res.send(kmlList)
    })
  }else{
    res.send(kmlList)
  }
})

checkFolder()



module.exports = manage;
