let detailListSortName = "";
let detailListOrder = "asc";

$(function(){
	initI18n();
	init();
	setCompEvent();
	
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
			namespaces: ['share', 'mngNewVsslReqInfo'],
			defaultNs: 'mngNewVsslReqInfo'
		},
		resStore: RES_LANG
	}, function () {
		$('body').i18n();
	});
}

const init = () => {
	initDesign();
	$('.modal-dialog').draggable({handle: '.modal-header'});
	
	getVesselList()
	getVesselReqInfoDetList(); // detailList ajax function
}

const getVesselList = () => {
	jQuery.ajax({
		type: 'GET',
		url: contextPath + '/db/vessel/getVesselList.html',
		data: {
			imo: "",
			title: "",
			shipNum: ""
		},
		success: function(data) {
			const json = JSON.parse(data);
			const shipinfos = json.list
			const hullNum = document.querySelector("#hullNum")

			shipinfos.forEach(i => {
				const option = document.createElement("option")
				option.setAttribute("value", i.shipNum)
				option.setAttribute("data-uid", i.uid)
				option.innerText = i.shipNum
				if ("Y" === i.isDefault) {
					option.setAttribute("selected", "selected")
				}
				hullNum.appendChild(option)
			})

			hullNum.addEventListener("change", (e) => {
				const uid = e.target.options[e.target.selectedIndex].getAttribute("data-uid")
				const info = shipinfos.find(s => s.uid == uid)
				if (info) {
					document.querySelector("#shiptype").querySelectorAll("option").forEach(nd => {
						if(info.shipType && nd.innerText === info.shipType) {
							nd.setAttribute("selected", "selected")
						} else {
							nd.removeAttribute("selected")
						}
					})
					document.querySelector("#desc").value = info.title
				}
			})
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

const getVesselReqInfoDetList = () => {
	const parentUid = vsslReqInfoUid;

	$.ajax({
		type: "GET",
		url: contextPath + "/mng/stnd/getStndReqInfoRowList.html",
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
			$("#getVesselReqInfoDetList").empty();

			if (jsonResult.length === 0) {
				emptyData()
			} else {
				jsonResult.forEach((row) => {
					addVesselReqInfoDet(row)
				})
			}
		}else {
			alertPop($.i18n.t('share:tryAgain'));
		}
	}).fail(function(data, textStatus, errorThrown) {

	});
}

const emptyData = () => {
	if ($("#getVesselReqInfoDetList tr").length === 0) {
		$("#getVesselReqInfoDetList").html(`<tr><td class="text-center" colspan="8">${ $.i18n.t('share:noList') }</td></tr>`)
	}
}

// select box find value
const getTypeSelOption = (curStnd, type) => {
	let selbox = ''
	if (!isEmpty(type)) {
		if ("reqinfotitle" === type) {
			for (reqinfotitle of reqinfotitleList) {
				selbox += `<option value="${reqinfotitle.value}" ${curStnd && curStnd.reqinfotitle.toUpperCase() == reqinfotitle.value ? 'Selected' : ''}>${reqinfotitle.desc}</option> `;
			}
			return selbox
		}
	}
}

// 행 추가
const addVesselReqInfoDet = (row) => {

	if (row && 0 !== row.uid) {
		const text = `
            <tr data-uid="${row.uid}" data-flag="C">
                <td class="" style="width: 97px;"><input type="text" name="vsslRIDetSeq" class=" vsslRIDetSeq" value="${getFloatVal(row.seq)}" maxlength="5" oninput="this.value = this.value.replace(/[^0-9.-]/g, '').replace(/(\\..*)\\./g, '$1').replace(/(\\--*)\\-/g, '$1');"></td>
                <td class=""><select name="vsslRIDetReqInfoTitle" class=" vsslRIDetReqInfoTitle"><option value=""></option>${getTypeSelOption(row, 'reqinfotitle')}</select></td>
                <td class=""><input type="text" name="vsslRIDetItem" class=" vsslRIDetItem" value="${row.item}" maxlength="20"></td>
                <td class=""><input type="text" name="vsslRIDetUnit" class=" vsslRIDetUnit" value="${row.unit}" maxlength="10"></td>
                <td class=""><input type="text" name="vsslRIDetName" class=" vsslRIDetName" value="" maxlength="100"></td>
                <td class=""><input type="text" name="vsslRIDetRpm" class=" vsslRIDetRpm" value="" maxlength="4" oninput="this.value = this.value.replace(/[^0-9.-]/g, '').replace(/(\\..*)\\./g, '$1').replace(/(\\--*)\\-/g, '$1');"></td>
                <td class=""><input type="text" name="vsslRIDetLoadrate" class=" vsslRIDetLoadrate" value="" maxlength="4" oninput="this.value = this.value.replace(/[^0-9.-]/g, '').replace(/(\\..*)\\./g, '$1').replace(/(\\--*)\\-/g, '$1');" ${row.reqinfotitle == 'DRFTBT' ? "disabled" : ""}></td>
                <td class=" text-center pointer" onClick="delVesselReqInfoDet(this)"><i class="fa-solid fa-trash-can"></i></td>
            </tr>
        `
		$("#getVesselReqInfoDetList").append(text)
	} else {
		const len = $("#getVesselReqInfoDetList tr[data-uid]").length

		if (0 === len) $("#getVesselReqInfoDetList").empty()

		const text = `
            <tr data-uid="0" data-flag="C">
                <td class="" style="width: 97px;"><input type="text" name="vsslRIDetSeq" class=" vsslRIDetSeq" value="${len + 1}" maxlength="5" oninput="this.value = this.value.replace(/[^0-9.-]/g, '').replace(/(\\..*)\\./g, '$1').replace(/(\\--*)\\-/g, '$1');"></td>
                <td class=""><select name="vsslRIDetReqInfoTitle" class=" vsslRIDetReqInfoTitle"><option value=""></option>${getTypeSelOption(null, 'reqinfotitle')}</select></td>
                <td class=""><input type="text" name="vsslRIDetItem" class=" vsslRIDetItem" value="" maxlength="20"></td>
                <td class=""><input type="text" name="vsslRIDetUnit" class=" vsslRIDetUnit" value="" maxlength="10"></td>
                <td class=""><input type="text" name="vsslRIDetName" class=" vsslRIDetName" value="" maxlength="100"></td>
                <td class=""><input type="text" name="vsslRIDetRpm" class=" vsslRIDetRpm" value="" maxlength="4" oninput="this.value = this.value.replace(/[^0-9.-]/g, '').replace(/(\\..*)\\./g, '$1').replace(/(\\--*)\\-/g, '$1');"></td>
                <td class=""><input type="text" name="vsslRIDetLoadrate" class=" vsslRIDetLoadrate" value="" maxlength="4" oninput="this.value = this.value.replace(/[^0-9.-]/g, '').replace(/(\\..*)\\./g, '$1').replace(/(\\--*)\\-/g, '$1');"></td>
                <td class=" text-center pointer" onClick="delVesselReqInfoDet(this)"><i class="fa-solid fa-trash-can"></i></td>
            </tr>
        `

		$("#getVesselReqInfoDetList").append(text)
	}
}

const delVesselReqInfoDet = (elm) => {
	const delTr = $(elm).parent();
	if (delTr.attr('data-flag') != 'D') {
		delTr.attr('data-flag', 'D');
		delTr.find('input[type="text"], select').css('text-decoration', 'line-through');
		delTr.find('input[type="text"], select').prop('disabled', true);
	} else {
		if(getFloatVal(delTr.attr('data-uid')) > 0){
			delTr.attr('data-flag', 'R');
		} else{
			delTr.attr('data-flag', 'C');
		}

		delTr.find('input[type="text"], select').css('text-decoration', 'none');
		delTr.find('input[type="text"], select').prop('disabled', false);
	}
	refreshSeq()
}

const saveVesselReqInfo = () => {
	const obj = {}
	let isEmpty = false
	let emptyMsg = ""

	const hullNum = $("#hullNum").val()
	const desc = $("#desc").val()
	const shiptype = $("#shiptype").val()
	const status = $("#status").val()

	if (!hullNum || !shiptype || !status) {
		alertPop($.i18n.t('requiredMain'))
		return false
	}

	$(`#getVesselReqInfoDetList tr[data-uid]`).each((i, e) => {
		const flag = $(e).attr("data-flag")
		const uid = $(e).attr("data-uid")
		const seq = $(e).find(`input[name="vsslRIDetSeq"]`).val()
		const reqinfotitle = $(e).find(`select[name="vsslRIDetReqInfoTitle"]`).val()
		const item = $(e).find(`input[name="vsslRIDetItem"]`).val()
		const unit = $(e).find(`input[name="vsslRIDetUnit"]`).val()
		const name = $(e).find(`input[name="vsslRIDetName"]`).val()
		const rpm = $(e).find(`input[name="vsslRIDetRpm"]`).val()
		const loadrate = $(e).find(`input[name="vsslRIDetLoadrate"]`).val()

		if ("D" === flag && "0" === uid) {

		} else {
			if("D" !== flag && (!reqinfotitle || !item || !seq)) {
				emptyMsg = $.i18n.t('requiredRow').replace('{0}',getFloatVal(i + 1));
				isEmpty = true
				return false
			}

			obj[`params[${i}].flag`] = flag
			obj[`params[${i}].uid`] = uid
			obj[`params[${i}].seq`] = seq
			obj[`params[${i}].reqinfotitle`] = reqinfotitle
			obj[`params[${i}].item`] = item
			obj[`params[${i}].unit`] = unit
			obj[`params[${i}].name`] = name
			obj[`params[${i}].rpm`] = rpm
			obj[`params[${i}].loadrate`] = loadrate
		}
	})

	if (isEmpty == false) {
		obj['uid'] = 0
		obj['hullNum'] = hullNum
		obj['shiptype'] = shiptype
		obj['description'] = desc
		obj['status'] = status

		obj['registerdowner'] = $("#registerdowner").val()
		obj['grosstonnage'] = $("#grosstonnage").val()
		obj['drawn'] = $("#drawn").val()
		obj['checked'] = $("#checked").val()
		obj['manager'] = $("#managerIpt").val()


		$.ajax({
			type: "POST",
			url: contextPath + "/mng/vssl/insertVesselReqInfo.html",
			traditional: true,
			dataType: 'json',
			contentType: "application/x-www-form-urlencoded; charset=UTF-8;",
			beforeSend: function() {
				$('#loading').css("display","block");
			},
			complete: function() {
				$('#loading').css('display',"none");
			},
			data: obj
		}).done((result, textStatus, xhr) => {
			if(textStatus == "success") {
				alertPop($.i18n.t('compNew'));

				$('#hullNum').val('');
				$('#shiptype option:eq(0)').prop("selected", true);
				$('#desc').val('');
				$('#status option:eq(0)').prop("selected", true);

				$("#registerdowner").val('')
				$("#grosstonnage").val('')
				$("#drawn").val('')
				$("#checked").val('')
				$("#managerIpt").val('')

			}else {
				alertPop($.i18n.t('share:tryAgain'));
			}
		}).fail((data, textStatus, errorThrown) => {
			// console.log(data, textStatus, errorThrown)
		});
	} else {
		alertPop(emptyMsg);
	}
}

// 컴포넌트 및 이벤트 추가
const setCompEvent = () => {

	// 순서 변경 컴포넌트 이벤트 설정
	setSeqEvent('input[name="vsslRIDetSeq"]');

	// Table 행 Drag & Drop 설정
	$('#getVesselReqInfoDetList').sortable({
		axis: "y",
		start: function(event, ui){
		},
		update: function(event, ui){
			console.log('getVesselReqInfoDetList.sortable.update START');

			console.log('getVesselReqInfoDetList.sortable.update END');
		},
		stop: function(event, ui){
			console.log('getVesselReqInfoDetList.sortable.stop START');
			// 전체 Seq 재설정
			console.log(event, ui)
			refreshSeq();
			console.log('getVesselReqInfoDetList.sortable.stop END');
		}
	});
	
	// Title이 Draft : Ballast 인 경우 그래프 읽기전용 처리
	setVesselReqinfoTitleEvent('select[name="vsslRIDetReqInfoTitle"]');
}

const refreshSeq = () => {
	$('#getVesselReqInfoDetList tr[data-flag!="D"]').each((i, e) => {
		$(e).find("input[name='vsslRIDetSeq']").val(i + 1)
	})
}

const setSeqEvent = (selStr) => {
	$('#getVesselReqInfoDetList').on('change', selStr, (e) => {

		let keys = Array.from(Array($('#getVesselReqInfoDetList tr[data-flag!="D"]').length).keys())
		keys = keys.map(x => x + 1);
		const findIndex = keys.findIndex(o => o == e.target.value)
		keys.splice(findIndex, 1)
		let ii = 0
		$('#getVesselReqInfoDetList tr[data-flag!="D"]').each((i, elm) => {
			const other = elm.querySelector("input[name='vsslRIDetSeq']")
			if (e.target !== other) {
				other.value = keys[ii]
				ii++
			}
		})

		let table, rows, switching, i, x, y, shouldSwitch;
		table = document.querySelector("#tbModVesselReqInfoDetList");
		switching = true;
		while (switching) {
			switching = false;
			rows = table.rows;
			for (i = 1; i < (rows.length - 1); i++) {
				shouldSwitch = false;

				x = rows[i].querySelector("input[name='vsslRIDetSeq']").value;
				y = rows[i + 1].querySelector("input[name='vsslRIDetSeq']").value;

				if (parseInt(x) > parseInt(y)) {
					shouldSwitch = true;
					break;
				}
			}
			if (shouldSwitch) {
				rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
				switching = true;
			}
		}

		refreshSeq()
	});
}

//Title이 Draft : Ballast 인 경우 그래프 읽기전용 처리
const setVesselReqinfoTitleEvent = (selStr) => {
	$('#getVesselReqInfoDetList').on('change', selStr, function(e){
		const elm = $(this);
		
		elm.closest('tr').children().find('input[name="vsslRIDetLoadrate"]').val('');
		elm.closest('tr').children().find('input[name="vsslRIDetLoadrate"]').attr('disabled', elm.val() == 'DRFTBT' ? true : false)
	});
}