<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt"%>
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
								<h3 class="g_text_primary font-weight-bold my-0">
									<span data-i18n="title"></span>
									<c:if test="${departureState eq 'O'}">
										${version} 일차
									</c:if>
								</h3>
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
									<a class="nav-link" href="${pageContext.request.contextPath}/mng/sche/departureReportScheduleChart.html?uid=${bean.uid}" role="tab" aria-controls="tab" aria-selected="false"> &nbsp; <span data-i18n="depChart">Chart</span> &nbsp;</a>
								</li>
								<li class="nav-item">
									<a class="nav-link" href="${pageContext.request.contextPath}/mng/sche/departureReport.html?uid=${bean.uid}" role="tab" aria-selected="false"> &nbsp; <span data-i18n="regCrew">Crew Registration</span> &nbsp;</a>
								</li>
								<li class="nav-item">
									<a class="nav-link" href="${pageContext.request.contextPath}/mng/sche/departureReportRegDailyInfo.html?uid=${bean.uid}" role="tab" aria-selected="true"><span data-i18n="regDailyInfo">Info Registration</span></a>
								</li>
								<li class="nav-item">
									<a class="nav-link active" href="${pageContext.request.contextPath}/mng/sche/departureDailyReportCheck.html?uid=${bean.uid}" role="tab" aria-selected="false"> &nbsp; <span data-i18n="depDailyRpt">Departure Report</span> &nbsp;</a>
								</li>
							</ul>
						</div>
					</div>
				</div>
				<div class="row">
					<div class="col-12">
						<div class="x_panel">
							<div class="col-md-12 col-sm-12 pt-2">
								<button type="button" class="btn btn-primary float-right" onClick="submitReportInfo()" <c:if test="${departureState ne 'O'}"> disabled</c:if>>
									<img src="${pageContext.request.contextPath}/img/i_btn_save.svg" class="mr-1" height="16px">
									<span class="text-white" data-i18n="btnSubmit">submit</span>
								</button>
							</div>

							<div class="col-md-12 col-sm-12 pt-2">
								<div class="row">
									<div class="col-md-12">
										<div class="departure_padding g_bg_light text-white text-center">
											<h2 data-i18n="list.title">${bean.hullnum} 해상 시운전 일일 보고(1/2)</h2>
											<h2 data-i18n="list.title">
												<c:if test="${not empty bean.description}">
													(${bean.description})
												</c:if>
											</h2>
										</div>
									</div>
								</div>
							</div>

							<div class="col-md-12 col-sm-12 pt-2">
								<div class="row">
									<div class="col-md-2">
										<span class="text-center" style="display: block; border: 1px solid rgba(221,221,221,0.78); height: 50px; line-height: 50px; background: #313F52; color: #ECF0F1;">Schedule</span>
									</div>
									<div class="col-md-8">
										<div class="col-md-12" style="border: 1px solid rgba(221,221,221,0.78); height: 50px; padding-top: 5px;">
											<span style="font-size: 15px; font-weight: bold;">계획: ${sdate} ${stime} ~ ${edate} ${etime}</span>
											<br />
											<span style="font-size: 15px; font-weight: bold;">실행: ${performancesdate} ${performancestime} ~ ${performanceedate} ${performanceetime}</span>
										</div>
									</div>
									<div class="col-md-2">
										<div class="col-md-12" style="border: 1px solid rgba(221,221,221,0.78); height: 50px; padding-top: 5px;">
											<span >&nbsp;</span>
										</div>
									</div>
								</div>
								<br>
								<table data-toggle="table" data-custom-sort="tblistSort" class="table table-borderless table-striped jambo_table bulk_action mg-0">
									<colgroup>
										<col>
										<col style="width: 22%;">
										<col style="width: 22%;">
										<col style="width: 22%;">
										<col style="width: 22%;">
									</colgroup>
									<thead>
										<tr class="headings">
											<th class="column-title border text-center"><span data-i18n="list.commander">수행시간</span></th>
											<th class="column-title border text-center"><span data-i18n="list.commander">Total</span></th>
											<th class="column-title border text-center"><span data-i18n="list.commander">Hull</span></th>
											<th class="column-title border text-center"><span data-i18n="list.commander">Mach</span></th>
											<th class="column-title border text-center"><span data-i18n="list.commander">Electic</span></th>
										</tr>
									</thead>
									<tbody id="schedulelist">
										<tr class="even pointer">
											<td class="border text-center">
												<div style="font-size: x-large; padding: 10px 0;">${hullCnt + machineryCnt + electricCnt}(<c:if test="${hullCompCnt + machCompCnt + elecCompCnt != 0}"><fmt:formatNumber value="${(hullCompCnt + machCompCnt + elecCompCnt)/(hullCnt + machineryCnt + electricCnt) * 100}" pattern=".00" /></c:if><c:if test="${hullCompCnt + machCompCnt + elecCompCnt == 0}">0</c:if> %)</div>
<%--												<div style="font-size: large;">146</div>--%>
											</td>
											<td class="border text-center"><div style="height: 100px;"><canvas id="totalChart" style="margin: 0 auto;"></canvas></div></td>
											<td class="border text-center"><div style="height: 100px;"><canvas id="hullChart" style="margin: 0 auto;"></canvas></div></td>
											<td class="border text-center"><div style="height: 100px;"><canvas id="machChart" style="margin: 0 auto;"></canvas></div></td>
											<td class="border text-center"><div style="height: 100px;"><canvas id="elecChart" style="margin: 0 auto;"></canvas></div></td>
										</tr>
									</tbody>
								</table>
								<div class="x_title border0">
									<h2 data-i18n="list.title">State of board</h2>
								</div>
								<br>
								<div style="font-size: 15px; font-weight: bold;">
									Commander : ${commanderName}(${commanderTel})
								</div>
								<table data-toggle="table" data-custom-sort="tblistSort2" class="table table-borderless table-striped jambo_table bulk_action mg-0">
									<thead>
									<tr class="headings">
										<th class="column-title border text-center" ><span data-i18n="list.commander">Total</span></th>
										<th class="column-title border text-center" ><span data-i18n="list.m ach">SHI</span></th>
										<th class="column-title border text-center" ><span data-i18n="list.hull">선주</span></th>
										<th class="column-title border text-center" ><span data-i18n="list.elec">선급</span></th>
										<th class="column-title border text-center" ><span data-i18n="list.elec">S/E</span></th>

										<th class="column-title border text-center" ><span data-i18n="list.depart">선장</span></th>
										<th class="column-title border text-center" ><span data-i18n="list.name">타수</span></th>
										<th class="column-title border text-center" ><span data-i18n="list.name">기관장</span></th>
										<th class="column-title border text-center" ><span data-i18n="list.name">간호사</span></th>
									</tr>
									</thead>
									<tbody>
									<tr class="even pointer">
										<td class="border text-center" ><input id="totalCnt" type="number" step="1" class="form-control" value="${totalCnt}" data-index="${empty totalCntuid ? 0 : totalCntuid}" disabled></td>
										<td class="border text-center" ><input id="shiCnt" type="number" step="1" class="form-control" value="${shiCnt}" data-index="${empty shiCntuid ? 0 : shiCntuid}" onchange="sumCrew()" disabled/></td>
										<td class="border text-center" ><input id="companyCnt" type="number" step="1" class="form-control" value="${companyCnt}" data-index="${empty companyCntuid ? 0 : companyCntuid}" onchange="sumCrew()" disabled/></td>
										<td class="border text-center" ><input id="classCnt" type="number" step="1" class="form-control" value="${classCnt}" data-index="${empty classCntuid ? 0 : classCntuid}" onchange="sumCrew()" disabled/></td>
										<td class="border text-center" ><input id="seCnt" type="number" step="1" class="form-control" value="${seCnt}" data-index="${empty seCntuid ? 0 : seCntuid}" onchange="sumCrew()" disabled/></td>

										<td class="border text-center" ><input id="captainCnt" type="number" step="1" class="form-control" value="${captainCnt}" data-index="${empty captainCntuid ? 0 : captainCntuid}" onchange="sumCrew()" disabled/></td>
										<td class="border text-center" ><input id="passengerCnt" type="number" step="1" class="form-control" value="${passengerCnt}" data-index="${empty passengerCntuid ? 0 : passengerCntuid}" onchange="sumCrew()" disabled/></td>
										<td class="border text-center" ><input id="engineerCnt" type="number" step="1" class="form-control" value="${engineerCnt}" data-index="${empty engineerCntuid ? 0 : engineerCntuid}" onchange="sumCrew()" disabled/></td>
										<td class="border text-center" ><input id="medicCnt" type="number" step="1" class="form-control" value="${medicCnt}" data-index="${empty medicCntuid ? 0 : medicCntuid}" onchange="sumCrew()" disabled/></td>
									</tr>
									</tbody>
								</table>
							</div>
							<div class="col-md-12 col-sm-12 pt-2">
								<div class="row">
									<div class="col-md-12">
										<div class="x_title border0">
											<h2 data-i18n="list.title">Ship's Condition</h2>
										</div>
									</div>
								</div>

								<div class="row">
									<div class="col-md-6">
										<table data-toggle="table" data-custom-sort="tblistSort2" class="table table-borderless table-striped jambo_table bulk_action mg-0">
											<tbody>
											<tr class="headings">
												<th class="column-title border text-center" rowspan="2"><span data-i18n="list.commander">Fuel</span></th>
												<th class="column-title border text-center" ><span data-i18n="list.commander">HFO</span></th>
												<th class="column-title border text-center" ><span data-i18n="list.commander">MGO</span></th>
												<th class="column-title border text-center" ><span data-i18n="list.commander">LNG</span></th>
											</tr>
											<tr class="even pointer">
												<td class="border text-center" ><input id="hfo" type="number" step="1" class="form-control" value="${hfo}" data-index="${empty hfouid ? 0 : hfouid}" disabled></td>
												<td class="border text-center" ><input id="mgo" type="number" step="1" class="form-control" value="${mgo}" data-index="${empty mgouid ? 0 : mgouid}" disabled></td>
												<td class="border text-center" ><input id="lng" type="number" step="1" class="form-control" value="${lng}" data-index="${empty lnguid ? 0 : lnguid}" disabled></td>
											</tr>
											</tbody>
										</table>
									</div>
									<div class="col-md-6">
										<table data-toggle="table" data-custom-sort="tblistSort2" class="table table-borderless table-striped jambo_table bulk_action mg-0">
											<tbody id="">
											<tr class="headings">
												<th class="column-title border text-center" rowspan="2"><span data-i18n="list.commander" style="color: red;">Draft</span></th>
												<th class="column-title border text-center" ><span data-i18n="list.commander">FWD</span></th>
												<th class="column-title border text-center" ><span data-i18n="list.commander">MID</span></th>
												<th class="column-title border text-center" ><span data-i18n="list.commander">AFT</span></th>
											</tr>
											<tr class="even pointer">
												<td class="border text-center" ><input id="fwd" type="number" step="1" class="form-control" value="${fwd}" data-index="${empty fwduid ? 0 : fwduid}" disabled></td>
												<td class="border text-center" ><input id="mid" type="number" step="1" class="form-control" value="${mid}" data-index="${empty miduid ? 0 : miduid}" disabled></td>
												<td class="border text-center" ><input id="aft" type="number" step="1" class="form-control" value="${aft}" data-index="${empty aftuid ? 0 : aftuid}" disabled></td>
											</tr>
											</tbody>
										</table>
									</div>
								</div>

								<div class="row">
									<div class="col-md-12">
										<div class="x_title border0">
											<h2 data-i18n="list.title">특이사항</h2>
										</div>
									</div>
									<div class="col-md-12">
										<textarea id="reportEtc" style="width: 100%;" rows="3" cols="20" data-index="${empty reportEtcuid ? 0 : reportEtcuid}" disabled>${reportEtc}</textarea>
									</div>
								</div>
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
	<script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js"></script>
	<script>
		const uid = '${bean.uid}'
		const totalCtx = document.querySelector('#totalChart').getContext('2d');
		new Chart(totalCtx, {
			type: 'doughnut',
			responsive: true,
			data: {
				datasets: [{
					data: ['${hullCnt + machineryCnt + electricCnt}', '${hullCompCnt + machCompCnt + elecCompCnt}'],
					backgroundColor: [
						'rgba(255, 99, 132, 0.2)',
						'rgba(54, 162, 235, 0.2)'
					],
					borderColor: [
						'rgba(255, 99, 132, 1)',
						'rgba(54, 162, 235, 1)'
					],
					borderWidth: 1
				}]
			}
		});

		const hullCtx = document.querySelector('#hullChart').getContext('2d');
		new Chart(hullCtx, {
			type: 'doughnut',
			responsive: true,
			data: {
				datasets: [{
					data: ['${hullCnt}', '${hullCompCnt}'],
					backgroundColor: [
						'rgba(255, 99, 132, 0.2)',
						'rgba(54, 162, 235, 0.2)'
					],
					borderColor: [
						'rgba(255, 99, 132, 1)',
						'rgba(54, 162, 235, 1)'
					],
					borderWidth: 1
				}]
			}
		});

		const machCtx = document.querySelector('#machChart').getContext('2d');
		new Chart(machCtx, {
			type: 'doughnut',
			responsive: true,
			data: {
				datasets: [{
					data: ['${machineryCnt}', '${machCompCnt}'],
					backgroundColor: [
						'rgba(255, 99, 132, 0.2)',
						'rgba(54, 162, 235, 0.2)'
					],
					borderColor: [
						'rgba(255, 99, 132, 1)',
						'rgba(54, 162, 235, 1)'
					],
					borderWidth: 1
				}]
			}
		});

		const elecCtx = document.querySelector('#elecChart').getContext('2d');
		new Chart(elecCtx, {
			type: 'doughnut',
			responsive: true,
			data: {
				datasets: [{
					data: ['${electricCnt}', ${elecCompCnt}],
					backgroundColor: [
						'rgba(255, 99, 132, 0.2)',
						'rgba(54, 162, 235, 0.2)'
					],
					borderColor: [
						'rgba(255, 99, 132, 1)',
						'rgba(54, 162, 235, 1)'
					],
					borderWidth: 1
				}]
			}
		});
	</script>
	<script src="${pageContext.request.contextPath}/js/mng/sche/departureDailyReport_check.js"></script>
</body>
</html>
