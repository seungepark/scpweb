var schedulerList = [];
let schePageNo = '';
var listArr = [];
var listSort = "shiptype";
var listOrder = "desc";
let _isSetSort = false;
let _isSetPage = false;

$(function() {
	initI18n();
	setSearchOption();
	getScheduleCodeInfoList(1);
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
			namespaces : [ 'share', 'mngScheCode' ],
			defaultNs : 'mngScheCode'
		},
		resStore : RES_LANG
	}, function() {
		$('body').i18n();
	});
}

function init() {
	initDesign();
	
	$('#listAllChk').click(function(){
		if($('#listAllChk').is(':checked')) {
			$('input[name=listChk]').prop('checked', true);
		}else {
			$('input[name=listChk]').prop('checked', false);
		}
		
		setRowSelected();
	});
	
	$('#shipType').keypress(function(e) {
		if(e.keyCode === 13) {
			getScheduleCodeInfoList(1);
		}
	});
	$('#desc').keypress(function(e) {
		if(e.keyCode === 13) {
			getScheduleCodeInfoList(1);
		}
	});
	
	$('.modal-dialog').draggable({handle: '.modal-header'});
}

function setSearchOption() {
	let page = getSearchCookie('SK_PAGE');
	
	let sortNm = getSearchCookie('SK_SORTNM');
  	let sortOd = getSearchCookie('SK_SORTOD');
	
  	let shipType = getSearchCookie('SK_TYPE');
  	let desc = getSearchCookie('SK_DESC');
  	let schedtype = getSearchCookie('SK_CAT');
  	let status = getSearchCookie('SK_STTS');
  	
  	if(shipType != '') {
		$('#shipType').val(shipType).prop('selected', true);
	}
  	if(schedtype != '') {
		$('#schedtype').val(schedtype).prop('selected', true);
	}
  	if(status != '') {
		$('#status').val(status).prop('selected', true);
	}
  	
	$('#desc').val(desc);
	
	if(page != '') {
		_isSetPage = true;
		schePageNo = page;
	}
	
	if(sortNm != '' && sortOd != '') {
		_isSetSort = true;
		initTbAlign(sortNm, sortOd);
	}
}

function saveSearchOption() {
	setSearchCookie('SK_PAGE', schePageNo);
	
	setSearchCookie('SK_SORTNM', listSort);
  	setSearchCookie('SK_SORTOD', listOrder);

  	setSearchCookie('SK_TYPE', $('#shipType option:selected').val());
  	setSearchCookie('SK_DESC', $('#desc').val());
  	setSearchCookie('SK_CAT', $('#schedtype option:selected').val());
  	setSearchCookie('SK_STTS', $('#status option:selected').val());
}

let tbAlignList = [
    {id: 'list0', name: 'shiptype', order: ''},
    {id: 'list1', name: 'desc', order: ''},
    {id: 'list2', name: 'schedtype', order: ''},
    {id: 'list3', name: 'status', order: ''},
    {id: 'list4', name: 'revnum', order: ''}
];

function initTbAlign(name, order) {
	listOrder = order;
	
    for(let i = 0; i < tbAlignList.length; i++) {
		let obj = document.getElementById(tbAlignList[i].id);
        obj.classList.remove('up', 'down');

		if(tbAlignList[i].name == name) {
			listSort = name;
			tbAlignList[i].order = order;
			
			if(order == 'asc') {
		        obj.classList.add('up');
		    }else if(order == 'desc') {
				obj.classList.add('down');
		    }
		}else {
			tbAlignList[i].order = '';
		}
    }
}

function tbAlign(obj, idx) {
    let order = tbAlignList[idx].order;
    let newName = tbAlignList[idx].name;
    let newOrder = '';

    for(let i = 0; i < tbAlignList.length; i++) {
		tbAlignList[i].order = '';
        document.getElementById(tbAlignList[i].id).classList.remove('up', 'down');
    }

    if(order == 'asc') {
        newOrder = 'desc';
        tbAlignList[idx].order = newOrder;
        obj.classList.add('down');
    }else if(order == 'desc') {
        newOrder = '';
        tbAlignList[idx].order = newOrder;
    }else {
        newOrder = 'asc';
        tbAlignList[idx].order = newOrder;
        obj.classList.add('up');
    }

    listSort = newName;
    listOrder = newOrder;

    if(_isSetSort) {
		_isSetSort = false;
	}else {
		getScheduleCodeInfoList(1);
	}
}

function getScheduleCodeInfoList(page) {
	var shipType = $('#shipType option:selected').val();
	var desc = $('#desc').val();
	var schedtype = $('#schedtype option:selected').val();
	var status = $('#status option:selected').val();
	
	if(_isSetPage) {
		_isSetPage = false;
		page = schePageNo;
	}else if(page == ""){
		page = 1;
		schePageNo = 1;
  	}else{
  		schePageNo = page; //현재 페이지 저장
  	}
	
	saveSearchOption();
	
	jQuery.ajax({
		type: 'GET',
		url: contextPath + '/mng/scheBasic/getScheduleCodeInfoList.html',
		data: {
			page: page,
			shiptype: shipType,
			description: desc,
			schedtype: schedtype,
			status: status,
			sort: listSort,
			order: listOrder
		},
		success: function(data) {
			var json = JSON.parse(data);
			var text = '';
			
			listArr = json.list;
			
			for(var i = 0; i < json.list.length; i++) {
				text += '<tr class="cursor-pointer">';
				text += '	<td class="text-center"><input type="checkbox" data-uid=' + json.list[i].uid + ' name="listChk" onclick="setRowSelected()"></td>';
				text += '	<td class="" onClick="goScheduleCodeDetail(' + json.list[i].uid + ')">' + json.list[i].shiptype  + '</td>';
				text += '	<td class="" onClick="goScheduleCodeDetail(' + json.list[i].uid + ')">' + json.list[i].description + '</td>';
				text += '	<td class="" onClick="goScheduleCodeDetail(' + json.list[i].uid + ')">' + json.list[i].schedtype + '</td>';
				text += '	<td class="text-center" onClick="goScheduleCodeDetail(' + json.list[i].uid + ')">' + json.list[i].status + '</td>';
				text += '	<td class="text-center" onClick="goScheduleCodeDetail(' + json.list[i].uid + ')">' + json.list[i].revnum + '</td>';
				
				text += '</tr>';
			}
			
			$('#scheduleCodelist').empty();
			
			if(json.list.length > 0) {
				$('#scheduleCodelist').append(text);
			}else {
				$('#scheduleCodelist').append('<tr><td class="text-center" colspan="6">' + $.i18n.t('share:noList') + '</td></tr>');
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
	var perPage = 10;
    var total = Math.ceil(parseInt(cnt) / perPage);
    var start = Math.floor((page - 1) / perPage) * perPage + 1;
    var end = start + perPage - 1;
    
    if(total <= end) {
    	end = total;
    }
    
	var paging_init_num = parseInt(start);
	var paging_end_num = parseInt(end);
	var total_paging_cnt = parseInt(total);
	var pre_no = parseInt(page) - 1;
	var next_no = parseInt(page) + 1;
	var text = '';
	
	if(total_paging_cnt != 0 && total_paging_cnt != 1 && pre_no != 0) {
		text += '<div onclick="getScheduleCodeInfoList(' + pre_no + ');" class="pg-prev">&nbsp;</div>';
	}else {
		text += '<div class="pg-prev-inact">&nbsp;</div>';
	}
	  
	for(var k = paging_init_num; k <= paging_end_num; k++) {
	    if(parseInt(page) == k) {
			text += '<div onclick="getScheduleCodeInfoList(' + k + ');" class="pg-num active">' + k + '</div>';
	    }else {
			text += '<div onclick="getScheduleCodeInfoList(' + k + ');" class="pg-num">' + k + '</div>';
	    }
	}
	
	if(total_paging_cnt != 0 && total_paging_cnt != 1 && next_no <= total_paging_cnt) {
		text += '<div onclick="getScheduleCodeInfoList(' + next_no + ');" class="pg-next">&nbsp;</div>';
	}else {
		text += '<div class="pg-next-inact">&nbsp;</div>';
	}
	
	if(total_paging_cnt == 0) {
		text = '';
	}
	
	$('#pagination').empty();
	$('#pagination').append(text);
}

function goScheduleCodeDetail(uid) {
	location.href = contextPath + '/mng/scheBasic/detailScheduleCode.html?uid=' + uid;
}

//상태 변경 modal 팝업
function popChangeStatusModal() {
	if($('input[name=listChk]:checked').length > 0) {
		$('#change_status_modal').modal();
		$("#changeStatusSel option:eq(0)").prop("selected", true);
	}else {
		alertPop($.i18n.t('changePop.selectMsg'));
	}
}

//상태 변경
function changeStatus() {
	var chk = $('input[name=listChk]');
	var chkUid = [];
	
	for(var i = 0; i < chk.length; i++) {
		if($('input[name=listChk]:eq(' + i + ')').is(':checked')) {
			chkUid.push(listArr[i].uid);
		}
	}
	
	jQuery.ajax({
		type: 'POST',
		url: contextPath + '/mng/scheBasic/changeStatusScheduleCode.html',
		traditional: true,
		data: {
			status: $('#changeStatusSel option:selected').val(),
			uidArr: chkUid
		},
		success: function(data) {
			var json = JSON.parse(data);
			
			if(json.result) {
				$('#change_status_modal').modal('hide');
				alertPop($.i18n.t('changePop.compChange'));
				getScheduleCodeInfoList('');
				$('#listAllChk').prop('checked', false);
			}else{
				toastPop($.i18n.t('share:tryAgain'));
			}
		},
		error: function(req, status, err) {
			toastPop($.i18n.t('share:tryAgain'));
		},
		beforeSend: function() {
			$('#loading').css("display","block");
		},
		complete: function() {
			$('#loading').css('display',"none");
		}
	});
}

// 삭제 팝업 호출
function popDeleteScheModal(){
	if($('input[name=listChk]:checked').length > 0) {
		let isActiveSchedule = false;
		// Active 상태의 데이터 체크 
		const chk = $('input[name=listChk]');
		for(var i = 0; i < chk.length; i++) {
			if($('input[name=listChk]:eq(' + i + ')').is(':checked')) {
				if(listArr[i].status == 'ACT'){
					isActiveSchedule = true;
				}
			}
		}
		
		if(isActiveSchedule){
			alertPop($.i18n.t('delPop.checkStatus'));
		} else{
			$('#del_modal').modal();
		}
	}else {
		alertPop($.i18n.t('delPop.selectMsg'));
	}
}

// Schedule 삭제
function deleteSchedule(){
	var chk = $('input[name=listChk]');
	var chkUid = [];
	
	for(var i = 0; i < chk.length; i++) {
		if($('input[name=listChk]:eq(' + i + ')').is(':checked')) {
			chkUid.push(listArr[i].uid);
		}
	}
	
	jQuery.ajax({
		type: 'POST',
		url: contextPath + '/mng/scheBasic/deleteScheduleCode.html',
		traditional: true,
		data: {
			uidArr: chkUid
		},
		success: function(data) {
			var json = JSON.parse(data);
			
			if(json.result) {
				$('#del_modal').modal('hide');
				alertPop($.i18n.t('delPop.compDel'));
				getScheduleCodeInfoList('');
				$('#listAllChk').prop('checked', false);
			}else{
				toastPop($.i18n.t('share:tryAgain'));
			}
		},
		error: function(req, status, err) {
			toastPop($.i18n.t('share:tryAgain'));
		},
		beforeSend: function() {
			$('#loading').css("display","block");
		},
		complete: function() {
			$('#loading').css('display',"none");
		}
	});
	
}

