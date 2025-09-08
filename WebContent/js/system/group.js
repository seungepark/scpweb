var groupPageNo = ""; //template 현재page
var groupArr = []; //template Data
var mainSort = "default";
var mainOrder = "asc";
let _isSetSort = false;
let _isSetPage = false;

$(function(){
	initI18n();
	setSearchOption();
	getGroupList(groupPageNo); // template List ajax function
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
	      namespaces: ['share', 'group'],
	      defaultNs: 'group'
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
	
	$("#search").keypress(function(e) {
		if(e.keyCode === 13) {
			getGroupList(1);
		}
	});
	
	$('.modal-dialog').draggable({handle: '.modal-header'});
}

function setSearchOption() {
	let page = getSearchCookie('SK_PAGE');

	let sortNm = getSearchCookie('SK_SORTNM');
  	let sortOd = getSearchCookie('SK_SORTOD');

  	let search = getSearchCookie('SK_DESC');

	$('#search').val(search);
	
	if(page != '') {
		_isSetPage = true;
		groupPageNo = page;
	}
	
	if(sortNm != '' && sortOd != '') {
		_isSetSort = true;
		initTbAlign(sortNm, sortOd);
	}
}

function saveSearchOption() {
	setSearchCookie('SK_PAGE', groupPageNo);
	
	setSearchCookie('SK_SORTNM', mainSort);
  	setSearchCookie('SK_SORTOD', mainOrder);

  	setSearchCookie('SK_DESC', $('#search').val());
}

let tbAlignList = [
    {id: 'list0', name: 'group', order: ''},
    {id: 'list1', name: 'desc', order: ''},
    {id: 'list2', name: 'status', order: ''}
];

function initTbAlign(name, order) {
	mainOrder = order;
	
    for(let i = 0; i < tbAlignList.length; i++) {
		let obj = document.getElementById(tbAlignList[i].id);
        obj.classList.remove('up', 'down');

		if(tbAlignList[i].name == name) {
			mainSort = name;
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

    mainSort = newName;
    mainOrder = newOrder;

    if(_isSetSort) {
		_isSetSort = false;
	}else {
		getGroupList(1);
	}
}

function getGroupList(pageNo){
  var search = $("#search").val();
	$('#listAllChk').prop('checked', false);
	$('input[name=listChk]').prop('checked', false);

  	if(_isSetPage) {
		_isSetPage = false;
		pageNo = groupPageNo;
	}else if(pageNo == ""){
    	pageNo = 1;
    	groupPageNo = 1;
  	}else{
    	groupPageNo = pageNo; //현재 페이지 저장
  	}

	saveSearchOption();

  $.ajax({
	  type    : "GET",
	  url        : contextPath + "/system/getGroupList.html",
	  dataType:"json",
	  headers: {
		  "content-type": "application/json"
	  },
	  beforeSend:function(){
        $('#loading').css("display","block");
	  },
	  complete:function(){
        $('#loading').css('display',"none");
	  },
    data:{
      page: pageNo,
      search: search,
	  sort: mainSort,
	  order: mainOrder
    }
	}).done(function (result, textStatus, xhr) {
		if(textStatus == "success"){
      var jsonResult = result.list;
      var text = '';

      groupArr = [];
      groupArr.push(result.list); // 배열 담기

		  for(var i in jsonResult){
        text +='<tr class="cursor-pointer">';
        text +='  <td class="text-center"><input type="checkbox" name="listChk" onclick="setRowSelected()"></td>';
        text +='  <td class=" " onClick="goDetailGroup(' + jsonResult[i].uid + ')">'+jsonResult[i].title+'</td>';
        text +='  <td class=" " onClick="goDetailGroup(' + jsonResult[i].uid + ')">'+jsonResult[i].desc+'</td>';
        text +='  <td class="text-center" onClick="goDetailGroup(' + jsonResult[i].uid + ')">'+jsonResult[i].status+'</td>';
        text +='</tr>';
      }

      $("#getGroupList").empty();
      
      if(text == '') {
    	  $("#getGroupList").append('<tr><td class="text-center" colspan="4">' + $.i18n.t('share:noList') + '</td></tr>');
	  }else {
		  $("#getGroupList").append(text);
	  }

      var perPage = 10;
      var totalPage = Math.ceil(parseInt(result.listCnt) / perPage);

      var startPage = Math.floor((groupPageNo - 1) / perPage) * perPage + 1;
      let endPage = startPage + perPage - 1;
      if (totalPage <= endPage) {
        endPage = totalPage;
      }
      groupPaging(endPage, startPage, totalPage);

		}else{
			alertPop($.i18n.t('share:tryAgain'));
		}
	}).fail(function(data, textStatus, errorThrown){
	  
	});
}

function groupPaging(end, start, total){
  var paging_init_num = parseInt(start);
  var paging_end_num = parseInt(end);
  var total_paging_cnt = parseInt(total);
  var pre_no = parseInt(groupPageNo) - 1;
  var next_no = parseInt(groupPageNo) + 1;
  var text = '';

  if (total_paging_cnt == 0 || total_paging_cnt == 1 || pre_no == 0) {
	text += '<div class="pg-prev-inact">&nbsp;</div>';
  }else{
	text += '<div onclick="getGroupList(' + pre_no + ');" class="pg-prev">&nbsp;</div>';
  }

  for( var k = paging_init_num; k <= paging_end_num; k++){
    if (parseInt(groupPageNo) == k) {
		text += '<div onclick="getGroupList(' + k + ');" class="pg-num active">' + k + '</div>';
    }else{
		text += '<div onclick="getGroupList(' + k + ');" class="pg-num">' + k + '</div>';
    }
  }

  if (total_paging_cnt == 0 || total_paging_cnt == 1 || next_no > total_paging_cnt) {
	text += '<div class="pg-next-inact">&nbsp;</div>';
  }else{
	text += '<div onclick="getGroupList(' + next_no + ');" class="pg-next">&nbsp;</div>';
  }

  if(total_paging_cnt == 0) {
	text = '';
  }

  $("#pagination").empty();
  $("#pagination").append(text);
}

function goDetailGroup(uid) {
	location.href = contextPath + '/system/group/detailGroup.html?uid=' + uid;
}

//상태 변경 modal 팝업
function popChangeStatusModal() {
	if($('input[name=listChk]:checked').length > 0) {
		$('#change_status_modal').modal();
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
			chkUid.push(groupArr[0][i].uid);
		}
	}
	
	jQuery.ajax({
		type: 'POST',
		url: contextPath + '/system/group/changeStatusGroup.html',
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
				getGroupList(1);
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

//삭제 modal 팝업
function popDeleteGroupModal() {
	if($('input[name=listChk]:checked').length > 0) {
		$('#del_modal').modal();
	}else {
		alertPop($.i18n.t('delPop.selectMsg'));
	}
}

// 삭제
function deleteGroup() {
	var chk = $('input[name=listChk]');
	var chkUid = [];
	
	for(var i = 0; i < chk.length; i++) {
		if($('input[name=listChk]:eq(' + i + ')').is(':checked')) {
			chkUid.push(groupArr[0][i].uid);
		}
	}
	
	jQuery.ajax({
		type: 'POST',
		url: contextPath + '/system/group/deleteGroup.html',
		traditional: true,
		data: {
			uidArr: chkUid
		},
		success: function(data) {
			var json = JSON.parse(data);
			
			if(json.result) {
				$('#del_modal').modal('hide');
				
				if(json.errCode == "OK") {
					alertPop($.i18n.t('delPop.compDel'));
				}else if(json.errCode == "ECDA") {
					alertPop($.i18n.t('delPop.compDelNothing'));
				}else if(json.errCode == "ECDP") {
					let okCodes = '';
					let failCodes = '';
					
					for(let i = 0; i < json.listOk.length; i++) {
						for(let x = 0; x < groupArr[0].length; x++) {
							if(json.listOk[i].uid == groupArr[0][x].uid) {
								if(okCodes != '') {
									okCodes += ', ';
								}
								
								okCodes += groupArr[0][x].title;
								break;
							}
						}
					}
					
					for(let i = 0; i < json.listFail.length; i++) {
						for(let x = 0; x < groupArr[0].length; x++) {
							if(json.listFail[i].uid == groupArr[0][x].uid) {
								if(failCodes != '') {
									failCodes += ', ';
								}
								
								failCodes += groupArr[0][x].title;
								break;
							}
						}
					}
					
					alertPopHtml($.i18n.t('delPop.compDelPart', {ok: okCodes, fail: failCodes}));
				}else {
					alertPop($.i18n.t('share:tryAgain'));
				}
				
				getGroupList(1);
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

function groupListDownloadAll() {
	var search = $("#search").val();

	$.ajax({
		type : "GET",
		url : contextPath + "/system/groupListDownloadAll.html",
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
			search: search,
			sort: mainSort,
			order: mainOrder
		}
	}).done(function(result, textStatus, xhr) {
		if(textStatus == "success") {
			var jsonResult = result.list;
			var text = '<thead>' +
							'<tr class="headings">' +
								'<th class="column-title border" style=""><div class="th-inner sortable both"><span>' + $.i18n.t('group') + '</span></div><div class="fht-cell"></div></th>' +
								'<th class="column-title border" style=""><div class="th-inner sortable both"><span>' + $.i18n.t('desc') + '</span></div><div class="fht-cell"></div></th>' +
								'<th class="column-title border text-center" style=""><div class="th-inner sortable both"><span>' + $.i18n.t('status') + '</span></div><div class="fht-cell"></div></th>' +
							'</tr>' +
						'</thead>' +
						'<tbody id="getGroupList">';

			for(var i in jsonResult) {
				text += '<tr class="even pointer">';
				text += '  <td>' + jsonResult[i].title + '</td>';
				text += '  <td>' + jsonResult[i].desc + '</td>';
				text += '  <td>' + jsonResult[i].status + '</td>';
				text += '</tr>';
			}

			text += '</tbody>';
			
			excelDownloadAll(text, 'authority_group_list');
		}else {
			alertPop($.i18n.t('share:tryAgain'));
		}
	}).fail(function(data, textStatus, errorThrown) {
		alertPop($.i18n.t('share:tryAgain'));
	});
}
