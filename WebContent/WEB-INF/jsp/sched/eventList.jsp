<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ include file="/WEB-INF/jsp/share/conf.jsp" %>
<c:forEach var="at" items="${auth}">
	<c:if test="${at eq 'P_GREEN_SCHE_R'}">
		<c:set var="P_GREEN_SCHE_R" value="true" />
	</c:if>
	<c:if test="${at eq 'P_GREEN_SCHE_W'}">
		<c:set var="P_GREEN_SCHE_W" value="true" />
	</c:if>
</c:forEach>
<c:if test="${empty P_GREEN_SCHE_R and empty P_GREEN_SCHE_W}">
	<c:redirect url="/index.html" />
</c:if>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <title>Smart Commissioning Platform</title>

    <!-- jQuery -->
    <link href="${pageContext.request.contextPath}/vendors/jquery/jqueryui/jquery-ui.min.css" rel="stylesheet">
    <!-- Bootstrap -->
    <link href="${pageContext.request.contextPath}/vendors/bootstrap/css/bootstrap.min.css" rel="stylesheet">
    <link href="${pageContext.request.contextPath}/vendors/bootstrap/css/bootstrap-table.min.css" rel="stylesheet">
    <link href="${pageContext.request.contextPath}/vendors/bootstrap/css/bootstrap-datetimepicker.min.css" rel="stylesheet">
    <!-- Font Awesome -->
    <link href="${pageContext.request.contextPath}/vendors/fontawesome/css/all.min.css" rel="stylesheet">
    <link href="${pageContext.request.contextPath}/vendors/fontawesome/css/v4-shims.min.css" rel="stylesheet">
    <link href="${pageContext.request.contextPath}/css/custom.min.css" rel="stylesheet">
    <link href="${pageContext.request.contextPath}/css/common.css" rel="stylesheet">
</head>
<body>
	<div class="body-wrap">
        <%@ include file="/WEB-INF/jsp/include/menu/sidebar_6_1.jsp"%>
        <div id="contentWrap" class="collapsed-content-wrap">
            <%@ include file="/WEB-INF/jsp/include/menu/header_6_1.jsp"%>
            <div class="main-container">
<%-- 				<%@ include file="/WEB-INF/jsp/include/menu/bread_6_1.jsp"%> --%>
	            <div class="sec-option-card">
					<div class="row">
						<div class="col-auto d-flex align-items-start flex-column pr-5">
							<div class="lb-title" data-i18n="op.ship"></div>
							<div class="my-auto">
								<div class="form-check form-check-inline mr-4">
			  						<input id="shipNow" name="shipOption" type="radio" class="form-check-input" value="NOW">
			  						<label for="shipNow" class="form-check-label event-op-radio-label" data-i18n="op.shipNow"></label>
								</div>
								<div class="form-check form-check-inline">
			  						<input id="shipAll" name="shipOption" type="radio" class="form-check-input" value="ALL" checked="checked">
			  						<label for="shipAll" class="form-check-label event-op-radio-label" data-i18n="op.shipAll"></label>
								</div>
							</div>
						</div>
						<div class="col-auto">
							<div class="lb-title" data-i18n="op.year"></div>
							<div class="d-flex align-items-center" style="border: 1px solid var(--primary-400); border-radius: 4px; padding: 0px 8px 0px 0px;">
								<div id="opYearList" style="padding-right: 4px;"></div>
								<div class="chip-obj event-op-year-del-all-chip">
									All
									<span onclick="deleteOptionYearAll()" class="chip-btn-delete ml-2"><i class="fa-solid fa-xmark fa-sm"></i></span>
								</div>
								<input id="opYear" type="text" style="width: 0px; padding: 8px 2px; border: none; color: transparent; background-color: transparent;">
								<a href="#" onclick="toggleOptionYearPicker()">
									<img src="${pageContext.request.contextPath}/img/new/dropdown_arrow.png">
								</a>
							</div>
						</div>
						<div class="col">
							<div class="lb-title">&nbsp;</div>
							<div id="searchBtn">
								<button class="bt-obj bt-primary" onclick="searchEventList()">
									<img src="${pageContext.request.contextPath}/img/i_btn_search.svg" class="bt-icon" height="16px">
									<span data-i18n="op.btnSearch"></span>
								</button>
							</div>
						</div>
					</div>
				</div>
				<div class="sp-24"></div>
				<div class="tb-area">
					<div class="d-flex align-items-end">
						<div class="flex-grow-1 pl-2">
							<span class="event-total-label" data-i18n="total"></span>
							<span id="totalCnt" class="event-total-cnt"></span>
							<span class="event-total-label" data-i18n="ea"></span>
						</div>
						<div class="event-last-if-date">${ifDate}<c:if test="${ifDate ne ' '}"> Updated</c:if></div>
						<c:if test="${P_GREEN_SCHE_W}">
                   			<button class="bt-obj bt-secondary svg" onClick="showNewPop()">
								<img src="${pageContext.request.contextPath}/img/i_btn_new.svg" class="bt-icon" height="16px">
								<span data-i18n="btnNew"></span>
							</button>
							<button onclick="saveEvent()" class="bt-obj bt-primary">
	                   			<img src="${pageContext.request.contextPath}/img/new/save.png" class="bt-icon">
	                   			<span data-i18n="btnSave"></span>
                   			</button>
						</c:if>
                   		<button class="bt-obj bt-primary" onClick="showColPop()"><img src="${pageContext.request.contextPath}/img/new/setting_w.png" height="16px"></button>
                   	</div>
                   	<div class="sp-16"></div>
					<div class="tb-wrap scroll-area-eventlist">
						<table class="tb-style-view tb-layout-fixed">
							<colgroup id="listTheadCol"></colgroup>
			                <thead class="event-list-thead">
				                <tr id="listTheadTr" class="text-center"></tr>
			                </thead>
			                <tbody id="listTbody"></tbody>
		              	</table>
					</div>
				</div>
            </div>
		</div>
	</div>
	
	<!-- 컬럼 설정 modal-->
  	<div class="modal fade" id="colPop" tabindex="-1" role="dialog" aria-hidden="true">
		<div class="modal-dialog modal-lg modal-dialog-centered" role="document">
      		<div class="modal-content">
        		<div class="modal-header">
          			<h5 class="modal-title" data-i18n="colPop.title"></h5>
          			<button type="button" class="close" data-dismiss="modal" aria-label="Close">
            			<span aria-hidden="true">&times;</span>
          			</button>
        		</div>
        		<div class="modal-body">
     				<h5 class="modal-title" data-i18n="colPop.subTitle"></h5>
       				<hr class="pop-sub-title-hr">
       				<table class="tb-style-view">
       					<tbody>
	       					<tr>
	       						<td data-i18n="colPop.lc"></td>
	       						<td><div class="form-check"><input id="colPopLc" type="checkbox" class="form-check-input position-static"></div></td>
	       						<td data-i18n="colPop.sp"></td>
	       						<td><div class="form-check"><input id="colPopSp" type="checkbox" class="form-check-input position-static"></div></td>
	       						<td data-i18n="colPop.bt"></td>
	       						<td><div class="form-check"><input id="colPopBt" type="checkbox" class="form-check-input position-static"></div></td>
	       						<td data-i18n="colPop.gt"></td>
	       						<td><div class="form-check"><input id="colPopGt" type="checkbox" class="form-check-input position-static"></div></td>
	       					</tr>
	       					<tr>
	       						<td data-i18n="colPop.cmr"></td>
	       						<td><div class="form-check"><input id="colPopCmr" type="checkbox" class="form-check-input position-static"></div></td>
	       						<td data-i18n="colPop.mt"></td>
	       						<td><div class="form-check"><input id="colPopMt" type="checkbox" class="form-check-input position-static"></div></td>
	       						<td data-i18n="colPop.ie"></td>
	       						<td><div class="form-check"><input id="colPopIe" type="checkbox" class="form-check-input position-static"></div></td>
	       						<td data-i18n="colPop.ac"></td>
	       						<td><div class="form-check"><input id="colPopAc" type="checkbox" class="form-check-input position-static"></div></td>
	       					</tr>
	       					<tr>
	       						<td data-i18n="colPop.st"></td>
	       						<td><div class="form-check"><input id="colPopSt" type="checkbox" class="form-check-input position-static"></div></td>
	       						<td data-i18n="colPop.cold"></td>
	       						<td><div class="form-check"><input id="colPopCold" type="checkbox" class="form-check-input position-static"></div></td>
	       						<td data-i18n="colPop.lng"></td>
	       						<td><div class="form-check"><input id="colPopLng" type="checkbox" class="form-check-input position-static"></div></td>
	       						<td data-i18n="colPop.gas"></td>
	       						<td><div class="form-check"><input id="colPopGas" type="checkbox" class="form-check-input position-static"></div></td>
	       					</tr>
	       					<tr>
	       						<td data-i18n="colPop.wf"></td>
	       						<td><div class="form-check"><input id="colPopWf" type="checkbox" class="form-check-input position-static"></div></td>
	       						<td data-i18n="colPop.dl"></td>
	       						<td><div class="form-check"><input id="colPopDl" type="checkbox" class="form-check-input position-static"></div></td>
	       						<td></td>
	       						<td></td>
	       						<td></td>
	       						<td></td>
	       					</tr>
	       				</tbody>
       				</table>
        		</div>
        		<div class="modal-footer">
        			<button class="bt-obj bt-secondary" data-dismiss="modal" data-i18n="colPop.btnClose"></button>
					<button class="bt-obj bt-primary" data-i18n="colPop.btnSave" onclick="saveColumn()"></button>
        		</div>
      		</div>
    	</div>
  	</div>
	
	<!-- 신규 추가 modal-->
  	<div class="modal fade" id="newPop" tabindex="-1" role="dialog" aria-hidden="true">
		<div class="modal-dialog modal-lg modal-dialog-centered" role="document">
      		<div class="modal-content">
        		<div class="modal-header">
          			<h5 class="modal-title" data-i18n="newPop.title"></h5>
          			<button type="button" class="close" data-dismiss="modal" aria-label="Close">
            			<span aria-hidden="true">&times;</span>
          			</button>
        		</div>
        		<div class="modal-body">
     				<h5 class="modal-title" data-i18n="newPop.subTitle"></h5>
       				<hr class="pop-sub-title-hr">
       				<table class="tb-style-view">
       					<tbody>
	       					<tr>
	       						<td data-i18n="newPop.pjt" class="ws-nowrap"></td>
	       						<td><input id="newPopPjt" type="text"></td>
	       						<td data-i18n="newPop.regOwner" class="ws-nowrap"></td>
	       						<td><input id="newPopRegOwner" type="text"></td>
	       					</tr>
	       					<tr>
	       						<td data-i18n="newPop.shipType" class="ws-nowrap"></td>
	       						<td>
	       							<select id="newPopShipType" class="">
		                                <c:forEach var="shiptype" items="${listShipType}">
		                                    <option value="${shiptype.val}">${shiptype.description}</option>
		                                </c:forEach>
		                            </select>
	       						</td>
	       						<td data-i18n="newPop.typeModel" class="ws-nowrap"></td>
	       						<td><input id="newPopTypeModel" type="text"></td>
	       					</tr>
	       				</tbody>
       				</table>
        		</div>
        		<div class="modal-footer">
        			<button class="bt-obj bt-secondary" data-dismiss="modal" data-i18n="newPop.btnClose"></button>
					<button class="bt-obj bt-primary" data-i18n="newPop.btnAdd" onclick="addShip()"></button>
        		</div>
      		</div>
    	</div>
  	</div>
  	
  	<!-- 호선 게시판 modal-->
  	<div class="modal fade" id="bbsPop" tabindex="-1" role="dialog" aria-hidden="true">
		<div class="modal-dialog modal-xl modal-dialog-centered" role="document">
      		<div class="modal-content">
        		<div class="modal-header">
          			<h5 class="modal-title"><span data-i18n="bbsPop.title"></span> / <span id="bbsPopPjt"></span></h5>
          			<button type="button" class="close" data-dismiss="modal" aria-label="Close">
            			<span aria-hidden="true">&times;</span>
          			</button>
        		</div>
        		<div class="modal-body">
     				<h5 class="modal-title" data-i18n="bbsPop.subTitleCrew"></h5>
     				<table class="tb-style-view">
       					<tbody>
	       					<tr>
	       						<td class="event-list-bbs-crew-label pl-0" data-i18n="bbsPop.crew1"></td>
	       						<td class="event-list-bbs-crew-label" data-i18n="bbsPop.crew2"></td>
	       						<td class="event-list-bbs-crew-label" data-i18n="bbsPop.crew3"></td>
	       						<td class="event-list-bbs-crew-label" data-i18n="bbsPop.com"></td>
	       						<td class="event-list-bbs-crew-label" data-i18n="bbsPop.operate"></td>
	       					</tr>
	       					<tr>
	       						<td class="event-list-bbs-crew-name pl-0"><div id="bbsPopCrew1"></div></td>
	       						<td class="event-list-bbs-crew-name"><div id="bbsPopCrew2"></div></td>
	       						<td class="event-list-bbs-crew-name"><div id="bbsPopCrew3"></div></td>
	       						<td class="event-list-bbs-crew-name"><div id="bbsPopCom"></div></td>
	       						<td class="event-list-bbs-crew-name"><div id="bbsPopOperate"></div></td>
	       					</tr>
	       				</tbody>
       				</table>
       				<div class="sp-16"></div>
     				<h5 class="modal-title" data-i18n="bbsPop.subTitleList"></h5>
     				<div class="sp-16"></div>
     				<div class="tb-wrap scroll-area-bbslist">
	     				<table class="tb-style-view">
			                <thead class="event-list-bbs-thead">
				                <tr class="text-center">
				                	<th class="event-list-bbs-col-width-kind"><div class="tb-th-col"><span class="tb-th-content" data-i18n="bbsPop.kind"></span></div></th>
				                	<th colspan="2"><div class="tb-th-col-last"><span class="tb-th-content" data-i18n="bbsPop.remark"></span></div></th>
				                </tr>
				                <tr>
				                	<th class="event-list-bbs-thead-form-th">
			                			<select id="bbsPopCrewKind">
			                                <c:forEach var="crewKind" items="${listCrewKind}">
			                                    <option value="${crewKind.description}">${crewKind.description}</option>
			                                </c:forEach>
			                            </select>
				                	</th>
				                	<th class="event-list-bbs-thead-form-th">
			                			<span class="tb-th-content">
			                				<textarea class="form-control rounded" id="bbsPopRemark" rows="4"></textarea>
			                			</span>
		                				<div class="sp-8"></div>
		                				<div id="bbsPopFileList" class="text-left"></div>
				                	</th>
				                	<th class="event-list-bbs-thead-form-th event-list-bbs-col-width-btn">
			                			<div>
			                				<button onclick="saveBbs()" class="bt-obj bt-primary event-list-bbs-btn">
					                   			<img src="${pageContext.request.contextPath}/img/new/save.png" class="bt-icon">
					                   			<span data-i18n="bbsPop.btnSave"></span>
				                   			</button>
			                			</div>
			                			<div class="sp-8"></div>
			                			<div>
			                				<div class="file-btn bt-obj bt-primary event-list-bbs-btn">
						                    	<span data-i18n="bbsPop.btnFile"></span>
						                    	<input id="bbsPopFileInput" onchange="bbsFileAdded(this)" class="" type="file" accept="" multiple="multiple" multiple/>
						                  	</div>
			                			</div>
				                	</th>
				                </tr>
			                </thead>
			                <tbody id="bbsPopListTbody"></tbody>
		              	</table>
					</div>
        		</div>
        		<div class="modal-footer"></div>
      		</div>
    	</div>
  	</div>
  	
  	<!--호선 게시판 삭제 modal-->
  	<div class="modal fade" id="bbsDelPop" tabindex="-1" role="dialog" aria-hidden="true">
    	<div class="modal-dialog modal-dialog-centered" role="document">
      		<div class="modal-content shadow border-0">
        		<div class="modal-body text-center pop-alert">
		        	<div class="pop-alert-title">
		        		<img src="${pageContext.request.contextPath}/img/new/bbs_del.png" class="bt-icon" height="26px">
		        		<span data-i18n="bbsDelPop.title"></span>
		        	</div>
		        	<div class="pop-alert-msg mt-3" data-i18n="bbsDelPop.msg"></div>
          			<button type="button" class="bt-obj bt-secondary" data-dismiss="modal" data-i18n="bbsDelPop.btnClose"></button>
		        	<button type="button" class="bt-obj bt-primary" onClick="delBbs()" data-i18n="bbsDelPop.btnDel"></button>
				</div>
      		</div>
    	</div>
  	</div>
	
	<script type="text/javascript">
	    let _colList = '';
	
	    <c:if test="${not empty bean.uid and bean.uid > 0}">
	  		_colList = {
				'uid': '${bean.uid}',
				'isLc': '${bean.isLc}',
				'isSp': '${bean.isSp}',
				'isBt': '${bean.isBt}',
				'isGt': '${bean.isGt}',
				'isCmr': '${bean.isCmr}',
				'isMt': '${bean.isMt}',
				'isIe': '${bean.isIe}',
				'isAc': '${bean.isAc}',
				'isSt': '${bean.isSt}',
				'isCold': '${bean.isCold}',
				'isLng': '${bean.isLng}',
				'isGas': '${bean.isGas}',
				'isWf': '${bean.isWf}',
				'isDl': '${bean.isDl}'
		    };
	  	</c:if>
	</script>
	
	<!-- jQuery -->
	<script src="${pageContext.request.contextPath}/vendors/jquery/jquery.min.js"></script>
	<script src="${pageContext.request.contextPath}/vendors/jquery/jqueryui/jquery-ui.min.js"></script>
	<!-- Bootstrap -->
	<script src="${pageContext.request.contextPath}/vendors/moment/moment.js"></script>
	<script src="${pageContext.request.contextPath}/vendors/bootstrap/js/bootstrap.bundle.min.js"></script>
	<script src="${pageContext.request.contextPath}/vendors/bootstrap/js/bootstrap-table.min.js"></script>
	<script src="${pageContext.request.contextPath}/vendors/bootstrap/js/bootstrap-datetimepicker.min.js"></script>
	<!-- Font Awesome -->
	<script src="${pageContext.request.contextPath}/vendors/fontawesome/js/all.min.js"></script>
	<script src="${pageContext.request.contextPath}/vendors/fontawesome/js/v4-shims.min.js"></script>
	<script src="${pageContext.request.contextPath}/vendors/loading/loadingOverlay.js"></script>
	<script src="${pageContext.request.contextPath}/vendors/i18n/i18next-1.11.2.min.js"></script>
	<script src="${pageContext.request.contextPath}/vendors/i18n/lang.js"></script>
	<script src="${pageContext.request.contextPath}/js/custom.min.js"></script>
	<script src="${pageContext.request.contextPath}/js/common.js"></script>
	<script src="${pageContext.request.contextPath}/js/sched/eventList.js"></script>
</body>
</html>