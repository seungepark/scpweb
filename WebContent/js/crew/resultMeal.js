let _anchCnt = 0;
let _inDate = "";
let _outDate = "";
let _tbRowId = 0;
let listArr = [];
let listSort = "";
let listOrder = "desc";
let _isSetSort = false;
let _isSetPage = false;

const MEAL_I18N_KEYS = ['list.breakfast', 'list.lunch', 'list.dinner', 'list.lateNight'];
const MEAL_FALLBACK_LABELS = ['조식', '중식', '석식', '야식'];
const INTERNAL_MEALS = ['조식', '중식', '석식', '야식'];
const MEAL_ATTR_CODES = ['B', 'L', 'D', 'N'];

const BASE_COLUMN_WIDTHS = [140, 140, 90, 90];
const MEAL_COLUMN_WIDTH = 80;
const MIN_TABLE_BODY_HEIGHT = 240;
const VISIBLE_BODY_ROWS = 4;
const BODY_ROW_HEIGHT = 56;
const SHIP_AUTOCOMPLETE_MIN_LENGTH = 4;

function t(key, fallback) {
	let value;
	try {
		value = $.i18n.t(key);
	} catch (e) {
		value = key;
	}
	if (!value || value === key) {
		return fallback;
	}
	return value;
}

function escapeHtml(value) {
	if (value === null || value === undefined) return '';
	return String(value)
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;')
		.replace(/'/g, '&#39;');
}

function escapeAttr(value) {
	return escapeHtml(value).replace(/`/g, '&#96;');
}

function getDateRangeValues() {
	let startDate = ($('#inDate').val() || '').trim();
	let endDate = ($('#outDate').val() || '').trim();

	const today = new Date();
	const todayStr = today.toISOString().slice(0, 10);

	if (!startDate) {
		startDate = todayStr;
		$('#inDate').val(startDate);
	}
	if (!endDate) {
		endDate = todayStr;
		$('#outDate').val(endDate);
	}

	if (startDate > endDate) {
		const temp = startDate;
		startDate = endDate;
		endDate = temp;
		$('#inDate').val(startDate);
		$('#outDate').val(endDate);
	}
	return { startDate, endDate };
}

function buildDateRange(startDate, endDate) {
	if (!startDate || !endDate) return [];
	let current = new Date(startDate);
	const end = new Date(endDate);
	if (isNaN(current.getTime()) || isNaN(end.getTime())) {
		return [];
	}
	const result = [];
	while (current.getTime() <= end.getTime()) {
		result.push(current.toISOString().slice(0, 10));
		current.setDate(current.getDate() + 1);
	}
	return result;
}

function getMealDisplayMap() {
	const displayMap = {};
	for (let i = 0; i < INTERNAL_MEALS.length; i++) {
		const label = t(MEAL_I18N_KEYS[i], MEAL_FALLBACK_LABELS[i]);
		displayMap[INTERNAL_MEALS[i]] = label;
	}
	return displayMap;
}

function getCuisineInfos() {
	return [
		{ code: 'K', label: t('list.foodStyleK', '한식') },
		{ code: 'W', label: t('list.foodStyleW', '양식') }
	];
}

function getTypeInfos() {
	return [
		{ code: 'plan', label: t('list.plan', '발주') },
		{ code: 'result', label: t('list.result', '실적') }
	];
}

function normalizeCuisine(value) {
	if (value === null || value === undefined) return null;
	const upper = String(value).trim().toUpperCase();
	if (upper === 'K' || upper === '한식') return 'K';
	if (upper === 'W' || upper === '양식') return 'W';
	return null;
}

const MEAL_NORMALIZE_MAP = {
	'B': '조식',
	'BREAKFAST': '조식',
	'조식': '조식',
	'L': '중식',
	'LUNCH': '중식',
	'중식': '중식',
	'D': '석식',
	'DINNER': '석식',
	'석식': '석식',
	'N': '야식',
	'NIGHT': '야식',
	'LATE_NIGHT': '야식',
	'야식': '야식'
};

function normalizeMeal(value) {
	if (value === null || value === undefined) return null;
	const key = String(value).trim().toUpperCase();
	return MEAL_NORMALIZE_MAP[key] || MEAL_NORMALIZE_MAP[value] || null;
}

function normalizeDate(value) {
	if (!value) return null;
	const str = String(value).trim();
	if (!str) return null;
	return str.slice(0, 10);
}

function isDateWithinRange(date, startDate, endDate) {
	if (!date) return false;
	if (startDate && date < startDate) return false;
	if (endDate && date > endDate) return false;
	return true;
}

function toNumber(value) {
	if (value === null || value === undefined || value === '') return 0;
	const num = Number(value);
	return isNaN(num) ? 0 : num;
}

function createZeroMealMap() {
	const map = {};
	INTERNAL_MEALS.forEach(meal => {
		map[meal] = 0;
	});
	return map;
}

function addMealValue(container, type, cuisine, date, meal, qty) {
	if (!container[type]) container[type] = {};
	if (!container[type][cuisine]) container[type][cuisine] = {};
	if (!container[type][cuisine][date]) container[type][cuisine][date] = createZeroMealMap();
	container[type][cuisine][date][meal] += qty;
}

function createShipBucket() {
	return {
		departments: {},
		departmentOrder: [],
		total: {}
	};
}

function buildDataset(list, startDate, endDate) {
	const dataset = { shipOrder: [], ships: {} };
	(list || []).forEach(item => {
		const ship = (item.projNo || '').trim() || '-';
		const dept = (item.department || '').trim() || t('anchorageMeal.department.unknown', '기타');
		if (!dataset.ships[ship]) {
			dataset.ships[ship] = createShipBucket();
			dataset.shipOrder.push(ship);
		}
		const shipBucket = dataset.ships[ship];
		if (!shipBucket.departments[dept]) {
			shipBucket.departments[dept] = {};
			shipBucket.departmentOrder.push(dept);
		}
		processMealEntries(shipBucket.departments[dept], item.planList, 'plan', startDate, endDate);
		processMealEntries(shipBucket.departments[dept], item.resultList, 'result', startDate, endDate);
		processMealEntries(shipBucket.total, item.planList, 'plan', startDate, endDate);
		processMealEntries(shipBucket.total, item.resultList, 'result', startDate, endDate);
	});
	return dataset;
}

function processMealEntries(target, list, type, startDate, endDate) {
	if (!Array.isArray(list)) return;
	list.forEach(entry => {
		const cuisine = normalizeCuisine(entry.planMealGubun || entry.resultMealGubun || entry.mealGubun);
		if (!cuisine) return;
		const rawDate = entry.planMealDate || entry.resultMealDate || entry.mealDate;
		const date = normalizeDate(rawDate);
		if (!isDateWithinRange(date, startDate, endDate)) return;
		const meal = normalizeMeal(entry.planMealTime || entry.resultMealTime || entry.mealTime);
		if (!meal) return;
		const qty = toNumber(entry.planMealQty || entry.resultMealQty || entry.mealQty);
		addMealValue(target, type, cuisine, date, meal, qty);
	});
}

function computeTotals(aggregation, dateRange) {
	const totals = createZeroMealMap();
	dateRange.forEach(date => {
		const daily = aggregation[date];
		if (daily) {
			INTERNAL_MEALS.forEach(meal => {
				const value = toNumber(daily[meal]);
				totals[meal] += value;
			});
		}
	});
	return totals;
}

function formatNumericValue(value) {
	const num = toNumber(value);
	return num === 0 ? '' : num.toString();
}

function buildMealTableHeader(dateRange, mealDisplayMap) {
	const baseHeaderInfos = [
		{ label: t('anchorageMeal.ship', '호선'), className: 'ship-header' },
		{ label: t('list.department', '부서'), className: 'dept-header' },
		{ label: t('list.kind', '구분'), className: 'type-header' },
		{ label: t('anchorageMeal.cuisine', '한/양'), className: 'cuisine-header' }
	];
	let topRow = baseHeaderInfos
		.map(info => `<th rowspan="2" class="text-center ${info.className}">${escapeHtml(info.label)}</th>`)
		.join('');

	const mealSubHeaderCells = INTERNAL_MEALS
		.map(meal => `<th class="meal-sub-header">${escapeHtml(mealDisplayMap[meal])}</th>`)
		.join('');

	topRow += `<th colspan="${INTERNAL_MEALS.length}" class="meal-header total-header">${escapeHtml(t('anchorageMeal.total', 'Total'))}</th>`;
	let subRow = mealSubHeaderCells;

	dateRange.forEach(date => {
		topRow += `<th colspan="${INTERNAL_MEALS.length}" class="meal-header">${escapeHtml(formatDisplayDate(date))}</th>`;
		subRow += mealSubHeaderCells;
	});

	return `<tr>${topRow}</tr><tr>${subRow}</tr>`;
}

function formatDisplayDate(dateStr) {
	if (!dateStr) return '';
	return dateStr.replace(/-/g, '/');
}

function buildMealTableBody(dataset, dateRange, mealDisplayMap) {
	const typeInfos = getTypeInfos();
	const cuisineInfos = getCuisineInfos();
	const mealOrder = INTERNAL_MEALS.slice();
	const totalLabel = t('anchorageMeal.total', 'Total');
	const rows = [];
	let hasData = false;

	const renderValueCell = (value, context) => {
		const text = formatNumericValue(value);
		const attrs = context
			? Object.entries(context)
				.filter(([, val]) => val !== undefined && val !== null)
				.map(([key, val]) => ` data-${key}="${escapeAttr(val)}"`)
				.join('')
			: '';
		return `<td class="meal-cell"${attrs}>${escapeHtml(text)}</td>`;
	};

	dataset.shipOrder.forEach(ship => {
		const shipBucket = dataset.ships[ship];
		const departments = [totalLabel, ...shipBucket.departmentOrder];
		const shipRowSpan = departments.length * typeInfos.length * cuisineInfos.length;
		let shipCellRendered = false;

		departments.forEach(dept => {
			const isTotal = dept === totalLabel;
			const deptBucket = isTotal ? shipBucket.total : (shipBucket.departments[dept] || {});
			const deptRowSpan = typeInfos.length * cuisineInfos.length;
			let deptCellRendered = false;

			typeInfos.forEach(typeInfo => {
				let typeCellRendered = false;
				cuisineInfos.forEach(cuisineInfo => {
					hasData = true;
					const aggregation = (deptBucket[typeInfo.code] && deptBucket[typeInfo.code][cuisineInfo.code]) || {};
					const totals = computeTotals(aggregation, dateRange);
					let rowHtml = '<tr' + (isTotal ? ' class="total-row"' : '') + '>';

					if (!shipCellRendered) {
						rowHtml += `<td rowspan="${shipRowSpan}" class="ship-cell">${escapeHtml(ship)}</td>`;
						shipCellRendered = true;
					}

					if (!deptCellRendered) {
						rowHtml += `<td rowspan="${deptRowSpan}" class="group-cell${isTotal ? ' total-row' : ''}">${escapeHtml(dept)}</td>`;
						deptCellRendered = true;
					}

					if (!typeCellRendered) {
						rowHtml += `<td rowspan="${cuisineInfos.length}" class="type-cell">${escapeHtml(typeInfo.label)}</td>`;
						typeCellRendered = true;
					}

					rowHtml += `<td class="cuisine-cell">${escapeHtml(cuisineInfo.label)}</td>`;

					mealOrder.forEach((meal, idx) => {
						const mealCode = MEAL_ATTR_CODES[idx] || meal;
						rowHtml += renderValueCell(totals[meal], {
							ship,
							'ship-label': ship,
							dept: isTotal ? '__TOTAL__' : dept,
							'dept-label': dept,
							type: typeInfo.code,
							'type-label': typeInfo.label,
							cuisine: cuisineInfo.code,
							'cuisine-label': cuisineInfo.label,
							date: 'TOTAL',
							'date-label': totalLabel,
							meal: mealCode,
							'meal-label': mealDisplayMap[meal]
						});
					});

					dateRange.forEach(date => {
						const daily = aggregation[date] || {};
						mealOrder.forEach((meal, idx) => {
							const mealCode = MEAL_ATTR_CODES[idx] || meal;
							rowHtml += renderValueCell(daily[meal], {
								ship,
								'ship-label': ship,
								dept: isTotal ? '__TOTAL__' : dept,
								'dept-label': dept,
								type: typeInfo.code,
								'type-label': typeInfo.label,
								cuisine: cuisineInfo.code,
								'cuisine-label': cuisineInfo.label,
								date,
								'date-label': formatDisplayDate(date),
								meal: mealCode,
								'meal-label': mealDisplayMap[meal]
							});
						});
					});

					rowHtml += '</tr>';
					rows.push(rowHtml);
				});
			});
		});
	});

	if (!hasData) {
		const emptyColspan = 4 + (dateRange.length + 1) * INTERNAL_MEALS.length;
		return `<tr><td class="text-center" colspan="${emptyColspan}">${escapeHtml(t('share:noList', '데이터가 없습니다'))}</td></tr>`;
	}

	return rows.join('');
}

function buildMealTableHtml(list, startDate, endDate) {
	const dateRange = buildDateRange(startDate, endDate);
	const mealDisplayMap = getMealDisplayMap();
	const dataset = buildDataset(list, startDate, endDate);
	return {
		headerHtml: buildMealTableHeader(dateRange, mealDisplayMap),
		bodyHtml: buildMealTableBody(dataset, dateRange, mealDisplayMap),
		dataset,
		dateRange,
		mealDisplayMap
	};
}

/*function updateTableColumnWidths(dateRange) {
	const cols = [];
	BASE_COLUMN_WIDTHS.forEach(width => cols.push(`<col style="width:${width}px">`));
	const groupCount = (dateRange.length + 1) * INTERNAL_MEALS.length;
	for (let i = 0; i < groupCount; i++) {
		cols.push(`<col style="width:${MEAL_COLUMN_WIDTH}px">`);
	}
	$('#tbList colgroup').remove();
	$('#tbList').prepend(`<colgroup>${cols.join('')}</colgroup>`);

	const baseWidth = BASE_COLUMN_WIDTHS.reduce((sum, width) => sum + width, 0);
	const totalWidth = baseWidth + groupCount * MEAL_COLUMN_WIDTH;
	$('#tbList').css('width', totalWidth + 'px');
}
*/

/*function updateTableColumnWidths(dateRange) {
	const cols = [];
	// 기본 컬럼: 호선, 부서, 구분, 한/양
	BASE_COLUMN_WIDTHS.forEach(width => cols.push(`<col style="width:${width}px">`));
	
	// Total 그룹의 식사 컬럼들
	for (let i = 0; i < INTERNAL_MEALS.length; i++) {
		cols.push(`<col style="width:${MEAL_COLUMN_WIDTH}px">`);
	}
	
	// 각 날짜별 식사 컬럼들
	dateRange.forEach(() => {
		for (let i = 0; i < INTERNAL_MEALS.length; i++) {
			cols.push(`<col style="width:${MEAL_COLUMN_WIDTH}px">`);
		}
	});
	
	$('#tbList colgroup').remove();
	$('#tbList').prepend(`<colgroup>${cols.join('')}</colgroup>`);

	const baseWidth = BASE_COLUMN_WIDTHS.reduce((sum, width) => sum + width, 0);
	const totalWidth = baseWidth + (dateRange.length + 1) * INTERNAL_MEALS.length * MEAL_COLUMN_WIDTH;
	$('#tbList').css('width', totalWidth + 'px');
}*/

function updateTableColumnWidths(dateRange) {
	const cols = [];
	// 기본 컬럼: 호선, 부서, 구분, 한/양
	BASE_COLUMN_WIDTHS.forEach(width => cols.push(`<col style="width:${width}px">`));
	
	// Total 그룹의 식사 컬럼들
	for (let i = 0; i < INTERNAL_MEALS.length; i++) {
		cols.push(`<col style="width:${MEAL_COLUMN_WIDTH}px">`);
	}
	
	// 각 날짜별 식사 컬럼들
	dateRange.forEach(() => {
		for (let i = 0; i < INTERNAL_MEALS.length; i++) {
			cols.push(`<col style="width:${MEAL_COLUMN_WIDTH}px">`);
		}
	});
	
	$('#tbList colgroup').remove();
	$('#tbList').prepend(`<colgroup>${cols.join('')}</colgroup>`);

	const baseWidth = BASE_COLUMN_WIDTHS.reduce((sum, width) => sum + width, 0);
	const totalWidth = baseWidth + (dateRange.length + 1) * INTERNAL_MEALS.length * MEAL_COLUMN_WIDTH;
	$('#tbList').css('width', totalWidth + 'px');
}

function renderMealTableForList(list) {
	const { startDate, endDate } = getDateRangeValues();
	const table = buildMealTableHtml(list, startDate, endDate);
	updateTableColumnWidths(table.dateRange);
	$('#tbHeader').html(table.headerHtml);
	$('#tbRowList').html(table.bodyHtml);

	requestAnimationFrame(() => {
		rebindStickyHeader();
		adjustResultTableHeight();
	});

	window.mealTableState = {
		dataset: table.dataset,
		dateRange: table.dateRange,
		mealDisplayMap: table.mealDisplayMap
	};
}

$(function(){
    initI18n();
    init();

    initServerCheck();
    autocompleteOff();
	
	buildShipAutoSourceBaseFromDOM();
	setSearchOption();
	$(window).on('resize', () => {
		rebindStickyHeader();
		adjustResultTableHeight();
	});
	initShipAutocomplete();
	updateShipAutocompleteSource();
});

function initI18n() {
    let lang = initLang();	

    $.i18n.init({
        lng: lang,
        fallbackLng: FALLBACK_LNG,
        fallbackOnNull: false,
        fallbackOnEmpty: false,
        useLocalStorage: false,
        ns: {
            namespaces: ['share', 'anchorageMeal'],
            defaultNs: 'anchorageMeal'
        },
        resStore: RES_LANG
    }, function() {
        $('body').i18n();
    });
}

function init() {
	initDesign();
	renderMealTableForList(_anchList);
	
	$('#filterWord').keypress(function(e) {
		if(e.keyCode === 13) {
			searchList();
		}
	});
	
	$('#shipInput').keypress(function(e) {
		if(e.keyCode === 13) {
			e.preventDefault();
			deriveShipValueFromInput();
			getAnchMealList();
		}
	});
}

function saveSearchOption() {
	const shipValue = deriveShipValueFromInput();
    setSearchCookie('SK_PAGE', crewPageNo);

    setSearchCookie('SK_SORTNM', listSort);
    setSearchCookie('SK_SORTOD', listOrder);

    setSearchCookie('SK_SHIP', shipValue);
}

//체크박스 전환
function setCheckBox(input) {
    if (input.checked) {
        input.value = "Y";
    } else {
        input.value = "N";
    }
}

//검색 옵션
function setSearchOption() {
	let page = getSearchCookie('SK_PAGE');	
  	let ship = getSearchCookie('SK_SHIP');
	
	let sortNm = getSearchCookie('SK_SORTNM');
	let sortOd = getSearchCookie('SK_SORTOD');
  	
  	if(ship != '') {
		const label = getShipDescription(ship) || (ship === 'ALL' ? '' : ship);
  		setShipValue(ship, label);
  	} else {
		setShipValue('', '');
	}
	updateShipAutocompleteSource();
	
	// 오늘 날짜 기본값 세팅
	let today = new Date();
	today.setDate(today.getDate());
	let todayStr = today.toISOString().slice(0, 10);
	
	let endDate = new Date();
	endDate.setDate(endDate.getDate());
	let endDateStr = endDate.toISOString().slice(0, 10);

	if (!$('#inDate').val() || $('#inDate').val() === '') {
		$('#inDate').val(todayStr);
	}
	if (!$('#outDate').val() || $('#outDate').val() === '') {
		$('#outDate').val(endDateStr);
	}

	if(page != '') {
		_isSetPage = true;
		anchPageNo = page;
	}
	
	if(sortNm != '' && sortOd != '') {
		_isSetSort = true;
		initTbAlign(sortNm, sortOd);
	}
}

// 앵카링 식사신청 목록 해더 세팅.
function initTableHeader() {}

// 기존 데이터 세팅.
function initData() {}


// 목록 없음 확인.
function setListEmpty() {
	const { startDate, endDate } = getDateRangeValues();
	const table = buildMealTableHtml([], startDate, endDate);
	updateTableColumnWidths(table.dateRange);
	$('#tbHeader').html(table.headerHtml);
	$('#tbRowList').html(table.bodyHtml);
	requestAnimationFrame(() => {
		rebindStickyHeader();
		adjustResultTableHeight();
		updateShipAutocompleteSource();
	});
}

// 식사신청 리스트 조회
function getAnchMealList() {
	let projNo = deriveShipValueFromInput();
	let inDate = $('#inDate').val();
	let outDate = $('#outDate').val();
	
	if(isValidDate(inDate) && isValidDate(outDate)) {
		getMealResultList(1);
	}
	else {
		getMealResultList(1);
	}
}

function getMealResultList(page) {
    var ship = deriveShipValueFromInput();
    var inDate = $('#inDate').val();
    var outDate = $('#outDate').val();
	
	//in/out Date 하나만 입력시 메시지	
	if((outDate != '' && inDate =='')){
		alertPop($.i18n.t('종료일을 입력해주세요.'));
		return;
	}
	if((inDate != '' && outDate =='')){
		alertPop($.i18n.t('시작일을 입력해주세요.'));
		return;
	}	
	
	let startDate = new Date(inDate);
	let endDate = new Date(outDate);
	
	//페이지 셋팅(현재페이지 저장X)
	_isSetPage = false;
	page = 1;
	
    jQuery.ajax({
        type: 'GET',
        url: contextPath + '/crew/getMealResultList.html',		
        data: {
            page: page,
            ship: ship,
            inDate: inDate,
            outDate: outDate,
            sort: listSort,
            order: listOrder
        },
        success: function(data) {
			try {
            var json = JSON.parse(data);
				_anchList = json.list || [];
				renderMealTableForList(_anchList);
			} catch (error) {
				console.error('Failed to render meal result list', error);
			$('#tbHeader').empty();
				$('#tbRowList').html('<tr><td class="text-center" colspan="'+ (4 + (buildDateRange(getDateRangeValues().startDate, getDateRangeValues().endDate).length + 1) * INTERNAL_MEALS.length) +'">'+ escapeHtml(t('share:tryAgain', '다시 시도해 주세요')) +'</td></tr>');
				requestAnimationFrame(() => {
					rebindStickyHeader();
					adjustResultTableHeight();
				});
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
			requestAnimationFrame(() => {
				rebindStickyHeader();
				adjustResultTableHeight();
			});
        }
    });
}

//엑셀 다운로드
function anchListDownloadAll() {
	var search = $("#search").val();
	var _cnt = 0;
	
	var ship = deriveShipValueFromInput();
	var inDate = $('#inDate').val();
	var outDate = $('#outDate').val();

	let start = new Date(inDate);
	let end = new Date(outDate);

	$.ajax({
		type : "GET",
		url : contextPath + "/crew/getMealResultList.html",
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
	        ship: ship,
	        inDate: inDate,
	        outDate: outDate,
            sort: listSort,
            order: listOrder
		}
	}).done(function(result, textStatus, xhr) {
		if(textStatus == "success") {
			const list = result.list || [];
			const table = buildMealTableHtml(list, inDate, outDate, { asText: true });
			const tableHtml = '<thead>' + table.headerHtml + '</thead><tbody>' + table.bodyHtml + '</tbody>';
			excelDownloadAll(tableHtml, 'anch_Result_list');
		}else {
			alertPop($.i18n.t('share:tryAgain'));
		}
	}).fail(function(data, textStatus, errorThrown) {
		alertPop($.i18n.t('share:tryAgain'));
	});
}
	
function adjustResultTableHeight() {
	const wrap = document.querySelector('.tb-wrap.table_fixed_head');
	if (!wrap) return;

	const thead = wrap.querySelector('thead');
	const firstRow = thead && thead.rows.length > 0 ? thead.rows[0] : null;
	const firstRowHeight = firstRow ? firstRow.getBoundingClientRect().height || firstRow.offsetHeight : 0;
	const headerHeight = thead ? thead.getBoundingClientRect().height || thead.offsetHeight : firstRowHeight;

	if (firstRowHeight) {
		document.documentElement.style.setProperty('--crew-result-header-row-height', `${firstRowHeight}px`);
	}

	const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
	const rect = wrap.getBoundingClientRect();
	const bodyHeight = Math.max(MIN_TABLE_BODY_HEIGHT, VISIBLE_BODY_ROWS * BODY_ROW_HEIGHT);
	const maxHeight = Math.max(headerHeight + bodyHeight, viewportHeight - rect.top - 40);

	wrap.style.maxHeight = `${maxHeight}px`;
}

function rebindStickyHeader() {
	const table = document.querySelector('#tbList');
	const thead = table ? table.querySelector('thead') : null;
	const wrap = table ? table.closest('.tb-wrap.table_fixed_head') : null;
	if (!table || !thead || !wrap) return;

	const rows = Array.from(thead.rows);
	let offset = 0;
	rows.forEach((row, index) => {
		const height = row.getBoundingClientRect().height || row.offsetHeight || 0;
		Array.from(row.cells).forEach(cell => {
			cell.style.position = 'sticky';
			cell.style.top = `${offset}px`;
			cell.style.zIndex = 5 + (rows.length - index);
			cell.style.background = '#e3e6ef';
		});
		offset += height;
	});

	const firstRowHeight = rows.length > 0 ? (rows[0].getBoundingClientRect().height || rows[0].offsetHeight || 0) : 0;
	if (firstRowHeight) {
		document.documentElement.style.setProperty('--crew-result-header-row-height', `${firstRowHeight}px`);
	}
}

function buildShipAutoSourceBaseFromDOM() {
	const options = document.querySelectorAll('#shipSource option');
	const base = [];
	options.forEach(option => {
		if (!option) return;
		const value = (option.value || '').trim();
		if (!value) return;
		const label = (option.textContent || '').trim() || value;
		base.push({ value, label });
	});
	window.shipAutoSourceBase = base;
	window.shipAutoSource = base.slice();
}

function initShipAutocomplete() {
	const $input = $('#shipInput');
	if (!$input.length || typeof $input.autocomplete !== 'function') return;

	$input.autocomplete({
		minLength: SHIP_AUTOCOMPLETE_MIN_LENGTH,
		delay: 200,
		source: shipAutocompleteSource,
		focus: function(event, ui) {
			event.preventDefault();
			if (ui && ui.item) {
				$input.val(ui.item.label);
			}
		},
		select: function(event, ui) {
			event.preventDefault();
			if (ui && ui.item) {
				setShipValue(ui.item.value, ui.item.label);
				getAnchMealList();
			}
		}
	});

	$input.on('input', function() {
		$('#ship').val('');
	});

	$input.on('blur', function() {
		deriveShipValueFromInput();
	});
}

function shipAutocompleteSource(request, response) {
	const term = (request.term || '').trim().toUpperCase();
	const source = getShipSourceArray();
	if (!term) {
		response(source.slice(0, 20));
		return;
	}
	const matches = source.filter(item => {
		if (!item) return false;
		const value = (item.value || '').toString().toUpperCase();
		const label = (item.label || '').toString().toUpperCase();
		return value.includes(term) || label.includes(term);
	});
	response(matches.slice(0, 20));
}

function updateShipAutocompleteSource() {
	const base = window.shipAutoSourceBase ? window.shipAutoSourceBase.slice() : [];
	const dynamic = [];
	if (window.mealTableState && window.mealTableState.dataset) {
		const dataset = window.mealTableState.dataset;
		(dataset.shipOrder || []).forEach(ship => {
			if (!ship || ship === '-' || ship === 'ALL') return;
			dynamic.push({ value: ship, label: ship });
		});
	}

	const map = new Map();
	const addItem = item => {
		if (!item) return;
		const value = (item.value || item.label || '').toString();
		if (!value) return;
		const key = value.toUpperCase();
		if (!map.has(key)) {
			map.set(key, { value: item.value || item.label, label: item.label || item.value });
		}
	};

	base.forEach(addItem);
	dynamic.forEach(addItem);

	window.shipAutoSource = Array.from(map.values());

	const $input = $('#shipInput');
	if ($input.length && $input.data('ui-autocomplete')) {
		$input.autocomplete('option', 'source', shipAutocompleteSource);
	}
}

function setShipValue(value, label) {
	const sanitizedValue = value && value !== '' ? value : 'ALL';
	$('#ship').val(sanitizedValue);
	if (label !== undefined) {
		$('#shipInput').val(label);
	} else if (sanitizedValue === 'ALL') {
		$('#shipInput').val('');
	} else {
		const desc = getShipDescription(sanitizedValue);
		$('#shipInput').val(desc || sanitizedValue);
	}
}

function getShipDescription(value) {
	const match = findShipOption(value, false);
	return match ? match.label : '';
}

function findShipOption(term, allowPartial) {
	const source = getShipSourceArray();
	const raw = (term || '').toString().trim();
	if (!raw) return null;
	const upper = raw.toUpperCase();
	let partialMatch = null;
	for (const item of source) {
		if (!item) continue;
		const val = (item.value || '').toString();
		const label = (item.label || '').toString();
		if (val.toUpperCase() === upper || label.toUpperCase() === upper) {
			return item;
		}
		if (allowPartial && !partialMatch && (val.toUpperCase().includes(upper) || label.toUpperCase().includes(upper))) {
			partialMatch = item;
		}
	}
	return allowPartial ? partialMatch : null;
}

function deriveShipValueFromInput() {
	const $input = $('#shipInput');
	if (!$input.length) {
		return $('#ship').val() || 'ALL';
	}
	const raw = ($input.val() || '').trim();
	if (!raw) {
		setShipValue('', '');
		return 'ALL';
	}
	const match = findShipOption(raw, true);
	if (match) {
		setShipValue(match.value, match.label);
		return match.value;
	}
	setShipValue(raw, raw);
	return raw;
}

function getShipSourceArray() {
	if (window.shipAutoSource && window.shipAutoSource.length) {
		return window.shipAutoSource;
	}
	return window.shipAutoSourceBase || [];
}
	