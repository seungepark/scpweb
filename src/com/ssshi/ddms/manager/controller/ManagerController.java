package com.ssshi.ddms.manager.controller;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.ssshi.ddms.constant.DBConst;
import com.ssshi.ddms.db.service.DbServiceI;
import com.ssshi.ddms.dto.*;
import org.apache.poi.hssf.util.HSSFColor;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.ss.util.CellRangeAddressList;
import org.apache.poi.xssf.usermodel.XSSFCell;
import org.apache.poi.xssf.usermodel.XSSFRow;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import com.ssshi.ddms.constant.Const;
import com.ssshi.ddms.manager.service.ManagerServiceI;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;

/********************************************************************************
 * 프로그램 개요 : Manager
 * 
 * 최초 작성자 : 김한준
 * 최초 작성일 : 2021-06-07
 * 
 * 최종 수정자 : KHJ
 * 최종 수정일 : 2025-02-05
 * 
 * 메모 : 없음
 * 
 * Copyright 2021 by HLab. Confidential and proprietary information
 * This document contains information, which is the property of HLab, 
 * and is furnished for the sole purpose of the operation and the maintenance.  
 * Copyright © 2021 HLab.  All rights reserved.
 *
 ********************************************************************************/

@Controller
public class ManagerController {

	@Autowired
	private ManagerServiceI service;

	@Autowired
	private DbServiceI dbService;
	
	// 시운전 스케줄러 관련 추가 Start
	@RequestMapping(value="/mng/sche/scheduler.html")
	public String scheduler(HttpServletRequest request, ModelMap model) throws Exception {
		model.addAllAttributes(service.scheduler());
		
		return "mng/sche/scheduler";
	}

	@RequestMapping(value="/mng/sche/getScheduleList.html")
	public String getSchedulerList(HttpServletRequest request, ModelMap model, SchedulerInfoBean bean) throws Exception {
		model.addAllAttributes(service.getSchedulerList(bean));
		
		return "mng/sche/getSchedulerList";
	}
	
	@RequestMapping(value="/mng/sche/detailRowScheduler.html")
	public String detailSchedulerRowData(HttpServletRequest request, ModelMap model, ParamBean bean) throws Exception{
		model.addAttribute(Const.BEAN, service.detailScheduler(bean));
		
		return "mng/sche/detailRowScheduler";
	}
	
	@RequestMapping(value="/mng/sche/getScheRowList.html")
	public String getDetailSchedulerRowData(HttpServletRequest request, ModelMap model, SchedulerDetailInfoBean bean) throws Exception{
		model.addAllAttributes(service.getSchedulerRowDataList(bean));
		
		return "mng/sche/getSchedulerDetailRowList";
	}
	
	@RequestMapping(value="/mng/sche/scheDetRowListDownAll.html")
	public String schedulerDetailRowListDownAll(HttpServletRequest request, ModelMap model, SchedulerDetailInfoBean bean) throws Exception{
		model.addAllAttributes(service.getSchedulerRowDataList(bean));
		
		return "mng/sche/getSchedulerDetailRowList";
	}
	
	@RequestMapping(value="/mng/sche/detailChartScheduler.html")
	public String detailSchedulerChart(HttpServletRequest request, ModelMap model, ParamBean bean) throws Exception{
		model.addAttribute(Const.BEAN, service.detailScheduler(bean));
		return "mng/sche/detailChartScheduler";
	}
	
	@RequestMapping(value="/mng/sche/getScheChartList.html")
	public String getDetailSchedulerChartData(HttpServletRequest request, ModelMap model, SchedulerDetailInfoBean bean) throws Exception{
		model.addAllAttributes(service.getSchedulerChartDataList(bean));
		
		return "mng/sche/getSchedulerDetailRowList";
	}
	
	@RequestMapping(value="/mng/sche/newScheduler.html")
	public String newScheduler(HttpServletRequest request, ModelMap model, ParamBean bean) throws Exception{
		model.addAllAttributes(service.newScheduler(request, bean));
		
		return "mng/sche/newScheduler";
	}
	
	@RequestMapping(value="/mng/sche/modifyScheduler.html")
	public String modifyScheduler(HttpServletRequest request, ModelMap model, ParamBean bean) throws Exception{
		model.addAllAttributes(service.modifyScheduler(request, bean));
		
		return "mng/sche/modifyScheduler";
	}	
	
	@RequestMapping(value="/mng/sche/updateSche.html")
	public String updateScheduler(HttpServletRequest request, ModelMap model, SchedulerInfoBean bean) throws Exception{
		model.addAttribute(Const.RESULT, service.updateScheduler(request, bean));
		
		return "share/result";
	}

	// 사용 여부 확인 필요 (24.10.29. 계획신규 수정 )
	@RequestMapping(value="/mng/sche/getScheTcNumSearchList.html")
	public String getScheduleTcNumSearchList(HttpServletRequest request, ModelMap model, ScheduleCodeDetailBean bean) throws Exception{
		model.addAllAttributes(service.getScheduleTcNumSearchList(request, bean));
		
		return "mng/scheBasic/getScheduleCodeDetList";
	}
	
	@RequestMapping(value="/mng/sche/insertSche.html", produces="application/json; charset=UTF-8")
	public String insertScheduler(HttpServletRequest request, ModelMap model, SchedulerInfoBean bean) throws Exception{
		model.addAttribute(Const.RESULT, service.insertScheduler(request, bean));
		
		return "share/resultString";
	}
	
	@RequestMapping(value="/mng/sche/deleteSchedule.html")
	public String deleteSchedule(HttpServletRequest request, ModelMap model, ParamBean bean) throws Exception {
		model.addAttribute(Const.RESULT, service.deleteScheduler(request, bean));
		
		return "share/result";
	}
	@RequestMapping(value="/mng/sche/changeStatusSchedule.html")
	public String changeStatusSchedule(HttpServletRequest request, ModelMap model, ParamBean bean) throws Exception {
		model.addAttribute(Const.RESULT, service.changeStatusScheduler(request, bean));
		
		return "share/result";
	}
	@RequestMapping(value="/mng/sche/popModifySchedulerChart.html")
	public String popModifyScheChart(HttpServletRequest request, ModelMap model) throws Exception {
		model.addAllAttributes(service.popModifyScheChart(request)); // 수정 기능이 추가 되어.....

		return "mng/sche/popModifySchedulerChart";
	}
	// 시운전 스케줄러 관련 추가 End
	
	// 시운전 스케줄러 기준 정보 관련 추가 Start
	@RequestMapping(value="/mng/scheBasic/scheHierarchy.html")
	public String scheHierarchy(HttpServletRequest request) throws Exception {
		return "mng/scheBasic/scheHierarchy";
	}
	
	@RequestMapping(value="/mng/scheBasic/getScheduleHierarchyList.html")
	public String getScheHierarchyList(HttpServletRequest request, ModelMap model, ScheduleHierarchyBean bean) throws Exception {
		model.addAllAttributes(service.getScheduleHierarchyList(request, bean));
		
		return "mng/scheBasic/getScheduleHierarchyList";
	}
	
	@RequestMapping(value="/mng/scheBasic/getScheParentSearchList.html")
	public String getScheParentSearchList(HttpServletRequest request, ModelMap model, ScheduleHierarchyBean bean) throws Exception {
		model.addAllAttributes(service.getScheduleHierarchyParentList(request, bean));
		
		return "mng/scheBasic/getScheduleHierarchyList";
	}
	
	@RequestMapping(value="/mng/scheBasic/updateScheHier.html")
	public String updateScheduleHierarchy(HttpServletRequest request, ModelMap model, ScheduleHierarchyBean bean) throws Exception {
		model.addAttribute(Const.RESULT, service.updateScheduleHierarchy(request, bean));
		
		return "share/result";
	}
	
	@RequestMapping(value="/mng/scheBasic/scheduleCode.html")
	public String scheduleCode(HttpServletRequest request, ModelMap model, ParamBean bean) throws Exception {
		model.addAllAttributes(service.scheduleCode(request, bean));
		
		return "mng/scheBasic/scheduleCode";
	}
	
	@RequestMapping(value="/mng/scheBasic/getScheduleCodeInfoList.html")
	public String getScheduleCodeInfoList(HttpServletRequest request, ModelMap model, ScheduleCodeInfoBean bean) throws Exception {
		model.addAllAttributes(service.getScheduleCodeInfoList(request, bean));
		
		return "mng/scheBasic/getScheduleCodeInfoList";
	}
	
	@RequestMapping(value="/mng/scheBasic/changeStatusScheduleCode.html")
	public String changeStatusScheduleCode(HttpServletRequest request, ModelMap model, ParamBean bean) throws Exception {
		model.addAttribute(Const.RESULT, service.changeStatusScheduleCode(request, bean));
		
		return "share/result";
	}
	
	@RequestMapping(value="/mng/scheBasic/deleteScheduleCode.html")
	public String deleteScheduleCode(HttpServletRequest request, ModelMap model, ParamBean bean) throws Exception {
		model.addAttribute(Const.RESULT, service.deleteScheduleCode(request, bean));
		
		return "share/result";
	}
	
	@RequestMapping(value="/mng/scheBasic/detailScheduleCode.html")
	public String detailScheduleCode(HttpServletRequest request, ModelMap model, ParamBean bean) throws Exception{
		model.addAllAttributes(service.getScheduleCodeInfo(request, bean));
		
		return "mng/scheBasic/detailScheduleCode";
	}
	
	@RequestMapping(value="/mng/scheBasic/modifyScheduleCode.html")
	public String modifyScheduleCode(HttpServletRequest request, ModelMap model, ParamBean bean) throws Exception{
		model.addAllAttributes(service.getScheduleCodeInfo(request, bean));
		
		return "mng/scheBasic/modifyScheduleCode";
	}
	
	@RequestMapping(value="/mng/scheBasic/getScheCodeDetList.html")
	public String getScheduleCodeDetList(HttpServletRequest request, ModelMap model, ParamBean bean) throws Exception {
		model.addAllAttributes(service.getSchedulerCodeDetList(bean));
		
		return "mng/scheBasic/getScheduleCodeDetList";
	}
	
	@RequestMapping(value="/mng/scheBasic/getScheCodeDetTcSearchList.html")
	public String getScheCodeDetTcSearchList(HttpServletRequest request, ModelMap model, ScheduleHierarchyBean bean) throws Exception {
		model.addAllAttributes(service.getScheduleHierarchyForCodeDetList(request, bean));
		
		return "mng/scheBasic/getScheduleHierarchyList";
	}
	
	@RequestMapping(value="/mng/scheBasic/updateScheCode.html")
	public String updateScheduleCode(HttpServletRequest request, ModelMap model, ScheduleCodeInfoBean bean) throws Exception{
		model.addAttribute(Const.RESULT, service.updateScheduleCode(request, bean));
		
		return "share/result";
	}

	@RequestMapping(value="/mng/scheBasic/newScheduleCode.html")
	public String newScheduleCode(HttpServletRequest request, ModelMap model, ParamBean bean) throws Exception{
		model.addAllAttributes(service.newScheduleCode(request, bean));
		
		return "mng/scheBasic/newScheduleCode";
	}
	
	@RequestMapping(value="/mng/scheBasic/insertScheCode.html", produces="application/json; charset=UTF-8")
	public String insertScheduleCode(HttpServletRequest request, ModelMap model, ScheduleCodeInfoBean bean) throws Exception{
		model.addAttribute(Const.RESULT, service.insertScheduleCode(request, bean));
		
		return "share/result";
	}

	@RequestMapping(value="/mng/stnd/reqInfo.html")
	public String standardReqInfo(HttpServletRequest request, ModelMap model, ParamBean bean) throws Exception {
		model.addAllAttributes(service.getStndReqInfo(request, bean));
		return "mng/stnd/reqInfo";
	}

	@RequestMapping(value="/mng/stnd/getStndReqInfoRowList.html")
	public String getStndReqInfoRowList(HttpServletRequest request, ModelMap model) throws Exception{
		model.addAllAttributes(service.getStandardReqInfoList());
		return "mng/stnd/getStndReqInfoRowList";
	}

	@RequestMapping(value="/mng/stnd/insertStndReqInfoRow.html")
	public String insertStndReqInfoRow(HttpServletRequest request, ModelMap model, @ModelAttribute StandardReqInfoBean param) throws Exception {
		model.addAttribute(Const.RESULT, service.insertStandardReqInfo(request, param.getParams()));
		return "share/result";
	}

	@RequestMapping(value="/mng/stnd/deleteStndReqInfoRow.html")
	public String deleteStndReqInfoRow(HttpServletRequest request, ModelMap model, ParamBean bean) throws Exception {
		model.addAttribute(Const.RESULT, service.deleteStandardReqInfo(request, bean));

		return "share/result";
	}

	@RequestMapping(value="/mng/vssl/reqInfo.html")
	public String vesselReqInfo(HttpServletRequest request, ModelMap model) throws Exception {
		model.addAllAttributes(service.vesselReqInfo());
		
		return "mng/vssl/reqInfo";
	}

	@RequestMapping(value="/mng/vssl/getVesselReqInfoList.html")
	public String getVesselReqInfoList(HttpServletRequest request, ModelMap model, VesselReqInfoBean bean) throws Exception {
		model.addAllAttributes(service.getVessleReqInfoList(request, bean));

		return "mng/vssl/getVesselReqInfoList";
	}

	@RequestMapping(value="/mng/vssl/changeStatusVesselReqInfo.html")
	public String changeStatusVesselReqInfo(HttpServletRequest request, ModelMap model, ParamBean bean) throws Exception {
		model.addAttribute(Const.RESULT, service.changeStatusVesselReqInfo(request, bean));

		return "share/result";
	}

	@RequestMapping(value="/mng/vssl/deleteVesselReqInfo.html")
	public String deleteVesselReqInfo(HttpServletRequest request, ModelMap model, ParamBean bean) throws Exception {
		model.addAttribute(Const.RESULT, service.deleteVesselReqInfo(request, bean));

		return "share/result";
	}

	@RequestMapping(value="/mng/vssl/detailVesselReqInfo.html")
	public String detailVesselReqInfo(HttpServletRequest request, ModelMap model, ParamBean bean) throws Exception{
		model.addAllAttributes(service.getVesselReqInfo(request, bean));

		return "mng/vssl/detailVesselReqInfo";
	}

	@RequestMapping(value="/mng/vssl/getVesselReqInfoDetList.html")
	public String getVesselReqInfoDetList(HttpServletRequest request, ModelMap model, ParamBean bean) throws Exception {
		model.addAllAttributes(service.getVesselReqInfoDetList(bean));

		return "mng/vssl/getVesselReqInfoDetList";
	}

	@RequestMapping(value="/mng/vssl/getVesselReqInfoDetListByHullNum.html")
	public String getVesselReqInfoDetListByHullNum(HttpServletRequest request, ModelMap model, ParamBean bean) throws Exception {
		model.addAllAttributes(service.getVesselReqInfoDetListByHullNum(bean));

		return "mng/vssl/getVesselReqInfoDetList";
	}


	@RequestMapping(value="/mng/vssl/modifyVesselReqInfo.html")
	public String modifyVesselReqInfo(HttpServletRequest request, ModelMap model, ParamBean bean) throws Exception{
		model.addAllAttributes(service.getVesselReqInfo(request, bean));

		return "mng/vssl/modifyVesselReqInfo";
	}

	@RequestMapping(value="/mng/vssl/insertVesselReqInfoDet.html")
	public String insertVesselReqInfoDet(HttpServletRequest request, ModelMap model, @ModelAttribute VesselReqInfoBean param) throws Exception {
		model.addAttribute(Const.RESULT, service.insertVesselReqInfoDet(request, param));
		return "share/result";
	}

	@RequestMapping(value="/mng/vssl/newVesselReqInfo.html")
	public String newVesselReqInfo(HttpServletRequest request, ModelMap model, ParamBean bean) throws Exception{
		model.addAllAttributes(service.newVesselReqInfo(request, bean));

		return "mng/vssl/newVesselReqInfo";
	}

	@RequestMapping(value="/mng/vssl/insertVesselReqInfo.html")
	public String insertVesselReqInfo(HttpServletRequest request, ModelMap model, @ModelAttribute VesselReqInfoBean param) throws Exception {
		model.addAttribute(Const.RESULT, service.insertVesselReqInfo(request, param));
		return "share/result";
	}
	
	@RequestMapping(value="/mng/stnd/getCurReqInfoRowList.html")
	public String getCurReqInfoRowList(HttpServletRequest request, ModelMap model, ParamBean bean) throws Exception{
		model.addAllAttributes(service.getCurReqInfoDetList(request, bean));
		return "mng/vssl/getVesselReqInfoDetList";
	}

	// 시운전 스케줄러 기준정보 관련 추가 End

	// schedule report start
	@RequestMapping(value="/mng/sche/reportSchedule.html")
	public String reportSchedule(HttpServletRequest request, ModelMap model) throws Exception {
		model.addAllAttributes(service.reportSchedule(request));
		return "mng/sche/reportSchedule";
	}
	// schedule report end

	// schedule ship cond event start
	@RequestMapping(value="/mng/shipCond/insertShipCond.html")
	public String insertShipCond(HttpServletRequest request, ModelMap model, @ModelAttribute ShipCondBean param) throws Exception {
		model.addAttribute(Const.RESULT, service.insertShipCond(request, param));
		return "share/result";
	}

	@RequestMapping(value="/mng/shipCond/getShipCondList.html")
	public String getShipCondList(HttpServletRequest request, ModelMap model, ParamBean bean) throws Exception {
		model.addAllAttributes(service.getShipCondList(bean));

		return "mng/shipCond/getShipCondList";
	}

	@RequestMapping(value="/mng/sche/departureDashboard.html")
	public String departureDashboard(HttpServletRequest request, ModelMap model, ParamBean bean) throws Exception {
		model.addAllAttributes(service.departureDashboard(request, bean));

		return "mng/sche/departureDashboard";
	}
	
	@RequestMapping(value="/mng/sche/departureReport.html")
	public String departureReport(HttpServletRequest request, ModelMap model, ParamBean bean) throws Exception {
		model.addAllAttributes(service.departureReport(request, bean));
		
		return "mng/sche/departureReport";
	}
	
	@RequestMapping(value="/mng/sche/departureReportRegInfo.html")
	public String departureReportRegInfo(HttpServletRequest request, ModelMap model, ParamBean bean) throws Exception {
		model.addAllAttributes(service.departureReportRegInfo(request, bean));
		
		return "mng/sche/departureReportRegInfo";
	}

	@RequestMapping(value="/mng/sche/insertDepartureReportRegInfo.html")
	public String insertDepartureReportRegInfo(HttpServletRequest request, ModelMap model, SchedulerReportInfoBean bean) throws Exception {
		model.addAllAttributes(service.insertDepartureReportRegInfo(request, bean));
		return "mng/sche/getDepartureReportRegInfo";
	}
	
	@RequestMapping(value="/mng/sche/departureReportCheck.html")
	public String departureReportCheck(HttpServletRequest request, ModelMap model, ParamBean bean) throws Exception {
		model.addAllAttributes(service.departureReportRegInfo(request, bean));
		
		return "mng/sche/departureReportCheck";
	}

	@RequestMapping(value="/mng/sche/departure.html")
	public String departure(HttpServletRequest request, ModelMap model) throws Exception {
		model.addAllAttributes(service.scheduler());

		return "mng/sche/departure";
	}

	// ScheController.getScheList 으로 이동.
	@RequestMapping(value="/mng/sche/getSchedulerDepartureList.html")
	public String getSchedulerDepartureList(HttpServletRequest request, ModelMap model, SchedulerInfoBean bean) throws Exception {
		model.addAllAttributes(service.getSchedulerDepartureList(bean));
		return "mng/sche/getSchedulerList";
	}

	@RequestMapping(value="/mng/sche/departureReportScheduleChart.html")
	public String departureReportScheduleChart(HttpServletRequest request, ModelMap model, ParamBean bean) throws Exception {
		model.addAllAttributes(service.departureReportScheduleChart(request, bean));
		return "mng/sche/departureReportScheduleChart";
	}

	@RequestMapping(value="/mng/sche/updateDepartureReport.html")
	public String updateDepartureReport(HttpServletRequest request, ModelMap model, ParamBean param) throws Exception {
		model.addAttribute(Const.RESULT, service.updateDepartureReport(request, param));
		return "share/result";
	}

	@RequestMapping(value="/mng/sche/updateScheCrewDays.html")
	public String updateScheCrewDays(HttpServletRequest request, ModelMap model, SchedulerInfoBean param) throws Exception {
		model.addAttribute(Const.RESULT, service.updateScheCrewDays(request, param));
		return "share/result";
	}

	@RequestMapping(value="/mng/sche/downloadScheCrewExcel.html")
	public void downloadScheCrewExcel(HttpServletRequest request, ModelMap model, ParamBean param, HttpServletResponse response) throws Exception {

		SchedulerInfoBean bean = service.getScheduler(param);

		String sdate = "";
		String edate = "";

		if (bean.getScheCrewSdate() == null) {
			sdate = bean.getSdate();
			edate = bean.getEdate();
		} else {
			sdate = bean.getScheCrewSdate();
			edate = addDates(sdate, bean.getScheCrewPeriod());
		}

		DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-d");
		LocalDate startDate = LocalDate.parse(sdate, formatter);
		LocalDate endDate = LocalDate.parse(edate, formatter);

		List<String> days = getDatesBetweenTwoDates(startDate, endDate);

		List<DomainInfoBean> cates = dbService.getDomainInfoList(DBConst.DOMAIN_CREW_CATE);
		String[] cateItems = new String[cates.size()];
		for (int i = 0; i < cates.size(); i ++) {
			cateItems[i] = cates.get(i).getDescription();
		}

		List<DomainInfoBean> positions = dbService.getDomainInfoList(DBConst.DOMAIN_CREW_POSITION);
		String[] positionItems = new String[positions.size()];
		for (int i = 0; i < positions.size(); i ++) {
			positionItems[i] = positions.get(i).getDescription();
		}

		List<DomainInfoBean> barkings = dbService.getDomainInfoList(DBConst.DOMAIN_CREW_BARKING);
		String[] barkingItems = new String[barkings.size()];
		for (int i = 0; i < barkings.size(); i ++) {
			barkingItems[i] = barkings.get(i).getDescription();
		}

		XSSFWorkbook wb = new XSSFWorkbook();
		XSSFSheet sheet = null;
		XSSFRow row = null;
		XSSFCell cell = null;

		int rowNo = 0;

		// 폰트 설정
		Font headFont = wb.createFont();
		headFont.setFontHeightInPoints((short) 11);
		headFont.setFontName("맑은 고딕");
		headFont.setBold(true);

		Font defaultFont = wb.createFont();
		defaultFont.setFontHeightInPoints((short) 10);
		defaultFont.setFontName("맑은 고딕");

		// 제목 경계 스타일 테두리 지정
		CellStyle headStyle = wb.createCellStyle();
		headStyle.setFont(headFont);
		headStyle.setBorderBottom((short) 1);
		headStyle.setBorderLeft((short) 1);
		headStyle.setBorderTop((short) 1);
		headStyle.setBorderRight((short) 1);
		headStyle.setFillForegroundColor(HSSFColor.LIGHT_YELLOW.index);
		headStyle.setFillPattern(CellStyle.SOLID_FOREGROUND);

		// 데이터용 경계 스타일 테두리만 지정
		CellStyle bodyStyle = wb.createCellStyle();
		bodyStyle.setFont(defaultFont);
		bodyStyle.setBorderBottom((short) 1);
		bodyStyle.setBorderLeft((short) 1);
		bodyStyle.setBorderTop((short) 1);
		bodyStyle.setBorderRight((short) 1);

		// 시트생성
		sheet = wb.createSheet("승선자등록");
		rowNo = 0;

		// 첫행 header 값 세팅
		row = sheet.createRow(rowNo++);
		cell = row.createCell(0);
		cell.setCellStyle(headStyle);
		cell.setCellValue("No.");
		cell = row.createCell(1);
		cell.setCellStyle(headStyle);
		cell.setCellValue("항목");
		cell = row.createCell(2);
		cell.setCellStyle(headStyle);
		cell.setCellValue("구분");
		cell = row.createCell(3);
		cell.setCellStyle(headStyle);
		cell.setCellValue("회사");
		cell = row.createCell(4);
		cell.setCellStyle(headStyle);
		cell.setCellValue("부서");
		cell = row.createCell(5);
		cell.setCellStyle(headStyle);
		cell.setCellValue("성명");
		cell = row.createCell(6);
		cell.setCellStyle(headStyle);
		cell.setCellValue("직급");
		cell = row.createCell(7);
		cell.setCellStyle(headStyle);
		cell.setCellValue("사번");
		cell = row.createCell(8);
		cell.setCellStyle(headStyle);
		cell.setCellValue("업무");
		cell = row.createCell(9);
		cell.setCellStyle(headStyle);
		cell.setCellValue("주민번호(앞7자리)");
		cell = row.createCell(10);
		cell.setCellStyle(headStyle);
		cell.setCellValue("전화번호");
		cell = row.createCell(11);
		cell.setCellStyle(headStyle);
		cell.setCellValue("미승선");

		for (int i = 0; i < days.size(); i ++) {
			cell = row.createCell(12 + i);
			cell.setCellStyle(headStyle);
			cell.setCellValue(days.get(i));
		}

		for (int i=0; i< 10; i ++) {
			row = sheet.createRow(rowNo);
			cell = row.createCell(0);
			cell.setCellStyle(bodyStyle);
			cell.setCellValue(i+1);

			cell = row.createCell(1);
			cell.setCellStyle(bodyStyle);

			setDropdownListItems(sheet, rowNo, 1, cateItems);

			cell = row.createCell(2);
			cell.setCellStyle(bodyStyle);

			setDropdownListItems(sheet, rowNo, 2, positionItems);

			cell = row.createCell(3);
			cell.setCellStyle(bodyStyle);

			cell = row.createCell(4);
			cell.setCellStyle(bodyStyle);

			cell = row.createCell(5);
			cell.setCellStyle(bodyStyle);

			cell = row.createCell(6);
			cell.setCellStyle(bodyStyle);

			cell = row.createCell(7);
			cell.setCellStyle(bodyStyle);

			cell = row.createCell(8);
			cell.setCellStyle(bodyStyle);

			cell = row.createCell(9);
			cell.setCellStyle(bodyStyle);

			cell = row.createCell(10);
			cell.setCellStyle(bodyStyle);

			cell = row.createCell(11);
			cell.setCellStyle(bodyStyle);


			for (int j = 0; j < days.size(); j ++) {
				cell = row.createCell(12 + j);
				cell.setCellStyle(bodyStyle);
				setDropdownListItems(sheet, rowNo, 12 + j, barkingItems);
			}

			rowNo++;
		}

		// 컨텐츠 타입과 파일명 지정
		response.setContentType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
		String outputFileName = new String("승선자_등록_양식.xlsx".getBytes("KSC5601"), "8859_1");
		response.setHeader("Content-Disposition", "attachment; fileName=\"" + outputFileName + "\"");

		// 엑셀 출력
		wb.write(response.getOutputStream());
		wb.close();
	}

	private void setDropdownListItems(XSSFSheet sheet, int rowNo, int colNo, String[] items) {
		DataValidationHelper validationHelper = sheet.getDataValidationHelper();
		CellRangeAddressList addressList = new CellRangeAddressList(rowNo, rowNo, colNo, colNo);
		DataValidationConstraint constraint = validationHelper.createExplicitListConstraint(items);

		// 드롭다운 목록의 데이터 유효성 검사 생성
		DataValidation dataValidation = validationHelper.createValidation(constraint, addressList);

		// 에러 스타일 및 허용 스타일 설정 (선택 사항)
		dataValidation.setSuppressDropDownArrow(true);
		dataValidation.setShowErrorBox(true);

		sheet.addValidationData(dataValidation);
	}

	private List<String> getDatesBetweenTwoDates(LocalDate startDate, LocalDate endDate) {
		long numOfDaysBetween = ChronoUnit.DAYS.between(startDate, endDate);
		List<String> days = new ArrayList<>();
		for (int i = 0; i < numOfDaysBetween; i ++) {
			days.add(startDate.plusDays(i).toString());
		}
		return days;
	}

	private String addDates(String targetDate, int days) throws Exception {
		DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-d");
		LocalDate startDate = LocalDate.parse(targetDate, formatter);
		return startDate.plusDays(days).toString();
	}

	@RequestMapping(value="/mng/sche/uploadScheCrewExcel.html")
	public String uploadScheCrewExcel(HttpServletRequest request, ModelMap model, @RequestParam("file") MultipartFile file, ParamBean param) throws Exception {
		try {
			SchedulerInfoBean bean = service.getScheduler(param);

			String sdate = "";
			String edate = "";

			if (bean.getScheCrewSdate() == null) {
				sdate = bean.getSdate();
				edate = bean.getEdate();
			} else {
				sdate = bean.getScheCrewSdate();
				edate = addDates(sdate, bean.getScheCrewPeriod());
			}

			DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-d");
			LocalDate startDate = LocalDate.parse(sdate, formatter);
			LocalDate endDate = LocalDate.parse(edate, formatter);

			List<String> days = getDatesBetweenTwoDates(startDate, endDate);

			List<DomainInfoBean> cates = dbService.getDomainInfoList(DBConst.DOMAIN_CREW_CATE);
			List<DomainInfoBean> positions = dbService.getDomainInfoList(DBConst.DOMAIN_CREW_POSITION);
			List<DomainInfoBean> barkings = dbService.getDomainInfoList(DBConst.DOMAIN_CREW_BARKING);

			// 엑셀 파일 읽어오기
			Workbook workbook = readExcel(file.getInputStream());

			// 여기서부터는 읽어온 내용에 대한 처리를 수행할 수 있습니다.
			// 예를 들어, 시트와 셀을 반복하면서 내용을 출력하거나 다른 작업을 수행할 수 있습니다.

			// 예제: 첫 번째 시트의 모든 셀 내용 출력
			Sheet sheet = workbook.getSheetAt(0);
			int rowNum = 0;

			List<SchedulerCrewInfoBean> schedulerCrewInfoList = new ArrayList<>();
			for (Row row : sheet) {
				if (rowNum != 0) {
					SchedulerCrewInfoBean infoBean = new SchedulerCrewInfoBean();
					String planText = getCellValue(row.getCell(1)).toString();
					String position = getCellValue(row.getCell(2)).toString();
					String company = getCellValue(row.getCell(3)).toString();
					String departure = getCellValue(row.getCell(4)).toString();
					String name = getCellValue(row.getCell(5)).toString();
					String rank = getCellValue(row.getCell(6)).toString();
					String comNum = getCellValue(row.getCell(7)).toString();
					String workType = getCellValue(row.getCell(8)).toString();
					String ssNum = getCellValue(row.getCell(9)).toString();
					String tel = getCellValue(row.getCell(10)).toString();
//					String notBoarding = getCellValue(row.getCell(11)).toString();

					if (position != null && !"".equals(position)) {
						infoBean.setSeq(rowNum);
						for (DomainInfoBean cate : cates) {
							if (cate.getDescription().equals(planText)) {
								infoBean.setCategory(cate.getVal());
							}
						}

						for (DomainInfoBean domainInfoBean : positions) {
							if (domainInfoBean.getDescription().equals(position)) {
								infoBean.setPosition(domainInfoBean.getVal());
							}
						}

						infoBean.setCompany(company);
						infoBean.setDeparture(departure);
						infoBean.setName(name);
						infoBean.setRank(rank);
						infoBean.setComNum(comNum);
						infoBean.setWorkType(workType);
						infoBean.setSsNum(ssNum);
						infoBean.setTel(tel);

						List<SchedulerCrewDetailBean> schedulerCrewDetailList = new ArrayList<>();
						for (int i = 0; i < days.size(); i ++) {
							String boardingCheck = getCellValue(row.getCell(12 + i)).toString();
							if (boardingCheck != null && !"".equals(boardingCheck)) {
								SchedulerCrewDetailBean detailBean = new SchedulerCrewDetailBean();
								for (DomainInfoBean barking : barkings) {
									if (barking.getDescription().equals(boardingCheck)) {
										detailBean.setBarkingCode(barking.getVal());
										detailBean.setBarkingDate(days.get(i));
										schedulerCrewDetailList.add(detailBean);
									}
								}
							}
						}
						infoBean.setSchedulerCrewDetailList(schedulerCrewDetailList);
						schedulerCrewInfoList.add(infoBean);
					}
				}
				rowNum++;
			}

			// 워크북 닫기
			workbook.close();

			model.addAttribute(Const.LIST, schedulerCrewInfoList);
			return "mng/sche/getUploadScheExcelList";

		} catch (IOException e) {
			e.printStackTrace();
			return "Error processing the uploaded file.";
		}
	}

	@RequestMapping(value="/mng/sche/getSchedulerCrewInfoList.html")
	public String getSchedulerCrewInfoList(HttpServletRequest request, ModelMap model, ParamBean param) throws Exception {
		model.addAllAttributes(service.getSchedulerCrewInfoList(request, param.getUid()));
		return "mng/sche/getUploadScheExcelList";
	}

	private Workbook readExcel(InputStream inputStream) throws IOException {
		return new XSSFWorkbook(inputStream); // 엑셀 파일을 읽어와서 Workbook 객체로 반환
	}

	private static Object getCellValue(Cell cell) {
		DataFormatter dataFormatter = new DataFormatter();
		dataFormatter.addFormat("0", new java.text.DecimalFormat("0"));

		if (cell == null) return "";

		switch (cell.getCellType()) {
			case Const.CELL_TYPE_STRING:
				return cell.getStringCellValue();
			case Const.CELL_TYPE_NUMERIC:
				if (DateUtil.isCellDateFormatted(cell)) {
					return cell.getDateCellValue();
				} else {
					return dataFormatter.formatCellValue(cell);
				}
			case Const.CELL_TYPE_BOOLEAN:
				return cell.getBooleanCellValue();
			case Const.CELL_TYPE_FORMULA:
				return cell.getCellFormula();
			case Const.CELL_TYPE_BLANK:
				return ""; // 빈 셀 처리
			default:
				return "";
		}
	}

	@RequestMapping(value="/mng/sche/updateScheCrew.html")
	public String updateScheCrew(HttpServletRequest request, ModelMap model, SchedulerInfoBean bean) throws Exception{
		model.addAttribute(Const.RESULT, service.updateSchedulerCrew(request, bean));

		return "share/result";
	}

	@RequestMapping(value="/mng/sche/updateScheNewRevNum.html")
	public String updateScheNewRevNum(HttpServletRequest request, ModelMap model, SchedulerInfoBean bean) throws Exception{
		model.addAttribute(Const.RESULT, service.updateScheNewRevNum(request, bean));

		return "share/result";
	}

	@RequestMapping(value="/mng/sche/getScheduleVersionList.html")
	public String getScheduleVersionList(HttpServletRequest request, ModelMap model, SchedulerInfoBean bean) throws Exception {
		model.addAllAttributes(service.getSchedulerVersionList(bean));

		return "mng/sche/getSchedulerList";
	}

	@RequestMapping(value="/mng/sche/submitDepartureReportInfo.html")
	public String submitDepartureReportInfo(HttpServletRequest request, ModelMap model, ParamBean param) throws Exception {
		model.addAttribute(Const.RESULT, service.submitDepartureReportInfo(request, param));
		return "share/result";
	}

	@RequestMapping(value="/mng/sche/departureReportRegDailyInfo.html")
	public String departureReportRegDailyInfo(HttpServletRequest request, ModelMap model, ParamBean bean) throws Exception {
		model.addAllAttributes(service.departureReportRegDailyInfo(request, bean));

		return "mng/sche/departureReportRegDailyInfo";
	}

	@RequestMapping(value="/mng/sche/departureDailyReportCheck.html")
	public String departureDailyReportCheck(HttpServletRequest request, ModelMap model, ParamBean bean) throws Exception {
		model.addAllAttributes(service.departureReportRegDailyInfo(request, bean));
		return "mng/sche/departureDailyReportCheck";
	}

	@RequestMapping(value="/mng/sche/departureReportRegCompleteInfo.html")
	public String departureReportRegCompleteInfo(HttpServletRequest request, ModelMap model, ParamBean bean) throws Exception {
		model.addAllAttributes(service.departureReportRegCompleteInfo(request, bean));

		return "mng/sche/departureReportRegCompleteInfo";
	}

	@RequestMapping(value="/mng/sche/departureCompleteReportCheck.html")
	public String departureCompleteReportCheck(HttpServletRequest request, ModelMap model, ParamBean bean) throws Exception {
		model.addAllAttributes(service.departureReportRegCompleteInfo(request, bean));
		return "mng/sche/departureCompleteReportCheck";
	}
	
	@RequestMapping(value="/mng/sche/getScheduleCodeInfoListForNewSche.html")
	public String getScheduleCodeInfoListForNewSche(HttpServletRequest request, ModelMap model, ScheduleCodeDetailBean bean) throws Exception{
		model.addAttribute(Const.LIST, service.getScheduleCodeInfoListForNewSche(bean));
		
		return "mng/scheBasic/getScheduleCodeInfoListForNewSche";
	}
	
	@RequestMapping(value="/mng/sche/getScheduleCodeDetailListForNewSche.html")
	public String getScheduleCodeDetailListForNewSche(HttpServletRequest request, ModelMap model, ParamBean bean) throws Exception{
		model.addAttribute(Const.LIST, service.getScheduleCodeDetailListForNewSche(bean));
		
		return "mng/scheBasic/getScheduleCodeDetailListForNewSche";
	}
	
	// 선종별 코드 멀티 등록 팝업 TC 조회 - 250205.
	@RequestMapping(value="/mng/scheBasic/getScheCodeDetTcSearchListForMulti.html", method=RequestMethod.POST)
	public String getScheCodeDetTcSearchListForMulti(HttpServletRequest request, ModelMap model, ScheduleHierarchyBean bean) throws Exception {
		model.addAttribute(Const.LIST, service.getScheCodeDetTcSearchListForMulti(bean));
		
		return "mng/scheBasic/getScheCodeDetTcSearchListForMulti";
	}
}