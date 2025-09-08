<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ include file="/WEB-INF/jsp/share/conf.jsp" %>
<c:forEach var="at" items="${auth}">
	<c:if test="${at eq 'P_DB_DOMAIN_R'}">
		<c:set var="P_DB_DOMAIN_R" value="true" />
	</c:if>
	<c:if test="${at eq 'P_DB_DOMAIN_W'}">
		<c:set var="P_DB_DOMAIN_W" value="true" />
	</c:if>
</c:forEach>
<c:if test="${empty P_DB_DOMAIN_R and empty P_DB_DOMAIN_W}">
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
        <%@ include file="/WEB-INF/jsp/include/menu/sidebar_3_5.jsp"%>
        <div id="contentWrap" class="collapsed-content-wrap">
            <%@ include file="/WEB-INF/jsp/include/menu/header_3_5.jsp"%>
            <div class="main-container">
<%-- 				<%@ include file="/WEB-INF/jsp/include/menu/bread_3_5.jsp"%> --%>
				<div class="sec-option-card">
					<div class="row">
						<div class="col-auto">
							<div class="lb-title" data-i18n="listOp.cat"></div>
							<select id="cat" class="">
								<option value="ALL">ALL</option>
								<option value="DATA">DATA</option>
								<option value="SYSTEM">SYSTEM</option>
							</select>
						</div>
						<div class="col-auto">
							<div class="lb-title" data-i18n="listOp.id"></div>
							<input type="text" class="" id="id">
						</div>
						<div class="col-auto">
							<div class="lb-title" data-i18n="listOp.desc"></div>
							<input type="text" class="" id="desc">
						</div>
						<div class="col">
							<div class="lb-title">&nbsp;</div>
							<div id="searchBtn">
								<button class="bt-obj bt-primary" onclick="getDomainList()">
									<img src="${pageContext.request.contextPath}/img/i_btn_search.svg" class="bt-icon" height="16px">
									<span data-i18n="listOp.btnSearch"></span>
								</button>
							</div>
						</div>
					</div>
				</div>
				<div class="sp-24"></div>
				<div class="tb-area">
					<c:if test="${P_DB_DOMAIN_W}">
						<div class="d-flex flex-row-reverse">
	                   		<button onClick="showNewPop()" class="bt-obj bt-secondary svg">
								<img src="${pageContext.request.contextPath}/img/i_btn_new.svg" class="bt-icon" height="16px">
								<span data-i18n="btnNew"></span>
							</button>
	                   	</div>
					</c:if>
                   	<div class="sp-16"></div>
                    <div class="tb-wrap tb-wrap-height-op-btn">
                    	<table class="tb-style">
							<thead>
								<tr>
									<th><div class="tb-th-col"><span class="tb-th-content" data-i18n="list.cat"></span></div></th>
									<th><div class="tb-th-col"><span class="tb-th-content" data-i18n="list.id"></span></div></th>
									<th><div class="tb-th-col"><span class="tb-th-content" data-i18n="list.desc"></span></div></th>
									<th><div class="tb-th-col"><span class="tb-th-content" data-i18n="list.type"></span></div></th>
									<th><div class="tb-th-col-last"><span class="tb-th-content" data-i18n="list.del"></span></div></th>
								</tr>
							</thead>
							<tbody id="list">
								<tr>
									<td class="text-center" colspan="5" data-i18n="share:noList"></td>
								</tr>
							</tbody>
						</table>
                    </div>
                </div>
            </div>
		</div>
	</div>
	<!-- 신규 modal-->
  	<div class="modal fade" id="new_pop" tabindex="-1" role="dialog" aria-labelledby="new_pop" aria-hidden="true">
    	<div class="modal-dialog modal-xl modal-dialog-centered" role="document">
      		<div class="modal-content">
        		<div class="modal-header">
          			<h5 class="modal-title" data-i18n="newPop.title"></h5>
          			<button type="button" class="close" data-dismiss="modal" aria-label="Close">
            			<span aria-hidden="true">&times;</span>
          			</button>
        		</div>
        		<div class="modal-body">
        			<div class="d-flex pop-op-area">
        				<div class="pop-op-obj">
        					<div class="pop-inner-title" data-i18n="newPop.domain"></div>
        					<input id="newPopDomain" type="text">
        				</div>
        				<div class="pop-op-obj">
        					<div class="pop-inner-title" data-i18n="newPop.desc"></div>
        					<input id="newPopDesc" type="text">
        				</div>
        				<div class="pop-op-obj">
        					<div class="pop-inner-title" data-i18n="newPop.cat"></div>
        					<select id="newPopCat" class="">
								<option value="DATA">DATA</option>
								<option value="SYSTEM">SYSTEM</option>
							</select>
        				</div>
        				<div class="pop-op-obj">
        					<div class="pop-inner-title" data-i18n="newPop.type"></div>
        					<select id="newPopType" class="">
								<option value="SYNONYM">SYNONYM</option>
								<option value="ALN">ALN</option>
								<option value="NUMBERIC">NUMBERIC</option>
							</select>
        				</div>
        				<div>
        					<div class="pop-inner-title">&nbsp;</div>
        					<button class="bt-obj bt-primary" onclick="newPopAddChild()">
								<img src="${pageContext.request.contextPath}/img/i_btn_add.svg" class="bt-icon" height="16px">
								<span data-i18n="newPop.btnAdd"></span>
							</button>
        				</div>
        			</div>
        			<div class="tb-wrap pop-op-tb-scroll-area">
						<table class="tb-style">
							<thead>
	         					<tr>
			           				<th><div class="tb-th-col"><span class="tb-th-content" data-i18n="newPop.vlInval"></span></div></th>
			           				<th><div class="tb-th-col"><span class="tb-th-content" data-i18n="newPop.vlVal"></span></div></th>
			           				<th><div class="tb-th-col"><span class="tb-th-content" data-i18n="newPop.vlDesc"></span></div></th>
			           				<th><div class="tb-th-col-last"><span class="tb-th-content" data-i18n="newPop.del"></span></div></th>
	         					</tr>
							</thead>
							<tbody id="newPopList"></tbody>
						</table>
					</div>
        		</div>
        		<div class="modal-footer">
        			<button class="bt-obj bt-secondary" data-dismiss="modal" data-i18n="newPop.btnClose"></button>
          			<button class="bt-obj bt-primary" onClick="insertDomain()">
          				<img src="${pageContext.request.contextPath}/img/i_btn_new.svg" class="bt-icon" height="16px">
						<span data-i18n="newPop.btnNew"></span>
          			</button>
        		</div>
      		</div>
    	</div>
  	</div>
  	<!-- 수정 modal-->
  	<div class="modal fade" id="modify_pop" tabindex="-1" role="dialog" aria-labelledby="modify_pop" aria-hidden="true">
    	<div class="modal-dialog modal-xl modal-dialog-centered" role="document">
      		<div class="modal-content">
        		<div class="modal-header">
          			<h5 class="modal-title" data-i18n="modifyPop.title"></h5>
          			<button type="button" class="close" data-dismiss="modal" aria-label="Close">
            			<span aria-hidden="true">&times;</span>
          			</button>
        		</div>
        		<div class="modal-body">
        			<div class="d-flex pop-op-area">
        				<div class="pop-op-obj">
        					<div class="pop-inner-title" data-i18n="modifyPop.domain"></div>
        					<input id="modifyPopDomain" type="text" readonly>
        				</div>
        				<div class="pop-op-obj">
        					<div class="pop-inner-title" data-i18n="modifyPop.desc"></div>
        					<input id="modifyPopDesc" type="text">
        				</div>
        				<div class="pop-op-obj">
        					<div class="pop-inner-title" data-i18n="modifyPop.cat"></div>
        					<select id="modifyPopCat" class="" disabled>
								<option value="DATA">DATA</option>
								<option value="SYSTEM">SYSTEM</option>
							</select>
        				</div>
        				<div class="pop-op-obj">
        					<div class="pop-inner-title" data-i18n="modifyPop.type"></div>
        					<select id="modifyPopType" class="" disabled>
								<option value="SYNONYM">SYNONYM</option>
								<option value="ALN">ALN</option>
								<option value="NUMBERIC">NUMBERIC</option>
							</select>
        				</div>
        				<div>
        					<div class="pop-inner-title">&nbsp;</div>
        					<button class="bt-obj bt-primary" onclick="modifyPopAddChild()">
								<img src="${pageContext.request.contextPath}/img/i_btn_add.svg" class="bt-icon" height="16px">
								<span data-i18n="modifyPop.btnAdd"></span>
							</button>
        				</div>
        			</div>
        			<div class="tb-wrap pop-op-tb-scroll-area">
						<table class="tb-style">
							<thead>
	         					<tr>
			           				<th><div class="tb-th-col"><span class="tb-th-content" data-i18n="modifyPop.vlInval"></span></div></th>
			           				<th><div class="tb-th-col"><span class="tb-th-content" data-i18n="modifyPop.vlVal"></span></div></th>
			           				<th><div class="tb-th-col"><span class="tb-th-content" data-i18n="modifyPop.vlDesc"></span></div></th>
			           				<th><div class="tb-th-col-last"><span class="tb-th-content" data-i18n="modifyPop.del"></span></div></th>
	         					</tr>
							</thead>
							<tbody id="modifyPopList"></tbody>
						</table>
					</div>
        		</div>
        		<div class="modal-footer">
        			<button class="bt-obj bt-secondary" data-dismiss="modal" data-i18n="modifyPop.btnClose"></button>
        			<c:choose>
						<c:when test="${P_DB_DOMAIN_W}">
							<button class="bt-obj bt-primary" onClick="updateDomain()">
		          				<img src="${pageContext.request.contextPath}/img/i_btn_save.svg" class="bt-icon" height="16px">
								<span data-i18n="modifyPop.btnUpdate"></span>
		          			</button>
						</c:when>
						<c:otherwise>
							<button class="bt-obj bt-primary" disabled>
		          				<img src="${pageContext.request.contextPath}/img/i_btn_save.svg" class="bt-icon" height="16px">
								<span data-i18n="modifyPop.btnUpdate"></span>
		          			</button>
						</c:otherwise>
					</c:choose>
        		</div>
      		</div>
    	</div>
  	</div>
  	<!--delete modal-->
  	<div class="modal fade" id="del_modal" tabindex="-1" role="dialog" aria-labelledby="del_modal" aria-hidden="true">
    	<div class="modal-dialog modal-dialog-centered" role="document">
      		<div class="modal-content">
        		<div class="modal-header">
          			<h5 class="modal-title" data-i18n="delPop.title"></h5>
       				<button type="button" class="close" data-dismiss="modal" aria-label="Close">
            			<span aria-hidden="true">&times;</span>
          			</button>
        		</div>
        		<div class="modal-body">
          			<div>Domain :&nbsp;&nbsp;&nbsp;<span id="del_modal_domain_name" class="text-danger"></span></div>
          			<div class="sp-40"></div>
          			<span data-i18n="delPop.msg"></span>
        		</div>
        		<div class="modal-footer">
        			<button class="bt-obj bt-secondary" data-dismiss="modal" data-i18n="delPop.btnClose"></button>
        			<c:choose>
						<c:when test="${P_DB_DOMAIN_W}">
							<button class="bt-obj bt-primary" onClick="deleteDomain()">
		          				<img src="${pageContext.request.contextPath}/img/i_btn_del.svg" class="bt-icon" height="16px">
								<span data-i18n="delPop.btnDel"></span>
		          			</button>
						</c:when>
						<c:otherwise>
							<button class="bt-obj bt-primary" disabled>
		          				<img src="${pageContext.request.contextPath}/img/i_btn_del.svg" class="bt-icon" height="16px">
								<span data-i18n="delPop.btnDel"></span>
		          			</button>
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
	<script src="${pageContext.request.contextPath}/js/db/domain/domain.js"></script>
</body>
</html>