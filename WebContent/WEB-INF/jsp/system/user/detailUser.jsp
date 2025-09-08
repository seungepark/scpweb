<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ include file="/WEB-INF/jsp/share/conf.jsp"%>
<c:forEach var="at" items="${auth}">
	<c:if test="${at eq 'P_SYS_USER_R'}">
		<c:set var="P_SYS_USER_R" value="true" />
	</c:if>
	<c:if test="${at eq 'P_SYS_USER_W'}">
		<c:set var="P_SYS_USER_W" value="true" />
	</c:if>
</c:forEach>
<c:if test="${empty P_SYS_USER_R and empty P_SYS_USER_W}">
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
        <%@ include file="/WEB-INF/jsp/include/menu/sidebar_5_2.jsp"%>
        <div id="contentWrap" class="collapsed-content-wrap">
            <%@ include file="/WEB-INF/jsp/include/menu/header_5_2.jsp"%>
            <div class="main-container">
<%-- 				<%@ include file="/WEB-INF/jsp/include/menu/bread_5_2.jsp"%> --%>
				<div class="sec-card">
					<div class="sp-24"></div>
					<div class="row">
						<div class="col-auto user-img-area">
							<img src="${pageContext.request.contextPath}/getProImg.html?uid=${bean.uid}" width="120" height="120" class="rounded-circle">
						</div>
						<div class="col px-4">
							<table>
								<tbody>
									<tr>
										<td class="detail-data-area-top">
											<div class="detail-label-user" data-i18n="userId"></div>
											<div class="detail-content-user">${bean.userId}</div>
										</td>
										<td></td>
									</tr>
									<tr>
										<td class="detail-data-area">
											<div class="detail-label-user" data-i18n="firstName"></div>
											<div class="detail-content-user">${bean.firstName}</div>
										</td>
										<td class="detail-data-area">
											<div class="detail-label-user" data-i18n="lastName"></div>
											<div class="detail-content-user">${bean.lastName}</div>
										</td>
									</tr>
									<tr>
										<td class="detail-data-area">
											<div class="detail-label-user" data-i18n="craft"></div>
											<div class="detail-content-user">${bean.codeName}</div>
										</td>
										<td></td>
									</tr>
									<tr>
										<td class="detail-data-area">
											<div class="detail-label-user" data-i18n="status"></div>
											<div class="detail-content-user">
												<c:choose>
													<c:when test="${bean.status eq 'ACT'}">
														Active
													</c:when>
													<c:otherwise>
														Inactive
													</c:otherwise>
												</c:choose>
											</div>
										</td>
										<td></td>
									</tr>
									<tr>
										<td class="detail-data-area">
											<div class="detail-label-user" data-i18n="workGroup"></div>
											<div class="detail-content-user">
												<c:forEach var="item" items="${listGroup}" varStatus="status">
													${item.groupName}<c:if test="${!status.last}"> , </c:if>
												</c:forEach>
											</div>
										</td>
										<td></td>
									</tr>
								</tbody>
							</table>
						</div>
					</div>
					<div class="sp-16"></div>
					<div class="d-flex flex-row-reverse">
						<c:if test="${P_SYS_USER_W}">
							<a href="${pageContext.request.contextPath}/system/user/modifyUser.html?uid=${bean.uid}">
								<button class="bt-obj bt-primary">
									<img src="${pageContext.request.contextPath}/img/i_btn_modify.svg" class="bt-icon" height="16px">
									<span data-i18n="btnModify">Modify</span>
								</button>
							</a>
						</c:if>
						<a href="${pageContext.request.contextPath}/system/user.html">
							<button class="bt-obj bt-secondary svg">
								<img src="${pageContext.request.contextPath}/img/i_btn_list.svg" class="bt-icon" height="16px">
								<span data-i18n="btnList">List</span>
							</button>
						</a>
					</div>
				</div>
            </div>
		</div>
	</div>
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
	<script src="${pageContext.request.contextPath}/js/system/detail_user.js"></script>
</body>
</html>
