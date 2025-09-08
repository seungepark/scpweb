<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ include file="/WEB-INF/jsp/share/conf.jsp"%>
<c:forEach var="at" items="${auth}">
	<c:if test="${at eq 'P_DB_CODE_R'}">
		<c:set var="P_DB_CODE_R" value="true" />
	</c:if>
	<c:if test="${at eq 'P_DB_CODE_W'}">
		<c:set var="P_DB_CODE_W" value="true" />
	</c:if>
</c:forEach>
<c:if test="${empty P_DB_CODE_R and empty P_DB_CODE_W}">
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
        <%@ include file="/WEB-INF/jsp/include/menu/sidebar_3_3.jsp"%>
        <div id="contentWrap" class="collapsed-content-wrap">
            <%@ include file="/WEB-INF/jsp/include/menu/header_3_3.jsp"%>
            <div class="main-container">
<%-- 				<%@ include file="/WEB-INF/jsp/include/menu/bread_3_3.jsp"%> --%>
				<div class="sec-card">
					<div class="d-flex">
						<div id="treeViewArea" class="flex-fill">
							<div class="d-flex align-items-center flex-row-reverse">
								<c:if test="${P_DB_CODE_W}">
									<button class="bt-obj bt-secondary bt-sm svg" onClick="uncheckAll()">
										<img src="${pageContext.request.contextPath}/img/i_btn_return.svg" class="bt-icon" height="16px">
										<span data-i18n="btnUnchk">Check Clear</span>
									</button>
									<button class="bt-obj bt-primary bt-sm" onClick="editHierarchy()" >
										<img src="${pageContext.request.contextPath}/img/i_btn_modify.svg" class="bt-icon" height="16px">
										<span data-i18n="btnEdit">Edit</span>
									</button>
								</c:if>
								<div class="flex-grow-1"></div>
								<button class="bt-obj bt-secondary bt-sm svg" onClick="toggleTreeView('H')" data-i18n="btnTreeViewHide"></button>
							</div>
							<div class="sp-8"></div>
							<div class="inner-scroll-container scroll-area-hierarchy">
								<div id="treeView"></div>
							</div>
						</div>
						<div id="areaGap" class="sp-w-36"></div>
						<div class="flex-fill">
							<div class="d-flex align-items-center flex-row-reverse">  
								<c:if test="${P_DB_CODE_W}">
									<button class="bt-obj bt-primary bt-sm" onClick="saveSchehier()">
										<img src="${pageContext.request.contextPath}/img/i_btn_save.svg" class="bt-icon" height="16px">
										<span data-i18n="list.btnSave"></span>
									</button>
									<button class="bt-obj bt-secondary bt-sm svg" onClick="addSchehier()">
										<img src="${pageContext.request.contextPath}/img/i_btn_add.svg" class="bt-icon" height="16px">
										<span data-i18n="list.btnAdd"></span>
									</button>
								</c:if>
								<button class="bt-obj bt-danger-outline bt-sm svg" onClick="editCan()">
									<img src="${pageContext.request.contextPath}/img/i_btn_return.svg" class="bt-icon" height="16px">
									<span data-i18n="list.btnCan"></span>
								</button>
								<div class="flex-grow-1"></div>
								<button id="btnTreeViewShow" class="bt-obj bt-secondary bt-sm svg" onClick="toggleTreeView('S')" data-i18n="btnTreeViewShow"></button>
							</div>
							<div class="sp-8"></div>
							<table class="tb-style">
								<thead>
									<tr>
										<th><div class="tb-th-col"><span class="tb-th-content" data-i18n="list.level"></span></div></th>
										<th><div class="tb-th-col"><span class="tb-th-content" data-i18n="list.parent"></span></div></th>
										<th><div class="tb-th-col"><span class="tb-th-content" data-i18n="list.code"></span></div></th>
										<th><div class="tb-th-col"><span class="tb-th-content" data-i18n="list.displaycode"></span></div></th>
										<th><div class="tb-th-col"><span class="tb-th-content" data-i18n="list.desc"></span></div></th>
										<th class="th-w-90"><div class="tb-th-col-last"><span class="tb-th-content" data-i18n="list.del"></span></div></th>
									</tr>
								</thead>
								<tbody id="scheduleHierlist">
									<tr>
										<td class="text-center" colspan="6" data-i18n="share:noList"></td>
									</tr>
								</tbody>
							</table>
						</div>
					</div>
				</div>
            </div>
		</div>
	</div>
	<!-- Parent Search Modal Start -->
	<div class="modal fade" id="search_parent_modal" tabindex="-1" role="dialog" aria-labelledby="search_parent_modal" aria-hidden="true">
		<div class="modal-dialog modal-xl modal-dialog-centered" role="document">
			<div class="modal-content">
				<div class="modal-header">
					<h5 class="modal-title" data-i18n="searchParent.title"></h5>
					<button type="button" class="close" data-dismiss="modal" aria-label="Close">
						<span aria-hidden="true">&times;</span>
					</button>
				</div>
				<div class="modal-body">
					<div class="d-flex pop-op-area">
        				<div class="pop-op-obj">
        					<div class="pop-inner-title" data-i18n="searchParent.code"></div>
        					<input id="searchParentPopCode" type="text">
        				</div>
        				<div class="pop-op-obj">
        					<div class="pop-inner-title" data-i18n="searchParent.desc"></div>
        					<input id="searchParentPopDesc" type="text">
        				</div>
        				<div>
        					<div class="pop-inner-title">&nbsp;</div>
        					<button class="bt-obj bt-primary" onclick="searchParentCodeSearch(1)">
								<img src="${pageContext.request.contextPath}/img/i_btn_search.svg" class="bt-icon" height="16px">
								<span data-i18n="searchParent.btnSearch"></span>
							</button>
        				</div>
        			</div>
        			<div class="tb-wrap pop-op-tb-scroll-area">
        				<table class="tb-style">
							<thead>
	         					<tr>
			           				<th><div class="tb-th-col"><span class="tb-th-content" data-i18n="searchParent.codelevel"></span></div></th>
			           				<th><div class="tb-th-col"><span class="tb-th-content" data-i18n="searchParent.code"></span></div></th>
			           				<th><div class="tb-th-col"><span class="tb-th-content" data-i18n="searchParent.displaycode"></span></div></th>
			           				<th><div class="tb-th-col-last"><span class="tb-th-content" data-i18n="searchParent.desc"></span></div></th>
	         					</tr>
							</thead>
							<tbody id="searchParentPopList"></tbody>
						</table>
        			</div>
        			<div class="sp-16"></div>
                    <div class="pg-area" id="pagination"></div>
				</div>
				<div class="modal-footer">
					<button class="bt-obj bt-secondary" data-dismiss="modal" data-i18n="searchParent.btnClose"></button>
				</div>
			</div>
		</div>
	</div>
	<!-- Parent Search Modal End -->

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
	<script src="${pageContext.request.contextPath}/js/mng/scheBasic/scheHierarchy.js"></script>
</body>
</html>
