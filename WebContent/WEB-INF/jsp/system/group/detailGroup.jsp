<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ include file="/WEB-INF/jsp/share/conf.jsp"%>
<c:forEach var="at" items="${auth}">
	<c:if test="${at eq 'P_SYS_GROUP_R'}">
		<c:set var="P_SYS_GROUP_R" value="true" />
	</c:if>
	<c:if test="${at eq 'P_SYS_GROUP_W'}">
		<c:set var="P_SYS_GROUP_W" value="true" />
	</c:if>
</c:forEach>
<c:if test="${empty P_SYS_GROUP_R and empty P_SYS_GROUP_W}">
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

<!-- Bootstrap -->
<link href="${pageContext.request.contextPath}/vendors/bootstrap/css/bootstrap.min.css" rel="stylesheet">
<link href="${pageContext.request.contextPath}/vendors/bootstrap/css/bootstrap-treeview.min.css" rel="stylesheet">
<!-- Font Awesome -->
<link href="${pageContext.request.contextPath}/vendors/fontawesome/css/all.min.css" rel="stylesheet">
<link href="${pageContext.request.contextPath}/vendors/fontawesome/css/v4-shims.min.css" rel="stylesheet">
<link href="${pageContext.request.contextPath}/css/custom.min.css" rel="stylesheet">
<link href="${pageContext.request.contextPath}/css/common.css" rel="stylesheet">
</head>

<body>
	<div class="body-wrap">
        <%@ include file="/WEB-INF/jsp/include/menu/sidebar_5_1.jsp"%>
        <div id="contentWrap" class="collapsed-content-wrap">
            <%@ include file="/WEB-INF/jsp/include/menu/header_5_1.jsp"%>
            <div class="main-container">
<%-- 				<%@ include file="/WEB-INF/jsp/include/menu/bread_5_1.jsp"%> --%>
				<div class="sec-option-card">
					<div class="d-flex detail-area">
						<div class="flex-fill detail-label" data-i18n="groupOp.code"></div>
						<div class="flex-fill detail-content">${bean.groupName}</div>
						<div class="flex-fill detail-label" data-i18n="groupOp.desc"></div>
						<div class="flex-fill detail-content">${bean.description}</div>
						<div class="flex-fill detail-label" data-i18n="groupOp.kind"></div>
						<div class="flex-fill detail-content">
							<c:choose>
								<c:when test="${bean.kind eq 'GROUP'}">
									<span>Group Leader</span>
								</c:when>
								<c:when test="${bean.kind eq 'CAPTAIN'}">
									<span>Captain</span>
								</c:when>
								<c:when test="${bean.kind eq 'ADMIN'}">
									<span>Administrator</span>
								</c:when>
								<c:when test="${bean.kind eq 'SYS'}">
									<span>System</span>
								</c:when>
								<c:otherwise>
									<span>Worker</span>
								</c:otherwise>
							</c:choose>
						</div>
						<div class="flex-fill detail-label" data-i18n="groupOp.status"></div>
						<div class="flex-fill detail-content">
							<c:choose>
								<c:when test="${bean.status eq 'ACT'}">
									Active
								</c:when>
								<c:otherwise>
									Inactive
								</c:otherwise>
							</c:choose>
						</div>
					</div>
				</div>
				<div class="sp-24"></div>
				<div class="sec-card">
					<div class="d-flex">
						<div class="flex-fill">
							<div class="lb-title" data-i18n="auth.title"></div>
							<div class="inner-scroll-container detail-scroll-area-group">
								<div id="treeView"></div>
							</div>
						</div>
						<div class="sp-w-36"></div>
						<div class="flex-fill">
							<div class="lb-title" data-i18n="user.title"></div>
							<table class="tb-style-view">
								<thead>
									<tr>
										<th><div class="tb-th-col"><span class="tb-th-content" data-i18n="user.id"></span></div></th>
										<th><div class="tb-th-col"><span class="tb-th-content" data-i18n="user.craft"></span></div></th>
										<th><div class="tb-th-col-last"><span class="tb-th-content" data-i18n="user.name"></span></div></th>
									</tr>
								</thead>
								<tbody>
									<c:choose>
										<c:when test="${listUser.size() > 0}">
											<c:forEach var="user" items="${listUser}">
												<tr>
													<td>${user.userId}</td>
													<td>${user.posCode}</td>
													<td>${user.firstName} ${user.lastName}</td>
												</tr>
											</c:forEach>
										</c:when>
										<c:otherwise>
											<tr>
												<td class="text-center" colspan="3" data-i18n="share:noList"></td>
											</tr>
										</c:otherwise>
									</c:choose>
								</tbody>
							</table>
						</div>
					</div>
					<div class="sp-16"></div>
					<div class="d-flex flex-row-reverse">
						<c:if test="${P_SYS_GROUP_W}">
							<a href="${pageContext.request.contextPath}/system/group/modifyGroup.html?uid=${bean.uid}">
								<button class="bt-obj bt-primary">
									<img src="${pageContext.request.contextPath}/img/i_btn_modify.svg" class="bt-icon" height="16px">
									<span data-i18n="auth.btnModify"></span>
								</button>
							</a>
						</c:if>
						<a href="${pageContext.request.contextPath}/system/group.html">
							<button class="bt-obj bt-secondary svg">
								<img src="${pageContext.request.contextPath}/img/i_btn_list.svg" class="bt-icon" height="16px">
								<span data-i18n="auth.btnList"></span>
							</button>
						</a>
					</div>
				</div>
            </div>
		</div>
	</div>
	<script>
	  	var oldGroupList = [];
		//그룹 목록 초기화
	  	<c:forEach var="item" items="${list}">
	  		oldGroupList.push(${item.authInfoUid});
	  	</c:forEach>
	</script>
	<!-- jQuery -->
	<script src="${pageContext.request.contextPath}/vendors/jquery/jquery.min.js"></script>
	<!-- Bootstrap -->
	<script src="${pageContext.request.contextPath}/vendors/bootstrap/js/bootstrap.bundle.min.js"></script>
	<script src="${pageContext.request.contextPath}/vendors/bootstrap/js/bootstrap-treeview.min.js"></script>
	<!-- Font Awesome -->
    <script src="${pageContext.request.contextPath}/vendors/fontawesome/js/all.min.js"></script>
    <script src="${pageContext.request.contextPath}/vendors/fontawesome/js/v4-shims.min.js"></script>
	<script src="${pageContext.request.contextPath}/vendors/i18n/i18next-1.11.2.min.js"></script>
	<script src="${pageContext.request.contextPath}/vendors/i18n/lang.js"></script>
	<script src="${pageContext.request.contextPath}/js/custom.min.js"></script>
	<script src="${pageContext.request.contextPath}/js/common.js"></script>
	<script src="${pageContext.request.contextPath}/js/system/detail_group.js"></script>
</body>
</html>
