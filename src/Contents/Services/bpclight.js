/*
 *
 *    BPCLight
 *    v1.00 
 *
 */

bpclight = {
	getFonctions: function(o,cb)
	{
		bpclight.using('db').model('bpclight','select * from roles order by LibRol',cb);
	},
	getPhoto: function(o,cb)
	{
		bpclight.using('db').query('bpclight','select trombi from trombi where kage='+o,cb);	
	},	
	getEtablissements: function(o,cb)
	{
		bpclight.using('db').model('bpclight','select * from etablissements where archive=0 order by LibEts',cb);		
	},
	getDepartements: function(o,cb)
	{
		bpclight.using('db').model('bpclight','select * from unites where archive=0 order by LibUni',cb);	
	},
	getServices: function(o,cb)
	{
		bpclight.using('db').model('bpclight','select * from subdis where archive=0 order by LibSub ',cb);	
	},
	getGrades: function(o,cb)
	{
		var db=bpclight.using('db');
		db.model('bpclight','select * from grades order by LibGra',cb);	
	},
	getBatiments: function(o,cb)
	{
		bpclight.using('db').model('bpclight','select * from batiments order by LibBat',cb);	
	},
	getCategories: function(o,cb)
	{
		bpclight.using('db').model('bpclight','select * from catgrad order by LibCgr',cb);		
	}
};

module.exports = bpclight;