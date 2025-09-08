<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ include file="/WEB-INF/jsp/share/conf.jsp" %>
<c:forEach var="at" items="${auth}">
	<c:if test="${at eq 'P_DB_PJT_R'}">
		<c:set var="P_DB_PJT_R" value="true" />
	</c:if>
	<c:if test="${at eq 'P_DB_PJT_W'}">
		<c:set var="P_DB_PJT_W" value="true" />
	</c:if>
</c:forEach>
<c:if test="${empty P_DB_PJT_R and empty P_DB_PJT_W}">
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
</head>

<body>
	<div class="body-wrap">
        <%@ include file="/WEB-INF/jsp/include/menu/sidebar_3_4.jsp"%>
        <div id="contentWrap" class="collapsed-content-wrap">
            <%@ include file="/WEB-INF/jsp/include/menu/header_3_4.jsp"%>
            <div class="main-container">
<%-- 				<%@ include file="/WEB-INF/jsp/include/menu/bread_3_4.jsp"%> --%>
				<div class="sec-option-card">
					<div class="row">
						<div class="col-md-3 col-sm-12 detail-label-border-b" data-i18n="shipType"></div>
						<div class="col-md-3 col-sm-12 detail-content-border-b">
							<c:forEach var="shiptype" items="${listShip}">
								<c:if test="${shiptype.val eq bean.shiptype}">
									${shiptype.description}
								</c:if>
							</c:forEach>
						</div>
						<div class="col-md-3 col-sm-12 detail-label-border-b" data-i18n="schedType"></div>
						<div class="col-md-3 col-sm-12 detail-content-border-b">
							<c:forEach var="schedtype" items="${listschedtype}">
								<c:if test="${schedtype.val eq bean.schedtype}">
									${schedtype.description}
								</c:if>
							</c:forEach>
						</div>
					</div>
					<div class="row">
						<div class="col-md-3 col-sm-12 detail-label-border-b" data-i18n="desc"></div>
						<div class="col-md-9 col-sm-12 detail-content-border-b">${bean.description}</div>
					</div>
					<div class="row">
						<div class="col-md-3 col-sm-12 detail-label-border-b" data-i18n="status"></div>
						<div class="col-md-3 col-sm-12 detail-content-border-b">${bean.status}</div>
						<div class="col-md-3 col-sm-12 detail-label-border-b" data-i18n="revnum"></div>
						<div class="col-md-3 col-sm-12 detail-content-border-b">${bean.revnum}</div>
					</div>
				</div>
				<div class="sp-24"></div>
				<div class="tb-area">
					<div class="d-flex flex-row-reverse">
                   		<button class="bt-obj bt-primary" onClick="scheDetRowListDownAll()"><img src="${pageContext.request.contextPath}/img/i_download.svg" height="16px"></button>
               			<c:if test="${P_DB_PJT_W}">
	               			<a href="${pageContext.request.contextPath}/mng/scheBasic/modifyScheduleCode.html?uid=${bean.uid}">
								<button class="bt-obj bt-secondary svg">
									<img src="${pageContext.request.contextPath}/img/i_btn_modify.svg" class="bt-icon" height="16px">
									<span data-i18n="btnModify"></span>
								</button>
							</a>
						</c:if>
						<a href="${pageContext.request.contextPath}/mng/scheBasic/scheduleCode.html">
							<button class="bt-obj bt-secondary svg">
								<img src="${pageContext.request.contextPath}/img/i_btn_list.svg" class="bt-icon" height="16px">
								<span data-i18n="btnList"></span>
							</button>
						</a>
                   	</div>
                   	<div class="sp-16"></div>
					<div class="tb-wrap scroll-area-schecode">
						<table id="tbRowSchedulerList" class="tb-style">
							<thead>
		                    	<tr>
	                                <th><div class="tb-th-col cursor-pointer tb-th-col-align" id="list0" onclick="tbAlign(this, 0)"><span class="tb-th-content" data-i18n="list.codelv"></span></div></th>
	                                <th><div class="tb-th-col cursor-pointer tb-th-col-align" id="list1" onclick="tbAlign(this, 1)"><span class="tb-th-content" data-i18n="list.displaycode"></span></div></th>
	                                <th><div class="tb-th-col cursor-pointer tb-th-col-align" id="list2" onclick="tbAlign(this, 2)"><span class="tb-th-content" data-i18n="list.desc"></span></div></th>
	                                <th><div class="tb-th-col cursor-pointer tb-th-col-align" id="list3" onclick="tbAlign(this, 3)"><span class="tb-th-content" data-i18n="list.ctype"></span></div></th>
	                                <th><div class="tb-th-col cursor-pointer tb-th-col-align" id="list4" onclick="tbAlign(this, 4)"><span class="tb-th-content" data-i18n="list.loadstr"></span></div></th>
	                                <th><div class="tb-th-col cursor-pointer tb-th-col-align" id="list5" onclick="tbAlign(this, 5)"><span class="tb-th-content" data-i18n="list.loadrate"></span></div></th>
	                                <th><div class="tb-th-col cursor-pointer tb-th-col-align" id="list6" onclick="tbAlign(this, 6)"><span class="tb-th-content" data-i18n="list.dtype"></span></div></th>
	                                <th><div class="tb-th-col cursor-pointer tb-th-col-align" id="list7" onclick="tbAlign(this, 7)"><span class="tb-th-content" data-i18n="list.per"></span></div></th>
	                                <th><div class="tb-th-col cursor-pointer tb-th-col-align" id="list8" onclick="tbAlign(this, 8)"><span class="tb-th-content" data-i18n="list.readTm"></span></div></th>
	                                <th><div class="tb-th-col cursor-pointer tb-th-col-align" id="list9" onclick="tbAlign(this, 9)"><span class="tb-th-content" data-i18n="list.seq"></span></div></th>
	                                <th><div class="tb-th-col-last cursor-pointer tb-th-col-align" id="list10" onclick="tbAlign(this, 10)"><span class="tb-th-content" data-i18n="list.sametcnum"></span></div></th>
	                            </tr>
		                  	</thead>
							<tbody id="getScheCodeDetList">
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
	<script>
	  	var scheCodeUid = "${bean.uid}";
	</script>
	
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
	<script src="${pageContext.request.contextPath}/js/mng/scheBasic/detail_scheduleCode.js"></script>
</body>
</html>
