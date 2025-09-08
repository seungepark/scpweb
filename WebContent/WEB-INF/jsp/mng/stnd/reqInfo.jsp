<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ include file="/WEB-INF/jsp/share/conf.jsp" %>
<c:forEach var="at" items="${auth}">
  <c:if test="${at eq 'P_MNG_STNDREQINFO'}">
    <c:set var="P_MNG_STNDREQINFO" value="true"/>
  </c:if>
</c:forEach>
<c:if test="${empty P_MNG_STNDREQINFO}">
  <c:redirect url="/index.html"/>
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
        <%@ include file="/WEB-INF/jsp/include/menu/sidebar_3_2.jsp"%>
        <div id="contentWrap" class="collapsed-content-wrap">
            <%@ include file="/WEB-INF/jsp/include/menu/header_3_2.jsp"%>
            <div class="main-container">
<%-- 				<%@ include file="/WEB-INF/jsp/include/menu/bread_3_2.jsp"%> --%>
				<div class="tb-area">
					<div class="d-flex flex-row-reverse">
						<button class="bt-obj bt-primary" onClick="saveStndReqInfo()">
		                  	<img src="${pageContext.request.contextPath}/img/i_btn_save.svg" class="bt-icon" height="16px">
		                  	<span data-i18n="btnSave"></span>
		                </button>
						<button class="bt-obj bt-secondary svg" onClick="addStndReqInfo()">
		                  	<img src="${pageContext.request.contextPath}/img/i_btn_add.svg" class="bt-icon" height="16px">
		                  	<span data-i18n="btnAdd"></span>
		                </button>
                   	</div>
                   	<div class="sp-16"></div>
                   	<div class="tb-wrap tb-wrap-height-btn">
	                   	<table id="tbStndReqInfoList" class="tb-style">
			                <thead>
				                <tr>
				                  	<th><div class="tb-th-col"><span class="tb-th-content" data-i18n="list.seq"></span></div></th>
				                  	<th><div class="tb-th-col"><span class="tb-th-content" data-i18n="list.reqinfotitle"></span></div></th>
				                  	<th><div class="tb-th-col"><span class="tb-th-content" data-i18n="list.item"></span></div></th>
				                  	<th><div class="tb-th-col"><span class="tb-th-content" data-i18n="list.unit"></span></div></th>
				                  	<th><div class="tb-th-col-last"><span class="tb-th-content" data-i18n="list.del"></span></div></th>
				                </tr>
			                </thead>
			                <tbody id="getStndReqInfoRowList">
				            	<tr>
				                	<td class="text-center" colspan="16" data-i18n="share.noList"></td>
				            	</tr>
			                </tbody>
		              	</table>
		            </div>
				</div>
            </div>
		</div>
	</div>
<script type="text/javascript">
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
<script src="${pageContext.request.contextPath}/js/mng/stnd/reqInfo.js"></script>
</body>
</html>
