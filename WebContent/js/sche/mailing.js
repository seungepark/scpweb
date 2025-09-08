$(function(){
    initI18n();
    init();

    initServerCheck();
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
            namespaces: ['share', 'mailing'],
            defaultNs: 'mailing'
        },
        resStore: RES_LANG
    }, function() {
        $('body').i18n();
    });
}

function init() {
	initDesign();
}

// 추가.
function add() {
	let email = document.getElementsByName('email');
	
	if(isEmpty(email) || email.length == 0) {
		$('#tbRowList').empty();
	}
	
	$('#tbRowList').append('<tr>' + 
    					'<td><input type="text" name="email"></td>' + 
    					'<td><input type="text" name="name"></td>' + 
    					'<td><input type="text" name="company"></td>' + 
    					'<td><input type="text" name="department"></td>' + 
    					'<td><input type="text" name="rank"></td>' + 
    					'<td><div onclick="delEmail(this)" class="pointer"><i class="fa-solid fa-trash-can"></i></div></td>' + 
    				'</tr>');
}

// 삭제.
function delEmail(obj) {
	$(obj).parent().parent().remove();
	
	let email = document.getElementsByName('email');
	
	if(isEmpty(email) || email.length == 0) {
		$('#tbRowList').append('<tr><td class="text-center" colspan="6">' + $.i18n.t('share:noList') + '</td></tr>');
	}
}

// 저장.
function save() {
	let email = [];
	let name = [];
	let company = [];
	let department = [];
	let rank = [];
	
	let emailVl = document.getElementsByName('email');
	let nameVl = document.getElementsByName('name');
	let companyVl = document.getElementsByName('company');
	let departmentVl = document.getElementsByName('department');
	let rankVl = document.getElementsByName('rank');
	
	let isError = false;
	
	if(emailVl.length < 1) {
		alertPop($.i18n.t('errorNoList'));
		isError = true;
	}
	
	for(let i = 0; i < emailVl.length; i++) {
		if(isEmpty(emailVl[i].value)) {
			alertPop($.i18n.t('errorRequired'));
			emailVl[i].focus();
			
			isError = true;
			break;
		}
		
		email.push(emailVl[i].value);
		name.push(nameVl[i].value);
		company.push(companyVl[i].value);
		department.push(departmentVl[i].value);
		rank.push(rankVl[i].value);
	}
	
	if(isError) {
		return;
	}
	
	jQuery.ajax({
		type: 'POST',
		url: contextPath + '/sche/mailingSave.html',
		traditional: true,
		data: {
			emailArr: email,
			nameArr: name,
			companyArr: company,
			departmentArr: department,
			rankArr: rank
		},
		success: function(data) {
			try {
				let json = JSON.parse(data);
			
				if(json.result) {
					alertPop($.i18n.t('compSave'));
				}else{
					alertPop($.i18n.t('share:tryAgain'));
				}
			}catch(ex) {
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