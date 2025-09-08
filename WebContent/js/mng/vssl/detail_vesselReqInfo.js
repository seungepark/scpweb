let detailList = []; // vessel req info detail rows
let detailListSortName = "";
let detailListOrder = "asc";

$(() => {
	initI18n();
	init();
	
	getVesselReqInfoDetList(); // detailList ajax function
	initServerCheck();
	autocompleteOff();
});

const initI18n = () => {
	const lang = initLang();

    $.i18n.init({
    	lng: lang,
    	fallbackLng: FALLBACK_LNG,
    	fallbackOnNull: false,
    	fallbackOnEmpty: false,
    	useLocalStorage: false,
    	ns: {
    		namespaces: ['share', 'mngDetVsslReqInfo'],
    		defaultNs: 'mngDetVsslReqInfo'
    	},
    	resStore: RES_LANG
	}, function () {
		$('body').i18n();
    });
}

const init = () => {
	initDesign();
	$('.modal-dialog').draggable({handle: '.modal-header'});
}

let tbAlignList = [
    {id: 'list0', name: 'seq', order: ''},
    {id: 'list1', name: 'reqinfotitle', order: ''},
    {id: 'list2', name: 'item', order: ''},
    {id: 'list3', name: 'unit', order: ''},
    {id: 'list4', name: 'name', order: ''},
    {id: 'list5', name: 'rpm', order: ''},
    {id: 'list6', name: 'loadrate', order: ''}
];

function initTbAlign(name, order) {
	detailListOrder = order;
	
    for(let i = 0; i < tbAlignList.length; i++) {
		let obj = document.getElementById(tbAlignList[i].id);
        obj.classList.remove('up', 'down');

		if(tbAlignList[i].name == name) {
			detailListSortName = name;
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

    detailListSortName = newName;
    detailListOrder = newOrder;

    getVesselReqInfoDetList();
}

const getVesselReqInfoDetList = () => {
	const parentUid = vsslReqInfoUid;
	
	$.ajax({
		type: "GET",
		url: contextPath + "/mng/vssl/getVesselReqInfoDetList.html",
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
			sort: detailListSortName,
			order: detailListOrder
		}
	}).done(function(result, textStatus, xhr) {
		if(textStatus == "success") {
			const jsonResult = result.list;
			let text = '';
			detailList = [];
			detailList.push(result.list); // detailList 배열 담기

			jsonResult.forEach((e) => {
				text += `<tr>
					<td class="text-center">${ getFloatVal(e.seq) }</td>
					<td class="">${ getReqInfoTitleDesc(e.reqinfotitle) }</td>
					<td class="">${ e.item }</td>
					<td class="text-center">${ e.unit }</td>
					<td class="text-center">${ e.name }</td>
					<td class="text-right">${ e.rpm }</td>
					<td class="text-right">${ getLoadRate(e.loadrate, true) }</td>
				</tr>
				`
			})

			$("#getVesselReqInfoDetList").empty();
      
			if(text == '') {
				$("#getVesselReqInfoDetList").append('<tr><td class="text-center" colspan="7">' + $.i18n.t('share:noList') + '</td></tr>');
			}else {
				$("#getVesselReqInfoDetList").append(text);
				
			}

		}else {
			alertPop($.i18n.t('share:tryAgain'));
		}
	}).fail(function(data, textStatus, errorThrown) {

	});
}

const getReqInfoTitleDesc = (val) => {
	const obj = reqinfotitleList.find(f => f.value === val)

	if (obj && obj.desc) return obj.desc
	return ""
}

const scheDetRowListDownAll = () => {
	
	const parentUid = vsslReqInfoUid;
	
	$.ajax({
		type: "GET",
		url: contextPath + "/mng/vssl/getVesselReqInfoDetList.html",
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
			sort: detailListSortName,
			order: detailListOrder
		}
	}).done(function (result, textStatus, xhr) {
		if(textStatus == "success") {
			const jsonResult = result.list;
			let text = `<thead>
				<th class="column-title border" style=""><div class="th-inner sortable both"><span>${ $.i18n.t('list.codelv') }</span></div><div class="fht-cell"></div></th>
				<th class="column-title border" style=""><div class="th-inner sortable both"><span>${ $.i18n.t('list.codelv') }</span></div><div class="fht-cell"></div></th>
				<th class="column-title border" style=""><div class="th-inner sortable both"><span>${ $.i18n.t('list.codelv') }</span></div><div class="fht-cell"></div></th>
				<th class="column-title border" style=""><div class="th-inner sortable both"><span>${ $.i18n.t('list.codelv') }</span></div><div class="fht-cell"></div></th>
				<th class="column-title border" style=""><div class="th-inner sortable both"><span>${ $.i18n.t('list.codelv') }</span></div><div class="fht-cell"></div></th>

				<th class="column-title border" style=""><div class="th-inner sortable both"><span>${ $.i18n.t('list.codelv') }</span></div><div class="fht-cell"></div></th>
				<th class="column-title border" style=""><div class="th-inner sortable both"><span>${ $.i18n.t('list.codelv') }</span></div><div class="fht-cell"></div></th>
			</thead>
			<tbody id="getVesselReqInfoDetList">
			`

			jsonResult.forEach(e => {
				text += `<tr class="even border">
					<td class="border">${ getFloatVal(e.seq) }</td>
					<td class="border">${ getReqInfoTitleDesc(e.reqinfotitle) }</td>
					<td class="border">${ e.item }</td>
					<td class="border">${ e.unit }</td>
					<td class="border">${ e.name }</td>
					<td class="border">${ e.rpm }</td>
					<td class="border">${ getLoadRate(e.loadrate, true) }</td>
				</tr>
				`
			})

			text += '</tbody>';
						
			excelDownloadAll(text, 'VesselReqInfo_Detail_List');
		} else {
			alertPop($.i18n.t('share:tryAgain'));
		}
	}).fail(function(data, textStatus, errorThrown) {
		alertPop($.i18n.t('share:tryAgain'));
	});
}



