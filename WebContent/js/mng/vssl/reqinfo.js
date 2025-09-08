let listPageNo = '';
let listArr = [];
let listSort = "";
let listOrder = "desc";
let _isSetSort = false;
let _isSetPage = false;

$(() => {
	initI18n();
	setSearchOption();
	getVesselReqInfoList(1);
	init();
	initServerCheck();
	autocompleteOff();
});

const initI18n = () => {
	const lang = initLang();

	$.i18n.init({
		lng : lang,
		fallbackLng : FALLBACK_LNG,
		fallbackOnNull : false,
		fallbackOnEmpty : false,
		useLocalStorage : false,
		ns : {
			namespaces : [ 'share', 'mngVsslReqInfo' ],
			defaultNs : 'mngVsslReqInfo'
		},
		resStore : RES_LANG
	}, () => {
		$('body').i18n();
	});
}

const init = () => {
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
			// getVesselReqInfoList(1);
		}
	});
	$('#hullNum').keypress(function(e) {
		if(e.keyCode === 13) {
			getVesselReqInfoList(1);
		}
	});
	
	$('.modal-dialog').draggable({handle: '.modal-header'});
}

const setSearchOption = () => {
	let page = getSearchCookie('SK_PAGE');
	
	let sortNm = getSearchCookie('SK_SORTNM');
  	let sortOd = getSearchCookie('SK_SORTOD');
	
  	let hullnum = getSearchCookie('SK_DESC');
  	let shipType = getSearchCookie('SK_TYPE');
  	let status = getSearchCookie('SK_STTS');
  	
  	if(shipType != '') {
		$('#shipType').val(shipType).prop('selected', true);
	}
  	if(status != '') {
		$('#status').val(status).prop('selected', true);
	}
  	
  	$('#hullNum').val(hullnum);
	
	if(page != '') {
		_isSetPage = true;
		listPageNo = page;
	}
	
	if(sortNm != '' && sortOd != '') {
		_isSetSort = true;
		initTbAlign(sortNm, sortOd);
	}
}

const saveSearchOption = () => {
	setSearchCookie('SK_PAGE', listPageNo);
	
	setSearchCookie('SK_SORTNM', listSort);
  	setSearchCookie('SK_SORTOD', listOrder);

  	setSearchCookie('SK_TYPE', $('#shipType option:selected').val());
  	setSearchCookie('SK_DESC', $('#hullNum').val());
  	setSearchCookie('SK_STTS', $('#status option:selected').val());
}

let tbAlignList = [
    {id: 'list0', name: 'hullNum', order: ''},
    {id: 'list1', name: 'shipType', order: ''},
    {id: 'list2', name: 'description', order: ''},
    {id: 'list3', name: 'status', order: ''},
    {id: 'list4', name: 'insertbyNm', order: ''}
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
		getVesselReqInfoList(1);
	}
}

const getVesselReqInfoList = (page) => {
	const shipType = $('#shipType option:selected').val();
	const hullNum = $('#hullNum').val();
	const status = $('#status option:selected').val();
	
	if(_isSetPage) {
		_isSetPage = false;
		page = listPageNo;
	}else if(page == ""){
		page = 1;
		listPageNo = 1;
  	}else{
  		listPageNo = page; //현재 페이지 저장
  	}
	
	saveSearchOption();
	
	jQuery.ajax({
		type: 'GET',
		url: contextPath + '/mng/vssl/getVesselReqInfoList.html',
		data: {
			page: page,
			shiptype: shipType,
			hullNum: hullNum,
			status: status,
			sort: listSort,
			order: listOrder
		},
		success: (data) => {
			const json = JSON.parse(data);
			let text = '';
			
			listArr = json.list;
			
			for(let i = 0; i < json.list.length; i++) {
				const obj = json.list[i]
				text += `<tr class="cursor-pointer">
					<td class=""><input type="checkbox" data-uid="${ obj.uid }" name="listChk" onclick="setRowSelected()"></td>
					<td class="" onClick="goVesselReqInfoDetail(${ obj.uid })">${ obj.hullNum }</td>
					<td class="" onClick="goVesselReqInfoDetail(${ obj.uid })">${ obj.shiptype }</td>
					<td class="" onClick="goVesselReqInfoDetail(${ obj.uid })">${ obj.description }</td>
					<td class="text-center" onClick="goVesselReqInfoDetail(${ obj.uid })">${ obj.status }</td>
					<td class="text-center" onClick="goVesselReqInfoDetail(${ obj.uid })">${ obj.insertbyNm }</td>
				</tr>`;
			}
			
			$('#vesselReqInfoList').empty();
			
			if(json.list.length > 0) {
				$('#vesselReqInfoList').append(text);
			}else {
				$('#vesselReqInfoList').append('<tr><td class="text-center" colspan="6">' + $.i18n.t('share:noList') + '</td></tr>');
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

const paging = (cnt, page) => {
	const perPage = 10;
    const total = Math.ceil(parseInt(cnt) / perPage);
    const start = Math.floor((page - 1) / perPage) * perPage + 1;
    let end = start + perPage - 1;
    
    if(total <= end) {
    	end = total;
    }
    
	const paging_init_num = parseInt(start);
	const paging_end_num = parseInt(end);
	const total_paging_cnt = parseInt(total);
	const pre_no = parseInt(page) - 1;
	const next_no = parseInt(page) + 1;
	let text = '';
	
	if(total_paging_cnt != 0 && total_paging_cnt != 1 && pre_no != 0) {
		text += '<div onclick="getVesselReqInfoList(' + pre_no + ');" class="pg-prev">&nbsp;</div>';
	}else {
		text += '<div class="pg-prev-inact">&nbsp;</div>';
	}
	  
	for(let k = paging_init_num; k <= paging_end_num; k++) {
	    if(parseInt(page) == k) {
			text += '<div onclick="getVesselReqInfoList(' + k + ');" class="pg-num active">' + k + '</div>';
	    }else {
			text += '<div onclick="getVesselReqInfoList(' + k + ');" class="pg-num">' + k + '</div>';
	    }
	}
	
	if(total_paging_cnt != 0 && total_paging_cnt != 1 && next_no <= total_paging_cnt) {
		text += '<div onclick="getVesselReqInfoList(' + next_no + ');" class="pg-next">&nbsp;</div>';
	}else {
		text += '<div class="pg-next-inact">&nbsp;</div>';
	}
	
	if(total_paging_cnt == 0) {
		text = '';
	}
	
	$('#pagination').empty();
	$('#pagination').append(text);
}

const goVesselReqInfoDetail = (uid) => {
	location.href = contextPath + '/mng/vssl/detailVesselReqInfo.html?uid=' + uid;
}

//상태 변경 modal 팝업
const popChangeStatusModal = () => {
	if($('input[name=listChk]:checked').length > 0) {
		$('#change_status_modal').modal();
		$("#changeStatusSel option:eq(0)").prop("selected", true);
	}else {
		alertPop($.i18n.t('changePop.selectMsg'));
	}
}

//상태 변경
const changeStatus = () => {
	var chk = $('input[name=listChk]');
	var chkUid = [];
	
	for(var i = 0; i < chk.length; i++) {
		if($('input[name=listChk]:eq(' + i + ')').is(':checked')) {
			chkUid.push(listArr[i].uid);
		}
	}
	
	jQuery.ajax({
		type: 'POST',
		url: contextPath + '/mng/vssl/changeStatusVesselReqInfo.html',
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
				getVesselReqInfoList('');
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
const popDeleteVesselReqInfoModal = () => {
	if($('input[name=listChk]:checked').length > 0) {
		let isActiveData = false;
		// Active 상태의 데이터 체크 
		const chk = $('input[name=listChk]');
		for(var i = 0; i < chk.length; i++) {
			if($('input[name=listChk]:eq(' + i + ')').is(':checked')) {
				if(listArr[i].status == 'ACT'){
					isActiveData = true;
				}
			}
		}
		
		if(isActiveData){
			alertPop($.i18n.t('delPop.checkStatus'));
		} else{
			$('#del_modal').modal();
		}
	}else {
		alertPop($.i18n.t('delPop.selectMsg'));
	}
}

// VesselReqInfo, VesselReqInfoDetail 삭제
const deleteVesselReqInfo = () => {
	var chk = $('input[name=listChk]');
	var chkUid = [];
	
	for(var i = 0; i < chk.length; i++) {
		if($('input[name=listChk]:eq(' + i + ')').is(':checked')) {
			chkUid.push(listArr[i].uid);
		}
	}
	
	jQuery.ajax({
		type: 'POST',
		url: contextPath + '/mng/vssl/deleteVesselReqInfo.html',
		traditional: true,
		data: {
			uidArr: chkUid
		},
		success: function(data) {
			var json = JSON.parse(data);
			
			if(json.result) {
				$('#del_modal').modal('hide');
				alertPop($.i18n.t('delPop.compDel'));
				getVesselReqInfoList('');
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

