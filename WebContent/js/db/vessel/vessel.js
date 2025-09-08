var delVesselUid = 0;
let vesselPageNo = 1;
let _isSetPage = false;
let _itemList = [];
let _currItemIdx = 0;

$(function() {
	initI18n();
	setSearchOption();
	getVesselList(1);
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
			namespaces : [ 'share', 'vessel' ],
			defaultNs : 'vessel'
		},
		resStore : RES_LANG
	}, function() {
		$('body').i18n();
	});
}

function init() {
	initDesign();
	
	$('#shipName').keypress(function(e) {
		if(e.keyCode === 13) {
			getVesselList(1);
		}
	});
	
	$('#shipNo').keypress(function(e) {
		if(e.keyCode === 13) {
			getVesselList(1);
		}
	});
	
	$('.modal-dialog').draggable({handle: '.modal-header'});
}

function setSearchOption() {
	let page = getSearchCookie('SK_PAGE');
	
  	let title = getSearchCookie('SK_DESC');
  	let ship = getSearchCookie('SK_SHIP');
	
	$('#shipName').val(title);
	$('#shipNo').val(ship);
	
	if(page != '') {
		_isSetPage = true;
		vesselPageNo = page;
	}
}

function saveSearchOption() {
	setSearchCookie('SK_PAGE', vesselPageNo);
	
  	setSearchCookie('SK_DESC', $('#shipName').val());
  	setSearchCookie('SK_SHIP', $('#shipNo').val());
}

function getVesselList(page) {
	let title = $('#shipName').val();
	let ship = $('#shipNo').val();
	
	if(_isSetPage) {
		_isSetPage = false;
		page = vesselPageNo;
	}else if(page == ""){
		page = 1;
		vesselPageNo = 1;
  	}else{
  		vesselPageNo = page; //현재 페이지 저장
  	}
	
	saveSearchOption();
	
	jQuery.ajax({
		type: 'GET',
		url: contextPath + '/db/vessel/getVesselPageList.html',
		data: {
			page: page,
			title: title,
			shipNum: ship
		},
		success: function(data) {
			let json = JSON.parse(data);
			let text = '';
			_itemList = json.list;
			
			for(let i = 0; i < json.list.length; i++) {
				let item = json.list[i];
				let uid = item.uid;
				let isSg = item.isSg == 'Y' ? ' checked' : '';
				let isLoad = item.isLoad == 'Y' ? ' checked' : '';
				let isUnload = item.isUnload == 'Y' ? ' checked' : '';
				let isCold = item.isCold == 'Y' ? ' checked' : '';
				let isTrial = item.isTrial == 'Y' ? ' checked' : '';
				
				text += '<tr class="cursor-pointer" onclick="showDetail(' + i + ')">' + 
							'<td class="text-center">' + item.shipNum + '</td>' + 
							'<td class="text-center">' + item.regOwner + '</td>' + 
							'<td class="text-center">' + item.shipClass + '</td>' + 
							'<td class="text-center">' + item.shipType + '</td>' + 
							'<td class="text-center">' + item.typeModel + '</td>' + 
							'<td class="text-center">#' + item.projSeq + '</td>' + 
							'<td class="text-center">' + item.dock + '</td>' + 
							'<td class="text-center">' + item.loc + '</td>' + 
							'<td class="text-center"><input type="checkbox"' + isSg + ' onclick="return false;"></td>' + 
							'<td class="text-center"><input type="checkbox"' + isLoad + ' onclick="return false;"></td>' + 
							'<td class="text-center"><input type="checkbox"' + isUnload + ' onclick="return false;"></td>' + 
							'<td class="text-center"><input type="checkbox"' + isCold + ' onclick="return false;"></td>' + 
							'<td class="text-center"><input type="checkbox"' + isTrial + ' onclick="return false;"></td>' + 
							'<td class="text-center">' + item.fuel + '</td>' + 
							'<td class="text-center">' + item.lc + '</td>' + 
							'<td class="text-center">' + item.workFinish + '</td>' + 
							'<td class="text-center">' + (isEmpty(item.crew1Pro) ? '-' : item.crew1Pro) + '/' + (isEmpty(item.crew1Lead) ? '-' : item.crew1Lead) + '</td>' + 
							'<td class="text-center">' + (isEmpty(item.crew2Pro) ? '-' : item.crew2Pro) + '/' + (isEmpty(item.crew2Lead) ? '-' : item.crew2Lead) + '</td>' + 
							'<td class="text-center">' + (isEmpty(item.crew3Pro) ? '-' : item.crew3Pro) + '/' + (isEmpty(item.crew3Lead) ? '-' : item.crew3Lead) + '</td>' + 
							'<td class="text-center">' + (isEmpty(item.comMain) ? '-' : item.comMain) + '/' + (isEmpty(item.comSub) ? '-' : item.comSub) + '</td>' + 
							'<td class="text-center">' + item.operate + '</td>' + 
						'</tr>';
			}
			
			$('#list').empty();
			
			if(json.list.length > 0) {
				$('#list').append(text);
			}else {
				$('#list').append('<tr><td class="text-center" colspan="21">' + $.i18n.t('share:noList') + '</td></tr>');
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
    
	let paging_init_num = parseInt(start);
	let paging_end_num = parseInt(end);
	let total_paging_cnt = parseInt(total);
	let pre_no = parseInt(page) - 1;
	let next_no = parseInt(page) + 1;
	let text = '';
	
	if(total_paging_cnt != 0 && total_paging_cnt != 1 && pre_no != 0) {
		text += '<div onclick="getVesselList(' + pre_no + ');" class="pg-prev">&nbsp;</div>';
	}else {
		text += '<div class="pg-prev-inact">&nbsp;</div>';
	}
	  
	for(let k = paging_init_num; k <= paging_end_num; k++) {
	    if(parseInt(page) == k) {
			text += '<div onclick="getVesselList(' + k + ');" class="pg-num active">' + k + '</div>';
	    }else {
	    	text += '<div onclick="getVesselList(' + k + ');" class="pg-num">' + k + '</div>';
	    }
	}
	
	if(total_paging_cnt != 0 && total_paging_cnt != 1 && next_no <= total_paging_cnt) {
		text += '<div onclick="getVesselList(' + next_no + ');" class="pg-next">&nbsp;</div>';
	}else {
		text += '<div class="pg-next-inact">&nbsp;</div>';
	}
	
	if(total_paging_cnt == 0) {
		text = '';
	}
	
	$('#pagination').empty();
	$('#pagination').append(text);
}

function showDetail(idx) {
	_currItemIdx = idx;
	let item = _itemList[idx];
	
	$('#detailModalDesc').text(item.shipNum + ' ' + item.regOwner + ' ' + item.typeModel + ' ' + item.shipType + ' #' + item.projSeq);
	$('#detailModalCrew1Pro').val(item.crew1Pro);
	$('#detailModalCrew1Lead').val(item.crew1Lead);
	$('#detailModalCrew2Pro').val(item.crew2Pro);
	$('#detailModalCrew2Lead').val(item.crew2Lead);
	$('#detailModalCrew3Pro').val(item.crew3Pro);
	$('#detailModalCrew3Lead').val(item.crew3Lead);
	$('#detailModalComMain').val(item.comMain);
	$('#detailModalComSub').val(item.comSub);
	$('#detailModalOp').val(item.operate);
	$('select[id=detailModalIsFuel]').val(item.fuel).prop('selected', true);
	
	if(item.isTrial == 'Y') {
		$('input[id=detailModalIsTrial]').prop('checked', true);
	}else {
		$('input[id=detailModalIsTrial]').prop('checked', false);
	}
	
	if(item.isLoad == 'Y') {
		$('input[id=detailModalIsLoad]').prop('checked', true);
	}else {
		$('input[id=detailModalIsLoad]').prop('checked', false);
	}
	
	if(item.isUnload == 'Y') {
		$('input[id=detailModalIsUnload]').prop('checked', true);
	}else {
		$('input[id=detailModalIsUnload]').prop('checked', false);
	}
	
	if(item.isCold == 'Y') {
		$('input[id=detailModalIsCold]').prop('checked', true);
	}else {
		$('input[id=detailModalIsCold]').prop('checked', false);
	}
	
	$('#detailModal').modal();
}

function updateVessel() {
	let item = _itemList[_currItemIdx];
	
	jQuery.ajax({
		type: 'GET',
		url: contextPath + '/db/vessel/updateVesselDetail.html',
		data: {
			uid: item.uid,
			crew1Pro: $('#detailModalCrew1Pro').val(),
			crew1Lead: $('#detailModalCrew1Lead').val(),
			crew2Pro: $('#detailModalCrew2Pro').val(),
			crew2Lead: $('#detailModalCrew2Lead').val(),
			crew3Pro: $('#detailModalCrew3Pro').val(),
			crew3Lead: $('#detailModalCrew3Lead').val(),
			comMain: $('#detailModalComMain').val(),
			comSub: $('#detailModalComSub').val(),
			operate: $('#detailModalOp').val(),
			fuel: $('#detailModalIsFuel').val(),
			isTrial: $('#detailModalIsTrial').is(':checked') ? 'Y' : 'N',
			isLoad: $('#detailModalIsLoad').is(':checked') ? 'Y' : 'N',
			isUnload: $('#detailModalIsUnload').is(':checked') ? 'Y' : 'N',
			isCold: $('#detailModalIsCold').is(':checked') ? 'Y' : 'N'
		},
		success: function(data) {
			let json = JSON.parse(data);
			
			if(json.result) {
				toastPop($.i18n.t('modal.compSave'));
			}else {
				toastPop($.i18n.t('share:tryAgain'));
			}
			
			getVesselList(vesselPageNo);
			$('#detailModal').modal('hide');
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