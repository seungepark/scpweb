let scheListSort = "insertdate";
let scheListOrder = "desc";
let dashMng = null; 

window.onresize = setScroll;

$(function(){
	initI18n();
	init();
	
	getData();
	
	autocompleteOff();
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
    		namespaces: ['share', 'kpi'],
    		defaultNs: 'kpi'
    	},
    	resStore: RES_LANG
	}, function() {
		$('body').i18n();
    });
}

function init() {	
	initDesign();
}

function setScroll() {
	let dashShipList = document.getElementById('dashShipList');
	
	if(dashShipList.scrollWidth > dashShipList.clientWidth) {
		document.getElementById('dashShipCard').classList.add('scroll-show');
	}else {
		document.getElementById('dashShipCard').classList.remove('scroll-show');
	}
}

function getData() {
	jQuery.ajax({
		type: 'POST',
		url: contextPath + '/dash.html',
		success: function(data) {
			let json = JSON.parse(data);
			let cntList = json.cntList;
			let hourList = json.hourList;
			let seaList = json.seaList;
			let quayList = json.quayList;
			let eventList = json.eventList;
			
			if(cntList.length == 2) {
				$('#dataCnt1').text(cntList[0].cnt);
				$('#dataCnt2').html('&nbsp;/&nbsp;' + cntList[1].cnt);
			}else {
				$('#dataCnt1').text('0');
				$('#dataCnt2').html('&nbsp;/&nbsp;0');
			}
			
			if(hourList.length == 2) {
				$('#dataHour1').text(hourList[0].cnt);
				$('#dataHour2').html('&nbsp;/&nbsp;' + hourList[1].cnt);
			}else {
				$('#dataHour1').text('0');
				$('#dataHour2').html('&nbsp;/&nbsp;0');
			}
			
			for(let i = 0; i < seaList.length; i++) {
				let item = seaList[i];
				
				$('#seaList').append(
					'<div class="dash-ship-list-card d-flex flex-column justify-content-between">' + 
						'<div class="d-flex">' + 
							'<img src="' + contextPath + '/img/new/dash_ship.png"/>' + 
							'<div class="sp-w-10">&nbsp;</div>' + 
							'<div class="flex-grow-1">' + 
								'<div class="dash-ship-list-text-lg">' + item.hull + '</div>' + 
								'<div class="dash-ship-list-text">' + (isEmpty(item.desc) ? item.type : item.desc) + '</div>' + 
							'</div>' + 
						'</div>' + 
						'<div>' + 
							'<div class="dash-ship-list-bar-wrap">' + 
								'<div class="dash-ship-list-bar-bg"></div>' + 
								'<div class="dash-ship-list-bar-fill dock" style="width:' + item.per + '%;"></div>' + 
							'</div>' + 
						'</div>' + 
					'</div>'
				);
			}
			
			for(let i = 0; i < quayList.length; i++) {
				let item = quayList[i];
				
				$('#quayList').append(
					'<div class="dash-ship-list-card d-flex flex-column justify-content-between">' + 
						'<div class="d-flex">' + 
							'<img src="' + contextPath + '/img/new/dash_ship.png"/>' + 
							'<div class="sp-w-10">&nbsp;</div>' + 
							'<div class="flex-grow-1"><div>' + 
								'<div class="dash-ship-list-text-lg">' + item.projNo + '</div>' + 
								'<div class="dash-ship-list-text">' + (isEmpty(item.newSknd) ? item.sknd : item.newSknd) + '</div>' + 
							'</div></div>' + 
						'</div>' + 
						'<div>' + 
							'<div class="dash-ship-list-bar-wrap">' + 
								'<div class="dash-ship-list-bar-bg"></div>' + 
								'<div class="dash-ship-list-bar-fill quay" style="width:' + item.per + '%;"></div>' + 
							'</div>' + 
						'</div>' + 
					'</div>'
				);
			}
			
			setScroll();			
			
			const option = {
				datas: eventList,
				isGanttChart: true,
				isEditable: false
			};

			dashMng = new DashBoardScheduleManager("dashboardScheduleManager", option);
			dashMng.init();			
		},
		error: function(req, status, err) {
			
		},
		beforeSend: function() {
			$('#loading').css('display', 'block');
		},
		complete: function() {
			$('#loading').css('display', 'none');
		}
	});
}
