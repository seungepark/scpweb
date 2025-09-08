var schedulerList = [];
let schePageNo = '';
var listArr = [];
var listSort = "";
var listOrder = "desc";
let _isSetSort = false;
let _isSetPage = false;

$(function() {
	initI18n();
	setSearchOption();
	getScheduleList(1);
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
			namespaces : [ 'share', 'mngSche' ],
			defaultNs : 'mngSche'
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
			getScheduleList(1);
		}
	});
	$('#hullnum').keypress(function(e) {
		if(e.keyCode === 13) {
			getScheduleList(1);
		}
	});
	$('#pic').keypress(function(e) {
		if(e.keyCode === 13) {
			getScheduleList(1);
		}
	});
	
	$('.modal-dialog').draggable({handle: '.modal-header'});
}

function setSearchOption() {
	let page = getSearchCookie('SK_PAGE');
	
	let sortNm = getSearchCookie('SK_SORTNM');
  	let sortOd = getSearchCookie('SK_SORTOD');
	
  	let shipType = getSearchCookie('SK_TYPE');
  	let hullnum = getSearchCookie('SK_SHIP');
  	let pic = getSearchCookie('SK_DESC');
  	
  	if(shipType != '') {
  		$('#shipType').val(shipType).prop('selected', true);
  	}
  	
	$('#hullnum').val(hullnum);
	$('#pic').val(pic);
	
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
  	setSearchCookie('SK_SHIP', $('#hullnum').val());
  	setSearchCookie('SK_DESC', $('#pic').val());
}

let tbAlignList = [
    {id: 'list0', name: 'hullnum', order: ''},
    {id: 'list1', name: 'regOwner', order: ''},
    {id: 'list2', name: 'shiptype', order: ''},
    {id: 'list3', name: 'series', order: ''},
    {id: 'list4', name: 'schedType', order: ''},
    {id: 'list5', name: 'sdate', order: ''},
    {id: 'list6', name: 'edate', order: ''},
    {id: 'list7', name: 'trialStatus', order: ''},
    {id: 'list8', name: 'insertName', order: ''},
    {id: 'list9', name: 'insertdate', order: ''}
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
		getScheduleList(1);
	}
}

function getScheduleList(page) {
	var shipType = $('#shipType option:selected').val();
	var hullnum = $('#hullnum').val();
	var pic = $('#pic').val();
	
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
		url: contextPath + '/mng/sche/getScheduleList.html',
		data: {
			page: page,
			shiptype: shipType,
			hullnum: hullnum,
			ownerName: pic,
			sort: listSort,
			order: listOrder
		},
		success: function(data) {
			var json = JSON.parse(data);
			var text = '';
			
			listArr = json.list;
			
			for(var i = 0; i < json.list.length; i++) {
				let trialStatus = json.list[i].trialStatus;
				let schedtype = json.list[i].schedtype;
				let insertDate = json.list[i].insertdate;
				let insertDateDate = insertDate;
				let insertDateTime = insertDate;
				let trialKey = json.list[i].trialKey;
				let isOff = json.list[i].isOff;
				let checkBoxDisabled = '';
				
				if(!isEmpty(insertDate)) {
					let tempArr = insertDate.split(' ');
					
					if(tempArr.length == 2) {
						insertDateDate = tempArr[0];
						insertDateTime = tempArr[1];
					}
				}
				
				if(!isEmpty(trialKey)) {
					let tempArr = trialKey.split('_');
					
					if(tempArr.length == 2) {
						trialKey = tempArr[1];
					}
				}
				
				if(isOff == 'Y') {
					checkBoxDisabled = ' disabled';
				}
				
				text += '<tr class="cursor-pointer">';
				text += '	<td class=""><input type="checkbox" data-uid=' + json.list[i].uid + ' name="listChk" onclick="setRowSelected()"' + checkBoxDisabled + '></td>';
				text += '	<td class="" onClick="goSchedulerDetail(' + json.list[i].uid + ')">' + json.list[i].hullnum + '</td>';
				text += '	<td class="" onClick="goSchedulerDetail(' + json.list[i].uid + ')">' + trialKey + '</td>';
				text += '	<td class="" onClick="goSchedulerDetail(' + json.list[i].uid + ')">' + json.list[i].regOwner + '</td>';
				text += '	<td class="" onClick="goSchedulerDetail(' + json.list[i].uid + ')">' + json.list[i].shiptype  + '</td>';
				text += '	<td class="text-center" onClick="goSchedulerDetail(' + json.list[i].uid + ')">#' + json.list[i].projSeq + '</td>';
				
				text += '	<td class="" onClick="goSchedulerDetail(' + json.list[i].uid + ')">';
				
				if(schedtype == 'SEA') {
					text += $.i18n.t('list.schedTypeSea');
				}else if(schedtype == 'GAS') {
					text += $.i18n.t('list.schedTypeGas');
				}else if(schedtype == 'TOTAL') {
					text += $.i18n.t('list.schedTypeTotal');
				}else {
					text += schedtype;
				}
				
				text += '   </td>';
				
				text += '	<td class="text-center" onClick="goSchedulerDetail(' + json.list[i].uid + ')">' + json.list[i].sdate + '</td>';
				text += '	<td class="text-center" onClick="goSchedulerDetail(' + json.list[i].uid + ')">' + json.list[i].edate + '</td>';
				
				text += '	<td class="" onClick="goSchedulerDetail(' + json.list[i].uid + ')"><div class="d-flex align-items-center">';
				
				if(json.list[i].status == 'INACT') {
					text += '<div class="rounded py-1 px-2 trial-status-box-inact"><i class="fa-solid fa-circle trial-status-prefix-inact"></i>INACTIVE</div>';
				}else if(trialStatus == 'ONGO') {
					text += '<div class="rounded py-1 px-2 trial-status-box-ongo"><i class="fa-solid fa-circle trial-status-prefix-ongo"></i>' + $.i18n.t('list.trialStatusOngo') + '</div>';
				}else if(trialStatus == 'ARRIVE') {
					text += '<div class="rounded py-1 px-2 trial-status-box-arrive"><i class="fa-solid fa-circle trial-status-prefix-arrive"></i>' + $.i18n.t('list.trialStatusArrive') + '</div>';
				}else {
					text += '<div class="rounded py-1 px-2 trial-status-box-default"><i class="fa-solid fa-circle trial-status-prefix-default"></i>' + $.i18n.t('list.trialStatusDepart') + '</div>';
				}
				
				text += '   </div></td>';
				
				text += '	<td class="text-center" onClick="goSchedulerDetail(' + json.list[i].uid + ')">' + json.list[i].insertName + '</td>';
				text += '	<td class="text-center" onClick="goSchedulerDetail(' + json.list[i].uid + ')"><div data-toggle="tooltip" data-placement="top" title="' + insertDateTime + '">' + insertDateDate + '</div></td>';
				
				text += '	<td class=""><div class="d-flex align-items-center">';
				
				if(isOff == 'Y') {
					text += '<i class="fa-solid fa-circle trial-status-prefix-off"></i>' + $.i18n.t('list.trialStatusOffline');
				}else {
					text += '<i class="fa-solid fa-circle trial-status-prefix-on"></i>' + $.i18n.t('list.trialStatusOnline');
				}
				
				text += '   </div></td>';
				
				text += '</tr>';
			}
			
			$('#schedulelist').empty();
			
			if(json.list.length > 0) {
				$('#schedulelist').append(text);
			}else {
				$('#schedulelist').append('<tr><td class="text-center" colspan="13">' + $.i18n.t('share:noList') + '</td></tr>');
			}
			
		    paging(json.listCnt, page);

			$('[data-toggle="tooltip"]').tooltip();
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
		text += '<div onclick="getScheduleList(' + pre_no + ');" class="pg-prev">&nbsp;</div>';
	}else {
		text += '<div class="pg-prev-inact">&nbsp;</div>';
	}
	  
	for(var k = paging_init_num; k <= paging_end_num; k++) {
	    if(parseInt(page) == k) {
			text += '<div onclick="getScheduleList(' + k + ');" class="pg-num active">' + k + '</div>';
	    }else {
	    	text += '<div onclick="getScheduleList(' + k + ');" class="pg-num">' + k + '</div>';
	    }
	}
	
	if(total_paging_cnt != 0 && total_paging_cnt != 1 && next_no <= total_paging_cnt) {
		text += '<div onclick="getScheduleList(' + next_no + ');" class="pg-next">&nbsp;</div>';
	}else {
		text += '<div class="pg-next-inact">&nbsp;</div>';
	}
	
	if(total_paging_cnt == 0) {
		text = '';
	}
	
	$('#pagination').empty();
	$('#pagination').append(text);
}

function goSchedulerDetail(uid) {
	location.href = contextPath + '/mng/sche/detailRowScheduler.html?uid=' + uid;
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
		url: contextPath + '/mng/sche/changeStatusSchedule.html',
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
				getScheduleList('');
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
		url: contextPath + '/mng/sche/deleteSchedule.html',
		traditional: true,
		data: {
			uidArr: chkUid
		},
		success: function(data) {
			var json = JSON.parse(data);
			
			if(json.result) {
				$('#del_modal').modal('hide');
				alertPop($.i18n.t('delPop.compDel'));
				getScheduleList('');
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
