<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ include file="/WEB-INF/jsp/share/conf.jsp"%>
<c:forEach var="at" items="${auth}">
	<c:if test="${at eq 'P_SYS_ULINE'}">
		<c:set var="P_SYS_ULINE" value="true" />
	</c:if>
</c:forEach>
<c:if test="${empty P_SYS_ULINE}">
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
        <%@ include file="/WEB-INF/jsp/include/menu/sidebar_5_3.jsp"%>
        <div id="contentWrap" class="collapsed-content-wrap">
            <%@ include file="/WEB-INF/jsp/include/menu/header_5_3.jsp"%>
            <div class="main-container">
<%-- 				<%@ include file="/WEB-INF/jsp/include/menu/bread_5_3.jsp"%> --%>
				<div class="row">
					<div class="col-xl-12 col-lg-12">
						<div class="page-title">
							<div class="x_content">
								<h3 class="g_text_primary font-weight-bold my-0" data-i18n="title">Approval Modify</h3>
							</div>
						</div>
					</div>
				</div>
				<div class="row">
					<div class="col-12">
						<div class="x_panel">
							<div class="x_content">
								<div class="tree" id="treeView">
								    <ul>
										<li>
											<a href="#">Captain</a>
											<ul>
												<c:forEach var="line" items="${list}">
													<li>
														<a href="#">${line.groupName}</a>
														<ul>
															<c:forEach var="subLine" items="${line.subList}">
																<li><a href="#">${subLine.groupName}</a></li>
															</c:forEach>
														</ul>
													</li>
												</c:forEach>
											</ul>
										</li>
									</ul>
								</div>
							</div>
						</div>		
						<div class="x_panel">
							<div class="x_content">
								<div class="row x_title border0">
									<h2 data-i18n="setting">Approval Setting</h2>
								</div>
								<c:forEach var="line2" items="${list}">
									<c:forEach var="worker" items="${line2.subList}">
										<div class="row">
											<div class="col-md-3 col-sm-12 pt-3">
												<label for="worker${worker.fromAuthGroupUid}" class="mb-0">${worker.groupName}</label>
												<select id="worker${worker.fromAuthGroupUid}" onChange="onChangeLeader(this, ${worker.fromAuthGroupUid}, '${worker.groupName}');" class="form-control">
													<c:forEach var="leader" items="${list}">
														<c:choose>
															<c:when test="${leader.fromAuthGroupUid == worker.toAuthGroupUid}">
																<option value="${leader.fromAuthGroupUid}" selected>${leader.groupName}</option>
															</c:when>
															<c:otherwise>
																<option value="${leader.fromAuthGroupUid}">${leader.groupName}</option>
															</c:otherwise>
														</c:choose>
													</c:forEach>
												</select>
											</div>
										</div>
									</c:forEach>
								</c:forEach>
								<p class="clear-both ">
									<a href="${pageContext.request.contextPath}/system/line/line.html">
										<button type="button" class="btn btn-secondary float-right">
											<img src="${pageContext.request.contextPath}/img/i_btn_list.svg" class="mr-1" height="16px">
											<span data-i18n="btnList">List</span>
										</button>
									</a>
									<button type="button" class="btn btn-primary float-right" onClick="updateLine()">
										<img src="${pageContext.request.contextPath}/img/i_btn_save.svg" class="mr-1" height="16px">
										<span data-i18n="btnSave">Save</span>
									</button>
								</p>
							</div>
						</div>
					</div>
				</div>
            </div>
		</div>
	</div>
	<script>
	  	var oldList = [];
	  	
		//목록 초기화
	  	<c:forEach var="item" items="${list}">
	  		var subList = [];
	  		
	  		<c:forEach var="sub" items="${item.subList}">
	  			subList.push({"from": ${sub.fromAuthGroupUid}, "to": ${sub.toAuthGroupUid}, "name": "${sub.groupName}"});
	  		</c:forEach>
	  		
	  		oldList.push({"from": ${item.fromAuthGroupUid}, "to": ${item.toAuthGroupUid}, "name": "${item.groupName}", "sub": subList});
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
	<script src="${pageContext.request.contextPath}/js/system/modify_line.js"></script>
</body>
</html>
