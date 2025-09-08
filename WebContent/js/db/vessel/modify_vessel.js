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
			namespaces : [ 'share', 'modifyVessel' ],
			defaultNs : 'modifyVessel'
		},
		resStore : RES_LANG
	}, function() {
		$('body').i18n();
	});
}

function init() {
	initDesign();
	
	$('#year').datepicker({
	    format: 'yyyy',
	    maxViewMode: 'years', 
	    minViewMode: 'years',
	    autoclose: true,
	    clearBtn: true
	});
	
	$('.modal-dialog').draggable({handle: '.modal-header'});
}

// 선박정보 수정
function updateVessel() {
	var isEmpty = false;
	var imo = $('#imo').val();
	var ship = $('#ship').val();
	var mmsi = $('#mmsi').val();
	var name = $('#name').val();
	var type = $('#type option:selected').val();
	var reg = $('#reg').val();
	var year = $('#year').val();
	var flag = $('#flag').val();
	var gross = $('#gross').val();
	var dwt = $('#dwt').val();
	var loa = $('#loa').val();
	var draught = $('#draught').val();
	var builder = $('#builder').val();
	var built = $('#built').val();
	
	if(imo == '' || ship == '') {
		isEmpty = true;
	}
	
	if(isEmpty) {
		alertPop($.i18n.t('required'));
	}else {
		jQuery.ajax({
			type: 'POST',
			url: contextPath + '/db/vessel/updateVessel.html',
			data: {
				uid: shipInfoUid,
				imo: imo,
				shipNum: ship,
				mmsi: mmsi,
				title: name,
				shipType: type,
				regOwner: reg,
				builtDate: year,
				flag: flag,
				grossTon: gross,
				dwt: dwt,
				loa: loa,
				draught: draught,
				builder: builder,
				builtBy: built
			},
			success: function(data) {
				var json = JSON.parse(data);
				
				if(json.result == 'OK') {
					alertPopBack($.i18n.t('compUpdate'), function() {
						location.href = contextPath + '/db/vessel/vessel.html';
					});
				}else if(json.result == 'EES') {
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