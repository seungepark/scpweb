<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ include file="/WEB-INF/jsp/share/conf.jsp" %>
<c:forEach var="at" items="${auth}">
	<c:if test="${at eq 'P_DB_VESSEL_R'}">
		<c:set var="P_DB_VESSEL_R" value="true" />
	</c:if>
	<c:if test="${at eq 'P_DB_VESSEL_W'}">
		<c:set var="P_DB_VESSEL_W" value="true" />
	</c:if>
</c:forEach>
<c:if test="${empty P_DB_VESSEL_R and empty P_DB_VESSEL_W}">
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
  	<!-- Font Awesome -->
	<link href="${pageContext.request.contextPath}/vendors/fontawesome/css/all.min.css" rel="stylesheet">
	<link href="${pageContext.request.contextPath}/vendors/fontawesome/css/v4-shims.min.css" rel="stylesheet">
  	<link href="${pageContext.request.contextPath}/css/custom.min.css" rel="stylesheet">
  	<link href="${pageContext.request.contextPath}/css/common.css" rel="stylesheet">
</head>
<body>
	<div class="body-wrap">
        <%@ include file="/WEB-INF/jsp/include/menu/sidebar_3_1.jsp"%>
        <div id="contentWrap" class="collapsed-content-wrap">
            <%@ include file="/WEB-INF/jsp/include/menu/header_3_1.jsp"%>
            <div class="main-container">
<%-- 				<%@ include file="/WEB-INF/jsp/include/menu/bread_3_1.jsp"%> --%>
				<div class="sec-option-card">
					<div class="row">
						<div class="col-auto">
							<div class="lb-title" data-i18n="listOp.title"></div>
							<input type="text" class="" id="shipName">
						</div>
						<div class="col-auto">
							<div class="lb-title" data-i18n="listOp.ship"></div>
							<input type="text" class="" id="shipNo">
						</div>
						<div class="col">
							<div class="lb-title">&nbsp;</div>
							<div id="searchBtn">
								<button class="bt-obj bt-primary" onclick="getVesselList(1)">
									<img src="${pageContext.request.contextPath}/img/i_btn_search.svg" class="bt-icon" height="16px">
									<span data-i18n="listOp.btnSearch"></span>
								</button>
							</div>
						</div>
					</div>
				</div>
				<div class="sp-24"></div>
				<div class="tb-area">
<!-- 					<div class="d-flex flex-row-reverse"> -->
<%--                			<a href="${pageContext.request.contextPath}/db/vessel/newVessel.html"> --%>
<!-- 							<button class="bt-obj bt-secondary svg"> -->
<%-- 								<img src="${pageContext.request.contextPath}/img/i_btn_new.svg" class="bt-icon" height="16px"> --%>
<!-- 								<span data-i18n="btnNew"></span> -->
<!-- 							</button> -->
<!-- 						</a> -->
<!--                    	</div> -->
                   	<div class="sp-16"></div>
                    <div class="tb-wrap tb-wrap-height-op-btn">
                    	<table class="tb-style">
							<thead>
								<tr>
									<th rowspan="2"><div class="tb-th-col"><span class="tb-th-content" data-i18n="list.shipNum"></span></div></th>
									<th rowspan="2"><div class="tb-th-col"><span class="tb-th-content" data-i18n="list.regOwner"></span></div></th>
									<th rowspan="2"><div class="tb-th-col"><span class="tb-th-content" data-i18n="list.shipClass"></span></div></th>
									<th rowspan="2"><div class="tb-th-col"><span class="tb-th-content" data-i18n="list.shipType"></span></div></th>
									<th rowspan="2"><div class="tb-th-col"><span class="tb-th-content" data-i18n="list.typeModel"></span></div></th>
									<th rowspan="2"><div class="tb-th-col"><span class="tb-th-content" data-i18n="list.series"></span></div></th>
									<th rowspan="2"><div class="tb-th-col"><span class="tb-th-content" data-i18n="list.dock"></span></div></th>
									<th rowspan="2"><div class="tb-th-col"><span class="tb-th-content" data-i18n="list.loc"></span></div></th>
									<th rowspan="2"><div class="tb-th-col"><span class="tb-th-content" data-i18n="list.isSg"></span></div></th>
									<th colspan="3" class="px-3 pb-0"><div class="tb-th-col-bottom"><span class="tb-th-content" data-i18n="list.green"></span></div></th>
									<th rowspan="2" class="pl-0"><div class="tb-th-col-both"><span class="tb-th-content" data-i18n="list.isTrial"></span></div></th>
									<th rowspan="2"><div class="tb-th-col"><span class="tb-th-content" data-i18n="list.fuel"></span></div></th>
									<th rowspan="2"><div class="tb-th-col"><span class="tb-th-content" data-i18n="list.lc"></span></div></th>
									<th rowspan="2"><div class="tb-th-col"><span class="tb-th-content" data-i18n="list.workFinish"></span></div></th>
									<th rowspan="2"><div class="tb-th-col"><span class="tb-th-content" data-i18n="[html]list.crew1"></span></div></th>
									<th rowspan="2"><div class="tb-th-col"><span class="tb-th-content" data-i18n="[html]list.crew2"></span></div></th>
									<th rowspan="2"><div class="tb-th-col"><span class="tb-th-content" data-i18n="[html]list.crew3"></span></div></th>
									<th rowspan="2"><div class="tb-th-col"><span class="tb-th-content" data-i18n="[html]list.com"></span></div></th>
									<th rowspan="2"><div class="tb-th-col-last"><span class="tb-th-content" data-i18n="list.operate"></span></div></th>
								</tr>
								<tr>
									<th><div class="tb-th-col"><span class="tb-th-content" data-i18n="list.isLoad"></span></div></th>
									<th><div class="tb-th-col"><span class="tb-th-content" data-i18n="list.isUnload"></span></div></th>
									<th><div class="tb-th-col-last"><span class="tb-th-content" data-i18n="list.isCold"></span></div></th>
								</tr>
							</thead>
							<tbody id="list">
								<tr>
									<td class="text-center" colspan="21" data-i18n="share:noList"></td>
								</tr>
							</tbody>
						</table>
                    </div>
                    <div class="sp-16"></div>
                    <div class="pg-area" id="pagination"></div>
                </div>
            </div>
		</div>
	</div>
	<!--detail modal-->
	<div id="detailModal" class="modal fade" tabindex="-1" role="dialog" aria-labelledby="detailModal" aria-hidden="true">
		<div class="modal-dialog modal-dialog-centered modal-lg" role="document">
			<div class="modal-content">
				<div class="modal-header">
					<span class="modal-title" data-i18n="modal.title"></span>
					<button type="button" class="close" data-dismiss="modal" aria-label="Close">
						<span aria-hidden="true">&times;</span>
					</button>
				</div>
				<div class="modal-body">
					<div id="detailModalDesc" class="pop-title"></div>
					<table class="tb-style-view">
						<tr>
							<td data-i18n="modal.crew1" class="font-weight-bold" nowrap></td>
							<td data-i18n="modal.pro" nowrap></td>
							<td><input id="detailModalCrew1Pro" type="text"/></td>
							<td data-i18n="modal.lead" nowrap></td>
							<td><input id="detailModalCrew1Lead" type="text"/></td>
						</tr>
						<tr>
							<td data-i18n="modal.crew2" class="font-weight-bold" nowrap></td>
							<td data-i18n="modal.pro" nowrap></td>
							<td><input id="detailModalCrew2Pro" type="text"/></td>
							<td data-i18n="modal.lead" nowrap></td>
							<td><input id="detailModalCrew2Lead" type="text"/></td>
						</tr>
						<tr>
							<td data-i18n="modal.crew3" class="font-weight-bold" nowrap></td>
							<td data-i18n="modal.pro" nowrap></td>
							<td><input id="detailModalCrew3Pro" type="text"/></td>
							<td data-i18n="modal.lead" nowrap></td>
							<td><input id="detailModalCrew3Lead" type="text"/></td>
						</tr>
						<tr>
							<td data-i18n="modal.com" class="font-weight-bold" nowrap></td>
							<td data-i18n="modal.main" nowrap></td>
							<td><input id="detailModalComMain" type="text"/></td>
							<td data-i18n="modal.sub" nowrap></td>
							<td><input id="detailModalComSub" type="text"/></td>
						</tr>
						<tr>
							<td data-i18n="modal.op" class="font-weight-bold" nowrap></td>
							<td data-i18n="modal.main" nowrap></td>
							<td><input id="detailModalOp" type="text"/></td>
							<td colspan="2" nowrap>
								<div class="d-flex">
			  						<div class="flex-fill" data-i18n="modal.trial"></div>
			  						<div class="flex-fill"><input id="detailModalIsTrial" type="checkbox"></div>
								</div>
							</td>
						</tr>
						<tr>
							<td data-i18n="modal.fuel" class="font-weight-bold" nowrap></td>
							<td></td>
							<td>
								<select id="detailModalIsFuel">
									<option value="">--</option>
									<option value="DF">DF</option>
								</select>
							</td>
							<td></td>
							<td></td>
						</tr>
						<tr>
							<td data-i18n="modal.green" class="font-weight-bold" nowrap></td>
							<td></td>
							<td colspan="3">
								<div class="d-flex">
									<div class="flex-fill form-check align-middle">
				  						<input id="detailModalIsLoad" type="checkbox" class="form-check-input">
				  						<label for="detailModalIsLoad" class="form-check-label" data-i18n="modal.load"></label>
									</div>
									<div class="flex-fill form-check align-middle">
				  						<input id="detailModalIsUnload" type="checkbox" class="form-check-input">
				  						<label for="detailModalIsUnload" class="form-check-label" data-i18n="modal.unload"></label>
									</div>
									<div class="flex-fill form-check align-middle">
				  						<input id="detailModalIsCold" type="checkbox" class="form-check-input">
				  						<label for="detailModalIsCold" class="form-check-label" data-i18n="modal.cold"></label>
									</div>
								</div>
							</td>
						</tr>
					</table>
				</div>
				<div class="modal-footer">
					<button class="bt-obj bt-secondary" data-dismiss="modal" aria-label="Close" data-i18n="modal.btnClose"></button>
					<c:choose>
						<c:when test="${P_DB_VESSEL_W}">
							<button class="bt-obj bt-primary" onclick="updateVessel()" data-i18n="modal.btnOk"></button>
						</c:when>
						<c:otherwise>
							<button class="bt-obj bt-primary" disabled data-i18n="modal.btnOk"></button>
						</c:otherwise>
					</c:choose>
				</div>
			</div>
		</div>
	</div>
	<!-- jQuery -->
	<script src="${pageContext.request.contextPath}/vendors/jquery/jquery.min.js"></script>
	<script src="${pageContext.request.contextPath}/vendors/jquery/jqueryui/jquery-ui.min.js"></script>
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
	<script src="${pageContext.request.contextPath}/js/db/vessel/vessel.js"></script>
</body>
</html>