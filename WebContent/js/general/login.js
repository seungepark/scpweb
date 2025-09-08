$(function(){
	initI18n();
	init();
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
			namespaces: ['share', 'login'],
			defaultNs: 'login'
		},
		resStore: RES_LANG
	}, function () {
		$('body').i18n();
	});
     
	$('#selLang').val(lang).prop('selected', true);
}

function init() {
	$('#selLang').change(function() {
		changeLang($('#selLang option:selected').val());
	});
	
	$("#pw").keypress(function(e) {
		if(e.keyCode === 13) {
			login();
		}
	});
}

function togglePw() {
	if($('#pw').prop('type') == 'password') {
		$('#pw').prop('type', 'text');
		document.getElementById('btnPw').src = contextPath + '/img/new/view.png';
	}else {
		$('#pw').prop('type', 'password');
		document.getElementById('btnPw').src = contextPath + '/img/new/view_off.png';
	}
}

function resetMsg() {
	document.getElementById('uuid').classList.remove('input-error');
	document.getElementById('pw').classList.remove('input-error');
	document.getElementById('loginMsg').classList.remove('d-block');
	document.getElementById('loginMsg').classList.add('d-none');
	document.getElementById('loginMsg').innerText = '';
	document.getElementById('btnLogin').disabled = '';
}

function login(){
  var uuid = $("#uuid").val();
  var pw = $("#pw").val();

  $.ajax({
	  type    : "POST",
	  url        : contextPath + "/login.html",
	  beforeSend:function(){
        $('#loading').css("display","block");
	  },
	  complete:function(){
        $('#loading').css('display',"none");
	  },
	  data: {
		 uuid: uuid,
		 pw: pw
	  }
	}).done(function (result, textStatus, xhr) {
    var jsonResult = JSON.parse(result);

  	if(xhr.status == "200"){
      if(jsonResult.result == true){
        location.href= contextPath + "/index.html";
      }else{
		document.getElementById('uuid').classList.add('input-error');
		document.getElementById('pw').classList.add('input-error');
		document.getElementById('loginMsg').classList.remove('d-none');
		document.getElementById('loginMsg').classList.add('d-block');
		document.getElementById('loginMsg').innerText = $.i18n.t('errLogin');
		document.getElementById('btnLogin').disabled = 'disabled';
      }
		}else{
			alertPop($.i18n.t('share:tryAgain'));
		}

	}).fail(function(data, textStatus, errorThrown){
		alertPop($.i18n.t('share:tryAgain'));
	});
}
