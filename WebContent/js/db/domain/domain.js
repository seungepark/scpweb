var listArr = [];
var listArrSelectIdx = 0;
var newPopVlTrNextIdx = 0;
var modifyPopVlTrNextIdx = 0;
let delDomainUid = 0;
let modifyPopDelUid = [];
let modifyPopDelVal = [];

$(function() {
	initI18n();
	getDomainList();
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
			namespaces : [ 'share', 'domain' ],
			defaultNs : 'domain'
		},
		resStore : RES_LANG
	}, function() {
		$('body').i18n();
	});
}

function init() {
	initDesign();
	
	$('#search').keypress(function(e) {
		if(e.keyCode === 13) {
			getDomainList();
		}
	});
	
	$('.modal-dialog').draggable({handle: '.modal-header'});
	
	$('#newPopType').change(function() {
		var type = $('#newPopType option:selected').val();
		var newPopVlInval = $('[name="newPopVlInval"]');
		
		if(type == 'SYNONYM') {
			for(var i = 0; i < newPopVlInval.length; i++) {
				newPopVlInval.eq(i).removeAttr('readonly');
			}
		}else {
			for(var i = 0; i < newPopVlInval.length; i++) {
				newPopVlInval.eq(i).attr('readonly', true);
			}
		}
	});
	
	$('#id').keypress(function(e) {
		if(e.keyCode === 13) {
			getDomainList();
		}
	});
	
	$('#desc').keypress(function(e) {
		if(e.keyCode === 13) {
			getDomainList();
		}
	});
}

function getDomainList() {
	var cat = $('#cat option:selected').val();
	var id = $('#id').val();
	var desc = $('#desc').val();
	
	jQuery.ajax({
		type: 'GET',
		url: contextPath + '/db/domain/getDomainList.html',
		data: {
			cat: cat,
			domain: id,
			description: desc
		},
		success: function(data) {
			var json = JSON.parse(data);
			var text = '';
			
			listArr = json.list;
			
			for(var i = 0; i < json.list.length; i++) {
				text +='<tr class="cursor-pointer">';
		        text +='  <td class="text-center" onClick="showModifyPop(' + i + ')">' + json.list[i].cat + '</td>';
		        text +='  <td class=" " onClick="showModifyPop(' + i + ')">' + json.list[i].domain + '</td>';
		        text +='  <td class=" " onClick="showModifyPop(' + i + ')">' + json.list[i].desc + '</td>';
		        text +='  <td class="text-center" onClick="showModifyPop(' + i + ')">' + json.list[i].dataType + '</td>';
				
				if(json.list[i].cat == 'DATA') {
					text +='  <td class="text-center" onClick="popDel(' + i + ')"><i class="fa-solid fa-xmark"></i></td>';
				}else {
					text +='  <td class="text-center" onClick="showModifyPop(' + i + ')"><i class="fa-solid fa-ban"></i></td>';
				}
		        
		        text +='</tr>';
			}
			
			$('#list').empty();
			
			if(json.list.length > 0) {
				$('#list').append(text);
			}else {
				$('#list').append('<tr><td class="text-center" colspan="5">' + $.i18n.t('share:noList') + '</td></tr>');
			}
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

// 신규 modal 팝업
function showNewPop() {
	$('#newPopDomain').val('');
	$('#newPopDesc').val('');
	$('#newPopList').empty();
	
	$('#new_pop').modal();
}

// 수정 modal 팝업
function showModifyPop(idx) {
	modifyPopDelUid = [];
	modifyPopDelVal = [];
	listArrSelectIdx = idx;
	var json = listArr[idx];
	let isCatData = json.cat == 'DATA' ? true : false;
	
	$('#modifyPopDomain').val(json.domain);
	$('#modifyPopDesc').val(json.desc);
	$('#modifyPopCat').val(json.cat).prop('selected', true);
	$('#modifyPopType').val(json.dataType).prop('selected', true);
	$('#modifyPopList').empty();
		
	for(var i = 0; i < json.infoList.length; i++) {
		let cat = isCatData ? '<td class="text-center align-middle cursor-pointer"><span onClick="modifyPopDelOldChild(' + modifyPopVlTrNextIdx + ', ' + json.infoList[i].uid + ", '" + json.infoList[i].val+ "'" + ')"><i class="fa-solid fa-xmark"></i></span></td>' 
			: '<td class="text-center align-middle"><i class="fa-solid fa-ban"></i></td>';
		
		var text = '' + 
		'<tr id="modifyPopVlTr' + modifyPopVlTrNextIdx + '">' + 
		'	<td class=" "><input type="text" name="modifyPopVlInval" readonly' + ' value="' + json.infoList[i].inVal + '"></td>' + 
		'	<td class=" "><input type="text" name="modifyPopVlVal" readonly' + ' value="' + json.infoList[i].val + '"></td>' + 
		'	<td class=" "><input type="text" name="modifyPopVlDesc"' + ' value="' + json.infoList[i].desc + '"></td>' + 
		cat + 
		'</tr>';
		
		$('#modifyPopList').append(text);
		
		modifyPopVlTrNextIdx++;
	}
	
	$('#modify_pop').modal();
}

// 신규 도메인값 추가
function newPopAddChild() {
	var isSynonym = $('#newPopType option:selected').val() == 'SYNONYM' ? '' : 'readonly';
	
	var text = '' + 
	'<tr id="newPopVlTr' + newPopVlTrNextIdx + '">' + 
	'	<td class=" "><input type="text" name="newPopVlInval" ' + isSynonym + '></td>' + 
	'	<td class=" "><input type="text" name="newPopVlVal"></td>' + 
	'	<td class=" "><input type="text" name="newPopVlDesc"></td>' + 
    ' 	<td class="text-center align-middle cursor-pointer"><span onClick="newPopDelChild(' + newPopVlTrNextIdx + ')"><i class="fa-solid fa-xmark"></i></span></td>' + 
	'</tr>';
	
    $('#newPopList').append(text);
    
    newPopVlTrNextIdx++;
}

// 수정 도메인값 추가
function modifyPopAddChild() {
	var isSynonym = $('#modifyPopType option:selected').val() == 'SYNONYM' ? '' : 'readonly';
	
	var text = '' + 
	'<tr id="modifyPopVlTr' + modifyPopVlTrNextIdx + '">' + 
	'	<td class=" "><input type="text" name="modifyPopVlInval" ' + isSynonym + '></td>' + 
	'	<td class=" "><input type="text" name="modifyPopVlVal"></td>' + 
	'	<td class=" "><input type="text" name="modifyPopVlDesc"></td>' + 
	' 	<td class="text-center align-middle cursor-pointer"><span onClick="modifyPopDelChild(' + modifyPopVlTrNextIdx + ')"><i class="fa-solid fa-xmark"></i></span></td>' + 
	'</tr>';
	
	$('#modifyPopList').append(text);
	
	modifyPopVlTrNextIdx++;
}

// 신규 도메인값 삭제
function newPopDelChild(idx) {
	$('#newPopVlTr' + idx).remove();
}

// 수정 도메인값 삭제
function modifyPopDelChild(idx) {
	$('#modifyPopVlTr' + idx).remove();
}

// 신규 도메인 생성
function insertDomain() {
	var isEmpty = false;
	var isNoRow = false;
	var domain = $('#newPopDomain').val();
	var desc = $('#newPopDesc').val();
	var cat = $('#newPopCat option:selected').val();
	var type = $('#newPopType option:selected').val();
	var invalList = [];
	var valList = [];
	var descList = [];
	
	var vlInval = $('[name="newPopVlInval"]');
	var vlVal = $('[name="newPopVlVal"]');
	var vlDesc = $('[name="newPopVlDesc"]');
	
	if(domain == '') {
		isEmpty = true;
	}else if(vlVal == null || vlVal.length == 0) {
		isNoRow = true;
	}else {
		for(var i = 0; i < vlVal.length; i++) {
			if(vlVal.eq(i).val() == '') {
				isEmpty = true;
				break;
			}else if(type == 'SYNONYM' && vlInval.eq(i).val() == '') {
				isEmpty = true;
				break;
			}else {
				invalList.push(vlInval.eq(i).val());
				valList.push(vlVal.eq(i).val());
				descList.push(vlDesc.eq(i).val());
			}
		}
	}

	if(isEmpty) {
		toastPop($.i18n.t('newPop.required'));
	}else if(isNoRow) {
		toastPop($.i18n.t('newPop.vlMin'));
	}else {
		jQuery.ajax({
			type: 'POST',
			url: contextPath + '/db/domain/insertDomain.html',
			traditional: true,
			data: {
				domain: domain,
				description: desc,
				cat: cat,
				dataType: type,
				inValList: invalList,
				valList: valList,
				descList: descList
			},
			success: function(data) {
				var json = JSON.parse(data);
				
				if(json.result) {
					newPopVlTrNextIdx = 0;
					$('#new_pop').modal('hide');
					alertPop($.i18n.t('newPop.compNew'));
					getDomainList();
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
}

// 수정 도메인 업데이트
function updateDomain() {
	var isEmpty = false;
	var isNoRow = false;
	var desc = $('#modifyPopDesc').val();
	var type = $('#modifyPopType option:selected').val();
	var invalList = [];
	var valList = [];
	var descList = [];
	var uidList = [];
	
	var vlInval = $('[name="modifyPopVlInval"]');
	var vlVal = $('[name="modifyPopVlVal"]');
	var vlDesc = $('[name="modifyPopVlDesc"]');
	
	var oldJson = listArr[listArrSelectIdx];
	
	if(vlVal == null || vlVal.length == 0) {
		isNoRow = true;
	}else {
		for(var i = 0; i < vlVal.length; i++) {
			if(vlVal.eq(i).val() == '') {
				isEmpty = true;
				break;
			}else if(type == 'SYNONYM' && vlInval.eq(i).val() == '') {
				isEmpty = true;
				break;
			}else {
				invalList.push(vlInval.eq(i).val());
				valList.push(vlVal.eq(i).val());
				descList.push(vlDesc.eq(i).val());
				
				if(i < oldJson.infoList.length) {
					uidList.push(oldJson.infoList[i].uid);
				}else {
					uidList.push(0);
				}
			}
		}
	}
	
	if(isEmpty) {
		toastPop($.i18n.t('modifyPop.required'));
	}else if(isNoRow) {
		toastPop($.i18n.t('modifyPop.vlMin'));
	}else {
		jQuery.ajax({
			type: 'POST',
			url: contextPath + '/db/domain/updateDomain.html',
			traditional: true,
			data: {
				uid: oldJson.uid,
				domain: $('#modifyPopDomain').val(),
				description: desc,
				dataType: type,
				inValList: invalList,
				valList: valList,
				descList: descList,
				uidList: uidList,
				delList: modifyPopDelUid,
				delValList: modifyPopDelVal
			},
			success: function(data) {
				var json = JSON.parse(data);
				
				if(json.result) {
					if(json.errCode == "OK") {
						alertPop($.i18n.t('modifyPop.compUpdate'));
					}else if(json.errCode == "ECDP") {
						let failVals = '';
					
						for(let i = 0; i < json.list.length; i++) {
							if(i > 0) {
								failVals += ', ';
							}
							
							failVals += '"' + json.list[i].val + '"';
						}
						
						alertPopHtml($.i18n.t('modifyPop.compDelPart', {fail: failVals}));
					}else {
						alertPop($.i18n.t('share:tryAgain'));
					}
				}else{
					alertPop($.i18n.t('share:tryAgain'));
				}
				
				modifyPopVlTrNextIdx = 0;
				$('#modify_pop').modal('hide');
				getDomainList();
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
}

// 도메인 삭제 modal 팝업
function popDel(idx) {
	let json = listArr[idx];
	delDomainUid = json.uid;
	
	$('#del_modal_domain_name').text(json.domain);
	$('#del_modal').modal();
}

// 도메인 삭제
function deleteDomain() {
	jQuery.ajax({
		type: 'GET',
		url: contextPath + '/db/domain/deleteDomain.html',
		data: {
			uid: delDomainUid,
		},
		success: function(data) {
			var json = JSON.parse(data);
			$('#del_modal').modal('hide');
			
			if(json.result) {
				if(json.errCode == "OK") {
					alertPop($.i18n.t('delPop.compDel'));
				}else if(json.errCode == "ECDD") {
					alertPop($.i18n.t('delPop.errDel'));
				}else {
					alertPop($.i18n.t('share:tryAgain'));
				}
			}else{
				alertPop($.i18n.t('share:tryAgain'));
			}
			
			getDomainList();
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

// 수정 도메인 기존값 삭제
function modifyPopDelOldChild(idx, uid, val) {
	$('#modifyPopVlTr' + idx).remove();
	modifyPopDelUid.push(uid);
	modifyPopDelVal.push(val);
}
