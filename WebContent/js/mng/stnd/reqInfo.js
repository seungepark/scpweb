$(function(){
    initI18n();
    init();

    getStndReqInfoRowList();
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
            namespaces: ['share', 'mngStndReqInfo'],
            defaultNs: 'mngStndReqInfo'
        },
        resStore: RES_LANG
    }, function () {
        $('body').i18n();
    });
}

const init = () => {
	initDesign();
}

const getStndReqInfoRowList = () => {

    $.ajax({
        type: "GET",
        url: contextPath + "/mng/stnd/getStndReqInfoRowList.html",
        dataType: "json",
        beforeSend: function() {
            $('#loading').css("display","block");
        },
        complete: function() {
            $('#loading').css('display',"none");
        },
        data: {}
    }).done((result, textStatus, xhr) => {
        if(textStatus == "success") {
            const jsonResult = result.list;

            $("#getStndReqInfoRowList").empty()

            if (jsonResult && jsonResult.length !== 0) {
                jsonResult.forEach((row, i) => {
                    addStndReqInfo(row)
                })
            } else {
                emptyData()
            }

        }else {
            alertPop($.i18n.t('share:tryAgain'));
        }
    }).fail((data, textStatus, errorThrown) => {

    });

}

const addStndReqInfo = (row) => {

    if (row && 0 !== row.uid) {
        const text = `
            <tr data-uid="${row.uid}" data-flag="R">
                <td class="" style="width: 97px;"><input type="text" name="stndSeq" class="stndSeq" value="${getFloatVal(row.seq)}" maxlength="5" oninput="this.value = this.value.replace(/[^0-9.-]/g, '').replace(/(\\..*)\\./g, '$1').replace(/(\\--*)\\-/g, '$1');"></td>
                <td class=""><select name="stndReqInfoTitle" class=" stndReqInfoTitle"><option value=""></option>${getTypeSelOption(row, 'reqinfotitle')}</select></td>
                <td class=""><input type="text" name="stndItem" class=" stndItem" value="${row.item}" maxlength="20"></td>
                <td class=""><input type="text" name="stndUnit" class=" stndUnit" value="${row.unit}" maxlength="10"></td>
                <td class=" text-center pointer" onClick="delStndReqInfo(this)"><i class="fa-solid fa-trash-can"></i></td>
            </tr>
        `
        $("#getStndReqInfoRowList").append(text)

        document.querySelector(`#getStndReqInfoRowList tr[data-uid='${row.uid}']`).querySelectorAll("input").forEach((n) => {
            n.addEventListener("change", () => {
                n.closest("tr").setAttribute("data-flag", "U")
            })
        })

        document.querySelector(`#getStndReqInfoRowList tr[data-uid='${row.uid}']`).querySelectorAll("select").forEach((n) => {
            n.addEventListener("change", () => {
                n.closest("tr").setAttribute("data-flag", "U")
            })
        })
    } else {
        const len = $("#getStndReqInfoRowList tr[data-uid]").length

        if (0 === len) $("#getStndReqInfoRowList").empty()

        const text = `
            <tr data-uid="0" data-flag="C">
                <td class="" style="width: 97px;"><input type="text" name="stndSeq" class="stndSeq" value="${len + 1}" maxlength="5" oninput="this.value = this.value.replace(/[^0-9.-]/g, '').replace(/(\\..*)\\./g, '$1').replace(/(\\--*)\\-/g, '$1');"></td>
                <td class=""><select name="stndReqInfoTitle" class=" stndReqInfoTitle"><option value=""></option>${getTypeSelOption(null, 'reqinfotitle')}</select></td>
                <td class=""><input type="text" name="stndItem" class=" stndItem" value="" maxlength="20"></td>
                <td class=""><input type="text" name="stndUnit" class=" stndUnit" value="" maxlength="10"></td>
                <td class=" text-center pointer" onClick="delStndReqInfo(this)"><i class="fa-solid fa-trash-can"></i></td>
            </tr>
        `

        $("#getStndReqInfoRowList").append(text)
    }
}

const delStndReqInfo = (elm) => {
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

const saveStndReqInfo = () => {
    const obj = {}
    let isEmpty = false
    let emptyMsg = ""
    $(`#getStndReqInfoRowList tr[data-uid]`).each((i, e) => {
        const flag = $(e).attr("data-flag")
        const uid = $(e).attr("data-uid")
        const seq = $(e).find(`input[name="stndSeq"]`).val()
        const reqinfotitle = $(e).find(`select[name="stndReqInfoTitle"]`).val()
        const item = $(e).find(`input[name="stndItem"]`).val()
        const unit = $(e).find(`input[name="stndUnit"]`).val()


        if ("D" === flag && "0" === uid) {

        } else {
            if("D" !== flag && (!reqinfotitle || !item || !seq)) {
                emptyMsg = $.i18n.t('errScheRow').replace('{0}',getFloatVal(i + 1));
                isEmpty = true
                return false
            }

            obj[`params[${i}].flag`] = flag
            obj[`params[${i}].uid`] = uid
            obj[`params[${i}].seq`] = seq
            obj[`params[${i}].reqinfotitle`] = reqinfotitle
            obj[`params[${i}].item`] = item
            obj[`params[${i}].unit`] = unit
        }
    })

    if (isEmpty == false) {
        $.ajax({
            type: "POST",
            url: contextPath + "/mng/stnd/insertStndReqInfoRow.html",
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
                alertPop($.i18n.t('compUpdate'));
                getStndReqInfoRowList()
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

const emptyData = () => {
    if ($("#getStndReqInfoRowList tr").length === 0) {
        $("#getStndReqInfoRowList").html(`<tr><td class="text-center" colspan="16" data-i18n="${ $.i18n.t('share:noList') }"></td></tr>`)
    }
}

const setCompEvent = () => {

    // 순서 변경 컴포넌트 이벤트 설정
    setSeqEvent('input[name="stndSeq"]');

    // Table 행 Drag & Drop 설정
    $('#getStndReqInfoRowList').sortable({
        axis: "y",
        start: function(event, ui){
        },
        update: function(event, ui){
            console.log('getStndReqInfoRowList.sortable.update START');

            console.log('getScheCodeDetList.sortable.update END');
        },
        stop: function(event, ui){
            console.log('getScheCodeDetList.sortable.stop START');
            // 전체 Seq 재설정
            console.log(event, ui)
            refreshSeq();
            console.log('getScheCodeDetList.sortable.stop END');
        }
    });
}

const refreshSeq = () => {
    $('#getStndReqInfoRowList tr[data-flag!="D"]').each((i, e) => {
        if ("R" == $(e).attr("data-flag")) $(e).attr("data-flag", "U")
        $(e).find("input[name='stndSeq']").val(i + 1)
    })
}

const setSeqEvent = (selStr) => {
    $('#getStndReqInfoRowList').on('change', selStr, (e) => {

        let keys = Array.from(Array($('#getStndReqInfoRowList tr[data-flag!="D"]').length).keys())
        keys = keys.map(x => x + 1);
        const findIndex = keys.findIndex(o => o == e.target.value)
        keys.splice(findIndex, 1)
        let ii = 0
        $('#getStndReqInfoRowList tr[data-flag!="D"]').each((i, elm) => {
            const other = elm.querySelector("input[name='stndSeq']")
            if (e.target !== other) {
                other.value = keys[ii]
                ii++
            }
        })

        let table, rows, switching, i, x, y, shouldSwitch;
        table = document.querySelector("#tbStndReqInfoList");
        switching = true;
        while (switching) {
            switching = false;
            rows = table.rows;
            for (i = 1; i < (rows.length - 1); i++) {
                shouldSwitch = false;

                x = rows[i].querySelector("input[name='stndSeq']").value;
                y = rows[i + 1].querySelector("input[name='stndSeq']").value;

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