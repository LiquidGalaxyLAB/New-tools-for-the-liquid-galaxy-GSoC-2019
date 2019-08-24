var express = require('express')
const app = express()
var lgKML = require('./index.js')
var port = process.env.KMLSERVERPORT || 8080

const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./documentation.json');
var options = {
  customCss: '.swagger-ui .topbar { display: none }'
};
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument,options));
app.use(lgKML)

app.listen(port,function(){
  console.log("API test, listening on port", port )
})
