let _currSearchTrial = 0;

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
            namespaces: ['share', 'planInfo'],
            defaultNs: 'planInfo'
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

// 시운전 실적 팝업.
function showTrialSearchPop(vl) {
	if(_status == 'ONGO' || _status == 'ARRIVE') {
		alertPop($.i18n.t('error.add'));
		return;
	}
	
	_currSearchTrial = vl;
	$('#trialSearchPop').modal();
}

// 시운전 실적 검색.
function searchTrial() {
	let hullNum = $('#trialSearchPopHullNum').val();
	let search = $('#trialSearchPopWord').val();
	
	jQuery.ajax({
		type: 'POST',
		url: contextPath + '/sche/searchTrial.html',
		data: {
			hullNum: hullNum,
			search: search
		},
		success: function(data) {
			try {
				let json = JSON.parse(data);
				$('#trialSearchPopList').empty();
			
				if(json.list.length > 0) {
					for(let i = 0; i < json.list.length; i++) {
						let bean = json.list[i];
						let hull = bean.hullNum;
						let type = bean.shipType;
						let desc = bean.desc;
						let start = bean.start;
						let end = bean.end;
						
						let text = '<tr>' + 
										'<td class="text-center">' + hull + '</td>' + 
										'<td class="text-center">' + type + '</td>' + 
										'<td>' + desc + '</td>' + 
										'<td class="text-center">' + start + '</td>' + 
										'<td class="text-center">' + end + '</td>' + 
										'<td class="text-center"><button type="button" class="bt-obj bt-primary bt-sm" onClick="setTrial(\'' + hull + ' (' + type + ')' + '\', ' + bean.uid + ')"><i class="fa-solid fa-check"></i></button></td>' + 
									'</tr>';
				
						$('#trialSearchPopList').append(text);
					}
				}else{
					$('#trialSearchPopList').append('<tr><td class="text-center" colspan="6">' + $.i18n.t('share:noList') + '</td></tr>');
				}
			}catch(ex) {
				toastPop($.i18n.t('share:tryAgain'));
			}
		},
		error: function(req, status, err) {
			toastPop($.i18n.t('share:tryAgain'));
		},
		beforeSend: function() {
			$('#loading').css('display','block');
		},
		complete: function() {
			$('#loading').css('display','none');
		}
	});
}

// 시운전 실적 추가.
function setTrial(desc, uid) {
	let id = 'trialList1';
	
	if(_currSearchTrial == 2) {
		id = 'trialList2';
		_trialList2 = uid;
	}else {
		_trialList1 = uid;
	}
	
	$('#' + id).text(desc);
	$('#trialSearchPop').modal('hide');
}

// 시운전 실적 삭제.
function delTrialList(vl) {
	if(_status == 'ONGO' || _status == 'ARRIVE') {
		alertPop($.i18n.t('error.del'));
		return;
	}
	
	let id = 'trialList1';
	
	if(vl == 2) {
		id = 'trialList2';
		_trialList2 = 0;
	}else {
		_trialList1 = 0;
	}
	
	$('#' + id).text('');
}

// 저장.
function save() {
	if(_status == 'ONGO' || _status == 'ARRIVE') {
		alertPop($.i18n.t('error.save'));
		return;
	}
	
	let crewRemark = $('#crewRemark').val();
	let itpTotalRemain = $('#itpTotalRemain').val();
	let itpTotalBase = $('#itpTotalBase').val();
	let itpTrialRemain = $('#itpTrialRemain').val();
	let itpTrialBase = $('#itpTrialBase').val();
	let itpOutfittingRemain = $('#itpOutfittingRemain').val();
	let itpOutfittingBase = $('#itpOutfittingBase').val();
	let punchTotal = $('#punchTotal').val();
	let punchTrial = $('#punchTrial').val();
	let punchOutfitting = $('#punchOutfitting').val();
	let fuelHfoScheduler = $('#fuelHfoScheduler').val();
	let fuelMgoScheduler = $('#fuelMgoScheduler').val();
	let fuelMdoScheduler = $('#fuelMdoScheduler').val();
	let fuelLngScheduler = $('#fuelLngScheduler').val();
	let draftFwdScheduler = $('#draftFwdScheduler').val();
	let draftMidScheduler = $('#draftMidScheduler').val();
	let draftAftScheduler = $('#draftAftScheduler').val();
	let remark = $('#remark').val();
	
	jQuery.ajax({
		type: 'POST',
		url: contextPath + '/sche/planInfoSave.html',
		data: {
			schedulerInfoUid: _scheUid,
			crewRemark: crewRemark,
			trial1SchedulerInfoUid: _trialList1,
			trial2SchedulerInfoUid: _trialList2,
			itpTotalRemain: itpTotalRemain,
			itpTotalBase: itpTotalBase,
			itpTrialRemain: itpTrialRemain,
			itpTrialBase: itpTrialBase,
			itpOutfittingRemain: itpOutfittingRemain,
			itpOutfittingBase: itpOutfittingBase,
			punchTotal: punchTotal,
			punchTrial: punchTrial,
			punchOutfitting: punchOutfitting,
			fuelHfoScheduler: fuelHfoScheduler,
			fuelMgoScheduler: fuelMgoScheduler,
			fuelMdoScheduler: fuelMdoScheduler,
			fuelLngScheduler: fuelLngScheduler,
			draftFwdScheduler: draftFwdScheduler,
			draftMidScheduler: draftMidScheduler,
			draftAftScheduler: draftAftScheduler,
			remark: remark
		},
		success: function(data) {
			try {
				let json = JSON.parse(data);
			
				if(json.result) {
					alertPop($.i18n.t('compSave'));
				}else{
					let code = json.code;
					
					if(code == 'ONGO' || code == 'ARRIVE') {
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