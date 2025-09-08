let _list = [];
let _pageNo = 1;
let _isSetPage = false;

$(function(){
	initI18n();
	setSearchOption();
	getList(_pageNo);
	init();
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
	      	namespaces: ['share', 'scenarioList'],
	      	defaultNs: 'scenarioList'
	    },
	    resStore: RES_LANG
	}, function () {
		$('body').i18n();
	});
}

function init() {
	initDesign();
	
	$('#listAllChk').click(function() {
		if($('#listAllChk').is(':checked')) {
			$('input[name=listChk]').prop('checked', true);
		}else {
			$('input[name=listChk]').prop('checked', false);
		}
		
		setRowSelected();
	});
	
	$('#title').keypress(function(e) {
		if(e.keyCode === 13) {
			getList(1);
		}
	});
	
	$('#desc').keypress(function(e) {
		if(e.keyCode === 13) {
			getList(1);
		}
	});
}

function setSearchOption() {
	let page = getSearchCookie('SK_PAGE');
	let title = getSearchCookie('SK_TITLE');
  	let desc = getSearchCookie('SK_DESC');
  	let shipType = getSearchCookie('SK_TYPE');

	$('#title').val(title);
	$('#desc').val(desc);
	
	if(shipType != '') {
  		$('#shipType').val(shipType).prop('selected', true);
  	}
	
	if(page != '') {
		_isSetPage = true;
		_pageNo = page;
	}
}

function saveSearchOption() {
	setSearchCookie('SK_PAGE', _pageNo);
	setSearchCookie('SK_TITLE', $('#title').val());
  	setSearchCookie('SK_DESC', $('#desc').val());
  	setSearchCookie('SK_TYPE', $('#shipType option:selected').val());
}

// 시나리오 목록.
function getList(page){
	let title = $('#title').val();
	let desc = $('#desc').val();
	let shipType = $('#shipType option:selected').val();
	
	if(_isSetPage) {
		_isSetPage = false;
		page = _pageNo;
	}else{
  		_pageNo = page;
  	}
	
	saveSearchOption();
	
	jQuery.ajax({
		type: 'GET',
		url: contextPath + '/sched/scenario/getScenarioList.html',
		data: {
			page: page,
			title: title,
			description: desc,
			shipType: shipType
		},
		success: function(data) {
			let json = JSON.parse(data);
			let html = '';
			_list = json.list;

			for(let i = 0; i < json.list.length; i++) {
				let uid = json.list[i].uid;
				let workTime = '';
				
				if(!isNanEmpty(json.list[i].workTime)) {
					let workTimeHour = 0;
					let workTimeMin = parseInt(json.list[i].workTime);
					
					if(workTimeMin >= 60) {
						workTimeHour = Math.floor(workTimeMin / 60);
						workTimeMin = workTimeMin % 60;
					}
					
					workTime = workTimeHour + ':' + (workTimeMin > 9 ? '' : '0') + workTimeMin;
				}
				
				html += '<tr class="cursor-pointer">' + 
							'<td class=""><input type="checkbox" name="listChk" onclick="setRowSelected()"></td>' + 
							'<td class="" onClick="goScenarioDetail(' + uid + ')">' + json.list[i].title + '</td>' +
							'<td class="" onClick="goScenarioDetail(' + uid + ')">' + json.list[i].desc + '</td>' +
							'<td class="text-center" onClick="goScenarioDetail(' + uid + ')">' + json.list[i].shipTypeDesc + '</td>' +
							'<td class="text-center" onClick="goScenarioDetail(' + uid + ')">' + json.list[i].status + '</td>' +
							'<td class="text-center" onClick="goScenarioDetail(' + uid + ')">' + json.list[i].projEvent + '</td>' +
							'<td class="text-right" onClick="goScenarioDetail(' + uid + ')">' + workTime + '</td>' +
							'<td class="text-right" onClick="goScenarioDetail(' + uid + ')">' + numberFormat(json.list[i].lngTotal, true, true, true) + '</td>' +
							'<td class="text-right" onClick="goScenarioDetail(' + uid + ')">' + numberFormat(json.list[i].ln2Total, true, true, true) + '</td>' +
							'<td class="text-right" onClick="goScenarioDetail(' + uid + ')">' + numberFormat(json.list[i].margin, true, false, true) + '</td>' +
							'<td class="text-center" onClick="goScenarioDetail(' + uid + ')">' + json.list[i].marginCur + '</td>' +
						 '</tr>';
			}
			
			$('#list').empty();
			
			if(json.list.length > 0) {
				$('#list').append(html);
			}else {
				$('#list').append('<tr><td class="text-center" colspan="11">' + $.i18n.t('share:noList') + '</td></tr>');
			}
			
		    paging(json.listCnt, page);
		},
		error: function(req, status, err) {
			alertPop($.i18n.t('share:tryAgain'));
		},
		beforeSend: function() {
			$('#loading').css('display', 'block');
		},
		complete: function() {
			$('#loading').css('display', 'none');
		}
	});
}

function paging(cnt, page){
	let perPage = 10;
    let total = Math.ceil(parseInt(cnt) / perPage);
    let start = Math.floor((page - 1) / perPage) * perPage + 1;
    let end = start + perPage - 1;
    
    if(total <= end) {
    	end = total;
    }
    
	let pagingInitNum = parseInt(start);
	let pagingEndNum = parseInt(end);
	let totalPagingCnt = parseInt(total);
	let preNo = parseInt(page) - 1;
	let nextNo = parseInt(page) + 1;
	let html = '';
	
	if(totalPagingCnt != 0 && totalPagingCnt != 1 && preNo != 0) {
		html += '<div onclick="getList(' + preNo + ');" class="pg-prev">&nbsp;</div>';
	}else {
		html += '<div class="pg-prev-inact">&nbsp;</div>';
	}
	  
	for(let k = pagingInitNum; k <= pagingEndNum; k++) {
	    if(parseInt(page) == k) {
			html += '<div onclick="getList(' + k + ');" class="pg-num active">' + k + '</div>';
	    }else {
	    	html += '<div onclick="getList(' + k + ');" class="pg-num">' + k + '</div>';
	    }
	}
	
	if(totalPagingCnt != 0 && totalPagingCnt != 1 && nextNo <= totalPagingCnt) {
		html += '<div onclick="getList(' + nextNo + ');" class="pg-next">&nbsp;</div>';
	}else {
		html += '<div class="pg-next-inact">&nbsp;</div>';
	}
	
	if(totalPagingCnt == 0) {
		html = '';
	}
	
	$('#pagination').empty();
	$('#pagination').append(html);
}

function goScenarioDetail(uid) {
	location.href = contextPath + '/sched/scenario/detailScenario.html?uid=' + uid;
}

// 상태 변경 팝업
function showChangePop() {
	if($('input[name=listChk]:checked').length > 0) {
		$('#changePop').modal();
	}else {
		alertPop($.i18n.t('changePop.selectMsg'));
	}
}

// 상태 변경
function changeStatus() {
	let chk = $('input[name=listChk]');
	let chkUid = [];
	
	for(let i = 0; i < chk.length; i++) {
		if($('input[name=listChk]:eq(' + i + ')').is(':checked')) {
			chkUid.push(_list[i].uid);
		}
	}
	
	jQuery.ajax({
		type: 'POST',
		url: contextPath + '/sched/scenario/changeStatusScenario.html',
		traditional: true,
		data: {
			status: $('#changePopStatusSel option:selected').val(),
			uidArr: chkUid
		},
		success: function(data) {
			let json = JSON.parse(data);
			
			if(json.result) {
				$('#changePop').modal('hide');
				alertPop($.i18n.t('changePop.compChange'));
				getList(_pageNo);
				$('#listAllChk').prop('checked', false);
				$('input[name=listChk]').prop('checked', false);
			}else{
				toastPop($.i18n.t('share:tryAgain'));
			}
		},
		error: function(req, status, err) {
			toastPop($.i18n.t('share:tryAgain'));
		},
		beforeSend: function() {
			$('#loading').css('display', 'block');
		},
		complete: function() {
			$('#loading').css('display', 'none');
		}
	});
}

// 삭제 팝업
function showDelPop() {
	if($('input[name=listChk]:checked').length > 0) {
		$('#delPop').modal();
	}else {
		alertPop($.i18n.t('delPop.selectMsg'));
	}
}

// 삭제
function deleteScenario() {
	let chk = $('input[name=listChk]');
	let chkUid = [];
	
	for(let i = 0; i < chk.length; i++) {
		if($('input[name=listChk]:eq(' + i + ')').is(':checked')) {
			chkUid.push(_list[i].uid);
		}
	}
	
	jQuery.ajax({
		type: 'POST',
		url: contextPath + '/sched/scenario/deleteScenario.html',
		traditional: true,
		data: {
			uidArr: chkUid
		},
		success: function(data) {
			let json = JSON.parse(data);
			
			if(json.result) {
				$('#delPop').modal('hide');
				alertPop($.i18n.t('delPop.compDel'));
				getList(1);
				$('#listAllChk').prop('checked', false);
				$('input[name=listChk]').prop('checked', false);
			}else{
				toastPop($.i18n.t('share:tryAgain'));
			}
		},
		error: function(req, status, err) {
			toastPop($.i18n.t('share:tryAgain'));
		},
		beforeSend: function() {
			$('#loading').css('display', 'block');
		},
		complete: function() {
			$('#loading').css('display', 'none');
		}
	});
}
