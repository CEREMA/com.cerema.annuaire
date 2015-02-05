
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

var speech = Ext.create('Ext.ux.SpeechRecognition', {
	maxAlternatives: 2,
	continuous: true,
	interimResults: true,
	logFinalOnly: true,
	chainTranscripts: true,
	listeners: {
		end: function( speechObj, timeStamp, e ) {
			var tab=speech.getCurrentTranscript().split(' ');
			console.log(tab);
			var token=[];
			if (tab.indexOf('recherche')>-1) token.push('SEARCH');
			if (tab.indexOf('cherche')>-1) token.push('SEARCH');
			if (tab.indexOf('service')>-1) {
				token.push('subdis');
				tab.splice(0,tab.indexOf('service')+1);
				token=token.concat(tab);
				console.log(token);
				var u = new SpeechSynthesisUtterance("OK ! Je cherche le service que vous avez demandé.");
				u.lang = 'fr-fr';
				speechSynthesis.speak(u);			
				App.bpclight.speech(token,function(err,o) {
					console.log(err);
					console.log(o);
				});
			};
			console.log(token);
			if (token.length==0) {
				var u = new SpeechSynthesisUtterance('Je n\'ai pas compris ! Veuillez reformuler la demande...');
				u.lang = 'fr-fr';
				speechSynthesis.speak(u);			
			}
		}
	}
});

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
	onSpeechGet: function()
	{
		if (App.get('mainform button#speechget').getText()=="Recherche vocale") {
			var u = new SpeechSynthesisUtterance('Que puis je faire pour vous');
			u.lang = 'fr-fr';
			speechSynthesis.speak(u);
			speech.start();
			App.get('mainform button#speechget').setText("Stop");
		} else {
			speech.stop();
			App.get('mainform button#speechget').setText("Recherche vocale");
		}
	},
	onBtnExportClick: function()
	{
		Auth.login(function(user) {
			console.log(user);
			var items=App.get('grid#GridAgents').getStore().data.items;
			var kage=[];
			for (var i=0;i<items.length;i++) kage.push(items[i].data.Kage);
			Ext.Ajax.request({
				url: '/export',
				params: {
					kage: kage.join(',')
				},
				success: function(response){
					var url=response.responseText;
					var iframe=document.createElement('iframe');
					iframe.src=url;
					document.getElementsByTagName('body')[0].appendChild(iframe);
				}
			});
		});
	},
	onFilterClick: function()
	{
		App.get('FilterBox#FilterPanel').store=App.get('grid#GridAgents').getStore();
		if (App.get('FilterBox#FilterPanel').isVisible())
		App.get('FilterBox#FilterPanel').hide();
		else
		App.get('FilterBox#FilterPanel').show();
	},
	grid_onclick: function( p, record, item, index )
	{
		$('#TPhone').html(record.data.Telephone);
		if (record.data.Portable!="") $('#TMobile').html(record.data.Portable); else $('#TMobile').html('&nbsp;&nbsp;');
		$('#Photo').css('background-image','url(http://172.23.210.97/'+record.data.Matri+'.jpg)');
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
