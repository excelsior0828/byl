module.exports = function(){
  var route = require('express').Router();
  var conn = require('../config/db')();
  var multiparty = require('../config/multiparty')();
  var fs = require('../config/fs')();

  // console.log(process.cwd());
  // HOME
  route.get('/', function(req, res){
    var sql ='SELECT * FROM byl, portfolio, contact';
    conn.query(sql, function(err, home, fields){
      res.render('homes/home', {home:home, user:req.user});
    })
  });
  route.get('/home/edit', function(req, res){
    var sql ='SELECT * FROM byl, portfolio, contact';
    conn.query(sql, function(err, home, fields){
      res.render('homes/home_edit', {home:home, user:req.user})
    })
  });
  route.post('/home/edit1', function(req, res){
    var byl_title1 = req.body.byl_title1;
    var byl_title2 = req.body.byl_title2;
    var byl_topic = req.body.byl_topic;
    var byl_description = req.body.byl_description;
    var web_intro = req.body.web_intro;
    var name = req.body.name;
    var my_intro = req.body.my_intro;
    var skill_topic = req.body.skill_topic;
    var skill1 = req.body.skill1;
    var skill2 = req.body.skill2;
    var skill3 = req.body.skill3;
    var number1 = req.body.number1;
    var number2 = req.body.number2;
    var number3 = req.body.number3;
    var number4 = req.body.number4;
    var activity1 = req.body.activity1;
    var activity2 = req.body.activity2;
    var activity3 = req.body.activity3;
    var activity4 = req.body.activity4;
    var sql ='UPDATE byl SET byl_title1=?, byl_title2=?, byl_topic=?, byl_description=?, web_intro=?, name=?, my_intro=?, skill_topic=?, skill1=?, skill2=?, skill3=?, number1=?, number2=?, number3=?, number4=?, activity1=?, activity2=?, activity3=?, activity4=? WHERE id=1';
    conn.query(sql, [byl_title1, byl_title2, byl_topic, byl_description, web_intro, name, my_intro, skill_topic, skill1, skill2, skill3, number1, number2, number3, number4, activity1, activity2, activity3, activity4], function(err, byl, fields){
      if(err){
        console.log(err);
        res.status(500).send('Internal Server Error');
      } else {
        res.redirect('/byl');
      }
    })
  });
  route.post('/home/edit2', function(req, res){
    var portfolio_title = req.body.portfolio_title;
    var portfolio_topic = req.body.portfolio_topic;
    var portfolio_description = req.body.portfolio_description;
    var interest_a = req.body.interest_a;
    var interest_b = req.body.interest_b;
    var interest_c = req.body.interest_c;
    var sql ='UPDATE portfolio SET portfolio_title=?, portfolio_topic=?, portfolio_description=?, interest_a=?, interest_b=?, interest_c=? WHERE id=1';
    conn.query(sql, [portfolio_title, portfolio_topic, portfolio_description, interest_a, interest_b, interest_c], function(err, portfolio, fields){
      if(err){
        console.log(err);
        res.status(500).send('Internal Server Error');
      } else {
        res.redirect('/byl');
      }
    })
  });
  route.post('/home/edit3', function(req, res){
    var contact_title = req.body.contact_title;
    var contact_topic = req.body.contact_topic;
    var contact_description = req.body.contact_description;
    var address = req.body.address;
    var number = req.body.number;
    var email = req.body.email;
    var phrase = req.body.phrase;
    var sql ='UPDATE contact SET contact_title=?, contact_topic=?, contact_description=?, address=?, number=?, email=?, phrase=? WHERE id=1';
    conn.query(sql, [contact_title, contact_topic, contact_description, address, number, email, phrase], function(err, contact, fields){
      if(err){
        console.log(err);
        res.status(500).send('Internal Server Error');
      } else {
        res.redirect('/byl');
      }
    })
  });

  // PORTFOLIO - FLOWER
  // FLOWER/ADD
  route.get('/flower', function(req, res) {
    var sql = 'SELECT * FROM flowers';
    conn.query(sql, function(err, flowers, fields){
      res.render('flowers/flower', {flowers:flowers, user:req.user});
    });
  });
  route.get('/flower/add', function(req, res){
    var sql = 'SELECT * FROM flowers';
    conn.query(sql, function(err, flowers, fields){
      res.render('flowers/flower_add', {flowers:flowers, user:req.user});
    })
  });
  route.post('/flower/add', function(req, res){
    var form = new multiparty.Form();
    form.parse(req, function(err, fields, files) {
      console.log(fields);
      console.log(files);
      var fieldMap = {
        category: fields.category[0]
      };
      console.log(fieldMap);
      if(files.img[0].size > 0) {
        console.log('in..');
        var fileName = files.img[0].originalFilename;
        // 경로 설정...
        console.log(fileName);
        var realPath = '/uploads/flowers/main/'+fileName;
        var tmp_path = files.img[0].path;
        console.log(tmp_path);
        var target_path = process.cwd() + realPath;
        fs.renameSync(tmp_path, target_path, function(err) {
          console.log('in renameSync');
            if(err) console.error(err.stack);
        });
        fieldMap.path = realPath;
        console.log(realPath);
        console.log(fieldMap.path)
        var sql = 'INSERT INTO flowers (category, path) VALUES(?, ?)';
        console.log(fieldMap);
        conn.query(sql, [fieldMap.category, fieldMap.path], function(err, flowers, fields){
          if(err){
            console.log(err);
            res.status(500).send('Internal Server Error');
          } else {
            console.log('Upload completed!');
            res.redirect('/byl/flower');
          }
        });
      } else {
        console.log(err);
        res.status(500).send('Internal Server Error');
      }
    });
  });
  // FLOWER/EDIT
  route.get('/flower/edit', function(req, res){
    var sql = 'SELECT * FROM flowers';
    conn.query(sql, function(err, flowers, fields){
      res.render('flowers/flower_edit', {flowers:flowers, user:req.user});
    })
  });
  route.post('/flower/edit', function(req, res){
    var form = new multiparty.Form();
    form.parse(req, function(err, fields, files){
      var fieldMap = {
        category: fields.category[0],
        flowerId: fields.flowerId[0]
      };
      console.log(fieldMap);
      if(files.img[0].size > 0) {
        console.log('in..');
        var fileName = files.img[0].originalFilename;
        console.log(fileName);
        //'/uploads/flowers/flower/' 디렉토리 새로 만들 것
        var realPath = '/uploads/flowers/'+fileName;
        var tmp_path = files.img[0].path;
        console.log(tmp_path);
        var target_path = process.cwd() + realPath;
        console.log(target_path);
        fs.renameSync(tmp_path, target_path, function(err){
          console.log('in renameSync');
            if(err) console.log(err.stack);
        });
        fieldMap.path = realPath;
        console.log(realPath);
        console.log(fieldMap.path)
        var sql = 'UPDATE flowers SET category = ?, path = ? WHERE flowerId =?';
        console.log(sql);
        console.log(fieldMap);
        //flowerId 값을 주어야 한다.
        conn.query(sql, [fieldMap.category, fieldMap.path, fieldMap.flowerId], function(err, flowers, fields){
          if(err){
            console.log(err);
            res.status(500).send('Internal Server Error');
          } else {
            console.log('Edit completed');
            res.redirect('/byl/flower');
          }
        })
      } else {
        console.log(err);
        res.status(500).send('Internal Server Error');
      }
    })
  });
  // FLOWER/DELETE
  route.get('/flower/delete', function(req, res){
    var sql = 'SELECT * FROM flowers';
    conn.query(sql, function(err, flowers, fields){
      res.render('flowers/flower_delete', {flowers:flowers, user:req.user});
    })
  });
  route.post('/flower/delete', function(req, res){
    var sql = 'DELETE FROM flowers WHERE flowerId=?';
    var id = req.body.flowerId;
    console.log(id);
    conn.query(sql, [id], function(err, flowers, fields){
      if(err){
        console.log(err);
        res.status(500).send('Internal Server Error');
      } else {
        res.redirect('/byl/flower');
      }
    })
  });
  // FLOWERS/:ID/ADD
  route.get('/flowers/:id', function(req, res){
    var sql = 'SELECT * FROM flowers WHERE flowerId=?';
    var id = req.params.id;
    console.log('id', id);
    conn.query(sql, [id], function(err, flowers, fields){
      console.log('flowers', flowers);
      // console.log(fields);
      if(err) {
        console.log(err);
        res.json(err);
      }
      if(id){
        var sql = 'SELECT * FROM flowers_item WHERE flowerId=?';
        conn.query(sql, [id], function(err, flowersId, fields){
          if(err){
            console.log(err);
          } else {
            console.log('flowers: ', flowers[0]);
            console.log('flowersId: ', flowersId )
            console.log('--');
            res.render('flowers/flowers_item', {flowers:flowers[0], flowersId:flowersId, user:req.user});
          }
        })
      }
    })
  });
  route.get('/flowers/:id/add', function(req, res){
    var sql = 'SELECT * FROM flowers WHERE flowerId=?';
    var id = req.params.id;
    console.log('id', id);
    conn.query(sql, [id], function(err, flowers, fields){
      console.log('flowers', flowers);
      var sql = 'SELECT * FROM flowers_item WHERE flowerId=?';
      conn.query(sql, [id], function(err, flowersId, fields){
        if(err){
          console.log(err);
          res.status(500).send('Internal Server Error');
        } else {
          console.log('flowersId', flowersId)
          res.render('flowers/flowers_item_add', {flowers:flowers[0], flowersId:flowersId, user:req.user});
        }
      })
    })
  });
  route.post('/flowers/:id/add', function(req, res){
    var form = new multiparty.Form();
    form.parse(req, function(err, fields, files) {
      console.log(fields);
      console.log(files);
      var fieldMap = {
        name: fields.name[0],
        flowerId: fields.flowerId[0],
        materials: fields.materials[0],
        size: fields.size[0],
        weight: fields.weight[0],
        price: fields.price[0]
      };
      console.log(fieldMap);
      if(files.img[0].size > 0) {
        console.log('in..');
        var fileName = files.img[0].originalFilename;
        // 경로 설정...
        console.log(fileName);
        var realPath = '/uploads/flowers/'+fileName;
        var tmp_path = files.img[0].path;
        console.log(tmp_path);
        var target_path = process.cwd() + realPath;
        console.log(target_path);
        fs.renameSync(tmp_path, target_path, function(err) {
          console.log('in renameSync');
            if(err) console.error(err.stack);
        });
        fieldMap.path = realPath;
        console.log(realPath);
        console.log(fieldMap.path)
        var sql = 'INSERT INTO flowers_item (flowerId, name, materials, size, weight, price, path) VALUES(?, ?, ?, ?, ?, ?, ?)';
        console.log(fieldMap);
        conn.query(sql, [fieldMap.flowerId, fieldMap.name, fieldMap.materials, fieldMap.size, fieldMap.weight, fieldMap.price, fieldMap.path], function(err, flowers, fields){
          if(err){
            console.log(err);
            res.status(500).send('Internal Server Error');
          } else {
            console.log('Upload completed!');
            // res.json(200);
            res.redirect('/byl/flowers/' + fieldMap.flowerId);
          }
        });
      } else {
        console.log(err);
        res.status(500).send('Internal Server Error');
      }
    });
  });
  // FLOWERS/:ID/EDIT
  route.get('/flowers/:id/edit', function(req, res){
    console.log("in");
    var sql = 'SELECT * FROM flowers WHERE flowerId=?';
    var id = req.params.id;
    console.log(id);
    conn.query(sql, [id], function(err, flowers, fields){
      console.log(flowers);
      // console.log(fields);
      if(err) {
        console.log(err);
        res.json(err);
      }
      var sql = 'SELECT * FROM flowers_item WHERE flowerId=?';
      conn.query(sql, [id], function(err, flowersId, fields){
        if(err){
          console.log(err);
          res.stauts(500).send('Internal Server Error');
        } else {
          res.render('flowers/flowers_item_edit', {flowers:flowers[0], flowersId:flowersId, user:req.user});
        }
      });
    });
  });
  route.post('/flowers/:id/edit', function(req, res){
    var form = new multiparty.Form();
    form.parse(req, function(err, fields, files){
      console.log(fields);
      console.log(files);
      var fieldMap = {
        flowerId: fields.flowerId[0],
        name: fields.name[0],
        materials: fields.materials[0],
        size: fields.size[0],
        weight: fields.weight[0],
        price: fields.price[0],
        id: fields.id
      };
      console.log(fieldMap);
      if(files.img[0].size > 0) {
        console.log('in..');
        var fileName = files.img[0].originalFilename;
        console.log(fileName);
        var realPath = '/uploads/flowers/'+fileName;
        var tmp_path = files.img[0].path;
        console.log(tmp_path);
        var target_path = process.cwd() + realPath;
        console.log(target_path);
        fs.renameSync(tmp_path, target_path, function(err){
          console.log('in renameSync');
            if(err) console.log(err.stack);
        });
        fieldMap.path = realPath;
        var sql = 'UPDATE flowers_item SET name = ?, materials=?, size =?, weight = ?, price = ?, path = ? WHERE id = ?';
        console.log(fieldMap);
        conn.query(sql, [fieldMap.name, fieldMap.materials, fieldMap.size, fieldMap.weight, fieldMap.price, fieldMap.path, fieldMap.id], function(err, flowers, fields){
          if(err){
            console.log(err);
            res.status(500).send('Internal Server Error');
          } else {
            console.log('Edit completed');
            res.redirect('/byl/flowers/' + fieldMap.flowerId);
          }
        })
      }
    })
  });
  // FLOWERS/:ID/DELETE
  route.get('/flowers/:id/delete', function(req, res){
    var sql = 'SELECT * FROM flowers WHERE flowerId=?';
    var id = req.params.id;
    console.log(id);
    conn.query(sql, [id], function(err, flowers, fields){
      console.log(flowers);
      // console.log(fields);
      if(err) {
        console.log(err);
        res.json(err);
      }
      var sql = 'SELECT * FROM flowers_item WHERE flowerId=?';
      conn.query(sql, [id], function(err, flowersId, fields){
        if(err){
          console.log(err);
          res.stauts(500).send('Internal Server Error');
        } else {
          res.render('flowers/flowers_item_delete', {flowers:flowers[0], flowersId:flowersId, user:req.user});
        }
      });
    });
  });
  route.post('/flowers/:id/delete', function(req, res){
    var sql = 'DELETE FROM flowers_item WHERE id=?';
    var id = req.params.id;
    // var flowerId = req.body.flowerId
    console.log(id);
    conn.query(sql, [id], function(err, flowers, fields){
      if(err){
        console.log(err);
        res.status(500).send('Internal Server Error');
      } else {
        res.redirect('/byl/flower');
      }
    })
  });

  // PORTFOLIO - TRAVEL
  // TRAVEL/ADD
  route.get('/travel', function(req, res) {
    var sql = 'SELECT * FROM travels';
    conn.query(sql, function(err, travels, fields){
      res.render('travels/travel', {travels:travels, user:req.user});
    });
  });
  route.get('/travel/add', function(req, res){
    var sql = 'SELECT * FROM travels';
    conn.query(sql, function(err, travels, fields){
      res.render('travels/travel_add', {travels:travels, user:req.user});
    })
  });
  route.post('/travel/add', function(req, res){
    var form = new multiparty.Form();
    form.parse(req, function(err, fields, files) {
      console.log(fields);
      console.log(files);
      var fieldMap = {
        category: fields.category[0]
      };
      console.log(fieldMap);
      if(files.img[0].size > 0) {
        console.log('in..');
        var fileName = files.img[0].originalFilename;
        // 경로 설정...
        console.log(fileName);
        var realPath = '/uploads/travels/main/'+fileName;
        var tmp_path = files.img[0].path;
        console.log(tmp_path);
        var target_path = process.cwd() + realPath;
        console.log(target_path);
        fs.renameSync(tmp_path, target_path, function(err) {
          console.log('in renameSync');
            if(err) console.error(err.stack);
        });
        fieldMap.path = realPath;
        console.log(realPath);
        console.log(fieldMap.path)
        var sql = 'INSERT INTO travels (category, path) VALUES(?, ?)';
        console.log(fieldMap);
        conn.query(sql, [fieldMap.category, fieldMap.path], function(err, travels, fields){
          if(err){
            console.log(err);
            res.status(500).send('Internal Server Error');
          } else {
            console.log('Upload completed!');
            res.redirect('/byl/travel');
          }
        });
      } else {
        console.log(err);
        res.status(500).send('Internal Server Error');
      }
    });
  });
  // TRAVEL/EDIT
  route.get('/travel/edit', function(req, res){
    var sql = 'SELECT * FROM travels';
    conn.query(sql, function(err, travels, fields){
      res.render('travels/travel_edit', {travels:travels, user:req.user});
    })
  });
  route.post('/travel/edit', function(req, res){
    var form = new multiparty.Form();
    form.parse(req, function(err, fields, files){
      var fieldMap = {
        category: fields.category[0],
        travelId: fields.travelId[0]
      };
      console.log(fieldMap);
      if(files.img[0].size > 0) {
        console.log('in..');
        var fileName = files.img[0].originalFilename;
        console.log(fileName);
        //'/uploads/flowers/flower/' 디렉토리 새로 만들 것
        var realPath = '/uploads/travels/'+fileName;
        var tmp_path = files.img[0].path;
        console.log(tmp_path);
        var target_path = process.cwd() + realPath;
        console.log(target_path);
        fs.renameSync(tmp_path, target_path, function(err){
          console.log('in renameSync');
            if(err) console.log(err.stack);
        });
        fieldMap.path = realPath;
        console.log(realPath);
        console.log(fieldMap.path)
        var sql = 'UPDATE travels SET category = ?, path = ? WHERE travelId =?';
        console.log(sql);
        console.log(fieldMap);
        //flowerId 값을 주어야 한다.
        conn.query(sql, [fieldMap.category, fieldMap.path, fieldMap.travelId], function(err, travels, fields){
          if(err){
            console.log(err);
            res.status(500).send('Internal Server Error');
          } else {
            console.log('Edit completed');
            res.redirect('/byl/travel');
          }
        })
      } else {
        console.log(err);
        res.status(500).send('Internal Server Error');
      }
    })
  });
  // TRAVEL/DELETE
  route.get('/travel/delete', function(req, res){
    var sql = 'SELECT * FROM travels';
    conn.query(sql, function(err, travels, fields){
      res.render('travels/travel_delete', {travels:travels, user:req.user});
    })
  });
  route.post('/travel/delete', function(req, res){
    var sql = 'DELETE FROM travels WHERE travelId=?';
    var id = req.body.travelId;
    console.log(id);
    conn.query(sql, [id], function(err, travels, fields){
      if(err){
        console.log(err);
        res.status(500).send('Internal Server Error');
      } else {
        res.redirect('/byl/travel');
      }
    })
  });
  // TRAVELS/:ID/ADD
  route.get('/travels/:id', function(req, res){
    var sql = 'SELECT * FROM travels WHERE travelId=?';
    var id = req.params.id;
    console.log('id', id);
    conn.query(sql, [id], function(err, travels, fields){
      console.log('travels1', travels);
      // console.log(fields);
      if(err) {
        console.log(err);
        res.json(err);
      }
      if(id){
        var sql = 'SELECT * FROM travels_item WHERE travelId=?';
        conn.query(sql, [id], function(err, travelsId, fields){
          if(err){
            console.log(err);
          } else {
            console.log('travels2', travels[0]);
            console.log('--');
            res.render('travels/travels_item', {travels:travels[0], travelsId:travelsId, user:req.user});
          }
        })
      }
    })
  });
  route.get('/travels/:id/add', function(req, res){
    var sql = 'SELECT * FROM travels WHERE travelId=?';
    var id = req.params.id;
    console.log(id);
    conn.query(sql, [id], function(err, travels, fields){
      console.log(travels);
      var sql = 'SELECT * FROM travels_item WHERE travelId=?';
      conn.query(sql, [id], function(err, travelsId, fields){
        if(err){
          console.log(err);
          res.status(500).send('Internal Server Error');
        } else {
          console.log(travelsId)
          console.log(travels[0])
          res.render('travels/travels_item_add', {travels:travels[0], travelsId:travelsId, user:req.user});
        }
      })
    })
  });
  route.post('/travels/:id/add', function(req, res){
    var form = new multiparty.Form();
    form.parse(req, function(err, fields, files) {
      console.log('fields:', fields);
      console.log(files);
      var fieldMap = {
        description: fields.description[0],
        travelId: fields.travelId[0],
      };
      console.log(fieldMap);
      if(files.img[0].size > 0) {
        console.log('in..');
        var fileName = files.img[0].originalFilename;
        // 경로 설정...
        console.log(fileName);
        var realPath = '/uploads/travels/'+fileName;
        var tmp_path = files.img[0].path;
        console.log(tmp_path);
        var target_path = process.cwd() + realPath;
        console.log(target_path);
        fs.renameSync(tmp_path, target_path, function(err) {
          console.log('in renameSync');
            if(err) console.error(err.stack);
        });
        fieldMap.path = realPath;
        console.log(realPath);
        console.log(fieldMap.path)
        var sql = 'INSERT INTO travels_item (travelId, description, path) VALUES(?, ?, ?)';
        console.log(fieldMap);
        conn.query(sql, [fieldMap.travelId, fieldMap.description, fieldMap.path], function(err, travels, fields){
          if(err){
            console.log(err);
            res.status(500).send('Internal Server Error');
          } else {
            console.log('Upload completed!');
            // res.json(200);
            res.redirect('/byl/travels/' + fieldMap.travelId);
          }
        });
      } else {
        console.log(err);
        res.status(500).send('Internal Server Error');
      }
    });
  });
  // TRAVELS/:ID/EDIT
  route.get('/travels/:id/edit', function(req, res){
    console.log("in");
    var sql = 'SELECT * FROM travels WHERE travelId=?';
    var id = req.params.id;
    console.log(id);
    conn.query(sql, [id], function(err, travels, fields){
      console.log(travels);
      // console.log(fields);
      if(err) {
        console.log(err);
        res.json(err);
      }
      var sql = 'SELECT * FROM travels_item WHERE travelId=?';
      conn.query(sql, [id], function(err, travelsId, fields){
        if(err){
          console.log(err);
          res.stauts(500).send('Internal Server Error');
        } else {
          res.render('travels/travels_item_edit', {travels:travels[0], travelsId:travelsId, user:req.user});
        }
      });
    });
  });
  route.post('/travels/:id/edit', function(req, res){
    var form = new multiparty.Form();
    form.parse(req, function(err, fields, files){
      console.log(fields);
      console.log(files);
      var fieldMap = {
        travelId: fields.travelId[0],
        description: fields.description[0],
        id: fields.id[0]
      };
      console.log(fieldMap);
      if(files.img[0].size > 0) {
        console.log('in..');
        var fileName = files.img[0].originalFilename;
        console.log(fileName);
        var realPath = '/uploads/travels/'+fileName;
        var tmp_path = files.img[0].path;
        console.log(tmp_path);
        var target_path = process.cwd() + realPath;
        console.log(target_path);
        fs.renameSync(tmp_path, target_path, function(err){
          console.log('in renameSync');
            if(err) console.log(err.stack);
        });
        fieldMap.path = realPath;
        var sql = 'UPDATE travels_item SET path = ?, description = ? WHERE id = ?';
        console.log(fieldMap);
        conn.query(sql, [fieldMap.path, fieldMap.description, fieldMap.id], function(err, travels, fields){
          if(err){
            console.log(err);
            res.status(500).send('Internal Server Error');
          } else {
            console.log('Edit completed');
            res.redirect('/byl/travels/' + fieldMap.travelId);
          }
        })
      }
    })
  });
  // TRAVELS/:ID/DELETE
  route.get('/travels/:id/delete', function(req, res){
    console.log("in");
    var sql = 'SELECT * FROM travels WHERE travelId=?';
    var id = req.params.id;
    console.log(id);
    conn.query(sql, [id], function(err, travels, fields){
      console.log(travels);
      // console.log(fields);
      if(err) {
        console.log(err);
        res.json(err);
      }
      var sql = 'SELECT * FROM travels_item WHERE travelId=?';
      conn.query(sql, [id], function(err, travelsId, fields){
        if(err){
          console.log(err);
          res.stauts(500).send('Internal Server Error');
        } else {
          res.render('travels/travels_item_delete', {travels:travels[0], travelsId:travelsId, user:req.user});
        }
      });
    });
  });
  route.post('/travels/:id/delete', function(req, res){
    var sql = 'DELETE FROM travels_item WHERE id=?';
    var id = req.params.id;
    // var travelId = req.body.travelId
    console.log(id);
    conn.query(sql, [id], function(err, travels, fields){
      if(err){
        console.log(err);
        res.status(500).send('Internal Server Error');
      } else {
        res.redirect('/byl/travel');
      }
    })
  });

  // PORTFOLIO - OTHER
  // OTHER/ADD
  route.get('/other/', function(req, res) {
    var sql = 'SELECT * FROM others';
    conn.query(sql, function(err, others, fields){
      res.render('others/other', {others:others, user:req.user});
    });
  });
  route.get('/other/add', function(req, res){
    var sql = 'SELECT * FROM others';
    conn.query(sql, function(err, others, fields){
      res.render('others/other_add', {others:others, user:req.user});
    })
  });
  route.post('/other/add', function(req, res){
    var form = new multiparty.Form();
    form.parse(req, function(err, fields, files) {
      console.log(fields);
      console.log(files);
      var fieldMap = {
        category: fields.category[0]
      };
      console.log(fieldMap);
      if(files.img[0].size > 0) {
        console.log('in..');
        var fileName = files.img[0].originalFilename;
        // 경로 설정...
        console.log(fileName);
        var realPath = '/uploads/others/main/'+fileName;
        var tmp_path = files.img[0].path;
        console.log(tmp_path);
        var target_path = process.cwd() + realPath;
        console.log(target_path);
        fs.renameSync(tmp_path, target_path, function(err) {
          console.log('in renameSync');
            if(err) console.error(err.stack);
        });
        fieldMap.path = realPath;
        console.log(realPath);
        console.log(fieldMap.path)
        var sql = 'INSERT INTO others (category, path) VALUES(?, ?)';
        console.log(fieldMap);
        conn.query(sql, [fieldMap.category, fieldMap.path], function(err, others, fields){
          if(err){
            console.log(err);
            res.status(500).send('Internal Server Error');
          } else {
            console.log('Upload completed!');
            res.redirect('/byl/other');
          }
        });
      } else {
        console.log(err);
        res.status(500).send('Internal Server Error');
      }
    });
  });
  // OTHER/EDIT
  route.get('/other/edit', function(req, res){
    var sql = 'SELECT * FROM others';
    conn.query(sql, function(err, others, fields){
      res.render('others/other_edit', {others:others, user:req.user});
    })
  });
  route.post('/other/edit', function(req, res){
    var form = new multiparty.Form();
    form.parse(req, function(err, fields, files){
      var fieldMap = {
        category: fields.category[0],
        otherId: fields.otherId[0]
      };
      console.log(fieldMap);
      if(files.img[0].size > 0) {
        console.log('in..');
        var fileName = files.img[0].originalFilename;
        console.log(fileName);
        //'/uploads/flowers/flower/' 디렉토리 새로 만들 것
        var realPath = '/uploads/others/'+fileName;
        var tmp_path = files.img[0].path;
        console.log(tmp_path);
        var target_path = process.cwd() + realPath;
        console.log(target_path);
        fs.renameSync(tmp_path, target_path, function(err){
          console.log('in renameSync');
            if(err) console.log(err.stack);
        });
        fieldMap.path = realPath;
        console.log(realPath);
        console.log(fieldMap.path)
        var sql = 'UPDATE others SET category = ?, path = ? WHERE otherId =?';
        console.log(sql);
        console.log(fieldMap);
        //flowerId 값을 주어야 한다.
        conn.query(sql, [fieldMap.category, fieldMap.path, fieldMap.otherId], function(err, others, fields){
          if(err){
            console.log(err);
            res.status(500).send('Internal Server Error');
          } else {
            console.log('Edit completed');
            res.redirect('/byl/other');
          }
        })
      } else {
        console.log(err);
        res.status(500).send('Internal Server Error');
      }
    })
  });
  // OTHER/DELETE
  route.get('/other/delete', function(req, res){
    var sql = 'SELECT * FROM others';
    conn.query(sql, function(err, others, fields){
      res.render('others/other_delete', {others:others, user:req.user});
    })
  });
  route.post('/other/delete', function(req, res){
    var sql = 'DELETE FROM others WHERE otherId=?';
    var id = req.body.otherId;
    console.log(id);
    conn.query(sql, [id], function(err, others, fields){
      if(err){
        console.log(err);
        res.status(500).send('Internal Server Error');
      } else {
        res.redirect('/byl/other');
      }
    })
  });

  // PORTFOLIO - OTHERS/:ID/ADD
  route.get('/others/:id', function(req, res){
    var sql = 'SELECT * FROM others WHERE otherId=?';
    var id = req.params.id;
    console.log(id);
    conn.query(sql, [id], function(err, others, fields){
      console.log(others);
      // console.log(fields);
      if(err) {
        console.log(err);
        res.json(err);
      }
      if(id){
        var sql = 'SELECT * FROM others_item WHERE otherId=?';
        conn.query(sql, [id], function(err, othersId, fields){
          if(err){
            console.log(err);
          } else {
            console.log(others[0]);
            console.log('--');
            res.render('others/others_item', {others:others[0], othersId:othersId, user:req.user});
          }
        })
      }
    })
  });
  route.get('/others/:id/add', function(req, res){
    var sql = 'SELECT * FROM others WHERE otherId=?';
    var id = req.params.id;
    console.log(id);
    conn.query(sql, [id], function(err, others, fields){
      console.log(others);
      var sql = 'SELECT * FROM others_item WHERE otherId=?';
      conn.query(sql, [id], function(err, othersId, fields){
        if(err){
          console.log(err);
          res.status(500).send('Internal Server Error');
        } else {
          console.log(othersId)
          res.render('others/others_item_add', {others:others[0], othersId:othersId, user:req.user});
        }
      })
    })
  });
  route.post('/others/:id/add', function(req, res){
    var form = new multiparty.Form();
    form.parse(req, function(err, fields, files) {
      console.log('fields:', fields);
      console.log('files:', files);
      var fieldMap = {
        description: fields.description[0],
        otherId: fields.otherId[0]
      };
      console.log('fieldMap:', fieldMap);
      if(files.img[0].size > 0) {
        console.log('in..');
        var fileName = files.img[0].originalFilename;
        // 경로 설정...
        console.log('fileName:', fileName);
        var realPath = '/uploads/others/'+fileName;
        var tmp_path = files.img[0].path;
        console.log('tmp_path:', tmp_path);
        var target_path = process.cwd() + realPath;
        console.log('target_path:', target_path);
        fs.renameSync(tmp_path, target_path, function(err) {
          console.log('in renameSync');
            if(err) console.error(err.stack);
        });
        fieldMap.path = realPath;
        console.log('realPath:', realPath);
        console.log(fieldMap.path)
        var sql = 'INSERT INTO others_item (otherId, description, path) VALUES(?, ?, ?)';
        console.log('fieldMap:', fieldMap);
        conn.query(sql, [fieldMap.otherId, fieldMap.description, fieldMap.path], function(err, others, fields){
          if(err){
            console.log(err);
            res.status(500).send('Internal Server Error');
          } else {
            console.log('Upload completed!');
            // res.json(200);
            res.redirect('/byl/others/' + fieldMap.otherId);
          }
        });
      } else {
        console.log(err);
        res.status(500).send('Internal Server Error');
      }
    });
  });
  // PORTFOLIO - OTHERS/:ID/EDIT
  route.get('/others/:id/edit', function(req, res){
    console.log("in");
    var sql = 'SELECT * FROM others WHERE otherId=?';
    var id = req.params.id;
    console.log(id);
    conn.query(sql, [id], function(err, others, fields){
      console.log(others);
      // console.log(fields);
      if(err) {
        console.log(err);
        res.json(err);
      }
      var sql = 'SELECT * FROM others_item WHERE otherId=?';
      conn.query(sql, [id], function(err, othersId, fields){
        if(err){
          console.log(err);
          res.stauts(500).send('Internal Server Error');
        } else {
          res.render('others/others_item_edit', {others:others[0], othersId:othersId, user:req.user});
        }
      });
    });
  });
  route.post('/others/:id/edit', function(req, res){
    var form = new multiparty.Form();
    form.parse(req, function(err, fields, files){
      console.log(fields);
      console.log(files);
      var fieldMap = {
        otherId: fields.otherId[0],
        description: fields.description[0],
        id: fields.id[0]
      };
      console.log(fieldMap);
      if(files.img[0].size > 0) {
        console.log('in..');
        var fileName = files.img[0].originalFilename;
        console.log(fileName);
        var realPath = '/uploads/others/'+fileName;
        var tmp_path = files.img[0].path;
        console.log(tmp_path);
        var target_path = process.cwd() + realPath;
        console.log(target_path);
        fs.renameSync(tmp_path, target_path, function(err){
          console.log('in renameSync');
            if(err) console.log(err.stack);
        });
        fieldMap.path = realPath;
        var sql = 'UPDATE others_item SET path = ?, description = ? WHERE id = ?';
        console.log(fieldMap);
        conn.query(sql, [fieldMap.path, fieldMap.description, fieldMap.id], function(err, others, fields){
          if(err){
            console.log(err);
            res.status(500).send('Internal Server Error');
          } else {
            console.log('Edit completed');
            res.redirect('/byl/others/' + fieldMap.otherId);
          }
        })
      }
    })
  });
  // PORTFOLIO - OTHERS/:ID/DELETE
  route.get('/others/:id/delete', function(req, res){
    console.log("in");
    var sql = 'SELECT * FROM others WHERE otherId=?';
    var id = req.params.id;
    console.log(id);
    conn.query(sql, [id], function(err, others, fields){
      console.log(others);
      // console.log(fields);
      if(err) {
        console.log(err);
        res.json(err);
      }
      var sql = 'SELECT * FROM others_item WHERE otherId=?';
      conn.query(sql, [id], function(err, othersId, fields){
        if(err){
          console.log(err);
          res.stauts(500).send('Internal Server Error');
        } else {
          res.render('others/others_item_delete', {others:others[0], othersId:othersId, user:req.user});
        }
      });
    });
  });
  route.post('/others/:id/delete', function(req, res){
    var sql = 'DELETE FROM others_item WHERE id=?';
    var id = req.params.id;
    // var otherId = req.body.otherId
    console.log(id);
    conn.query(sql, [id], function(err, others, fields){
      if(err){
        console.log(err);
        res.status(500).send('Internal Server Error');
      } else {
        res.redirect('/byl/other');
      }
    })
  });

  return route;
}
