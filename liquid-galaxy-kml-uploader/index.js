const express = require("express")
const lgKML = express.Router()


var path = require('path');
const kmlDir = path.join(require('os').homedir(),'/kmlApi/');

var fs = require('fs');

var kmlWriter = require('kmlwriter')
const kmlMaster = new kmlWriter()
const kmlSlave = new kmlWriter()

kmlMaster.startKml("initKmlMaster")
kmlSlave.startKml("initKmlSlave")
updateKML()

var kmlList = []
var currentKmlMaster = {};
var currentKmlSlave = {};
var concatenate = [];

var exec = require('child_process').exec;
var bodyParser = require('body-parser')


const formidableMiddleware = require('express-formidable');
const acceptedImageTypes = ['image/gif', 'image/jpg' ,'image/jpeg', 'image/png'];
const kmlType = ['text/xml', 'application/vnd.google-earth.kml+xml'];
const events = [
  {
    event: 'fileBegin',
    action: function(req,res,next,name,file){
        if(acceptedImageTypes.includes(file['type']) || file['name'].includes('.png')){
          file.path = kmlDir + "images/" + file.name
        }else if(kmlType.includes(file['type']) || file['name'].includes('.kml')){
          file.path = kmlDir + file.name
        }
    }
  }
]

lgKML.use(formidableMiddleware({
  keepExtensions: true,

},events));

lgKML.use('/',express.static(kmlDir));

lgKML.use( bodyParser.json() );       // to support JSON-encoded bodies
lgKML.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: true
}))
lgKML.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});


// lgKML.use(bodyParser() );



/***
* KML Builder endpoits
****/

/****
*  params  id,name,lon,lat,range, altMode = 'relativeToGround', description = '', icon= ''
****/
lgKML.post('/kml/builder/addplacemark',function(req,res){
  data = req.fields
  kmlMaster.addPlacemark(data.id,data.name,data.longitude,data.latitude,data.range,'relativeToGround',data.description,data.icon,data.scale)
  kmlSlave.addPlacemark(data.id,data.name,data.longitude,data.latitude,data.range,'relativeToGround',data.description,data.icon,data.scale)
  updateKML()
  res.send({message: true})
})
lgKML.post('/kml/builder/Createtour',function(req,res){
})


lgKML.put('/kml/builder/editCoodPlacemark',function(req,res){
  data = req.fields
  kmlMaster.editCoodPlacemark(data.id,data.latitude,data.longitude,data.range)
  kmlSlave.editCoodPlacemark(data.id,data.latitude,data.longitude,data.range)
  updateKML()
  res.send({message:'done'})
})

lgKML.post('/kml/builder/drawpath',function(req,res){
  data = req.fields
  kmlMaster.createLineString(data.id,data.name,data.path,data.tessellate)
  kmlSlave.createLineString(data.id,data.name,data.path,data.tessellate)
  updateKML()
  res.send({ message : 'done' })
})

lgKML.post('/kml/builder/addpoint/:tourName',function(req,res){
  pass
})

lgKML.post('/kml/builder/orbit',function(req,res){
  data = req.fields
  kmlMaster.createOrbit(data.id,data.name,data.description,data.latitude,data.longitude,data.range)
  kmlSlave.createOrbit(data.id,data.name,data.description,data.latitude,data.longitude,data.range)
  updateKML()
  res.send({message: 'done'})
})

lgKML.post('/kml/builder/addPhoto',function(req,res){
  image = req.files.img
  data = req.fields
  // name = fs.readFileSync(image.path)
  // var contentType = 'image/png'
  // var base64=Buffer.from(name.toString('base64'))
  // name = 'data:image/png;base64,'+ base64
  // name = 'http://' + process.env.KMLSERVERIP +":"+ process.env.KMLSERVERPORT + '/images/'+ image.name
  name = 'http://' + process.env.KMLSERVERIP +":"+ process.env.KMLSERVERPORT + '/images/'+ image.name

  kmlMaster.addGroundOverlay(data.id,data.name,name,data.fCorner,data.sCorner,data.tCorner,data.ftCorner)
  kmlSlave.addGroundOverlay(data.id,data.name,name,data.fCorner,data.sCorner,data.tCorner,data.ftCorner)
  updateKML()
  res.send({ message : 'done' })
})

lgKML.get('/kml/manage/stopTour',function(req,res){
  var text = 'exittour=true'
  fs.writeFile('/tmp/query.txt', text,function(err){
    if(err){
      console.log(err)
    }

  })
  res.send({message: 'done'})
})

lgKML.post('/kml/builder/concatenate',function(req,res){
  concatenate.push(req.files.kml.path)
  // console.log(req.files.kml.path)
  // fs.writeFile('./pre',out,function(err){
  //   if(err){
  //     console.log(err)
  //   }
  // })
  updateKML()
  res.send({message: 'done'})
})

lgKML.delete('/kml/builder/deleteTag/:tag/:id',function(req,res){
  kmlMaster.deleteTagById(req.params.tag, req.params.id)
  kmlSlave.deleteTagById(req.params.tag, req.params.id)
  updateKML()
  res.send({message: "done" })
})

/***
* KML Manage endpoints
****/
lgKML.post('/kml/manage/new',function(req,res){
  startNewKml(req.query.name)
  updateKML()
  checkFolder().then(() => {
    changeCurrentByName(req.query.name)
    res.send({list: kmlList})
  })
})

lgKML.get('/kml/manage/current',function(req,res){
  res.send({current: currentKmlSlave})
})

lgKML.get('/kml/manage/list',function(req,res){
  res.send({list: kmlList})
})
lgKML.get('/kml/manage/clean',function(req,res){
  kmlMaster.startKml("initKmlMaster")
  kmlSlave.startKml("initKmlSlave")
  updateKML()
  cleanScreen()
  res.send({current: currentKmlMaster})
})

function cleanScreen(){
    concatenate = []
    checkFolder().then(function(){
      kmlList.forEach(function(data,index){
        if(data.name.includes('initKmlMaster')){
          currentKmlMaster = kmlList[index]
        }else if(data.name.includes('initKmlSlave')){
          currentKmlSlave = kmlList[index]
        }
      })
    })
}

lgKML.put('/kml/manage/:id',function(req,res){
  currentKml = kmlList[req.params.id]
  res.send({message: "done" })
})
lgKML.put('/kml/manage',function(req,res){
  checkFolder().then(() => {
    res.send(kmlList)
  })
})


lgKML.get('/kml/manage/balloon/:id/:newState',function(req,res){
  kmlMaster.editBalloonState(req.params.id,req.params.newState)
  updateKML()
  res.send({message : "done"})
})

lgKML.get('/kml/manage/initTour/:name',function(req,res){
  var text = 'playtour=' + req.params.name
  fs.writeFile('/tmp/query.txt', text,function(err){
  if(err){
    console.log(err)
  }

  })
  res.send({message: "done" })
})

lgKML.delete('/kml/manage/:id',function(req,res){
  if(kmlList.length > 0){
    fs.unlink(kmlList[req.params.id].path,function(err){
      console.log(err)
    })
    checkFolder()
    .then(() => {
      res.send(kmlList)
    })
  }else{
    res.send(kmlList)
  }

})

/****
*
****/
lgKML.post('/kml/manage/upload/',function(req,res){
  var kml = req.files.kml
  checkFolder()
  .then(() => {
    changeCurrentByName(kml.name)
    // joinKMLs(currentKmlMaster.path)
    // joinKMLs(currentKmlSlave.path)
    res.send({message: "done", List: kmlList})
  })
  .catch((err) =>{
    console.log(err)
  })

})



/****
* the endpoint to sync the kml
****/
lgKML.get('/kml/viewsync/slave',function(req,res){
  res.setHeader('Content-Type', 'text/xml')
  res.sendFile(currentKmlSlave.path)
})
lgKML.get('/kml/viewsync/master',function(req,res){
  res.setHeader('Content-Type', 'text/xml')
  res.sendFile(currentKmlMaster.path)
})

/***
* exec the scripts
***/

lgKML.get('/system/:exec',function(req,res){
    exec(req.params.exec, function(error, stdout, stderr){
        res.send(stdout);
    });
})

lgKML.get('/kml/flyto/:longitude/:latitude/:range',function(req,res){

  var text = 'flytoview=<LookAt> <longitude>' + req.params.longitude +'</longitude><latitude>' + req.params.latitude + '</latitude><range>' + req.params.range + '</range></LookAt>'
  fs.writeFile('/tmp/query.txt', text,function(err){
    if(err){
      console.log(err)
    }
  })
  res.send({ message: 'Done' })

})


function changeCurrentByName(name){
  name = name.split('.kml')[0]
  checkFolder().then(function(){
    kmlList.forEach(function(data,index){
      if(data.name.includes(name)){
        currentKmlMaster = kmlList[index]
        currentKmlSlave = kmlList[index]
      }
    })
  })
  joinKMLs(currentKmlMaster.path)
  joinKMLs(currentKmlSlave.path)


}

//suport functions
function checkFolder(){
  kmlList = []
  return new Promise ((resolve,reject) => {
    fs.readdir(kmlDir, function (err, files) {
      files.forEach(function (file) {
        if(file.substr(-4) === '.kml') {
          addKML(file)
        }
      });
      resolve()
    });
  })
}

function addKML(kml){
  kmlList.push({
    'id'    : kmlList.length,
    'name'  : kml.split(".kml")[0],
    'path'  : path.join(kmlDir,kml)
    })
}

function updateKML(){
  kmlMaster.saveKML(kmlDir)
  .then(function(res){

    joinKMLs(currentKmlMaster.path)
  })
  kmlSlave.saveKML(kmlDir)
  .then(function(res){
    joinKMLs(currentKmlSlave.path)

  })
  // joinKMLs(currentKmlSlave.path)
}

function startNewKml(name){
  kmlMaster.saveKML(name)
  kmlSlave.saveKML(name)
}

function joinKMLs(CurrentPath){
  var out = fs.readFileSync(CurrentPath).toString()
  out = out.replace(/<\/Document[^>]*>|<\/kml[^>]*>/g,"")
  concatenate.forEach(function(cKml){
    cKml = fs.readFileSync(cKml).toString().replace(/<\?{0,1}\/{0,1}[kx]{1}ml[^>]*>/g,'')
    cKml = cKml.replace(/<\/Document/g,'</Folder')
    cKml = cKml.replace(/<Document/g,'<Folder')
    out += cKml
  })
  out += '</Document></kml>'
  // CurrentPath
  fs.writeFile(CurrentPath,out,function(err){
    if(err){
      console.log(err)
    }
  })
}

cleanScreen()
/***
*export
**/
module.exports = lgKML;
