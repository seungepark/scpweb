<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ include file="/WEB-INF/jsp/share/confOnlyContext.jsp" %>
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

	<!-- Font Awesome -->
	<link href="${pageContext.request.contextPath}/vendors/fontawesome/css/all.min.css" rel="stylesheet">
	<link href="${pageContext.request.contextPath}/vendors/fontawesome/css/v4-shims.min.css" rel="stylesheet">

	<link href="${pageContext.request.contextPath}/css/ssLineGanttChart.css" rel="stylesheet">

	<style>
		@media print {
			header, footer, .no-print { display:none }
		}
	</style>
</head>

<body>
	<section>
		<article></article>
	</section>

	<script>
		var shipcondtypeList = new Array();
		let _code1LvList = [];

		<c:forEach items="${list}" var="shipcondtype">
			shipcondtypeList.push({
				'value': '${shipcondtype.val}',
				'desc': '${shipcondtype.description}'
			});
		</c:forEach>

		<c:forEach items="${listCode}" var="code1Lv">
			<c:if test="${code1Lv.displaycode ne 'G'}">
				_code1LvList.push({
					'code': '${code1Lv.displaycode}',
					'desc': '${code1Lv.description}'
				});
			</c:if>
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

	<!-- system -->
	<script src="${pageContext.request.contextPath}/js/common.js"></script>
	<script src="${pageContext.request.contextPath}/js/sche/ssPlanReportSchedule.js"></script>
	<script src="${pageContext.request.contextPath}/js/sche/planReportSchedule.js"></script>

</body>
</html>
