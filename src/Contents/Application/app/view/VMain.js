App.view.define('VMain', {

    extend: 'Ext.Panel',
	alias : 'widget.mainform',
	border: false,
	
	layout: "border",
	
	items: [
		{
			region: 'north',
			height: 25,
			minHeight: 25,
			border:false,
			baseCls: 'cls-header',
			xtype: "Menu",
			itemId: "MenuPanel",
			menu: [
			]		
		},
		{
			region: "west",
			html: "yes",
			width: 450,
			xtype: "treepanel",
			itemId: "TreePanel",
			height: "100%",
			rootVisible: false, 
			split:true,
			store: Ext.create('Ext.data.TreeStore', {
				autoLoad: true,
				proxy: {
					type: 'ajax',
					url: '/root',
					actionMethods: {
						read: 'POST'
					},
					reader: {
						type: 'json'
					}					
				}
			})			
		},
		{
			region: "center",			
			split:true,
			width: 350,	
			xtype: "grid",
			border: true,
			itemId: "GridAgents",
			tbar: [
				{
					xtype: 'ux-searchbox',
					width: 200,
					triggerCls : Ext.baseCSSPrefix + 'form-search-trigger',
					itemId: 'searchbox',
					padding:4,
					width: 150
				},
				{
					xtype: "button",
					text: "Recherche vocale",
					itemId: "speechget",
					disabled: true
				},
				'->'
			],
			columns:[
				{ 
					text: 'Nom',  
					dataIndex: 'Nom', 
					flex:1 
				},{ 
					text: 'Prénom',  
					dataIndex: 'Prenom' 
				},{ 
					text: 'Téléphone',  
					dataIndex: 'Telephone' 
				},{ 
					text: 'Mobile',  
					dataIndex: 'Portable' 
				}
			],
			store:Ext.create('Ext.data.Store', {
				autoLoad: false,
				proxy: {
					type: 'ajax',
					url: '/agents',
					actionMethods: {
						read: 'POST'
					}, 
					reader: {
						type: 'json'
					}					
				}
			})
		},
		{
			region: "east",
			layout: "vbox",
			flex: 1,
			split:true,
			items: [
				{
					html: '<table width=100%><tr><td><div id="Photo" class="CPhoto"></div></td><td>&nbsp;&nbsp;</td><td valign=top width=100%><div id="NomPrenom" class="CNomPrenom"></div><br><div id="Poste" class="CPoste"></div></td></tr></table><br><table><tr><td>Téléphone</td><td><div id="TPhone" class="CLabel"></div></td></tr><tr><td>Mobile</td><td><div id="TMobile" class="CLabel"></div></td></tr><tr><td>Courriel</td><td><div id="TMail" class="CLabel"></div></td></tr></table>',
					padding: 10,
					split: true,
					height: 350,
					width: "100%",
					border: false
				},
				{
					html: '<div id="LibellePoste" class="CPoste"></div>',
					padding: 10,
					split: true,
					width: "100%",
					border: false,
					flex: 1
				},
				{
					id: "MyGMapPanel",
					html: '<div id="TMapPanel" style="width:100%;height:100%"></div>',
					padding: 10,
					height: 350,
					width: "100%",
					border: false,
					split: true
				}
			]
		}
	]
	
});
	