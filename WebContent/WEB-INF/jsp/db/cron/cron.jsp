<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ include file="/WEB-INF/jsp/share/conf.jsp" %>
<c:forEach var="at" items="${auth}">
	<c:if test="${at eq 'P_SYS_CRON_R'}">
		<c:set var="P_SYS_CRON_R" value="true" />
	</c:if>
	<c:if test="${at eq 'P_SYS_CRON_W'}">
		<c:set var="P_SYS_CRON_W" value="true" />
	</c:if>
</c:forEach>
<c:if test="${empty P_SYS_CRON_R and empty P_SYS_CRON_W}">
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
        <%@ include file="/WEB-INF/jsp/include/menu/sidebar_5_6.jsp"%>
        <div id="contentWrap" class="collapsed-content-wrap">
            <%@ include file="/WEB-INF/jsp/include/menu/header_5_6.jsp"%>
            <div class="main-container">
<%-- 				<%@ include file="/WEB-INF/jsp/include/menu/bread_5_6.jsp"%> --%>
				<div class="sec-option-card">
					<div class="row">
						<div class="col-auto">
							<div class="lb-title" data-i18n="listOp.cron"></div>
							<input type="text" class="" id="cronid">
						</div>
						<div class="col-auto">
							<div class="lb-title" data-i18n="listOp.desc"></div>
							<input type="text" class="" id="desc">
						</div>
						<div class="col-auto">
							<div class="lb-title" data-i18n="listOp.status"></div>
							<select id="status" class="" >
								<option value="ALL" data-i18n="listOp.statusAll"></option>
								<option value="ACT">Active</option>
	       						<option value="INACT">Inactive</option>
							</select>
						</div>
						<div class="col">
							<div class="lb-title">&nbsp;</div>
							<div id="searchBtn">
								<button class="bt-obj bt-primary" onclick="getCronList(1)">
									<img src="${pageContext.request.contextPath}/img/i_btn_search.svg" class="bt-icon" height="16px">
									<span data-i18n="listOp.btnSearch"></span>
								</button>
							</div>
						</div>
					</div>
				</div>
				<div class="sp-24"></div>
				<div class="tb-area">
					<div class="d-flex flex-row-reverse">
                   		<button class="bt-obj bt-primary" onClick="cronListDownloadAll()"><img src="${pageContext.request.contextPath}/img/i_download.svg" height="16px"></button>
                   		<c:if test="${P_SYS_CRON_W}">
                   			<a href="${pageContext.request.contextPath}/db/cron/newCron.html">
								<button class="bt-obj bt-secondary svg">
									<img src="${pageContext.request.contextPath}/img/i_btn_new.svg" class="bt-icon" height="16px">
									<span data-i18n="btnNew"></span>
								</button>
							</a>
                   			<button class="bt-obj bt-secondary svg" onClick="popChangeStatusModal()">
								<img src="${pageContext.request.contextPath}/img/i_btn_newstatus.svg" class="bt-icon" height="16px">
								<span data-i18n="btnChange"></span>
							</button>
							<button class="bt-obj bt-danger-outline svg" onClick="popDeleteCronModal()">
								<img src="${pageContext.request.contextPath}/img/i_btn_del.svg" class="bt-icon" height="16px">
								<span data-i18n="btnDel"></span>
							</button>
						</c:if>
                   	</div>
                   	<div class="sp-16"></div>
                    <div class="tb-wrap">
                    	<table id="tbMainList" class="tb-style">
							<thead>
								<tr>
									<th><div class="tb-th-col"><span class="tb-th-content"><input type="checkbox" id="listAllChk"></span></div></th>
									<th><div class="tb-th-col"><span class="tb-th-content" data-i18n="list.cron"></span></div></th>
									<th><div class="tb-th-col"><span class="tb-th-content" data-i18n="list.desc"></span></div></th>
			                        <th><div class="tb-th-col"><span class="tb-th-content" data-i18n="list.status"></span></div></th>
			                        <th><div class="tb-th-col-last"><span class="tb-th-content" data-i18n="list.freq"></span></div></th>
								</tr>
							</thead>
							<tbody id="getCronList">
								<tr>
									<td class="text-center" colspan="5" data-i18n="share:noList"></td>
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
  <!--change status modal-->
  <div class="modal fade" id="change_status_modal" tabindex="-1" role="dialog" aria-labelledby="change_status_modal" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" data-i18n="changePop.title"></h5>
          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
        	<span data-i18n="changePop.msg"></span>
       			<div class="sp-40"></div>
			<div class="pop-inner-title" data-i18n="changePop.selectStatus"></div>
			<select class="w-100" id="changeStatusSel">
				<option value="ACT">Active</option>
				<option value="INACT">Inactive</option>
			</select>
        </div>
        <div class="modal-footer">
        	<button class="bt-obj bt-secondary" data-dismiss="modal" data-i18n="changePop.btnClose"></button>
			<button class="bt-obj bt-primary" onClick="changeStatus()" data-i18n="changePop.btnChange"></button>
        </div>
      </div>
    </div>
  </div>
  
  <!--delete modal-->
  <div class="modal fade" id="del_modal" tabindex="-1" role="dialog" aria-labelledby="del_modal" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered" role="document">
      <div class="modal-content">
      	<div class="modal-body text-center pop-alert">
        	<div class="pop-alert-title" data-i18n="delPop.title"></div>
        	<div class="pop-alert-msg" data-i18n="delPop.msg"></div>
   			<button class="bt-obj bt-secondary" data-dismiss="modal" data-i18n="delPop.btnClose"></button>
        	<button class="bt-obj bt-primary" onClick="deleteCron()">
   				<img src="${pageContext.request.contextPath}/img/i_btn_del.svg" class="bt-icon" height="16px">
				<span data-i18n="delPop.btnDel"></span>
   			</button>
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
  <script src="${pageContext.request.contextPath}/js/db/cron/cron.js"></script>
</body>
</html>
