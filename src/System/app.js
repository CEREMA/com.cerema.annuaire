Math.uuid = function() {
	var CHARS = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
    var chars = CHARS, uuid = new Array(36), rnd=0, r;
    for (var i = 0; i < 36; i++) {
      if (i==8 || i==13 ||  i==18 || i==23) {
        uuid[i] = '-';
      } else if (i==14) {
        uuid[i] = '4';
      } else {
        if (rnd <= 0x02) rnd = 0x2000000 + (Math.random()*0x1000000)|0;
        r = rnd & 0xf;
        rnd = rnd >> 4;
        uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
      }
    }
    return uuid.join('');
};

App = {
	init: function(app,server) {
		app.use('/tmp',server.static(__dirname + require('path').sep+'tmp'));
		app.post('/export',function(req,res) {
			var excelbuilder=App.using('msexcel-builder');
			if (req.body.kage) {
				var o=req.body.kage.split(',');
				App.bpclight.exportXLS(o,function(e,tabs) {
					var uid=Math.uuid();
					var workbook = excelbuilder.createWorkbook(__dirname+require('path').sep+'tmp', uid+'.xlsx');
					var sheet1 = workbook.createSheet('BPCLight', 500, 1500);
					var conf={};
					conf.cols = [
					{
						caption: 'Nom',
						type:'string',
						width: 50
					},
					{
						caption: 'Prénom',
						type:'string',
						width: 50
					},
					{
						caption: 'Date naissance',
						type:'date',
						width: 30
					},
					{
						caption: 'Date position',
						type:'date',
						width: 30
					},
					{
						caption: 'Grade',
						type:'string',
						width: 50
					},
					{
						caption: 'Département',
						type:'string',
						width: 100
					},
					{
						caption: 'Service',
						type:'string',
						width: 100
					},
					{
						caption: 'Arrivée',
						type:'string',
						width: 100
					},
					{
						caption: 'Motif',
						type:'string',
						width: 100
					},
					{
						caption: 'Position',
						type:'string',
						width: 100
					},
					{
						caption: 'Service destination',
						type:'string',
						width: 100
					}
					];			
					for (var e=0;e<conf.cols.length;e++) {
						sheet1.set(e+1,1,conf.cols[e].caption);
						sheet1.width(e+1, conf.cols[e].width*1);
					};
					for (var i=0;i<tabs.length;i++) {
						var element=tabs[i];
						var k=1;
						var ii=i+2;
						for (var el in element) {
							if (k<12) {
								sheet1.set(k, ii, element[el]);								
							};
							k++;
						};
					};			
					workbook.save(function(ok){
						res.end('/tmp/'+uid+'.xlsx');
					});					
					
				});
			};
		}),
		app.post('/agent',function(req,res) {
			res.header("Content-Type", "application/json; charset=utf-8");
			App.using('db').model('bpclight','SELECT roles.LibRol FROM (bpclight.agerol agerol INNER JOIN bpclight.roles roles ON (agerol.Krol = roles.Krol)) INNER JOIN bpclight.agents agents ON (agents.Kage = agerol.Kage) WHERE agents.kage='+req.body.kage,function(err,o){
				res.end(JSON.stringify(o,null,4));
			});
		}),
		app.post('/agent.mail',function(req,res) {
			res.header("Content-Type", "application/json; charset=utf-8");
			App.using('db').model('bpclight','SELECT DISTINCT * FROM mela WHERE kage='+req.body.kage,function(err,o){
				res.end(JSON.stringify(o,null,4));
			});
		}),
		app.post('/agents',function(req,res) {
			res.header("Content-Type", "application/json; charset=utf-8");
			if (req.body.quest) {
				var o=JSON.parse(req.body.quest);
				var db=bpclight.using('db');
				var objs=[];
				var where=[];
				objs.push("batiments.LibBatC");
				objs.push("batiments.GPS");
				objs.push("agents.*");
				for (var i=0;i<o.length;i++)
				{
					var str="";
					if (i!=0) {
						str=' '+o[i].operator+' ';
					};
					str+=o[i].name;
					str+=o[i].value;
					//str=str.replace(/item/g,o[i].value);
					where.push(str);
				};		
				var sql=db.get('bpclight',objs,where);
				console.log(sql);
				db.model('bpclight', sql ,function(err,result) {
					res.end(JSON.stringify(result,null,4));
				});			
				return;
			};
			if (req.body.nom)
			{
				App.using('db').model('bpclight','SELECT batiments.LibBatC, batiments.GPS, agents.* FROM bpclight.agents agents LEFT OUTER JOIN bpclight.batiments batiments ON (agents.Kbat = batiments.Kbat) WHERE actif=1 and nom like "'+req.body.nom+'" order by nom,prenom',function(err,o) {
					res.end(JSON.stringify(o,null,4));
				});
				return;			
			};						
			if (req.body.ksub)
			{
				App.using('db').model('bpclight','SELECT batiments.LibBatC, batiments.GPS, agents.* FROM bpclight.agents agents LEFT OUTER JOIN bpclight.batiments batiments ON (agents.Kbat = batiments.Kbat) WHERE actif=1 and ksub='+req.body.ksub+' order by nom,prenom',function(err,o) {
					res.end(JSON.stringify(o,null,4));
				});
				return;
			};
			if (req.body.kuni)
			{
				App.using('db').model('bpclight','SELECT batiments.LibBatC, batiments.GPS, agents.* FROM bpclight.agents agents LEFT OUTER JOIN bpclight.batiments batiments ON (agents.Kbat = batiments.Kbat) WHERE actif=1 and kuni='+req.body.kuni+' order by nom,prenom',function(err,o) {
					res.end(JSON.stringify(o,null,4));
				});
				return;
			};
			if (req.body.kets)
			{	
				App.using('db').model('bpclight','SELECT batiments.LibBatC, batiments.GPS, agents.* FROM bpclight.agents agents LEFT OUTER JOIN bpclight.batiments batiments ON (agents.Kbat = batiments.Kbat) WHERE actif=1 and kuni in (select kuni from unites where kets='+req.body.kets+') order by nom,prenom',function(err,o) {
					res.end(JSON.stringify(o,null,4));
				});
			};			
		}),
		app.post('/root',function(req,res) {
			res.header("Content-Type", "application/json; charset=utf-8");
			var ff=[];
			var db=App.using('db');
			if (req.body.node=="root") {
				var sql='select * from etablissements';				
				db.query('bpclight',sql,function(err,o) {	
					for (var i=0;i<o.length;i++)
					{
						ff.push({
							text: o[i].LibEts,
							id: 'Kets'+o[i].Kets,
							leaf: false
						});
					};
					res.end(JSON.stringify(ff,null,4));	
				});
			} else {
				if (req.body.node.indexOf('Kets')>-1) {
					var kets=req.body.node.split('Kets')[1];
					var sql='select * from unites where archive=0 and Kets='+kets+' order by libuni';
					db.query('bpclight',sql,function(err,o) {	
					for (var i=0;i<o.length;i++)
					{
						ff.push({
							text: '<b>'+o[i].LibUnic+'</b>&nbsp;'+o[i].LibUni,
							id: 'Kuni'+o[i].Kuni,
							leaf: false
						});
					};
					res.end(JSON.stringify(ff,null,4));						
					});
				};
				if (req.body.node.indexOf('Kuni')>-1) {
					var kuni=req.body.node.split('Kuni')[1];
					var sql='select * from subdis where archive=0 and Kuni='+kuni+' order by libsub';
					db.query('bpclight',sql,function(err,o) {	
					for (var i=0;i<o.length;i++)
					{
						ff.push({
							text: '<b>'+o[i].LibSubC+'</b>&nbsp;'+o[i].LibSub,
							id: 'Ksub'+o[i].Ksub,
							leaf: true
						});
					};
					res.end(JSON.stringify(ff,null,4));						
					});
				};				
			}
		});
		
	}
};

module.exports = App;