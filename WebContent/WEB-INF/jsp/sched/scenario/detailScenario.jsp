<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
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
        <%@ include file="/WEB-INF/jsp/include/menu/sidebar_6_3.jsp"%>
        <div id="contentWrap" class="collapsed-content-wrap">
            <%@ include file="/WEB-INF/jsp/include/menu/header_6_3.jsp"%>
            <div class="main-container">
<%-- 				<%@ include file="/WEB-INF/jsp/include/menu/bread_6_3.jsp"%> --%>
				<div class="sec-option-card">
					<div class="row">
						<div class="col-md-3 col-sm-12 detail-label-border-b" data-i18n="title"></div>
						<div class="col-md-3 col-sm-12 detail-content-border-b">${bean.title}</div>
						<div class="col-md-3 col-sm-12 detail-label-border-b" data-i18n="shipType"></div>
						<div class="col-md-3 col-sm-12 detail-content-border-b">${bean.shipTypeDesc}</div>
					</div>
					<div class="row">
						<div class="col-md-3 col-sm-12 detail-label-border-b" data-i18n="desc"></div>
						<div class="col-md-9 col-sm-12 detail-content-border-b">${bean.description}</div>
					</div>
					<div class="row">
						<div class="col-md-3 col-sm-12 detail-label-border-b" data-i18n="projEvent"></div>
						<div class="col-md-3 col-sm-12 detail-content-border-b">${bean.projEvent}</div>
						<div class="col-md-3 col-sm-12 detail-label-border-b" data-i18n="workTime"></div>
						<div class="col-md-3 col-sm-12 detail-content-border-b" id="workTime"></div>
					</div>
					<div class="row">
						<div class="col-md-3 col-sm-12 detail-label-border-b" data-i18n="lngTotal"></div>
						<div class="col-md-3 col-sm-12 detail-content-border-b" id="lngTotal"></div>
						<div class="col-md-3 col-sm-12 detail-label-border-b" data-i18n="ln2Total"></div>
						<div class="col-md-3 col-sm-12 detail-content-border-b" id="ln2Total"></div>
					</div>
					<div class="row">
						<div class="col-md-3 col-sm-12 detail-label-border-b" data-i18n="margin"></div>
						<div class="col-md-3 col-sm-12 detail-content-border-b" id="margin"></div>
						<div class="col-md-3 col-sm-12 detail-label-border-b" data-i18n="revenue"></div>
						<div class="col-md-3 col-sm-12 detail-content-border-b" id="revenue"></div>
					</div>
					<div class="row">
						<div class="col-md-3 col-sm-12 detail-label-border-b" data-i18n="cost"></div>
						<div class="col-md-3 col-sm-12 detail-content-border-b" id="cost"></div>
						<div class="col-md-3 col-sm-12 detail-label-border-b" data-i18n="exRate"></div>
						<div class="col-md-3 col-sm-12 detail-content-border-b" id="exRate"></div>
					</div>
				</div>
				<div class="sp-24"></div>
				<div class="tb-area">
					<div class="d-flex flex-row-reverse">
						<button class="bt-obj bt-primary" onClick="listDown()"><img src="${pageContext.request.contextPath}/img/i_download.svg" height="16px"></button>
               			<c:if test="${P_GREEN_SCHE_W}">
	               			<a href="${pageContext.request.contextPath}/sched/scenario/modifyScenario.html?uid=${bean.uid}">
								<button class="bt-obj bt-secondary svg">
									<img src="${pageContext.request.contextPath}/img/i_btn_modify.svg" class="bt-icon" height="16px">
									<span data-i18n="btnModify"></span>
								</button>
							</a>
						</c:if>
						<a href="${pageContext.request.contextPath}/sched/scenario/scenarioList.html">
							<button class="bt-obj bt-secondary svg">
								<img src="${pageContext.request.contextPath}/img/i_btn_list.svg" class="bt-icon" height="16px">
								<span data-i18n="btnList"></span>
							</button>
						</a>
                   	</div>
                   	<div class="sp-16"></div>
                    <div class="tb-wrap scroll-area-scenario">
                    	<table class="tb-style-view">
							<thead>
								<tr>
									<th><div class="tb-th-col"><span class="tb-th-content" data-i18n="list.seq"></span></div></th>
									<th><div class="tb-th-col"><span class="tb-th-content" data-i18n="list.desc"></span></div></th>
									<th><div class="tb-th-col"><span class="tb-th-content" data-i18n="list.color"></span></div></th>
									<th><div class="tb-th-col"><span class="tb-th-content" data-i18n="list.option"></span></div></th>
									<th><div class="tb-th-col"><span class="tb-th-content" data-i18n="list.workTime"></span></div></th>
									<th><div class="tb-th-col"><span class="tb-th-content" data-i18n="list.lng"></span></div></th>
									<th><div class="tb-th-col-last"><span class="tb-th-content" data-i18n="list.ln2"></span></div></th>
								</tr>
							</thead>
							<tbody id="list">
								<tr>
									<td class="text-center" colspan="7" data-i18n="share:noList"></td>
								</tr>
							</tbody>
						</table>
                    </div>
                </div>
            </div>
		</div>
	</div>
  	
  	<script>
		let _title = "${bean.title}";
		let _shipType = "${bean.shipType}";
		let _projEvent = "${bean.projEvent}";
		let _workTime = "${bean.workTime}";
		let _lngTotal = "${bean.lngTotal}";
		let _ln2Total = "${bean.ln2Total}";
		let _margin = "${bean.margin}";
		let _marginCurrency = "${bean.marginCurrency}";
		let _revenue = "${bean.revenue}";
		let _revenueCurrency = "${bean.revenueCurrency}";
		let _cost = "${bean.cost}";
		let _costCurrency = "${bean.costCurrency}";
		let _exRate = "${bean.exRate}";
		let _list = [];
		let _optionList = [];
		
		<c:forEach var="item" items="${list}">
	  		_list.push({
	  			seq: "${item.seq}",
	  			desc: "${item.description}",
	  			color: "${item.color}",
	  			isOption: "${item.isOption}",
	  			option: "${item.optionData}",
	  			workTime: "${item.workTime}",
	  			lng: "${item.lng}",
	  			ln2: "${item.ln2}"
	  		});
	  	</c:forEach>
	  	
	  	<c:forEach var="item" items="${listOption}">
	  		_optionList.push("${item.val}");
	  	</c:forEach>
	</script>
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
  	<script src="${pageContext.request.contextPath}/js/sched/scenario/detailScenario.js"></script>
</body>
</html>
