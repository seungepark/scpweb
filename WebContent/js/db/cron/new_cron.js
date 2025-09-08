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
			namespaces : [ 'share', 'newCron' ],
			defaultNs : 'newCron'
		},
		resStore : RES_LANG
	}, function() {
		$('body').i18n();
	});
}

function init() {
	initDesign();
	$('.modal-dialog').draggable({handle: '.modal-header'});
}

//Cron 생성
function insertCron() {
	let isEmpty = false;
	let isFreqError = false;
	
	let cronid = $('#cronid').val();
	let desc = $('#desc').val();
	let status = $('#status option:selected').val();
	let frequency = $('#frequency').val();
	let cronclass = $('#cronclass').val();
	
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
			url: contextPath + '/db/cron/insertCron.html',
			data: {
				cronid: cronid,
				description: desc,
				status: status,
				frequency: frequency,
				cronclass: cronclass,
				isExist: 'Y'
			},
			success: function(data) {
				var json = JSON.parse(data);
				
				if(json.result == 'OK') {
					$('#cronid').val('');
					$('#desc').val('');
					$('#frequency').val('');
					$('#cronclass').val('');
					$("#status option:eq(1)").prop("selected", true);
					
					alertPop($.i18n.t('compNew'));
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