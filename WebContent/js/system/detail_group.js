$(function(){
	initI18n();
	initTree();
	init();
		
	initServerCheck();
});

function initI18n() {
	var lang = initLang();

	$.i18n.init({
	    lng: lang,
	    fallbackLng: FALLBACK_LNG,
	    fallbackOnNull: false,
	    fallbackOnEmpty: false,
	    useLocalStorage: false,
	    ns: {
	      namespaces: ['share', 'detailGroup'],
	      defaultNs: 'detailGroup'
	    },
	    resStore: RES_LANG
	}, function () {
		$('body').i18n();
	});
}

function init() {
	initDesign();
}

function initTree() {
	jQuery.ajax({
		type: 'GET',
		url: contextPath + '/system/group/getAuthList.html',
		data: {},
		success: function(data) {
			var json = JSON.parse(data);
			
			if(json.list.length > 0) {
				var html = new Array();
				var item = new Object();
				var isFirstSub = true;
				
				for(var i = 0; i < json.list.length; i++) {
					var isAuth = false;
					
					for(var x = 0; x < oldGroupList.length; x++) {
						if(json.list[i].uid == oldGroupList[x]) {
							isAuth = true;
							break;
						}
					}
					
					if(json.list[i].kind == 'PAGE') {
						if(i > 0) {
							html.push(item);
						}
						
						isFirstSub = true;
						item = new Object();
						item.selectable = false;
						item.uid = json.list[i].uid;
						item.upUid = json.list[i].upUid;
						item.text = json.list[i].desc; 
						item.color = '#212134';
						item.state = new Object();
						item.state.expanded = false;
						
						if(isAuth) {
							item.state.selected = true;
							item.icon = 'glyphicon glyphicon-check';
						}else {
							item.icon = 'glyphicon glyphicon-unchecked';
						}
					}else {
						if(isFirstSub) {
							item.nodes = new Array();
							isFirstSub = false;
						}
						
						var subItem = new Object();
						subItem.selectable = false;
						subItem.uid = json.list[i].uid;
						subItem.upUid = json.list[i].upUid;
						subItem.text = json.list[i].desc;
						subItem.color = '#212134';
						subItem.backColor = '#FFFFFF';
						
						if(isAuth) {
							subItem.state = new Object();
							subItem.state.selected = true;
							subItem.icon = 'glyphicon glyphicon-check';
						}else {
							subItem.icon = 'glyphicon glyphicon-unchecked';
						}
						
						item.nodes.push(subItem);
					}
				}
				
				html.push(item);
				
				$('#treeView').treeview({
					data: html
				});
			}
		},
		error: function(req, status, err) {
		},
		beforeSend: function() {
		},
		complete: function() {
		}
	});
}
