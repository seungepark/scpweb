$(function(){
    initI18n();
    init();

    initServerCheck();
    autocompleteOff();
});

function initI18n() {
    let lang = initLang();

    $.i18n.init({
        lng: lang,
        fallbackLng: FALLBACK_LNG,
        fallbackOnNull: false,
        fallbackOnEmpty: false,
        useLocalStorage: false,
        ns: {
            namespaces: ['share', 'resultInfo'],
            defaultNs: 'resultInfo'
        },
        resStore: RES_LANG
    }, function() {
        $('body').i18n();
    });
}

function init() {
	initDesign();
	initData();
}

function viewReport() {
	let url = contextPath + '/sche/resultDailyReport.html?uid=' + _scheUid;
	
	if($('input[id=checkComp]').is(':checked')) {
		url = contextPath + '/sche/resultCompReport.html?uid=' + _scheUid;
	}
	
	location.href = url;
}

// 기존 데이터 세팅.
function initData() {
	for(let i = 0; i < _commanderList.length; i++) {
		if(_commanderList[i].mainSub == 'M') {
			$('#commander01').html(_commanderList[i].name + '<br>' + _commanderList[i].phone);
		}else {
			$('#commander02').html(_commanderList[i].name + '<br>' + _commanderList[i].phone);
		}
		
	}
	
	for(let i = 0; i < _mainCrewList.length; i++) {
		let name = _mainCrewList[i].name;
		let phone = _mainCrewList[i].phone;
		let type2 = _mainCrewList[i].workType2;
		
		if(type2 == 'A2') {
			$('#crew01').html(name + '<br>' + phone);
		}else if(type2 == 'A3') {
			$('#crew02').html(name + '<br>' + phone);
		}else if(type2 == 'A4') {
			$('#crew03').html(name + '<br>' + phone);
		}else if(type2 == 'C1') {
			$('#crew04').html(name + '<br>' + phone);
		}else if(type2 == 'D3') {
			$('#crew05').html(name + '<br>' + phone);
		}
		
	}
	
	let owner = 0;
	let cls = 0;
	let captain = 0;
	let mate = 0;
	
	for(let i = 0; i < _crewCntList.length; i++) {
		let cnt = _crewCntList[i].cnt;
		let kind = _crewCntList[i].kind;
		
		if(kind == 'TOTAL') {
			$('#crewCntTotal').html(cnt);
		}else if(kind == 'SHI') {
			$('#crewCnt01').html(cnt);
		}else if(kind == 'OUT') {
			$('#crewCnt02').html(cnt);
		}else if(kind == 'OWNER') {
			owner = cnt;
		}else if(kind == 'CLASS') {
			cls = cnt;
		}else if(kind == 'SE') {
			$('#crewCnt04').html(cnt);
		}else if(kind == 'CAPTAIN') {
			captain = cnt;
		}else if(kind == 'MATE') {
			mate = cnt;
		}else if(kind == 'ENG') {
			$('#crewCnt06').html(cnt);
		}else if(kind == 'ETC') {
			$('#crewCnt07').html(cnt);
		}
	}
	
	$('#crewCnt03').html(owner + ' / ' + cls);
	$('#crewCnt05').html(captain + ' / ' + mate);
	
	for(let i = 0; i < _tcCntList.length; i++) {
		$('#trialCnt' + (i + 1)).html(_tcCntList[i]);
	}
}

// 저장.
function save() {
	if(isEmpty(_status) || _status == 'DEPART') {
		alertPop($.i18n.t('error.depart'));
		return;
	}
	
	if(_status == 'ARRIVE') {
		alertPop($.i18n.t('error.save'));
		return;
	}
	
	let crewRemark = $('#crewRemark').val();
	let fuelHfoTemp = $('#fuelHfoTemp').val();
	let fuelMgoTemp = $('#fuelMgoTemp').val();
	let fuelMdoTemp = $('#fuelMdoTemp').val();
	let fuelLngTemp = $('#fuelLngTemp').val();
	let fuelHfoUp = $('#fuelHfoUp').val();
	let fuelMgoUp = $('#fuelMgoUp').val();
	let fuelMdoUp = $('#fuelMdoUp').val();
	let fuelLngUp = $('#fuelLngUp').val();
	let fuelHfoDown = $('#fuelHfoDown').val();
	let fuelMgoDown = $('#fuelMgoDown').val();
	let fuelMdoDown = $('#fuelMdoDown').val();
	let fuelLngDown = $('#fuelLngDown').val();
	let draftFwdTemp = $('#draftFwdTemp').val();
	let draftMidTemp = $('#draftMidTemp').val();
	let draftAftTemp = $('#draftAftTemp').val();
	let remark = $('#remark').val();
	let contractSpeed = $('#contractSpeed').val();
	let measureSpeed = $('#measureSpeed').val();
	let compRemark = $('#compRemark').val();
	let noiseVibration = $('#noiseVibration').val();
	
	jQuery.ajax({
		type: 'POST',
		url: contextPath + '/sche/resultInfoSave.html',
		data: {
			schedulerInfoUid: _scheUid,
			crewRemark: crewRemark,
			fuelHfoTemp: fuelHfoTemp,
			fuelMgoTemp: fuelMgoTemp,
			fuelMdoTemp: fuelMdoTemp,
			fuelLngTemp: fuelLngTemp,
			fuelHfoUp: fuelHfoUp,
			fuelMgoUp: fuelMgoUp,
			fuelMdoUp: fuelMdoUp,
			fuelLngUp: fuelLngUp,
			fuelHfoDown: fuelHfoDown,
			fuelMgoDown: fuelMgoDown,
			fuelMdoDown: fuelMdoDown,
			fuelLngDown: fuelLngDown,
			draftFwdTemp: draftFwdTemp,
			draftMidTemp: draftMidTemp,
			draftAftTemp: draftAftTemp,
			remark: remark,
			contractSpeed: contractSpeed,
			measureSpeed: measureSpeed,
			compRemark: compRemark,
			noiseVibration: noiseVibration
		},
		success: function(data) {
			try {
				let json = JSON.parse(data);
			
				if(json.result) {
					alertPop($.i18n.t('compSave'));
				}else{
					let code = json.code;
					
					if(isEmpty(code) || code == 'DEPART') {
						_status = code;
						alertPop($.i18n.t('error.depart'));
					}else if(code == 'ARRIVE') {
						_status = code;
						alertPop($.i18n.t('error.save'));
					}else if(code == 'EIO') {
						alertPop($.i18n.t('share:isOffline'));
					}else {
						alertPop($.i18n.t('share:tryAgain'));
					}
				}
			}catch(ex) {
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
