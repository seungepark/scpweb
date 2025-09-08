var cronPageNo = ""; // 현재 page
var listArr = []; //cron Data
var mainSort = "default";
var mainOrder = "asc";
let _isSetPage = false;

$(function(){
	initI18n();
	setSearchOption();
	getCronList(cronPageNo); // template List ajax function
	init();
	initServerCheck();
	autocompleteOff();
});

function initI18n() {
	var lang = initLang();

	$.i18n.init({
	    lng: lang,
	    fallbackLng: FALLBACK_LNG,
	    fallbackOnNull: false,
	    fallbackOnEmpty: false,
	    useLocalStorage: false,
	    ns: {
	      namespaces: ['share', 'cron'],
	      defaultNs: 'cron'
	    },
	    resStore: RES_LANG
	}, function () {
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
	
	// 검색 조건에서 키 이벤트 추가 
	$("#cronid").keypress(function(e) {
		if(e.keyCode === 13) {
			getCronList(1);
		}
	});
	$("#desc").keypress(function(e) {
		if(e.keyCode === 13) {
			getCronList(1);
		}
	});
	$("#status").keypress(function(e) {
		if(e.keyCode === 13) {
			getCronList(1);
		}
	});
	
	$('.modal-dialog').draggable({handle: '.modal-header'});
}

function setSearchOption() {
	let page = getSearchCookie('SK_PAGE');

  	let cronid = getSearchCookie('SK_CODE');
  	let desc = getSearchCookie('SK_DESC');
  	let status = getSearchCookie('SK_STTS');

	if(status != '') {
		$('#status').val(status).prop('selected', true);
	}

	$('#cronid').val(cronid);
	$('#desc').val(desc);
	
	if(page != '') {
		_isSetPage = true;
		cronPageNo = page;
	}
}

function saveSearchOption() {
	setSearchCookie('SK_PAGE', cronPageNo);
	
  	setSearchCookie('SK_CODE', $('#cronid').val());
  	setSearchCookie('SK_DESC', $('#desc').val());
  	setSearchCookie('SK_STTS', $('#status').val());
}

function getCronList(pageNo){
	let cronid = $('#cronid').val();
	let desc = $('#desc').val();
	let status = $('#status').val();
	
	$('#listAllChk').prop('checked', false);
	$('input[name=listChk]').prop('checked', false);
	
	if(_isSetPage) {
		_isSetPage = false;
		pageNo = cronPageNo;
	}else if(pageNo == "") {
		pageNo = 1;
		cronPageNo = 1;
	}else {
		cronPageNo = pageNo; // 현재 페이지 저장
	}
	
	saveSearchOption();
	
	jQuery.ajax({
		type: "GET",
		url: contextPath + "/db/cron/getCronList.html",
		data:{
			page : pageNo,
			cronid: cronid,
			description: desc,
			status: status
		},
		success: function(data) {
			let result = JSON.parse(data);
			let text = '';
			
			listArr = [];
			listArr.push(result.list); // apprArr 배열 담기
			
			for(let i = 0; i < result.list.length; i++) {
				text +='<tr class="cursor-pointer">';
				text +='  <td class="text-center"><input type="checkbox" name="listChk" onclick="setRowSelected()"></td>';
				text +='  <td class=" " onClick="goDetailCron(' + result.list[i].uid + ')">'+result.list[i].cronid+'</td>';
				text +='  <td class=" " onClick="goDetailCron(' + result.list[i].uid + ')">'+result.list[i].description+'</td>';
				text +='  <td class="text-center" onClick="goDetailCron(' + result.list[i].uid + ')">'+result.list[i].status+'</td>';
				text +='  <td class=" " onClick="goDetailCron(' + result.list[i].uid + ')">'+result.list[i].frequency+'</td>';
				text +='</tr>';
			}
			
			$('#getCronList').empty();
			$('#listAllChk').prop('checked', false);
			
			if(result.list.length > 0) {
				$("#getCronList").append(text);
			} else{
				$("#getCronList").append('<tr><td class="text-center" colspan="5">' + $.i18n.t('share:noList') + '</td></tr>');
			}
			
			var perPage = 10;
			var totalPage = Math.ceil(parseInt(result.listCnt) / perPage);
			var startPage = Math.floor((cronPageNo - 1) / perPage) * perPage + 1;
			let endPage = startPage + perPage - 1;
			
			if(totalPage <= endPage) {
				endPage = totalPage;
			}
			
			cronPaging(endPage, startPage, totalPage);
			
		},
		error: function(req, status, err){console.log(err);
			alertPop($.i18n.t('share:tryAgain'));
		},
		beforeSend:function(){
			$('#loading').css("display","block");
		},
		complete:function(){
			$('#loading').css('display',"none");
		}
	});
}

function cronPaging(end, start, total) {
	var paging_init_num = parseInt(start);
	var paging_end_num = parseInt(end);
	var total_paging_cnt = parseInt(total);
	var pre_no = parseInt(cronPageNo) - 1;
	var next_no = parseInt(cronPageNo) + 1;
	var text = '';
	
	if(total_paging_cnt == 0 || total_paging_cnt == 1 || pre_no == 0) {
		text += '<div class="pg-prev-inact">&nbsp;</div>';
	}else {
		text += '<div onclick="getCronList(' + pre_no + ');" class="pg-prev">&nbsp;</div>';
	}
	
	for(var k = paging_init_num; k <= paging_end_num; k++) {
		if(parseInt(cronPageNo) == k) {
			text += '<div onclick="getCronList(' + k + ');" class="pg-num active">' + k + '</div>';
		}else {
			text += '<div onclick="getCronList(' + k + ');" class="pg-num">' + k + '</div>';
		}
	}
	
	if(total_paging_cnt == 0 || total_paging_cnt == 1 || next_no > total_paging_cnt) {
		text += '<div class="pg-next-inact">&nbsp;</div>';
	}else {
		text += '<div onclick="getCronList(' + next_no + ');" class="pg-next">&nbsp;</div>';
	}
	
	if(total_paging_cnt == 0) {
		text = '';
	}
	
	$("#pagination").empty();
	$("#pagination").append(text);
}

function goDetailCron(uid) {
	location.href = contextPath + '/db/cron/detailCron.html?uid=' + uid;
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

// 상태 변경
function changeStatus() {
	var chk = $('input[name=listChk]');
	var chkUid = [];
	
	for(var i = 0; i < chk.length; i++) {
		if($('input[name=listChk]:eq(' + i + ')').is(':checked')) {
			chkUid.push(listArr[0][i].uid);
		}
	}
	
	jQuery.ajax({
		type: 'POST',
		url: contextPath + '/db/cron/changeStatusCron.html',
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
				getCronList(cronPageNo);
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
			$('#loading').css("display","block");
		},
		complete: function() {
			$('#loading').css('display',"none");
		}
	});
}

function popDeleteCronModal() {
	if($('input[name=listChk]:checked').length > 0) {
		let isActiveCron = false;
		// Active 상태의 데이터 체크 
		const chk = $('input[name=listChk]');
		for(var i = 0; i < chk.length; i++) {
			if($('input[name=listChk]:eq(' + i + ')').is(':checked')) {
				if(listArr[0][i].status == 'ACT'){
					isActiveCron = true;
				}
			}
		}
		
		if(isActiveCron){
			alertPop($.i18n.t('delPop.checkStatus'));
		} else{
			$('#del_modal').modal();
		}
	}else {
		alertPop($.i18n.t('delPop.selectMsg'));
	}
}

function deleteCron(){
	var chk = $('input[name=listChk]');
	var chkUid = [];
	
	for(var i = 0; i < chk.length; i++) {
		if($('input[name=listChk]:eq(' + i + ')').is(':checked')) {
			chkUid.push(listArr[0][i].uid);
		}
	}
	
	jQuery.ajax({
		type: 'POST',
		url: contextPath + '/db/cron/deleteCron.html',
		traditional: true,
		data: {
			uidArr: chkUid
		},
		success: function(data) {
			var json = JSON.parse(data);
			
			if(json.result) {
				$('#del_modal').modal('hide');
				alertPop($.i18n.t('delPop.compDel'));
				getCronList(cronPageNo);
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
			$('#loading').css("display","block");
		},
		complete: function() {
			$('#loading').css('display',"none");
		}
	});
}

function cronListDownloadAll() {
	let cronid = $('#cronid').val();
	let desc = $('#desc').val();
	let status = $('#status').val();

	$.ajax({
		type : "GET",
		url : contextPath + "/db/cron/cronListDownloadAll.html",
		dataType : "json",
		headers : {
			"content-type" : "application/json"
		},
		beforeSend : function() {
			$('#loading').css("display", "block");
		},
		complete : function() {
			$('#loading').css('display', "none");
		},
		data : {
			isAll: 'Y',
			cronid: cronid,
			description: desc,
			status: status
		}
	}).done(function(result, textStatus, xhr) {
		if(textStatus == "success") {
			var jsonResult = result.list;
			var text = '<thead>' +
							'<tr class="headings">' +
								'<th class="column-title border" style=""><div class="th-inner sortable both"><span>' + $.i18n.t('list.cron') + '</span></div><div class="fht-cell"></div></th>' +
								'<th class="column-title border" style=""><div class="th-inner sortable both"><span>' + $.i18n.t('list.desc') + '</span></div><div class="fht-cell"></div></th>' +
								'<th class="column-title border text-center" style=""><div class="th-inner sortable both"><span>' + $.i18n.t('list.status') + '</span></div><div class="fht-cell"></div></th>' +
								'<th class="column-title border" style=""><div class="th-inner sortable both"><span>' + $.i18n.t('list.freq') + '</span></div><div class="fht-cell"></div></th>' +
								'<th class="column-title border" style=""><div class="th-inner sortable both"><span>' + $.i18n.t('list.cronClass') + '</span></div><div class="fht-cell"></div></th>' +
							'</tr>' +
						'</thead>' +
						'<tbody id="getCronList">';
			
			for(var i in jsonResult) {
				text += '<tr class="even pointer">';
				text += '  <td>' + jsonResult[i].cronid + '</td>';
				text += '  <td>' + jsonResult[i].description + '</td>';
				text += '  <td>' + jsonResult[i].status + '</td>';
				text += '  <td>' + jsonResult[i].frequency + '</td>';
				text += '  <td>' + jsonResult[i].cronclass + '</td>';
				text += '</tr>';
			}
			
			text += '</tbody>';
			
			excelDownloadAll(text, 'cron_list');
		}else {
			alertPop($.i18n.t('share:tryAgain'));
		}
	}).fail(function(data, textStatus, errorThrown) {
		alertPop($.i18n.t('share:tryAgain'));
	});
}
