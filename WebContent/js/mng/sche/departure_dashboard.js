$(function () {
    initI18n();

    init();
    initServerCheck();
    autocompleteOff();
});

function initI18n() {
    const lang = initLang();

    $.i18n.init({
        lng : lang,
        fallbackLng : FALLBACK_LNG,
        fallbackOnNull : false,
        fallbackOnEmpty : false,
        useLocalStorage : false,
        ns : {
            namespaces : [ 'share', 'mngDepDashboard' ],
            defaultNs : 'mngDepDashboard'
        },
        resStore : RES_LANG
    }, function() {
        $('body').i18n();
    });
}

function init() {

//	$('.modal-dialog').draggable({handle: '.modal-header'});
    $("#trialMng").addClass("active"); // Left Menu 1depth open
    $("#trialMng ul").css("display", "block"); // Left Menu open
    $("#scheDepart").addClass("current-page"); // Left Menu 2depth open

    setSearchOption()
}

function setSearchOption() {
    let sortNm = getSearchCookie('SK_SORTNM');
    let sortOd = getSearchCookie('SK_SORTOD');

    let shipType = getSearchCookie('SK_TYPE');
    let hullnum = getSearchCookie('SK_SHIP');
    let pic = getSearchCookie('SK_DESC');

    if(shipType != '') {
        $('#shipType').val(shipType).prop('selected', true);
    }

    $('#hullnum').val(hullnum);
    $('#pic').val(pic);

    if(sortNm != '' && sortOd != '') {
        _isSetSort = true;
        $('#tbList').bootstrapTable('refreshOptions', {sortName: sortNm, sortOrder: sortOd});
    }
}

