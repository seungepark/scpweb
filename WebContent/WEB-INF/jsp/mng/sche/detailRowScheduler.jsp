<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ include file="/WEB-INF/jsp/share/conf.jsp" %>
<c:forEach var="at" items="${auth}">
	<c:if test="${at eq 'P_PLAN_SCHE_R'}">
		<c:set var="P_PLAN_SCHE_R" value="true" />
	</c:if>
	<c:if test="${at eq 'P_PLAN_SCHE_W'}">
		<c:set var="P_PLAN_SCHE_W" value="true" />
	</c:if>
</c:forEach>
<c:if test="${empty P_PLAN_SCHE_R and empty P_PLAN_SCHE_W}">
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
	<!-- Bootstrap -->
	<link href="${pageContext.request.contextPath}/vendors/bootstrap/css/bootstrap.min.css" rel="stylesheet">
	<link href="${pageContext.request.contextPath}/vendors/bootstrap/css/bootstrap-table.min.css" rel="stylesheet">
	<!-- Font Awesome -->
	<link href="${pageContext.request.contextPath}/vendors/fontawesome/css/all.min.css" rel="stylesheet">
	<link href="${pageContext.request.contextPath}/vendors/fontawesome/css/v4-shims.min.css" rel="stylesheet">
	<link href="${pageContext.request.contextPath}/css/custom.min.css" rel="stylesheet">
	<link href="${pageContext.request.contextPath}/css/common.css" rel="stylesheet">

	<link href="${pageContext.request.contextPath}/css/ssLineGanttChart.css" rel="stylesheet">
</head>

<body>
	<div class="body-wrap">
        <%@ include file="/WEB-INF/jsp/include/menu/sidebar_1_1.jsp"%>
        <div id="contentWrap" class="collapsed-content-wrap">
            <%@ include file="/WEB-INF/jsp/include/menu/header_1_1.jsp"%>
            <div class="main-container">
<%-- 				<%@ include file="/WEB-INF/jsp/include/menu/bread_1_1.jsp"%> --%>
				<div class="tab-area">
                    <div class="tab-base active"><a href="${pageContext.request.contextPath}/mng/sche/detailRowScheduler.html?uid=${bean.uid}" data-i18n="tab.row"></a></div>
                    <div class="tab-base"><a href="${pageContext.request.contextPath}/mng/sche/detailChartScheduler.html?uid=${bean.uid}" data-i18n="tab.chart"></a></div>
                </div>
                <div class="sec-card">
                	<div class="row">
						<div class="col">
							<div class="x_panel">
								<!-- Parent Data List  START-->
								<div>
									<input type="hidden" id="parentUid" value="${bean.uid}">
									<input type="hidden" id="parentPeriod" value="${bean.period}">
									<input type="hidden" id="parentSdate" value="${bean.sdate}">
									<input type="hidden" id="parentEdate" value="${bean.edate}">
								</div>
								<!-- Parent Data List  END-->
								<div class="x_content" id="scheChartCont">
									<!-- Line Chart Canvas -->
									<%--<div id="schedulerLineChart"></div>--%>
									<div class="row" style="display: block;" id="scheduleManager"></div>
								</div>
							</div>
						</div>
					</div>
                </div>
                <div class="sp-24"></div>
                <div class="tb-area">
                	<div class="d-flex align-items-center">
						<div><div class="lb-title-no-sp" data-i18n="list.title"></div></div>
						<div class="ml-auto">
							<c:if test="${P_PLAN_SCHE_W}">
								<a href="${pageContext.request.contextPath}/mng/vssl/detailVesselReqInfo.html?tempUid=${bean.uid}" target="_blank">
									<button class="bt-obj bt-secondary svg">
										<img src="${pageContext.request.contextPath}/img/i_btn_newstatus.svg" class="bt-icon" height="16px">
										<span data-i18n="btnVsslReqInfo"></span>
									</button>
								</a>
								<c:choose>
									<c:when test="${bean.isOff eq 'Y'}">
										<button class="bt-obj bt-secondary svg" disabled>
											<img src="${pageContext.request.contextPath}/img/i_btn_modify.svg" class="bt-icon" height="16px">
											<span data-i18n="btnModify"></span>
										</button>
									</c:when>
									<c:otherwise>
										<a href="${pageContext.request.contextPath}/mng/sche/modifyScheduler.html?uid=${bean.uid}">
											<button class="bt-obj bt-secondary svg" >
												<img src="${pageContext.request.contextPath}/img/i_btn_modify.svg" class="bt-icon" height="16px">
												<span data-i18n="btnModify"></span>
											</button>
										</a>
									</c:otherwise>
								</c:choose>
							</c:if>
							<a href="${pageContext.request.contextPath}/mng/sche/scheduler.html">
								<button class="bt-obj bt-secondary svg">
									<img src="${pageContext.request.contextPath}/img/i_btn_list.svg" class="bt-icon" height="16px">
									<span data-i18n="btnList"></span>
								</button>
							</a>
							<button class="bt-obj bt-primary" onClick="scheDetRowListDownAll()"><img src="${pageContext.request.contextPath}/img/i_download.svg" height="16px"></button>
						</div>
					</div>
					<div class="sp-16"></div>
                    <div class="tb-wrap scroll-area-detailrowsche">
                    	<table id="tbRowSchedulerList" class="tb-style">
							<thead>
								<tr>
									<th><div class="tb-th-col"><span class="tb-th-content" data-i18n="list.cate"></span></div></th>
									<th><div class="tb-th-col"><span class="tb-th-content" data-i18n="list.tcnum"></span></div></th>
									<th><div class="tb-th-col"><span class="tb-th-content" data-i18n="list.desc"></span></div></th>
									<th><div class="tb-th-col"><span class="tb-th-content" data-i18n="list.ctype"></span></div></th>
									<th><div class="tb-th-col"><span class="tb-th-content" data-i18n="list.loadrate"></span></div></th>
									<th><div class="tb-th-col"><span class="tb-th-content" data-i18n="list.sdate"></span></div></th>
									<th><div class="tb-th-col"><span class="tb-th-content" data-i18n="list.stime"></span></div></th>
									<th><div class="tb-th-col"><span class="tb-th-content" data-i18n="list.edate"></span></div></th>
									<th><div class="tb-th-col"><span class="tb-th-content" data-i18n="list.etime"></span></div></th>
									<th><div class="tb-th-col"><span class="tb-th-content" data-i18n="list.seq"></span></div></th>
									<th><div class="tb-th-col-last"><span class="tb-th-content" data-i18n="list.per"></span></div></th>
								</tr>
							</thead>
							<tbody id="getScheRowList">
								<tr>
									<td class="text-center" colspan="11" data-i18n="share:noList"></td>
								</tr>
							</tbody>
						</table>
                    </div>
                </div>
            </div>
		</div>
	</div>
	<!-- The Tooltip-->
	<div id="chartTooltip" class="tooltip"></div>
	
	<!-- jQuery -->
	<script src="${pageContext.request.contextPath}/vendors/jquery/jquery.min.js"></script>
	<script src="${pageContext.request.contextPath}/vendors/jquery/jqueryui/jquery-ui.min.js"></script>
	<!-- chart -->
	<script src="${pageContext.request.contextPath}/vendors/chart/chart.js"></script>
	<script src="${pageContext.request.contextPath}/vendors/chart/chartjs-adapter-date-fns.bundle.min.js"></script>
	<script src="${pageContext.request.contextPath}/vendors/chart/chartjs-plugin-datalabels.js"></script>
	<!-- Bootstrap -->
	<script src="${pageContext.request.contextPath}/vendors/bootstrap/js/bootstrap.bundle.min.js"></script>
	<script src="${pageContext.request.contextPath}/vendors/bootstrap/js/bootstrap-table.min.js"></script>
	<!-- Font Awesome -->
	<script src="${pageContext.request.contextPath}/vendors/fontawesome/js/all.min.js"></script>
	<script src="${pageContext.request.contextPath}/vendors/fontawesome/js/v4-shims.min.js"></script>
	<script src="${pageContext.request.contextPath}/vendors/i18n/i18next-1.11.2.min.js"></script>
	<script src="${pageContext.request.contextPath}/vendors/i18n/lang.js"></script>
	<script src="${pageContext.request.contextPath}/js/custom.min.js"></script>
	<script src="${pageContext.request.contextPath}/js/common.js"></script>
	<script src="${pageContext.request.contextPath}/js/mng/sche/ssLineGanttChart.js"></script>
	<script src="${pageContext.request.contextPath}/js/mng/sche/detail_draw_charts.js"></script>
	<script src="${pageContext.request.contextPath}/js/mng/sche/detail_row_scheduler.js"></script>

</body>
</html>
