<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ include file="/WEB-INF/jsp/share/conf.jsp" %>
<c:forEach var="at" items="${auth}">
	<c:if test="${at eq 'P_PLAN_SCHE_W'}">
		<c:set var="P_PLAN_SCHE_W" value="true" />
	</c:if>
</c:forEach>
<c:if test="${empty P_PLAN_SCHE_W}">
	<c:redirect url="/index.html" />
</c:if>
<!DOCTYPE html>
<html lang="en">

<head>
	<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
	<!-- Meta, title, CSS, favicons, etc. -->
	<meta charset="utf-8">
	<meta http-equiv="X-UA-Compatible" content="IE=edge">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	
	<title>Smart Commissioning Platform</title>
	<!-- jQuery -->
	<link href="${pageContext.request.contextPath}/vendors/jquery/jqueryui/jquery-ui.min.css" rel="stylesheet">
	<link href="${pageContext.request.contextPath}/vendors/jquery/jquery.timepicker.min.css" rel="stylesheet">
	<!-- Bootstrap -->
	<link href="${pageContext.request.contextPath}/vendors/bootstrap/css/bootstrap.min.css" rel="stylesheet">
	<link href="${pageContext.request.contextPath}/vendors/bootstrap/css/bootstrap-table.min.css" rel="stylesheet">
	<link href="${pageContext.request.contextPath}/vendors/bootstrap/css/bootstrap-datepicker.min.css" rel="stylesheet">
	<!-- Font Awesome -->
	<link href="${pageContext.request.contextPath}/vendors/fontawesome/css/all.min.css" rel="stylesheet">
	<link href="${pageContext.request.contextPath}/vendors/fontawesome/css/v4-shims.min.css" rel="stylesheet">
	<link href="${pageContext.request.contextPath}/css/custom.min.css" rel="stylesheet">
	<link href="${pageContext.request.contextPath}/css/common.css" rel="stylesheet">
	<style>
		.ui-timepicker-container {
			z-index:1151 !important;
		}
	</style>
</head>

<body>
	<div class="body-wrap">
        <%@ include file="/WEB-INF/jsp/include/menu/sidebar_1_1.jsp"%>
        <div id="contentWrap" class="collapsed-content-wrap">
            <%@ include file="/WEB-INF/jsp/include/menu/header_1_1.jsp"%>
            <div class="main-container">
<%-- 				<%@ include file="/WEB-INF/jsp/include/menu/bread_1_1.jsp"%> --%>
				<div class="btn-option-hide pointer" id="dParentDataHide" data-i18n="hideParent"></div>
				<div id="dParentData" class="sec-option-card">
					<div class="row">
						<div class="col-md-3 col-sm-12">
							<div class="lb-title" data-i18n="hullnum"></div>
							<input id="hullnum" type="text" class="" value="${bean.hullnum}" disabled>
						</div>
						<div class="col-md-3 col-sm-12">
							<div class="lb-title" data-i18n="shipType"></div>
							<select id="shiptype" class="" disabled>
								<option value=""  />
								<c:forEach var="shiptype" items="${listShip}">
									<option value="${shiptype.val}" <c:if test="${shiptype.val eq bean.shiptype}">selected="selected" </c:if>>${shiptype.description}</option>
								</c:forEach>
							</select>
						</div>
						<div class="col-md-3 col-sm-12">
							<div class="lb-title" data-i18n="schedType"></div>
							<select id="schedtype" class="" disabled>
								<option value=""  />
								<c:forEach var="schedtype" items="${listschedtype}">
									<option value="${schedtype.val}" <c:if test="${schedtype.val eq bean.schedtype}">selected="selected" </c:if>>${schedtype.description}</option>
								</c:forEach>
							</select>
						</div>
						<div class="col-md-3 col-sm-12">
							<div class="lb-title" data-i18n="pic"></div>
							<input id="pic" type="text" class="" value="${userInfo.firstName} ${userInfo.lastName}" disabled>
						</div>
					</div>
					<div class="sp-16"></div>
					<div class="row">
						<div class="col-md-3 col-sm-12">
							<div class="lb-title" data-i18n="sdate"></div>
							<input id="sdate" type="date" class="" value="${bean.sdate}" >
						</div>
						<div class="col-md-3 col-sm-12">
							<div class="lb-title" data-i18n="edate"></div>
							<input id="edate" type="date" class="" value="${bean.edate}" >
						</div>
						<div class="col-md-3 col-sm-12">
							<div class="lb-title" data-i18n="desc"></div>
							<input id="desc" type="text" class="" value="${bean.description}" >
							<!-- Hidden Info START -->
							<input type="hidden" id="period" value="${bean.period}">
							<input type="hidden" id="uid" value="${bean.uid}" />
							<!-- Hidden Info END -->
						</div>
						<div class="col-md-3 col-sm-12">
							<div class="lb-title" data-i18n="revnum"></div>
							<input id="revnum" type="text" class="" value="${bean.revnum}" disabled>
						</div>
					</div>
				</div>
				<div class="sp-24"></div>
				<div class="tb-area">
					<div class="d-flex flex-wrap flex-row-reverse">
						<c:choose>
							<c:when test="${bean.isOff eq 'Y'}">
								<button class="bt-obj bt-primary" disabled>
									<img src="${pageContext.request.contextPath}/img/i_btn_save.svg" class="bt-icon" height="16px">
									<span data-i18n="btnSave"></span>
								</button>
							</c:when>
							<c:otherwise>
								<button class="bt-obj bt-primary" onClick="saveSchedule()">
									<img src="${pageContext.request.contextPath}/img/i_btn_save.svg" class="bt-icon" height="16px">
									<span data-i18n="btnSave"></span>
								</button>
							</c:otherwise>
						</c:choose>
						<a href="${pageContext.request.contextPath}/mng/sche/detailRowScheduler.html?uid=${bean.uid}">
							<button class="bt-obj bt-secondary svg">
								<img src="${pageContext.request.contextPath}/img/i_btn_return.svg" class="bt-icon" height="16px">
								<span data-i18n="btnCan"></span>
							</button>
						</a>
						
						<c:choose>
							<c:when test="${bean.isOff eq 'Y'}">
								<button class="bt-obj bt-secondary svg" disabled>
									<img src="${pageContext.request.contextPath}/img/i_btn_newstatus.svg" class="bt-icon" height="16px">
									<span data-i18n="btnNewVersion"></span>
								</button>
								<button class="bt-obj bt-secondary svg" disabled>
									<img src="${pageContext.request.contextPath}/img/i_btn_reverif.svg" class="bt-icon" height="16px">
									<span data-i18n="btnVersionHistory"></span>
								</button>
								<button class="bt-obj bt-secondary svg" disabled>
									<img src="${pageContext.request.contextPath}/img/i_btn_add.svg" class="bt-icon" height="16px">
									<span data-i18n="btnAdd"></span>
								</button>
								<button class="bt-obj bt-secondary svg" disabled>
									<img src="${pageContext.request.contextPath}/img/i_btn_reverif.svg" class="bt-icon" height="16px">
									<span data-i18n="btnSetDT"></span>
								</button>
								<button class="bt-obj bt-secondary svg" disabled>
									<img src="${pageContext.request.contextPath}/img/i_btn_reverif.svg" class="bt-icon" height="16px">
									<span data-i18n="btnSetConvDT">Set Conv Date Time</span>
								</button>
								<button class="bt-obj bt-secondary svg" disabled>
									<img src="${pageContext.request.contextPath}/img/i_btn_search.svg" class="bt-icon" height="16px">
									<span data-i18n="btnViewChart"></span>
								</button>
							</c:when>
							<c:otherwise>
								<button class="bt-obj bt-secondary svg" onClick="saveNewVersionSchedule()">
									<img src="${pageContext.request.contextPath}/img/i_btn_newstatus.svg" class="bt-icon" height="16px">
									<span data-i18n="btnNewVersion"></span>
								</button>
								<button class="bt-obj bt-secondary svg" onClick="showScheduleVersionHistoryModal()">
									<img src="${pageContext.request.contextPath}/img/i_btn_reverif.svg" class="bt-icon" height="16px">
									<span data-i18n="btnVersionHistory"></span>
								</button>
								<button class="bt-obj bt-secondary svg" onClick="addSchedule()">
									<img src="${pageContext.request.contextPath}/img/i_btn_add.svg" class="bt-icon" height="16px">
									<span data-i18n="btnAdd"></span>
								</button>
								<button class="bt-obj bt-secondary svg" onClick="setAllDateTime()">
									<img src="${pageContext.request.contextPath}/img/i_btn_reverif.svg" class="bt-icon" height="16px">
									<span data-i18n="btnSetDT"></span>
								</button>
								<button class="bt-obj bt-secondary svg" onClick="setConvDateBtn()">
									<img src="${pageContext.request.contextPath}/img/i_btn_reverif.svg" class="bt-icon" height="16px">
									<span data-i18n="btnSetConvDT">Set Conv Date Time</span>
								</button>
								<button class="bt-obj bt-secondary svg" onClick="viewChart()">
									<img src="${pageContext.request.contextPath}/img/i_btn_search.svg" class="bt-icon" height="16px">
									<span data-i18n="btnViewChart"></span>
								</button>
							</c:otherwise>
						</c:choose>
						<a href="${pageContext.request.contextPath}/mng/vssl/detailVesselReqInfo.html?tempUid=${bean.uid}" target="_blank">
							<button class="bt-obj bt-secondary svg">
								<img src="${pageContext.request.contextPath}/img/i_btn_newstatus.svg" class="bt-icon" height="16px">
								<span data-i18n="btnVsslReqInfo"></span>
							</button>
						</a>
                   	</div>
                   	<div class="sp-16"></div>
					<div id="tbWrap" class="tb-wrap scroll-area-sche-hide">
						<table id="tbNewSchedulerList"  class="tb-style">
							<thead>
								<tr>
									<th><div class="tb-th-col"><span class="tb-th-content"><input type="checkbox" id="scheRowAllChk"></span></div></th>
									<th><div class="tb-th-col"><span class="tb-th-content" data-i18n="list.cate"></span></div></th>
									<th><div class="tb-th-col"><span class="tb-th-content" data-i18n="list.tcnum"></span></div></th>
									<th><div class="tb-th-col"><span class="tb-th-content" data-i18n="list.desc"></span></div></th>
									<th><div class="tb-th-col"><span class="tb-th-content" data-i18n="list.ctype"></span></div></th>
									<th><div class="tb-th-col"><span class="tb-th-content" data-i18n="list.loadrate"></span></div></th>
									<th><div class="tb-th-col"><span class="tb-th-content" data-i18n="list.dtype"></span></div></th>
									<th><div class="tb-th-col"><span class="tb-th-content" data-i18n="list.sdate"></span></div></th>
									<th><div class="tb-th-col"><span class="tb-th-content" data-i18n="list.stime"></span></div></th>
									<th><div class="tb-th-col"><span class="tb-th-content" data-i18n="list.edate"></span></div></th>
									<th><div class="tb-th-col"><span class="tb-th-content" data-i18n="list.etime"></span></div></th>
									<th><div class="tb-th-col"><span class="tb-th-content" data-i18n="list.seq"></span></div></th>
									<th><div class="tb-th-col"><span class="tb-th-content" data-i18n="list.per"></span></div></th>
									<th><div class="tb-th-col"><span class="tb-th-content" data-i18n="list.readTm"></span></div></th>
									<th><div class="tb-th-col"><span class="tb-th-content" data-i18n="list.sametcnum"></span></div></th>
									<th><div class="tb-th-col-last"><span class="tb-th-content">&nbsp;</span></div></th>
								</tr>
							</thead>
							<tbody id="getScheRowList">
								<tr>
									<td class="text-center" colspan="16" data-i18n="share:noList"></td>
								</tr>
							</tbody>
						</table>
					</div>
				</div>
            </div>
		</div>
	</div>
	<!-- TCnum Search Modal Start -->
	<div class="modal fade" id="search_tcnum_modal" tabindex="-1" role="dialog" aria-labelledby="search_tcnum_modal" aria-hidden="true">
		<div class="modal-dialog modal-xl modal-dialog-centered" role="document">
			<div class="modal-content">
				<div class="modal-header">
					<h5 class="modal-title" data-i18n="searchTcPop.title"></h5>
					<button type="button" class="close" data-dismiss="modal" aria-label="Close">
						<span aria-hidden="true">&times;</span>
					</button>
				</div>
				<div class="modal-body">
					<div class="d-flex pop-op-area">
        				<div class="pop-op-obj">
        					<div class="pop-inner-title" data-i18n="searchTcPop.tcnum"></div>
        					<input id="searchTcPopTcnum" type="text">
        				</div>
        				<div class="pop-op-obj">
        					<div class="pop-inner-title" data-i18n="searchTcPop.desc"></div>
        					<input id="searchTcPopDesc" type="text">
        				</div>
        				<div>
        					<div class="pop-inner-title">&nbsp;</div>
        					<button class="bt-obj bt-primary" onclick="searchTcPopSearch(1)">
								<img src="${pageContext.request.contextPath}/img/i_btn_search.svg" class="bt-icon" height="16px">
								<span data-i18n="searchTcPop.btnSearch"></span>
							</button>
        				</div>
        			</div>
					<div class="tb-wrap pop-op-tb-scroll-area">
						<table class="tb-style">
							<thead>
	         					<tr>
			           				<th><div class="tb-th-col"><span class="tb-th-content" data-i18n="searchTcPop.tcnum"></span></div></th>
			           				<th><div class="tb-th-col"><span class="tb-th-content" data-i18n="searchTcPop.desc"></span></div></th>
			           				<th><div class="tb-th-col"><span class="tb-th-content" data-i18n="searchTcPop.dtype"></span></div></th>
			           				<th><div class="tb-th-col"><span class="tb-th-content" data-i18n="searchTcPop.ctype"></span></div></th>
			           				<th><div class="tb-th-col"><span class="tb-th-content" data-i18n="searchTcPop.load"></span></div></th>
			           				<th><div class="tb-th-col"><span class="tb-th-content" data-i18n="searchTcPop.per"></span></div></th>
			           				<th><div class="tb-th-col-last"><span class="tb-th-content" data-i18n="searchTcPop.readytm"></span></div></th>
	         					</tr>
							</thead>
							<tbody id="searchTcPopList"></tbody>
						</table>
					</div>
					<div class="sp-16"></div>
                    <div class="pg-area" id="pagination"></div>
				</div>
				<div class="modal-footer">
					<button class="bt-obj bt-secondary" data-dismiss="modal" data-i18n="searchTcPop.btnClose"></button>
				</div>
			</div>
		</div>
	</div>
	<!-- TCnum Search Modal End -->
	
	<!-- Conv Date Input Modal Start -->
	<div class="modal fade" id="set_conv_modal" tabindex="-1" role="dialog" aria-labelledby="set_conv_modal" aria-hidden="true">
		<div class="modal-dialog modal-xl modal-dialog-centered" role="document">
			<div class="modal-content">
				<div class="modal-header">
					<h5 class="modal-title" data-i18n="setConvDatePop.title"></h5>
					<button type="button" class="close" data-dismiss="modal" aria-label="Close">
						<span aria-hidden="true">&times;</span>
					</button>
				</div>
				<div class="modal-body">
					<div class="d-flex pop-op-area">
        				<div class="pop-op-obj">
        					<div class="pop-inner-title" data-i18n="setConvDatePop.sdate"></div>
        					<input id="setConvDatePopSdate" type="date">
        				</div>
        				<div class="pop-op-obj">
        					<div class="pop-inner-title" data-i18n="setConvDatePop.stime"></div>
        					<input id="setConvDatePopStime" type="time">
        				</div>
        				<div class="pop-op-obj">
        					<div class="pop-inner-title" data-i18n="setConvDatePop.edate"></div>
        					<input id="setConvDatePopEdate" type="date">
        				</div>
        				<div class="pop-op-obj">
        					<div class="pop-inner-title" data-i18n="setConvDatePop.etime"></div>
        					<input id="setConvDatePopEtime" type="time">
        				</div>
        				<div>
        					<div class="pop-inner-title">&nbsp;</div>
        					<button class="bt-obj bt-primary" onclick="setConvDateApplyBtn()">
								<img src="${pageContext.request.contextPath}/img/i_btn_verif.svg" class="bt-icon" height="16px">
								<span data-i18n="setConvDatePop.btnApply"></span>
							</button>
        				</div>
        			</div>
					<div class="tb-wrap pop-op-tb-scroll-area">
						<table class="tb-style">
							<thead>
	         					<tr>
	         						<th><div class="tb-th-col"><span class="tb-th-content"><input type="checkbox" id="convDataAllChk"></span></div></th>
			           				<th class="th-w-120"><div class="tb-th-col"><span class="tb-th-content" data-i18n="setConvDatePop.tcnum"></span></div></th>
			           				<th><div class="tb-th-col"><span class="tb-th-content" data-i18n="setConvDatePop.desc"></span></div></th>
			           				<th><div class="tb-th-col"><span class="tb-th-content" data-i18n="setConvDatePop.sdate"></span></div></th>
			           				<th><div class="tb-th-col"><span class="tb-th-content" data-i18n="setConvDatePop.stime"></span></div></th>
			           				<th><div class="tb-th-col"><span class="tb-th-content" data-i18n="setConvDatePop.edate"></span></div></th>
			           				<th><div class="tb-th-col-last"><span class="tb-th-content" data-i18n="setConvDatePop.etime"></span></div></th>
	         					</tr>
							</thead>
							<tbody id="setConvDatePopList"></tbody>
						</table>
					</div>
				</div>
				<div class="modal-footer">
					<button class="bt-obj bt-secondary" data-dismiss="modal" data-i18n="setConvDatePop.btnClose"></button>
				</div>
			</div>
		</div>
	</div>
	<!-- Conv Date Input Modal End -->

	<!-- Scheduler Version History Modal Start -->
	<div class="modal fade" id="scheduler_version_history_modal" tabindex="-1" role="dialog" aria-labelledby="scheduler_version_history_modal" aria-hidden="true">
		<div class="modal-dialog modal-lg modal-dialog-centered" role="document">
			<div class="modal-content">
				<div class="modal-header">
					<h5 class="modal-title" data-i18n="searchVersionHistoryPop.title"></h5>
					<button type="button" class="close" data-dismiss="modal" aria-label="Close">
						<span aria-hidden="true">&times;</span>
					</button>
				</div>
				<div class="modal-body">
					<div class="d-flex pop-op-area">
						<div>
        					<div class="pop-inner-title" data-i18n="searchVersionHistoryPop.revnum"></div>
        					<input type="text" class="" id="searchVersionHistoryPopRevnum" data-i18n="[placeholder]searchVersionHistoryPop.revnum">
        				</div>
       					<div>
	       					<div class="pop-inner-title">&nbsp;</div>
	       					<button class="bt-obj bt-primary" onclick="getVersionHistoryList()">
								<img src="${pageContext.request.contextPath}/img/i_btn_search.svg" class="bt-icon" height="16px">
								<span data-i18n="trialSearchPop.search"></span>
							</button>
	       				</div>
					</div>
					<div class="tb-wrap pop-op-tb-scroll-area">
						<table class="tb-style">
							<thead>
								<tr class="headings">
									<th><div class="tb-th-col"><span class="tb-th-content">&nbsp;</span></div></th>
									<th><div class="tb-th-col"><span class="tb-th-content" data-i18n="searchVersionHistoryPop.list.revnum"></span></div></th>
									<th><div class="tb-th-col-last"><span class="tb-th-content" data-i18n="searchVersionHistoryPop.list.insertdate"></span></div></th>
								</tr>
							</thead>
							<tbody id="versionHistorylist">
								<tr>
									<td class="text-center" colspan="3" data-i18n="share:noList"></td>
								</tr>
							</tbody>
						</table>
					</div>
				</div>
				<div class="modal-footer">
					<button class="bt-obj bt-secondary" data-dismiss="modal" data-i18n="searchVersionHistoryPop.btnClose"></button>
					<button class="bt-obj bt-primary" data-i18n="searchVersionHistoryPop.btnLoad" onclick="loadVersionHistory()"></button>
				</div>
			</div>
		</div>
	</div>
	<!-- Scheduler Version History Modal End -->
	
	<script>
		var scheUid = "${bean.uid}";
		
		// ctype, dtype 데이터 
		var ctypeList = new Array();
		var dtypeList = new Array();

		const schedtypeList = new Array();
		
		<c:forEach items="${listctype}" var="ctype">
		ctypeList.push({
			'value': '${ctype.val}',
			'desc': '${ctype.description}'
		});
		</c:forEach>
		<c:forEach items="${listdtype}" var="dtype">
		dtypeList.push({
			'value': '${dtype.val}',
			'desc': '${dtype.description}'
		});
		</c:forEach>

		<c:forEach items="${listschedtype}" var="item">
		schedtypeList.push({
			'value': '${item.val}',
			'desc': '${item.description}'
		})
		</c:forEach>
		
	</script>
	<!-- jQuery -->
	<script src="${pageContext.request.contextPath}/vendors/jquery/jquery.min.js"></script>
	<script src="${pageContext.request.contextPath}/vendors/jquery/jqueryui/jquery-ui.min.js"></script>
	<script src="${pageContext.request.contextPath}/vendors/jquery/jquery.timepicker.min.js"></script>
	<!-- Bootstrap -->
	<script src="${pageContext.request.contextPath}/vendors/bootstrap/js/bootstrap.bundle.min.js"></script>
	<script src="${pageContext.request.contextPath}/vendors/bootstrap/js/bootstrap-table.min.js"></script>
	<script src="${pageContext.request.contextPath}/vendors/bootstrap/js/bootstrap-datepicker.min.js"></script>
	<!-- Font Awesome -->
	<script src="${pageContext.request.contextPath}/vendors/fontawesome/js/all.min.js"></script>
	<script src="${pageContext.request.contextPath}/vendors/fontawesome/js/v4-shims.min.js"></script>
	<script src="${pageContext.request.contextPath}/vendors/i18n/i18next-1.11.2.min.js"></script>
	<script src="${pageContext.request.contextPath}/vendors/i18n/lang.js"></script>
	<script src="${pageContext.request.contextPath}/js/custom.min.js"></script>
	<script src="${pageContext.request.contextPath}/js/common.js"></script>
	<script src="${pageContext.request.contextPath}/js/mng/sche/modify_scheduler.js"></script>
</body>
</html>
