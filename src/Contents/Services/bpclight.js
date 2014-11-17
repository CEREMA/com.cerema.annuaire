/*
 *
 *    BPCLight
 *    v1.00 
 *
 */

bpclight = {
	getFonctions: function(o,cb)
	{
		var db=bpclight.using('db');
		db.model('bpclight','select * from roles order by LibRol',cb);
	},
	getEtablissements: function(o,cb)
	{
		var db=bpclight.using('db');
		db.model('bpclight','select * from etablissements where archive=0 order by LibEts',cb);		
	},
	getDepartements: function(o,cb)
	{
		var db=bpclight.using('db');
		db.model('bpclight','select * from unites where archive=0 order by LibUni',cb);	
	},
	getServices: function(o,cb)
	{
		var db=bpclight.using('db');
		db.model('bpclight','select * from subdis where archive=0 order by LibSub ',cb);	
	},
	getGrades: function(o,cb)
	{
		var db=bpclight.using('db');
		db.model('bpclight','select * from grades order by LibGra',cb);	
	},
	getBatiments: function(o,cb)
	{
		var db=bpclight.using('db');
		db.model('bpclight','select * from batiments order by LibBat',cb);	
	},
	getCategories: function(o,cb)
	{
		var db=bpclight.using('db');
		db.model('bpclight','select * from catgrad order by LibCgr',cb);		
	},
	exportXLS: function(o,cb)
	{
		var db=bpclight.using('db');
		if (o.length==0) {
			cb(true,null);
			return;
		};
		db.query('bpclight',db.sql("export",{
			kage: o
		}),cb);
	},
	speech: function(o,cb)
	{
		var db=bpclight.using('db');
		console.log(o);
		if (!o[2]) cb("NOT_FOUND",null); else {
			if (o.indexOf('SEARCH')>-1) {
				if (o.indexOf('subdis')>-1) {
					o.splice(0,o.indexOf('subdis'));
					console.log('select * from subdis where archive=0 and libsub="'+o.join(' ')+'" order by LibSub');
					db.model('bpclight','select * from subdis where archive=0 and libsub="'+o.join(' ')+'" order by LibSub',cb);
				};
			}
		}
	}
};

module.exports = bpclight;