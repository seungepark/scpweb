var scheCodeDetList = []; //Scheduler Row Data
var scheCodeDetSort = "";
var scheCodeDetOrder = "asc";

$(function(){
	initI18n();
	init();
	
	getScheCodeDetList(); // scheCodeDetList ajax function
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
    		namespaces: ['share', 'mngDetScheCode'],
    		defaultNs: 'mngDetScheCode'
    	},
    	resStore: RES_LANG
	}, function () {
		$('body').i18n();
    });
}

function init() {
	initDesign();
	$('.modal-dialog').draggable({handle: '.modal-header'});
	
	// ctype 값이 Schedule 인 경우 dtype 값 초기화 
	$('#ctype').change(function(){
		if(this.value == 'SCHE'){
			$('#dtype').val('ALL').attr('selected', 'selected');
		}
	});
}

let tbAlignList = [
    {id: 'list0', name: 'codelevel', order: ''},
    {id: 'list1', name: 'displaycode', order: ''},
    {id: 'list2', name: 'description', order: ''},
    {id: 'list3', name: 'ctype', order: ''},
    {id: 'list4', name: 'loadstr', order: ''},
    {id: 'list5', name: 'loadrate', order: ''},
    {id: 'list6', name: 'dtype', order: ''},
    {id: 'list7', name: 'per', order: ''},
    {id: 'list8', name: 'readytime', order: ''},
    {id: 'list9', name: 'seq', order: ''},
    {id: 'list10', name: 'sametcnum', order: ''}
];

function initTbAlign(name, order) {
	scheCodeDetOrder = order;
	
    for(let i = 0; i < tbAlignList.length; i++) {
		let obj = document.getElementById(tbAlignList[i].id);
        obj.classList.remove('up', 'down');

		if(tbAlignList[i].name == name) {
			scheCodeDetSort = name;
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

    scheCodeDetSort = newName;
    scheCodeDetOrder = newOrder;

    getScheCodeDetList();
}

function getScheCodeDetList(){
	const parentUid = scheCodeUid;
	
	$.ajax({
		type: "GET",
		url: contextPath + "/mng/scheBasic/getScheCodeDetList.html",
		dataType: "json",
		headers: {
			"content-type": "application/json"
		},
		beforeSend: function() {
			$('#loading').css("display","block");
		},
		complete: function() {
			$('#loading').css('display',"none");
		},
		data: {
			isAll: 'Y',
			uid: parentUid,
			sort: scheCodeDetSort,
			order: scheCodeDetOrder
		}
	}).done(function(result, textStatus, xhr) {
		if(textStatus == "success") {
			var jsonResult = result.list;
			var text = '';
			scheCodeDetList = [];
			scheCodeDetList.push(result.list); // scheCodeDetList 배열 담기
			
			for(var i in jsonResult) {
				text +='<tr>';
				
				text +='  <td class="text-center">'+jsonResult[i].codelevel+'</td>';
				text +='  <td class="">'+jsonResult[i].displaycode+'</td>';
				text +='  <td class="">' + jsonResult[i].description + '</td>';
				text +='  <td class="text-center">' + jsonResult[i].ctypedesc + '</td>';
				text +='  <td class="text-center">' + jsonResult[i].loadstr + '</td>';
				text +='  <td class="text-center">' + getLoadRate(jsonResult[i].loadrate, true) + '</td>';
				text +='  <td class="text-center">' + jsonResult[i].dtypedesc + '</td>';
				text +='  <td class="text-right">' + getFloatVal(jsonResult[i].per) + '</td>';
				text +='  <td class="text-right">' + getFloatVal(jsonResult[i].readytime) + '</td>';
				text +='  <td class="text-center">' + getFloatVal(jsonResult[i].seq) + '</td>';
				text +='  <td class="">' + jsonResult[i].sametcnum + '</td>';
				
				text +='</tr>';
			}

			$("#getScheCodeDetList").empty();
      
			if(text == '') {
				$("#getScheCodeDetList").append('<tr><td class="text-center" colspan="11">' + $.i18n.t('share:noList') + '</td></tr>');
			}else {
				$("#getScheCodeDetList").append(text);
				
			}

		}else {
			alertPop($.i18n.t('share:tryAgain'));
		}
	}).fail(function(data, textStatus, errorThrown) {

	});
}

function scheDetRowListDownAll(){
	
	const parentUid = scheCodeUid;
	
	$.ajax({
		type: "GET",
		url: contextPath + "/mng/scheBasic/getScheCodeDetList.html",
		dataType: "json",
		headers: {
			"content-type": "application/json"
		},
		beforeSend:function() {
			$('#loading').css("display","block");
		},
		complete:function() {
			$('#loading').css('display',"none");
		},
		data:{
			isAll: 'Y',
			uid: parentUid,
			sort: scheCodeDetSort,
			order: scheCodeDetOrder
		}
	}).done(function (result, textStatus, xhr) {
		if(textStatus == "success") {
			let jsonResult = result.list;
			let text = '<thead>' +
				'<tr class="headings">' +
					'<th class="column-title border" style=""><div class="th-inner sortable both"><span>' + $.i18n.t('list.codelv') + '</span></div><div class="fht-cell"></div></th>' +
					'<th class="column-title border" style=""><div class="th-inner sortable both"><span>' + $.i18n.t('list.displaycode') + '</span></div><div class="fht-cell"></div></th>' +
					'<th class="column-title border" style=""><div class="th-inner sortable both"><span>' + $.i18n.t('list.desc') + '</span></div><div class="fht-cell"></div></th>' +
					'<th class="column-title border" style=""><div class="th-inner sortable both"><span>' + $.i18n.t('list.ctype') + '</span></div><div class="fht-cell"></div></th>' +
					'<th class="column-title border" style=""><div class="th-inner sortable both"><span>' + $.i18n.t('list.loadstr') + '</span></div><div class="fht-cell"></div></th>' +
					
					'<th class="column-title border" style=""><div class="th-inner sortable both"><span>' + $.i18n.t('list.loadrate') + '</span></div><div class="fht-cell"></div></th>' +
					'<th class="column-title border" style=""><div class="th-inner sortable both"><span>' + $.i18n.t('list.dtype') + '</span></div><div class="fht-cell"></div></th>' +					
					'<th class="column-title border" style=""><div class="th-inner sortable both"><span>' + $.i18n.t('list.per') + '</span></div><div class="fht-cell"></div></th>' +
					'<th class="column-title border" style=""><div class="th-inner sortable both"><span>' + $.i18n.t('list.readTm') + '</span></div><div class="fht-cell"></div></th>' +
					'<th class="column-title border" style=""><div class="th-inner sortable both"><span>' + $.i18n.t('list.seq') + '</span></div><div class="fht-cell"></div></th>' +
					
					'<th class="column-title border" style=""><div class="th-inner sortable both"><span>' + $.i18n.t('list.sametcnum') + '</span></div><div class="fht-cell"></div></th>' +
					
				'</tr>' +
			'</thead>' +
			'<tbody id="getScheCodeDetList">';
						
			for(let i in jsonResult) {
				text +='<tr class="even pointer">';
				
				text +='  <td class="border">'+jsonResult[i].codelevel+'</td>';
				text +='  <td class="border">'+jsonResult[i].displaycode+'</td>';
				text +='  <td class="border">' + jsonResult[i].description + '</td>';
				text +='  <td class="border">' + jsonResult[i].ctypedesc + '</td>';
				text +='  <td class="border">' + jsonResult[i].loadstr + '</td>';
				
				text +='  <td class="border">' + getLoadRate(jsonResult[i].loadrate, true) + '</td>';
				text +='  <td class="border">' + jsonResult[i].dtypedesc + '</td>';
				text +='  <td class="border">' + getFloatVal(jsonResult[i].per) + '</td>';
				text +='  <td class="border">' + getFloatVal(jsonResult[i].readytime) + '</td>';
				text +='  <td class="border">' + getFloatVal(jsonResult[i].seq) + '</td>';
				
				text +='  <td class="border">' + jsonResult[i].sametcnum + '</td>';
					        
				text +='</tr>';
			}
			
			text += '</tbody>';
						
			excelDownloadAll(text, 'ScheduleCode_Detail_List');
		} else {
			alertPop($.i18n.t('share:tryAgain'));
		}
	}).fail(function(data, textStatus, errorThrown) {
		alertPop($.i18n.t('share:tryAgain'));
	});
}



