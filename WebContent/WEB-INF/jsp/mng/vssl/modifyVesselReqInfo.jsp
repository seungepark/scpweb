<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ include file="/WEB-INF/jsp/share/conf.jsp" %>
<c:forEach var="at" items="${auth}">
	<c:if test="${at eq 'P_SHIP_INFO_W'}">
		<c:set var="P_SHIP_INFO_W" value="true" />
	</c:if>
</c:forEach>
<c:if test="${empty P_SHIP_INFO_W}">
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
</head>

<body>
	<div class="body-wrap">
        <%@ include file="/WEB-INF/jsp/include/menu/sidebar_1_4.jsp"%>
        <div id="contentWrap" class="collapsed-content-wrap">
            <%@ include file="/WEB-INF/jsp/include/menu/header_1_4.jsp"%>
            <div class="main-container">
<%-- 				<%@ include file="/WEB-INF/jsp/include/menu/bread_1_4.jsp"%> --%>
				<div class="btn-option-hide pointer" id="dParentDataHide" data-i18n="hideParent"></div>
				<div id="dParentData" class="sec-option-card">
					<div class="row">
						<div class="col-md-3 col-sm-12">
							<div class="lb-title" data-i18n="hullNum"></div>
							<select id="hullNum" class=""></select>
						</div>
						<div class="col-md-6 col-sm-12">
							<div class="lb-title" data-i18n="desc"></div>
							<input id="desc" type="text" class="w-100" value="${bean.description}" maxlength="150">
						</div>
						<div class="col-md-3 col-sm-12">
							<div class="lb-title" data-i18n="status"></div>
							<input id="status" type="text" class="w-100" value="${bean.status}" disabled>
						</div>
					</div>
					<div class="sp-16"></div>
					<div class="row">
						<div class="col-md-3 col-sm-12">
							<div class="lb-title" data-i18n="shipType"></div>
							<select id="shiptype" class="">
								<c:forEach var="shiptype" items="${listShip}">
									<option value="${shiptype.val}" <c:if test="${shiptype.val eq bean.shiptype}">selected="selected" </c:if>>${shiptype.description}</option>
								</c:forEach>
							</select>
						</div>
						<div class="col-md-3 col-sm-12">
							<div class="lb-title" data-i18n="registerdOwner"></div>
							<input id="registerdowner" type="text" class="w-100" value="${bean.registerdowner}" maxlength="200">
						</div>
						<div class="col-md-3 col-sm-12">
							<div class="lb-title" data-i18n="grossTonnage"></div>
							<input id="grosstonnage" type="text" class="w-100" value="${bean.grosstonnage}" oninput="this.value = this.value.replace(/[^0-9.-]/g, '').replace(/(\..*)\./g, '$1').replace(/(\--*)\-/g, '$1');" maxlength="10">
						</div>
					</div>
					<div class="sp-16"></div>
					<div class="row">
						<div class="col-md-3 col-sm-12">
							<div class="lb-title" data-i18n="drawn"></div>
							<input id="drawn" type="text" class="w-100" value="${bean.drawn}" maxlength="200">
						</div>
						<div class="col-md-3 col-sm-12">
							<div class="lb-title" data-i18n="checked"></div>
							<input id="checked" type="text" class="w-100" value="${bean.checked}" maxlength="200">
						</div>
						<div class="col-md-3 col-sm-12">
							<div class="lb-title" data-i18n="manager"></div>
							<input id="managerIpt" type="text" class="w-100" value="${bean.manager}" maxlength="200">
						</div>
					</div>
				</div>
				<div class="sp-24"></div>
				<div class="tb-area">
					<div class="d-flex flex-row-reverse">
						<button class="bt-obj bt-primary" onClick="saveVesselReqInfoDet()">
							<img src="${pageContext.request.contextPath}/img/i_btn_save.svg" class="bt-icon" height="16px">
							<span data-i18n="btnSave"></span>
						</button>
               			<button class="bt-obj bt-secondary svg" onClick="addVesselReqInfoDet()">
							<img src="${pageContext.request.contextPath}/img/i_btn_add.svg" class="bt-icon" height="16px">
							<span data-i18n="btnAdd"></span>
						</button>
						<a href="${pageContext.request.contextPath}/mng/vssl/detailVesselReqInfo.html?uid=${bean.uid}">
							<button class="bt-obj bt-secondary svg">
								<img src="${pageContext.request.contextPath}/img/i_btn_return.svg" class="bt-icon" height="16px">
								<span data-i18n="btnCan"></span>
							</button>
						</a>
                   	</div>
                   	<div class="sp-16"></div>
					<div id="tbWrap" class="tb-wrap scroll-area-vessel-hide">
						<table id="tbModVesselReqInfoDetList" class="tb-style">
							<thead>
								<tr>
									<th><div class="tb-th-col"><span class="tb-th-content" data-i18n="list.seq"></span></div></th>
									<th><div class="tb-th-col"><span class="tb-th-content" data-i18n="list.reqinfotitle"></span></div></th>
									<th><div class="tb-th-col"><span class="tb-th-content" data-i18n="list.item"></span></div></th>
									<th><div class="tb-th-col"><span class="tb-th-content" data-i18n="list.unit"></span></div></th>
									<th><div class="tb-th-col"><span class="tb-th-content" data-i18n="list.name"></span></div></th>
									<th><div class="tb-th-col"><span class="tb-th-content" data-i18n="list.rpm"></span></div></th>
									<th><div class="tb-th-col"><span class="tb-th-content" data-i18n="list.loadrate"></span></div></th>
									<th><div class="tb-th-col-last"><span class="tb-th-content">&nbsp;</span></div></th>
								</tr>
							</thead>
							<tbody id="getVesselReqInfoDetList">
								<tr>
									<td class="text-center" colspan="8" data-i18n="share:noList"></td>
								</tr>
							</tbody>
						</table>
					</div>
				</div>
            </div>
		</div>
	</div>
	<script>
		const vsslReqInfoUid = "${bean.uid}";
		const bhullNum = "${bean.hullNum}"

		// title domain
		const reqinfotitleList = new Array();
		<c:forEach items="${listreqinfotitle}" var="item">
			reqinfotitleList.push({
			'value': '${item.val}',
			'desc': '${item.description}'
			});
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
	<script src="${pageContext.request.contextPath}/js/mng/vssl/modify_vesselReqInfo.js"></script>
</body>
</html>
