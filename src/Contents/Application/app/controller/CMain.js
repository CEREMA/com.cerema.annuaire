
function GMap(l,m)
{
	var TMap={};
	TMap.map = new google.maps.Map(document.getElementById('TMapPanel'),{
		zoom: 18,
		center: new google.maps.LatLng(l, m),
		mapTypeId: google.maps.MapTypeId.SATELLITE	
	});
	TMap.marker= new google.maps.Marker({
		position: new google.maps.LatLng(l,m)
	});		
	TMap.marker.setMap(TMap.map);
};

App.controller.define('CMain', {

	views: [
		"VMain"
	],
	
	models: [
		"mFonctions",
		"mGrades",
		"mBatiments",
		"mEtablissements",
		"mDepartements",
		"mServices",
		"mCategories"	
	],
	
	init: function()
	{

		this.control({
			"mainform menu>menuitem": {
				click: "Menu_onClick"
			},
			"mainform treepanel#TreePanel": {
				itemclick: "tree_onclick"
			},
			"mainform grid#GridAgents": {
				itemclick: "grid_onclick"
			},
			"mainform ux-searchbox#searchbox" : {
				click: "onSearch"
			}
		});
		
		App.init('VMain',this.onLoad);
		
	},
	Menu_onClick: function(p) 
	{
		if (p.itemId) {
			Ext.Msg.alert('Status', 'Click event on '+p.itemId);
		};
	},	
	onSearch: function(v)
	{
		var grid=App.get('grid#GridAgents');
		grid.getStore().getProxy().extraParams={
			nom: v+"%"
		};
		grid.getStore().load();
	},
	grid_onclick: function( p, record, item, index )
	{
		$('#TPhone').html(record.data.Telephone);
		if (record.data.Portable!="") $('#TMobile').html(record.data.Portable); else $('#TMobile').html('&nbsp;&nbsp;');
		//$('#Photo').css('background-image','url(http://172.23.210.97/'+record.data.Matri+'.jpg)');
		App.bpclight.getPhoto(record.data.Kage,function(e) {
			try {
				$('#Photo').css('background-image','url('+e[0].trombi+')');
			}catch(e) {
				$('#Photo').css('background-image','url(data:image/png;base64,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)');
			}
		});		
		$('#NomPrenom').html(record.data.Prenom+' '+record.data.Nom);
		try{
			$('#LibellePoste').html(record.data.libelle_poste);
		}catch(e)
		{
			$('#LibellePoste').html('...');
		};
		Ext.Ajax.request({
			url: '/agent',
			params: {
				kage: record.data.Kage
			},
			success: function(response){
				var response = JSON.parse(response.responseText);
				var r=[];
				for (var i=0;i<response.data.length;i++)
				{
					r.push(response.data[i].LibRol);
				};
				$('#Poste').html(r.join('<br>'));
			}
		});		
		Ext.Ajax.request({
			url: '/agent.mail',
			params: {
				kage: record.data.Kage
			},
			success: function(response){
				var response = JSON.parse(response.responseText);
				var r=[];
				for (var i=0;i<response.data.length;i++)
				{
					if (r.indexOf(response.data[i].LibMelA)==-1) r.push(response.data[i].LibMelA);
				};
				$('#TMail').html(r.join('<br>'));
			}
		});		
		try {
			GMap(record.data.GPS.split(' ')[0],record.data.GPS.split(' ')[1]);
		} catch(err) {
			Ext.getCmp('MyGMapPanel').hide();
		};
	},
	tree_onclick: function( p, record, item, index )
	{
		var id=record.data.id;
		var grid=App.get('grid#GridAgents');
		if (id.indexOf('Ksub')>-1) grid.getStore().getProxy().extraParams.ksub=id.split('Ksub')[1];
		else
		if (id.indexOf('Kuni')>-1) grid.getStore().getProxy().extraParams.kuni=id.split('Kuni')[1];
		else
		if (id.indexOf('Kets')>-1) grid.getStore().getProxy().extraParams.kets=id.split('Kets')[1];		
		grid.getStore().load();
		grid.getStore().getProxy().extraParams={};
	},	
	onLoad: function()
	{
	App.loadAPI("http://maps.google.com/maps/api/js?sensor=false&callback=GMap");
	}	

	
});
