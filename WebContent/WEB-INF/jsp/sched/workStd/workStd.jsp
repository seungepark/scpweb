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
        <%@ include file="/WEB-INF/jsp/include/menu/sidebar_6_2.jsp"%>
        <div id="contentWrap" class="collapsed-content-wrap">
            <%@ include file="/WEB-INF/jsp/include/menu/header_6_2.jsp"%>
            <div class="main-container">
<%-- 				<%@ include file="/WEB-INF/jsp/include/menu/bread_6_2.jsp"%> --%>
				<div class="sec-option-card">
					<div class="d-flex flex-row-reverse">
                   		<c:if test="${P_GREEN_SCHE_W}">
                   			<button class="bt-obj bt-secondary svg" onClick="modify()">
								<img src="${pageContext.request.contextPath}/img/i_btn_modify.svg" class="bt-icon" height="16px">
								<span data-i18n="btnModify"></span>
							</button>
							<button class="bt-obj bt-primary svg" onClick="save()">
								<img src="${pageContext.request.contextPath}/img/i_btn_save.svg" class="bt-icon" height="16px">
								<span data-i18n="btnSave"></span>
							</button>
							<button class="bt-obj bt-primary svg" onClick="add()">
								<img src="${pageContext.request.contextPath}/img/i_btn_add.svg" class="bt-icon" height="16px">
								<span data-i18n="btnAdd"></span>
							</button>
							<button class="bt-obj bt-danger-outline svg" onClick="cancel()">
								<img src="${pageContext.request.contextPath}/img/i_btn_return.svg" class="bt-icon" height="16px">
								<span data-i18n="btnCancel"></span>
							</button>
							<button class="bt-obj bt-secondary svg" onClick="uncheck()">
								<img src="${pageContext.request.contextPath}/img/new/i_btn_uncheck.svg" class="bt-icon" height="16px">
								<span data-i18n="btnUncheck"></span>
							</button>
						</c:if>
                   	</div>
                   	<div class="sp-16"></div>
                   	<div id="addArea">
                   		<div class="tb-wrap">
	                    	<table class="tb-style">
								<thead>
									<tr>
										<th><div class="tb-th-col"><span class="tb-th-content" data-i18n="list.codeLevel"></span></div></th>
										<th><div class="tb-th-col"><span class="tb-th-content" data-i18n="list.group"></span></div></th>
										<th><div class="tb-th-col"><span class="tb-th-content" data-i18n="list.desc"></span></div></th>
				                        <th><div class="tb-th-col"><span class="tb-th-content" data-i18n="list.isOption"></span></div></th>
				                        <th><div class="tb-th-col"><span class="tb-th-content" data-i18n="list.color"></span></div></th>
				                        <th><div class="tb-th-col-last"><span class="tb-th-content" data-i18n="list.delete"></span></div></th>
									</tr>
								</thead>
								<tbody id="addList">
								</tbody>
							</table>
	                    </div>
                    	<div id="pagination" class="pg-area pt-1"></div>
                   		<div class="sp-16"></div>
                   	</div>
					<div id="list" class="scroll-area-workStd inner-scroll-container sec-inner-card-border"></div>
				</div>
            </div>
		</div>
	</div>
	
	<script>
		let _list = [];
		let _groupList = [];
		let _colorList = [];
		
		<c:forEach var="item" items="${list}">
	  		_list.push({
	  			uid: "${item.uid}",
	  			puid: "${item.parentUid}",
	  			lv: "${item.codeLevel}",
	  			desc: "${item.description}",
	  			isOption: "${item.isOption}",
	  			color: "${item.color}",
	  			isExp: true
	  		});
	  	</c:forEach>
		
		<c:forEach var="item" items="${listGroup}">
	  		_groupList.push({
	  			uid: "${item.uid}",
	  			desc: "${item.description}"
	  		});
	  	</c:forEach>
		
		<c:forEach var="item" items="${listColor}">
	  		_colorList.push("${item.val}");
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
  	<script src="${pageContext.request.contextPath}/js/sched/workStd/workStd.js"></script>
</body>
</html>
