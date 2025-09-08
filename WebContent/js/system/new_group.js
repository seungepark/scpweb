var authList = [];
var userPopPageNo = 1;
var userPopArr = [];
var userArr = [];

$(function() {
	initI18n();
	
	$('.modal-dialog').draggable({handle: '.modal-header'});
	
	initServerCheck();
	initTree();
	initGroup();
	init();
	autocompleteOff();
	
	getUserList(1);
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
			namespaces : [ 'share', 'newGroup' ],
			defaultNs : 'newGroup'
		},
		resStore : RES_LANG
	}, function() {
		$('body').i18n();
	});
}

function initTree() {
	jQuery.ajax({
		type: 'GET',
		url: contextPath + '/system/group/getAuthList.html',
		data: {},
		success: function(data) {
			var json = JSON.parse(data);
			
			if(json.list.length > 0) {
				authList = json.list;
				var html = new Array();
				var item = new Object();
				var isFirstSub = true;
				
				for(var i = 0; i < json.list.length; i++) {
					if(json.list[i].kind == 'PAGE') {
						if(i > 0) {
							html.push(item);
						}
						
						isFirstSub = true;
						item = new Object();
						item.uid = json.list[i].uid;
						item.upUid = json.list[i].upUid;
						item.text = json.list[i].desc; 
						item.icon = 'glyphicon glyphicon-file';
						item.color = '#212134';
						item.state = new Object();
						item.state.expanded = false;
					}else {
						if(isFirstSub) {
							item.nodes = new Array();
							isFirstSub = false;
						}
						
						var subItem = new Object();
						subItem.uid = json.list[i].uid;
						subItem.upUid = json.list[i].upUid;
						subItem.text = json.list[i].desc;
						subItem.color = '#212134';
						subItem.backColor = '#FFFFFF';
						item.nodes.push(subItem);
					}
				}
				
				html.push(item);
//				console.log(JSON.stringify(html));
				
				$('#treeView').treeview({
					data: html,
					multiSelect: true,
					showCheckbox: true,
					onNodeChecked: function(event, data) {
						$('#treeView').treeview('selectNode', [data.nodeId, { silent: true }]);
					},
					onNodeUnchecked: function(event, data) {
						$('#treeView').treeview('unselectNode', [data.nodeId, { silent: true }]);
					},
					onNodeSelected: function(event, data) {
						$('#treeView').treeview('checkNode', [data.nodeId, { silent: true }]);
					},
					onNodeUnselected: function(event, data) {
						$('#treeView').treeview('uncheckNode', [data.nodeId, { silent: true }]);
					}
				});
			}
		},
		error: function(req, status, err) {
		},
		beforeSend: function() {
		},
		complete: function() {
		}
	});
}

// 그룹장 목록
function initGroup() {
	jQuery.ajax({
		type: 'GET',
		url: contextPath + '/system/group/getLineGroupLeaderList.html',
		data: {},
		success: function(data) {
			var json = JSON.parse(data);
			
			if(json.list.length > 0) {
				for(var i = 0; i < json.list.length; i++) {
					$('#authGroup').append('<option value="' + json.list[i].uid + '">' + json.list[i].groupName + '</option>');
				}
			}
		},
		error: function(req, status, err) {
		},
		beforeSend: function() {
		},
		complete: function() {
		}
	});
}

function init() {
	initDesign();
	
	$('#kind').change(function() {
		var kind = $('#kind option:selected').val();
		
		if(kind == 'WORKER') {
			$('#authGroupView').show();
		}else {
			$('#authGroupView').hide();
		}
	});
}

// 사용자 목록
function getUserList(pageNo){
	userPopPageNo = pageNo;

	jQuery.ajax({
		type: 'GET',
		url: contextPath + '/system/group/getUserListForGroup.html',
		data: {
			page: pageNo
		},
		success: function(data) {
			var json = JSON.parse(data);
			
			userPopArr = json.list;
			$("#userPopList").empty();
			
			for(var i = 0; i < json.list.length; i++) {
				var text = '' + 
				'<tr>' + 
				'	<td>' + json.list[i].userId + '</td>' + 
				'	<td>' + json.list[i].posCode + '</td>' + 
				'	<td>' + json.list[i].firstName + ' ' + json.list[i].lastName + '</td>' + 
				'	<td class="text-center cursor-pointer"><span onClick="addUser(' + i + ')"><i class="fa fa-plus-square"></i></span></td>' + 
				'</tr>';
				
				$("#userPopList").append(text);
			}
			
			var perPage = 10;
			var totalPage = Math.ceil(parseInt(json.listCnt) / perPage);
			var startPage = Math.floor((userPopPageNo - 1) / perPage) * perPage + 1;
			let endPage = startPage + perPage - 1;
			
			if(totalPage <= endPage) {
				endPage = totalPage;
			}
			
			userPaging(endPage, startPage, totalPage);
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

function userPaging(end, start, total){
	var paging_init_num = parseInt(start);
	var paging_end_num = parseInt(end);
	var total_paging_cnt = parseInt(total);
	var pre_no = parseInt(userPopPageNo) - 1;
	var next_no = parseInt(userPopPageNo) + 1;
	var text = '';
	
	if (total_paging_cnt == 0 || total_paging_cnt == 1 || pre_no == 0) {
		text += '<div class="pg-prev-inact">&nbsp;</div>';
	  }else{
		text += '<div onclick="getUserList(' + pre_no + ');" class="pg-prev">&nbsp;</div>';
	  }

	  for( var k = paging_init_num; k <= paging_end_num; k++){
	    if (parseInt(userPopPageNo) == k) {
			text += '<div onclick="getUserList(' + k + ');" class="pg-num active">' + k + '</div>';
	    }else{
			text += '<div onclick="getUserList(' + k + ');" class="pg-num">' + k + '</div>';
	    }
	  }

	  if (total_paging_cnt == 0 || total_paging_cnt == 1 || next_no > total_paging_cnt) {
		text += '<div class="pg-next-inact">&nbsp;</div>';
	  }else{
		text += '<div onclick="getUserList(' + next_no + ');" class="pg-next">&nbsp;</div>';
	  }
	  $("#pagination").empty();
	  $("#pagination").append(text);
}

//사용자 추가
function addUser(idx) {
	var isExist = false;
	
	for(var i = 0; i < userArr.length; i++) {
		if(userArr[i].uid == userPopArr[idx].uid) {
			isExist = true;
		}
	}
	
	if(isExist) {
		toastPop($.i18n.t('userPop.existUserMsg'));
	}else {
		if(userArr.length == 0) {
			$("#userList").empty();
		}
		
		userArr.push(userPopArr[idx]);
		
		var text = '' + 
		'<tr id="userTr' + userPopArr[idx].uid + '">' + 
		'	<td>' + userPopArr[idx].userId + '</td>' + 
		'	<td>' + userPopArr[idx].posCode + '</td>' + 
		'	<td>' + userPopArr[idx].firstName + ' ' + userPopArr[idx].lastName + '</td>' + 
		'	<td class="text-center cursor-pointer"><span onClick="delUser(' + userPopArr[idx].uid + ')"><i class="fa fa-close"></i></span></td>' + 
		'</tr>';
		
	    $('#userList').append(text);
	}
}

// 사용자 삭제
function delUser(uid) {
	for(var i = 0; i < userArr.length; i++) {
		if(userArr[i].uid == uid) {
			userArr.splice(i, 1);
			$('#userTr' + uid).remove();
			break;
		}
	}
	
	if(userArr.length == 0) {
		$("#userList").append('<tr><td class="text-center" colspan="4">' + $.i18n.t('share:noList') + '</td></tr>');
	}
}

// 그룹 생성
function insertGroup() {
	var isEmpty = false;
	var title = $('#code').val();
	var desc = $('#desc').val();
	var kind = $('#kind option:selected').val();
	var status = $('#status option:selected').val();
	var authGroup = $('#authGroup option:selected').val();
	var selectedList = [];
	var authList = [];
	var uidList = [];
	
	if(title == '') {
		isEmpty = true;
	}else {
		selectedList = $('#treeView').treeview('getSelected');
		
		for(var i = 0; i < selectedList.length; i++) {
			authList.push(selectedList[i].uid);
		}
		
		for(var i = 0; i < userArr.length; i++) {
			uidList.push(userArr[i].uid);
		}
	}
	
	if(isEmpty) {
		alertPop($.i18n.t('auth.required'));
	}else {
		jQuery.ajax({
			type: 'POST',
			url: contextPath + '/system/group/insertGroup.html',
			traditional: true,
			data: {
				groupName: title,
				description: desc,
				kind: kind,
				status: status,
				toUid: authGroup,
				authInfoUidList: authList,
				userUidList: uidList
			},
			success: function(data) {
				var json = JSON.parse(data);
				
				if(json.result) {
					$('#code').val('');
					$('#desc').val('');
					alertPop($.i18n.t('auth.compNew'));
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