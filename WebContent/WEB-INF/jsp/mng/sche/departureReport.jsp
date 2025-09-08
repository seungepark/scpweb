<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ include file="/WEB-INF/jsp/share/conf.jsp"%>
<c:forEach var="at" items="${auth}">
	<c:if test="${at eq 'P_MNG_DEPRPT'}">
		<c:set var="P_MNG_DEPRPT" value="true" />
	</c:if>
</c:forEach>
<c:if test="${empty P_MNG_DEPRPT}">
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
	<style>
		#dropArea {
			width: 430px;
			height: 200px;
			border: 2px dashed #ccc;
			text-align: center;
			padding: 50px;
			margin: 12px auto;
			cursor: pointer;
		}

		#fileInput {
			display: none;
		}

		#fileList {
			margin-top: 20px;
		}
	</style>
</head>

<body class="nav-md">
	<div class="container body">
		<div class="main_container">
			<div id="includeLeft"></div>

			<!-- top navigation -->
			<div id="includeHeader"></div>
			<!-- /top navigation -->

			<!-- page content -->
			<div class="right_col" role="main">
				<div class="row">
					<div class="col-xl-12 col-lg-12">
						<div class="page-title">
							<div class="x_content">
								<h3 class="g_text_primary font-weight-bold my-0" data-i18n="title">Departure Report</h3>
							</div>
						</div>
					</div>
				</div>
				<div class="row">
					<div class="col-12">
						<div class="x_content">
							<h4 id="scheduleTitle" class="g_text_primary font-weight-bold my-0">
								${bean.hullnum} / ${bean.shiptype}
								<c:if test="${not empty bean.description}"> 
									/ ${bean.description}
								</c:if>
							</h4>
						</div>
					</div>
				</div>
				<div class="row">
					<div class="col-12">
						<div class="x_content">
							<div class="btn-toolbar" role="toolbar" aria-label="Status button groups">
								<div class="btn-group mr-2" role="group" aria-label="First group">
									<button type="button" class="btn btn-primary" style="cursor: default;" ${departureState eq 'D' ? '' : 'disabled="disabled"'}>Departure</button>
								</div>
								<div class="btn-group mr-2" role="group" aria-label="Second group">
									<button type="button" class="btn btn-primary" style="cursor: default;" ${departureState eq 'O' ? '' : 'disabled="disabled"'}>On Going</button>
								</div>
								<div class="btn-group" role="group" aria-label="Third group">
									<button type="button" class="btn btn-primary" style="cursor: default;" ${departureState eq 'C' ? '' : 'disabled="disabled"'}>Arrival</button>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div class="row">
					<div class="col-12">
						<div class="x_content">
							<ul class="nav nav-tabs bar_tabs" id="myTab" role="tablist">
								<li class="nav-item">
									<a class="nav-link" href="${pageContext.request.contextPath}/mng/sche/departureReportScheduleChart.html?uid=${bean.uid}" role="tab" aria-selected="false"><span data-i18n="depChart">Schedule Chart</span></a>
								</li>
								<li class="nav-item">
									<a class="nav-link active" href="${pageContext.request.contextPath}/mng/sche/departureReport.html?uid=${bean.uid}" role="tab" aria-selected="true"><span data-i18n="regCrew">Crew Registration</span></a>
								</li>
								<c:choose>
									<c:when test="${departureState eq 'D'}">
										<li class="nav-item">
											<a class="nav-link" href="${pageContext.request.contextPath}/mng/sche/departureReportRegInfo.html?uid=${bean.uid}" role="tab" aria-selected="true"><span data-i18n="regInfo">Info Registration</span></a>
										</li>
										<li class="nav-item">
											<a class="nav-link" href="${pageContext.request.contextPath}/mng/sche/departureReportCheck.html?uid=${bean.uid}" role="tab" aria-selected="false"> &nbsp; <span data-i18n="depRpt">Departure Report</span> &nbsp;</a>
										</li>
									</c:when>
									<c:when test="${departureState eq 'O'}">
										<li class="nav-item">
											<a class="nav-link" href="${pageContext.request.contextPath}/mng/sche/departureReportRegDailyInfo.html?uid=${bean.uid}" role="tab" aria-selected="true"><span data-i18n="regDailyInfo">Info Registration</span></a>
										</li>
										<li class="nav-item">
											<a class="nav-link" href="${pageContext.request.contextPath}/mng/sche/departureDailyReportCheck.html?uid=${bean.uid}" role="tab" aria-selected="false"> &nbsp; <span data-i18n="depDailyRpt">Departure Report</span> &nbsp;</a>
										</li>
									</c:when>
									<c:when test="${departureState eq 'C'}">
										<li class="nav-item">
											<a class="nav-link" href="${pageContext.request.contextPath}/mng/sche/departureReportRegCompleteInfo.html?uid=${bean.uid}" role="tab" aria-selected="true"><span data-i18n="regComInfo">Info Registration</span></a>
										</li>
										<li class="nav-item">
											<a class="nav-link" href="${pageContext.request.contextPath}/mng/sche/departureCompleteReportCheck.html?uid=${bean.uid}" role="tab" aria-selected="false"> &nbsp; <span data-i18n="comRpt">Departure Report</span> &nbsp;</a>
										</li>
									</c:when>
									<c:otherwise>
										<li class="nav-item">
											<a class="nav-link" href="${pageContext.request.contextPath}/mng/sche/departureReportRegInfo.html?uid=${bean.uid}" role="tab" aria-selected="true"><span data-i18n="regInfo">Info Registration</span></a>
										</li>
										<li class="nav-item">
											<a class="nav-link" href="${pageContext.request.contextPath}/mng/sche/departureReportCheck.html?uid=${bean.uid}" role="tab" aria-selected="false"> &nbsp; <span data-i18n="depRpt">Departure Report</span> &nbsp;</a>
										</li>
									</c:otherwise>
								</c:choose>
							</ul>
						</div>
					</div>
				</div>
				<div class="row">
					<div class="col-12">
						<div class="x_panel">
							<div class="x_title border0">
								<div class="row">
									<div class="col-6"></div>
									<div class="col-auto ml-auto">
										<c:choose>
											<c:when test="${not empty bean.scheCrewSdate}">
												<input id="sdate" type="date" class="form-control" style="width: 125px; display: inline-block;" value="${bean.scheCrewSdate}">
												<c:choose>
													<c:when test="${not empty bean.scheCrewPeriod and bean.scheCrewPeriod != 0}">
														<input id="period" type="number" class="form-control" style="width: 100px; display: inline-block;" placeholder="+00일" step="1" value="${bean.scheCrewPeriod}">
													</c:when>
													<c:otherwise>
														<input id="period" type="number" class="form-control" style="width: 100px; display: inline-block;" placeholder="+00일" step="1" value="">
													</c:otherwise>
												</c:choose>
											</c:when>
											<c:otherwise>
												<input id="sdate" type="date" class="form-control" style="width: 125px; display: inline-block;" value="${bean.sdate}">
												<input id="period" type="number" class="form-control" style="width: 100px; display: inline-block;" placeholder="+00일" step="1">
											</c:otherwise>
										</c:choose>
										<button type="button" onClick="setScheduleDate()" class="btn btn-primary">
											<img src="${pageContext.request.contextPath}/img/i_btn_verif.svg" class="mr-1" height="16px">
											<span class="text-white" data-i18n="btnApply">Apply</span>
										</button>
									</div>
									<div class="col-auto ml-auto">
										<button type="button" class="btn btn-primary" onClick="addTableForSchedulerCrewInfoData()"><i class="fa-solid fa-plus">Add</i></button>
										<button type="button" class="btn btn-danger" onClick="delTableForSchedulerCrewInfoData()"><i class="fa-solid fa-minus">Del</i></button>

										<button type="button" class="btn btn-primary" onClick="saveScheCrewList()">
											<img src="${pageContext.request.contextPath}/img/i_btn_save.svg" class="mr-1" height="16px">
											<span class="text-white" data-i18n="btnSave">Save</span>
										</button>
									</div>
									<div class="col-auto ml-auto">
										<input type="file" id="fileInput" onchange="handleFiles(this.files)" accept=".xlsx">
										<button type="button" class="btn btn-primary" onClick="downloadExcel()">
											<img src="${pageContext.request.contextPath}/img/i_download.svg" class="mr-1" height="16px">
											<span class="text-white" data-i18n="btnFormDown">form download</span>
										</button>
										<button type="button" class="btn btn-primary" onClick="openFileInput()">
											<img src="${pageContext.request.contextPath}/img/i_upload.svg" class="mr-1" height="16px">
											<span class="text-white" data-i18n="btnExcelUp">excel upload</span>
										</button>
									</div>
								</div>
							</div>
							<div class="x_content table_fixed_head" id="dDataPanel">
								<table id="tbList"  data-toggle="table" data-custom-sort="tblistSort" class="table table-borderless table-striped jambo_table bulk_action mg-0">
									<thead id="schedulerCrewInfoHead">
				                    	<tr class="headings">
				                      		<th class="column-title border text-center"><input type="checkbox" id="listAllChk"></th>
				                      		<th class="column-title border text-center"  data-field="seq" data-sortable="true"><span data-i18n="list.seq">No.</span></th>
				                      		<th class="column-title border" data-field="plan" data-sortable="true"><span data-i18n="list.plan">항목</span></th>
				                      		<th class="column-title border" data-field="position" data-sortable="true"><span data-i18n="list.position">구분</span></th>
				                      		<th class="column-title border" data-field="company" data-sortable="true"><span data-i18n="list.company">회사</span></th>
				                      		
				                      		<th class="column-title border" data-field="departure" data-sortable="true"><span data-i18n="list.departure">부서</span></th>
				                      		<th class="column-title border" data-field="name" data-sortable="true"><span data-i18n="list.name">성명</span></th>
				                      		<th class="column-title border" data-field="rank" data-sortable="true"><span data-i18n="list.rank">직급</span></th>
				                      		<th class="column-title border" data-field="comnum" data-sortable="true"><span data-i18n="list.comnum">사번</span></th>
				                      		<th class="column-title border" data-field="worktype" data-sortable="true"><span data-i18n="list.worktype">업무</span></th>
				                      		
				                      		<th class="column-title border" data-field="ssnum" data-sortable="true"><span data-i18n="list.ssnum">주민번호(앞7자리)/여권번호</span></th>
				                      		<th class="column-title border" data-field="tel" data-sortable="true"><span data-i18n="list.tel">전화번호</span></th>
				                    	</tr>
				                  	</thead>
									<tbody id="schedulerCrewInfoData">
<%--										<tr class="even pointer">--%>
<%--											<td class="border text-center"><input type="checkbox" name="listChk"></td>--%>
<%--											<td class="border text-center" >1</td>--%>
<%--											<td class="border text-center" >계획</td>--%>
<%--											<td class="border text-center" ><select class="form-control"><option></option><option selected="selected">SHI</option><option>S/E</option><option>S/E Corps</option><option>Owner/Class</option></select></td>--%>
<%--											<td class="border text-center" ><input type="text" class="form-control" value="삼성중공업"></td>--%>
<%--											--%>
<%--											<td class="border text-center" ><input type="text" class="form-control" value="시운전팀 공정예산"></td>--%>
<%--											<td class="border text-center" ><input type="text" class="form-control" value="김삼성"></td>--%>
<%--											<td class="border text-center" ><input type="text" class="form-control" value="프로"></td>--%>
<%--											<td class="border text-center" ><input type="text" class="form-control" value="123456"></td>--%>
<%--											<td class="border text-center" ><input type="text" class="form-control" value="시운전 업무"></td>--%>
<%--											--%>
<%--											<td class="border text-center" ><input type="text" class="form-control" value="1234567"></td>--%>
<%--											<td class="border text-center" ><input type="text" class="form-control" value="010-1234-1234"></td>--%>
<%--											<td class="border text-center" ></td>--%>
<%--											<td class="border text-center" ><select class="form-control"><option></option><option selected="selected">승선</option><option>하선</option></select></td>--%>
<%--											<td class="border text-center" ><select class="form-control"><option selected="selected"></option><option>승선</option><option>하선</option></select></td>--%>
<%--											--%>
<%--											<td class="border text-center" ><select class="form-control"><option selected="selected"></option><option>승선</option><option>하선</option></select></td>--%>
<%--											<td class="border text-center" ><select class="form-control"><option></option><option>승선</option><option selected="selected">하선</option></select></td>--%>
<%--										</tr>--%>
									</tbody>
								</table>
							</div>
						</div>
					</div>
				</div>
				<div id="includeFooter"></div>
			</div>
		</div>
		<!-- /footer content -->
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
	<script src="${pageContext.request.contextPath}/js/common.js"></script>
	<script>
		const scheUid = "${bean.uid}";
		<c:choose>
			<c:when test="${not empty bean.scheCrewSdate}">
			const scheSdate = '${bean.scheCrewSdate}'
			let scheEdate = null
			const scheCrewPeriod = ${bean.scheCrewPeriod}
			if (isEmpty(scheCrewPeriod) || scheCrewPeriod === 0) {
				scheEdate = scheSdate
			} else {
				let result = new Date(scheSdate);
				result.setDate(result.getDate() + scheCrewPeriod);
				scheEdate = `\${result.getFullYear()}-\${result.getMonth() + 1 > 9 ? result.getMonth() + 1 : '0' + (result.getMonth() + 1)}-\${result.getDate() > 9 ? result.getDate() : '0' + result.getDate()}`
			}
			</c:when>
			<c:otherwise>
				const scheSdate = '${bean.sdate}'
				const scheEdate = '${bean.edate}'
			</c:otherwise>
		</c:choose>

		const cateList = new Array();
		const positionList = new Array();
		const barkingList = new Array();

		<c:forEach items="${listCate}" var="domain">
			cateList.push({
				'value': '${domain.val}',
				'desc': '${domain.description}'
			});
		</c:forEach>

		<c:forEach items="${listPosition}" var="domain">
			positionList.push({
				'value': '${domain.val}',
				'desc': '${domain.description}'
			});
		</c:forEach>

		<c:forEach items="${listBarking}" var="domain">
			barkingList.push({
				'value': '${domain.val}',
				'desc': '${domain.description}'
			});
		</c:forEach>
	</script>
	<script src="${pageContext.request.contextPath}/js/mng/sche/departureReport.js"></script>
</body>
</html>
