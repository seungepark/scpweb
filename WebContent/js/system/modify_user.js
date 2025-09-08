$(function() {
	initI18n();
	init();
	
	$('.modal-dialog').draggable({handle: '.modal-header'});
	
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
			namespaces : [ 'share', 'modifyUser' ],
			defaultNs : 'modifyUser'
		},
		resStore : RES_LANG
	}, function() {
		$('body').i18n();
	});
}

function init() {
	initDesign();
}

//사용자 수정
function updateUser() {
	var isEmpty = false;
	var userId = $('#userId').val();
	var firstName = $('#firstName').val();
	var lastName = $('#lastName').val();
	var posCode = $('#posCode option:selected').val();
	var status = $('#status option:selected').val();
	
	if(orgPosCode == 'CAPTAIN') {
		posCode = 'CAPTAIN';
		status = 'ACT';
	}
	
	if(userId == '' || firstName == '' || lastName == '') {
		isEmpty = true;
	}
	
	if(isEmpty) {
		alertPop($.i18n.t('required'));
	}else {
		jQuery.ajax({
			type: 'POST',
			url: contextPath + '/system/user/updateUser.html',
			data: {
				uid: userUid,
				firstName: firstName,
				lastName: lastName,
				posCode: posCode,
				status: status
			},
			success: function(data) {
				var json = JSON.parse(data);
				
				if(json.result) {
					alertPopBack($.i18n.t('compUpdate'), function() {
						location.href = contextPath + '/system/user.html';
					});
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