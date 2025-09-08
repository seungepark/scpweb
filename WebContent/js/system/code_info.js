$(function() {
	initI18n();
	initTree();
	init();
	
	initServerCheck();
});

function initI18n() {
	var lang = initLang();

	$.i18n.init({
		lng : lang,
		fallbackLng : FALLBACK_LNG,
		fallbackOnNull : false,
		fallbackOnEmpty : false,
		useLocalStorage : false,
		ns : {
			namespaces : [ 'share', 'codeInfo' ],
			defaultNs : 'codeInfo'
		},
		resStore : RES_LANG
	}, function() {
		$('body').i18n();
	});
}

function initTree() {
	var html = new Array();
	var item = new Object();
	var isFirstSub = true;
	
	for(var i = 0; i < codeList.length; i++) {
		if(codeList[i].kind == 'G') {
			if(i > 0) {
				html.push(item);
			}
			
			isFirstSub = true;
			item = new Object();
			item.selectable = false;
			item.text = codeList[i].codeName + ' [' + codeList[i].code + ']'; 
			item.icon = 'glyphicon glyphicon-file';
			item.color = '#3F51B5';
			item.state = new Object();
			item.state.expanded = false;
			item.state.selected = true;
		}else {
			if(isFirstSub) {
				item.nodes = new Array();
				isFirstSub = false;
			}
			
			var subItem = new Object();
			subItem.selectable = false;
			subItem.text = codeList[i].codeName + ' [' + codeList[i].code + ']';
			subItem.color = '#000000';
			subItem.backColor = '#DFDFDF';
			
			item.nodes.push(subItem);
		}
	}
	
	html.push(item);
	
	$('#treeView').treeview({
		data: html
	});
}

function init() {
	initDesign();
}
