/**
 * Created by shelley on 2017/2/14.
 */
var express = require('express');

var config = require('./config');
var port = config.build.port;

var app = express();

var router = express.Router();
router.get('/', (req, res, next) => {
  req.url = '/index.html';
  next();
});
app.use(router);

// 获取本地json数据
var data = require('./data.json');
var seller = data.seller;
var goods = data.goods;
var ratings = data.ratings;

var apiRouter = express.Router();

apiRouter.get('/seller',function(req,res){
  res.json({
    errno:0,
    data:seller
  })
});
apiRouter.get('/goods',function(req,res){
  res.json({
    errno:0,
    data:goods
  });
});
apiRouter.get('/ratings',function(req,res){
  res.json({
    errno:0,
    data:ratings
  });
});

app.use('/api',apiRouter);  // 让所有数据路由都放到／api路由下

app.use(express.static('./dist'));

module.export = app.listen(port, (err) => {
  if (err) {
    console.log(err);
    return
  }
  console.log('Listening at http://localhost:' + port + '\n')
});
