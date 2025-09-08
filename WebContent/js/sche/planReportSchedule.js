$(function(){
    initI18n();
    init();

    autocompleteOff();
});

const initI18n =() => {
    const lang = initLang();

    $.i18n.init({
        lng: lang,
        fallbackLng: FALLBACK_LNG,
        fallbackOnNull: false,
        fallbackOnEmpty: false,
        useLocalStorage: false,
        ns: {
            namespaces: ['share', 'reportSchedule'],
            defaultNs: 'reportSchedule'
        },
        resStore: RES_LANG
    }, function () {
        $('body').i18n();
    });
}

function init() {
    // 데이터 조회
    getVesselReqInfoDetList()
}

const getVesselReqInfoDetList = () => {
    const hullNum = opener.$('#hullnum').val();
    const parentUid = opener.$("#uid").val();
    
    $.ajax({
        type: "GET",
        url: contextPath + "/sche/getVesselReqInfoDetListByHullNum.html",
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
            uid: parentUid
        }
    }).done(function(result, textStatus, xhr) {
        if(textStatus == "success") {
            const scheRowList = opener.mng.getData();

            const reportschedule = {
                datas: JSON.parse(JSON.stringify(scheRowList)),
                vsslReqInfos: result.list,
                hullNum: hullNum,
                uid : parentUid,
                bean: {
                    drawn: result.drawn ? result.drawn : "",
                    checked: result.checked ? result.checked : "",
                    manager: result.manager ? result.manager : "",
                }
            }

            const reportManager = new ReportScheduleManager(reportschedule);
            reportManager.init()

        }else {
            alert($.i18n.t('share:tryAgain'));
        }
    }).fail(function(data, textStatus, errorThrown) {
        console.log(errorThrown)
    });
}

function printwindow() {
    window.onbeforeprint = function() {
        const root = document.querySelector('#report_chart');
        root.style.cssText = "width: 4450px;"
    }

    window.onafterprint = function() {
        const root = document.querySelector('#report_chart');
        root.style.cssText = "width: 2237px;"
    }
    window.print()
}