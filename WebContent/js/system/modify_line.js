$(function(){
	initI18n();
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
	      namespaces: ['share', 'modifyLine'],
	      defaultNs: 'modifyLine'
	    },
	    resStore: RES_LANG
	}, function () {
		$('body').i18n();
	});
}

function init() {
	initDesign();
}

function onChangeLeader(obj, worker, name) {
	for(var i = 0; i < oldList.length; i++) {
		var isDel = false;
		
		for(var x = 0; x < oldList[i].sub.length; x++) {
			if(worker == oldList[i].sub[x].from) {
				oldList[i].sub.splice(x, 1);
				isDel = true;
				break;
			}
		}
		
		if(isDel) {
			break;
		}
	}
	
	for(var i = 0; i < oldList.length; i++) {
		if(obj.value == oldList[i].from) {
			oldList[i].sub.push({"from": worker, "to": obj.value, "name": name});
			break;
		}
	}
	
	var text = '<ul>' +
				'	<li>' +
				'		<a href="#">Captain</a>' +
				'		<ul>';
	
	for(var i = 0; i < oldList.length; i++) {
		text += '			<li>' +
				'				<a href="#">' + oldList[i].name + '</a>' +
				'				<ul>';
		for(var x = 0; x < oldList[i].sub.length; x++) {
			text += '				<li><a href="#">' + oldList[i].sub[x].name + '</a></li>';
		}
		
		text += '				</ul>' +
				'			</li>';
		
	}
	
	text += '			</ul>' +
			'		</li>' +
			'	</ul>';
	
	$('#treeView').html(text);
}

//결재 라인 수정
function updateLine() {
	var fromList = [];
	var toList = [];
	
	for(var i = 0; i < oldList.length; i++) {
		for(var x = 0; x < oldList[i].sub.length; x++) {
			fromList.push(oldList[i].sub[x].from);
			toList.push(oldList[i].sub[x].to);
		}
	}
	
	jQuery.ajax({
		type: 'POST',
		url: contextPath + '/system/line/updateLine.html',
		traditional: true,
		data: {
			fromUidList: fromList,
			toUidList: toList
		},
		success: function(data) {
			var json = JSON.parse(data);
			
			if(json.result) {
				alert($.i18n.t('compUpdate'));
				location.href = contextPath + '/system/line/line.html';
			}else{
				alertPop($.i18n.t('share:tryAgain'));
			}
		},
		error: function(req, status, err) {
			alertPop($.i18n.t('share:tryAgain'));
		},
		beforeSend: function() {
			$('#loading').css("display","block");
		},
		complete: function() {
			$('#loading').css('display',"none");
		}
	});
}
