$(function() {
	initI18n();
	
	init();
	initServerCheck();
	autocompleteOff();
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
			namespaces : [ 'share', 'modifyCron' ],
			defaultNs : 'modifyCron'
		},
		resStore : RES_LANG
	}, function() {
		$('body').i18n();
	});
}

function init() {
	initDesign();
	
	$('#lastrundate').datepicker({
	    format: 'yyyy-mm-dd hh:mm:ss',
	    autoclose: true,
	    clearBtn: true
	});
	
	$('.modal-dialog').draggable({handle: '.modal-header'});
}

// Cron정보 수정
function updateCron() {
	let isEmpty = false;
	let isFreqError = false;
	
	let cronid = $('#cronid').val();
	let description = $('#description').val();
	let status = $('#status').val();
	let frequency = $('#frequency').val();
	let cronclass = $('#cronclass').val();
	let lastrundate = $('#lastrundate').val();
	let runcnt = $('#runcnt').val();
	
	
	if(cronid == '' || frequency == '' || cronclass == '') {
		isEmpty = true;
	}
	
	if(frequency.split(' ').length != 6){
		isFreqError = true;
	}
	
	if(isEmpty) {
		alertPop($.i18n.t('required'));
	} else if(isFreqError){
		alertPop($.i18n.t('errFrequency'));
	} else {
		jQuery.ajax({
			type: 'POST',
			url: contextPath + '/db/cron/updateCron.html',
			data: {
				uid: cronUid,
				cronid: cronid,
				description: description,
				status: status,
				frequency: frequency,
				cronclass: cronclass,
				lastrundate: lastrundate,
				runcnt: runcnt
			},
			success: function(data) {
				let json = JSON.parse(data);
				
				if(json.result == 'OK') {
					alertPopBack($.i18n.t('compUpdate'), function() {
						location.href = contextPath + '/db/cron/cron.html';
					});
				}else if(json.result == 'EEC') {
					alertPop($.i18n.t('errExist'));
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
}