<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ include file="/WEB-INF/jsp/share/conf.jsp"%>
<c:forEach var="at" items="${auth}">
	<c:if test="${at eq 'P_SYS_GROUP_W'}">
		<c:set var="P_SYS_GROUP_W" value="true" />
	</c:if>
</c:forEach>
<c:if test="${empty P_SYS_GROUP_W}">
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
					<div class="row">
						<div class="col-auto">
							<div class="lb-title" data-i18n="groupOp.code"></div>
							<input id="code" type="text" class="" value="${bean.groupName}">
						</div>
						<div class="col-auto">
							<div class="lb-title" data-i18n="groupOp.desc"></div>
							<input id="desc" type="text" class="" value="${bean.description}">
						</div>
						<div class="col-auto">
							<div class="lb-title" data-i18n="groupOp.kind"></div>
							<select id="kind">
								<c:choose>
									<c:when test="${bean.kind eq 'GROUP'}">
										<option value="WORKER">Worker</option>
										<option value="GROUP" selected>Group Leader</option>
										<option value="ADMIN">Administrator</option>
										<option value="SYS">System</option>
										<option value="CAPTAIN">Captain</option>
									</c:when>
									<c:when test="${bean.kind eq 'ADMIN'}">
										<option value="WORKER">Worker</option>
										<option value="GROUP">Group Leader</option>
										<option value="ADMIN" selected>Administrator</option>
										<option value="SYS">System</option>
										<option value="CAPTAIN">Captain</option>
									</c:when>
									<c:when test="${bean.kind eq 'SYS'}">
										<option value="WORKER">Worker</option>
										<option value="GROUP">Group Leader</option>
										<option value="ADMIN">Administrator</option>
										<option value="SYS" selected>System</option>
										<option value="CAPTAIN">Captain</option>
									</c:when>
									<c:when test="${bean.kind eq 'CAPTAIN'}">
										<option value="WORKER">Worker</option>
										<option value="GROUP">Group Leader</option>
										<option value="ADMIN">Administrator</option>
										<option value="SYS">System</option>
										<option value="CAPTAIN" selected>Captain</option>
									</c:when>
									<c:otherwise>
										<option value="WORKER">Worker</option>
										<option value="GROUP">Group Leader</option>
										<option value="ADMIN">Administrator</option>
										<option value="SYS">System</option>
										<option value="CAPTAIN">Captain</option>
									</c:otherwise>
								</c:choose>
							</select>
						</div>
						<div class="col-auto">
							<div class="lb-title" data-i18n="groupOp.authGroup"></div>
							<select id="authGroup"></select>
						</div>
						<div class="col-auto">
							<div class="lb-title" data-i18n="groupOp.status"></div>
							<select id="status">
								<c:choose>
									<c:when test="${bean.status eq 'ACT'}">
										<option value="ACT" selected>Active</option>
										<option value="INACT">Inactive </option>
									</c:when>
									<c:otherwise>
										<option value="ACT">Active</option>
										<option value="INACT" selected>Inactive </option>
									</c:otherwise>
								</c:choose>
							</select>
						</div>
					</div>
				</div>
				<div class="sp-24"></div>
				<div class="sec-card">
					<div class="d-flex">
						<div class="flex-fill">
							<div class="sp-8"></div>
							<div class="lb-title" data-i18n="auth.title"></div>
							<div class="sp-4"></div>
							<div class="inner-scroll-container detail-scroll-area-group">
								<div id="treeView"></div>
							</div>
						</div>
						<div class="sp-w-36"></div>
						<div class="flex-fill">
							<div class="d-flex align-items-center">
								<div><div class="lb-title-no-sp" data-i18n="user.title"></div></div>
								<div class="ml-auto">
									<button class="bt-obj bt-primary bt-sm" data-toggle="modal" data-target="#add_modal">
										<img src="${pageContext.request.contextPath}/img/i_add.svg" height="16px">
									</button>
								</div>
							</div>
							<div class="sp-8"></div>
							<table class="tb-style">
								<thead>
									<tr>
										<th><div class="tb-th-col"><span class="tb-th-content" data-i18n="user.id"></span></div></th>
										<th><div class="tb-th-col"><span class="tb-th-content" data-i18n="user.craft"></span></div></th>
										<th><div class="tb-th-col"><span class="tb-th-content" data-i18n="user.name"></span></div></th>
										<th><div class="tb-th-col-last"><span class="tb-th-content" data-i18n="user.del"></span></div></th>
									</tr>
								</thead>
								<tbody id="userList">
									<tr>
										<td class="text-center" colspan="4" data-i18n="share:noList"></td>
									</tr>
								</tbody>
							</table>
						</div>
					</div>
					<div class="sp-16"></div>
					<div class="d-flex flex-row-reverse">
						<button class="bt-obj bt-primary" onClick="updateGroup()">
							<img src="${pageContext.request.contextPath}/img/i_btn_save.svg" class="bt-icon" height="16px">
							<span data-i18n="auth.btnSave"></span>
						</button>
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
	<!-- 사용자 modal-->
  <div class="modal fade" id="add_modal" tabindex="-1" role="dialog" aria-labelledby="add_modal" aria-hidden="true">
    <div class="modal-dialog modal-lg modal-dialog-centered" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" data-i18n="userPop.title"></h5>
          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
        	<div class="tb-wrap pop-op-tb-scroll-area">
				<table class="tb-style">
					<thead>
						<tr class="headings">
							<th><div class="tb-th-col"><span class="tb-th-content" data-i18n="userPop.id"></span></div></th>
							<th><div class="tb-th-col"><span class="tb-th-content" data-i18n="userPop.craft"></span></div></th>
							<th><div class="tb-th-col"><span class="tb-th-content" data-i18n="userPop.name"></span></div></th>
							<th><div class="tb-th-col-last"><span class="tb-th-content" data-i18n="userPop.add"></span></div></th>
						</tr>
					</thead>
					<tbody id="userPopList"></tbody>
				</table>
			</div>
			<div class="sp-16"></div>
            <div class="pg-area" id="pagination"></div>
        </div>
        <div class="modal-footer">
          <button class="bt-obj bt-secondary" data-dismiss="modal" data-i18n="userPop.btnClose"></button>
        </div>
      </div>
    </div>
  </div>
	<script>
	  	var oldGroupList = [];
	  	var oldUserList = [];
	  	var groupUid = "${bean.uid}";
	  	var toUid = "${toUid}";
	  	
		// 그룹 목록 초기화
	  	<c:forEach var="item" items="${list}">
	  		oldGroupList.push(${item.authInfoUid});
	  	</c:forEach>
	  	
	  	// 사용자 목록 초기화
	  	<c:forEach var="user" items="${listUser}">
	  		oldUserList.push({
	 			uid: "${user.uid}",
	 			userId: "${user.userId}",
	 			posCode: "${user.posCode}",
	 			firstName: "${user.firstName}",
	 			lastName: "${user.lastName}"
	 		});
	  	</c:forEach>
	</script>
	<!-- jQuery -->
	<script src="${pageContext.request.contextPath}/vendors/jquery/jquery.min.js"></script>
	<script src="${pageContext.request.contextPath}/vendors/jquery/jqueryui/jquery-ui.min.js"></script>
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
	<script src="${pageContext.request.contextPath}/js/system/modify_group.js"></script>
</body>
</html>
