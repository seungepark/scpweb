package com.ssshi.ddms.sche.controller;

import java.util.ArrayList;
import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;

import com.ssshi.ddms.constant.Const;
import com.ssshi.ddms.constant.DBConst;
import com.ssshi.ddms.dto.ParamBean;
import com.ssshi.ddms.dto.ScheCrewBean;
import com.ssshi.ddms.dto.ScheCrewInOutBean;
import com.ssshi.ddms.dto.ScheCrewListBean;
import com.ssshi.ddms.dto.ScheMailBean;
import com.ssshi.ddms.dto.ScheMailLogBean;
import com.ssshi.ddms.dto.ScheTcNoteBean;
import com.ssshi.ddms.dto.ScheTrialInfoBean;
import com.ssshi.ddms.dto.ScheduleCodeDetailBean;
import com.ssshi.ddms.dto.SchedulerDetailInfoBean;
import com.ssshi.ddms.dto.SchedulerInfoBean;
import com.ssshi.ddms.sche.service.ScheServiceI;
import com.ssshi.ddms.util.CommonUtil;
import com.ssshi.ddms.util.DRMUtil;
import com.ssshi.ddms.util.ExcelUtil;

/********************************************************************************
 * 프로그램 개요 : Sche
 * 
 * 최초 작성자 : KHJ
 * 최초 작성일 : 2024-02-28
 * 
 * 최종 수정자 : KHJ
 * 최종 수정일 : 2025-05-12
 * 
 * 메모 : 없음
 * 
 * Copyright 2024 by SiriusB. Confidential and proprietary information
 * This document contains information, which is the property of SiriusB, 
 * and is furnished for the sole purpose of the operation and the maintenance.  
 * Copyright © 2024 SiriusB.  All rights reserved.
 *
 ********************************************************************************/

@Controller
public class ScheController {

	@Autowired
	private ScheServiceI service;
	
	// ManagerController.getSchedulerDepartureList
	@RequestMapping(value="/sche/getScheList.html")
	public String getScheList(HttpServletRequest request, ModelMap model, SchedulerInfoBean bean) throws Exception {
		model.addAllAttributes(service.getScheList(bean));
		
		return "sche/getScheList";
	}
	
	@RequestMapping(value="/sche/scheChart.html")
	public String scheChart(HttpServletRequest request, ModelMap model, ParamBean bean) throws Exception {
		model.addAllAttributes(service.scheChart(request, bean));
		String status = (String) model.get("status");
		
		if(DBConst.SCHE_TRIAL_INFO_TRIALSTATUS_ONGOING.equals(status) || DBConst.SCHE_TRIAL_INFO_TRIALSTATUS_ARRIVAL.equals(status)) {
			return "forward:/sche/resultChart.html";
		}else {
			return "forward:/sche/planChart.html";
		}
	}
	
	@RequestMapping(value="/sche/planChart.html")
	public String planChart(HttpServletRequest request, ModelMap model, ParamBean bean) throws Exception {
		model.addAllAttributes(service.planChart(request, bean));
		
		return "sche/planChart";
	}
	
	@RequestMapping(value="/sche/planChartSave.html", method=RequestMethod.POST)
	public String planChartSave(HttpServletRequest request, ModelMap model, SchedulerInfoBean bean) throws Exception{
		model.addAllAttributes(service.planChartSave(request, bean));
		
		return "share/resultCode";
	}
	
	@RequestMapping(value="/sche/planCrew.html")
	public String planCrew(HttpServletRequest request, ModelMap model, ParamBean bean) throws Exception {
		model.addAllAttributes(service.planCrew(request, bean));
		
		return "sche/planCrew";
	}
	

	
	@RequestMapping(value="/sche/downCrewExcel.html")
	public void downCrewExcel(HttpServletRequest request, HttpServletResponse response, ParamBean bean) throws Exception {
		service.downCrewExcel(response, bean);
	}
	
	@RequestMapping(value="/sche/planCrewSave.html", method=RequestMethod.POST)
	public String planCrewSave(HttpServletRequest request, ModelMap model, ScheCrewListBean bean) throws Exception {
		model.addAllAttributes(service.planCrewSave(request, bean));
		
		return "share/resultCode";
	}
	
	@RequestMapping(value="/sche/planCrewDRM.html")
	public String planCrewDRM(HttpServletRequest request, ModelMap model, @RequestParam("file") MultipartFile file) throws Exception {
		
		// 암호화 해제
		String path = DRMUtil.getDecodingExcel(file);
		
		// 반환 값 오류 발생인 경우 오류 반환
		if(path.startsWith("ERROR")) {
			return "share/exception";
			
		}
		// 정상인 경우 엑셀 파일 기반으로 승선자 데이터 생성
		else {
			String rtnDataFormat = "sche/getPlanCrewDRMList";
			
			XSSFWorkbook workbook = new XSSFWorkbook(path);
			
			Sheet sheet = workbook.getSheetAt(0);
			int rowNum = 0;

			try {
				List<ScheCrewBean> schedulerCrewInfoList = new ArrayList<ScheCrewBean>();
				for (Row row : sheet) {
					if (rowNum != 0) {
						ScheCrewBean crewBean = new ScheCrewBean();
						
						// 각 데이터 읽기
						String no = ExcelUtil.getCellValue(row.getCell(0)).toString();
						String kind = ExcelUtil.getCellValue(row.getCell(1)).toString();
						String company = ExcelUtil.getCellValue(row.getCell(2)).toString();
						String department = ExcelUtil.getCellValue(row.getCell(3)).toString();
						String name = ExcelUtil.getCellValue(row.getCell(4)).toString();
						
						String rank =  ExcelUtil.getCellValue(row.getCell(5)).toString();
						String idno = ExcelUtil.getCellValue(row.getCell(6)).toString();
						String worktype1 = ExcelUtil.getCellValue(row.getCell(7)).toString();
						String worktype2 = ExcelUtil.getCellValue(row.getCell(8)).toString();
						String mainsub = ExcelUtil.getCellValue(row.getCell(9)).toString();
						
						String foodstyle = ExcelUtil.getCellValue(row.getCell(10)).toString();
						String personno = ExcelUtil.getCellValue(row.getCell(11)).toString();
						String phone = ExcelUtil.getCellValue(row.getCell(12)).toString();
						String inDate = CommonUtil.excelDateStringFormatDate(ExcelUtil.getCellValue(row.getCell(13)).toString());
						String outDate = CommonUtil.excelDateStringFormatDate(ExcelUtil.getCellValue(row.getCell(14)).toString());
						
//						System.out.println("@@@ ScheController.planCrewDRM inDate: " + inDate);
//						System.out.println("@@@ ScheController.planCrewDRM outDate: " + outDate);
	
						// Bean에 데이터 입력
						crewBean.setCnt(Integer.parseInt(no));
						crewBean.setKind(kind);
						crewBean.setCompany(company);
						crewBean.setDepartment(department);
						crewBean.setName(name);
						
						crewBean.setRank(rank);
						crewBean.setIdNo(idno);
						crewBean.setWorkType1(worktype1);
						crewBean.setWorkType2(worktype2);
						crewBean.setMainSub(mainsub);
						
						crewBean.setFoodStyle(foodstyle);
						crewBean.setPersonNo(personno);
						crewBean.setPhone(phone);
						
						// 승/하선일 입력
						List<ScheCrewInOutBean> inoutList = new ArrayList<ScheCrewInOutBean>();
						ScheCrewInOutBean inBean = new ScheCrewInOutBean();
						inBean.setSchedulerInOut("B");
						inBean.setInOutDate(inDate);
						inoutList.add(inBean);
						
						ScheCrewInOutBean outBean = new ScheCrewInOutBean();
						outBean.setSchedulerInOut("N");
						outBean.setInOutDate(outDate);
						inoutList.add(outBean);
						
						crewBean.setInOutList(inoutList);
						
						schedulerCrewInfoList.add(crewBean);
					}
					rowNum++;
				}
	
				// 워크북 닫기
				workbook.close();
	
				model.addAttribute(Const.LIST, schedulerCrewInfoList);
			} catch(Exception e) {
				rtnDataFormat = "share/exception";
				
//				System.out.println("@@@ ERROR: Excel Process Fail=" + e.getMessage());
				e.printStackTrace();
			}
			
			return rtnDataFormat;
		}
	}
	
	@RequestMapping(value="/sche/planInfo.html")
	public String planInfo(HttpServletRequest request, ModelMap model, ParamBean bean) throws Exception {
		model.addAllAttributes(service.planInfo(request, bean));
		
		return "sche/planInfo";
	}
	
	@RequestMapping(value="/sche/searchTrial.html", method=RequestMethod.POST)
	public String searchTrial(HttpServletRequest request, ModelMap model, ParamBean bean) throws Exception {
		model.addAttribute(Const.LIST, service.searchTrial(bean));
		
		return "sche/searchTrial";
	}
	
	@RequestMapping(value="/sche/planInfoSave.html", method=RequestMethod.POST)
	public String planInfoSave(HttpServletRequest request, ModelMap model, ScheTrialInfoBean bean) throws Exception {
		model.addAllAttributes(service.planInfoSave(request, bean));
		
		return "share/resultCode";
	}
	
	@RequestMapping(value="/sche/planDepartureReport.html")
	public String planDepartureReport(HttpServletRequest request, ModelMap model, ParamBean bean) throws Exception {
		model.addAllAttributes(service.planDepartureReport(request, bean));
		
		return "sche/planDepartureReport";
	}
	
	@RequestMapping(value="/sche/planDepartureReportSubmit.html", method=RequestMethod.POST)
	public String planDepartureReportSubmit(HttpServletRequest request, ModelMap model, ScheMailLogBean bean) throws Exception {
		model.addAllAttributes(service.planDepartureReportSubmit(request, bean));
		
		return "share/resultCode";
	}
	
	@RequestMapping(value="/sche/resultChart.html")
	public String resultChart(HttpServletRequest request, ModelMap model, ParamBean bean) throws Exception {
		model.addAllAttributes(service.resultChart(request, bean));
		
		return "sche/resultChart";
	}
	
	@RequestMapping(value="/sche/resultChartSave.html", method=RequestMethod.POST)
	public String resultChartSave(HttpServletRequest request, ModelMap model, SchedulerInfoBean bean) throws Exception{
		model.addAllAttributes(service.resultChartSave(request, bean));
		
		return "share/resultCode";
	}
	
	// ManagerController.getDetailSchedulerRowData
	@RequestMapping(value="/sche/getScheRowList.html")
	public String getScheRowList(HttpServletRequest request, ModelMap model, SchedulerDetailInfoBean bean) throws Exception{
		model.addAllAttributes(service.getScheRowList(bean));
		
		return "sche/getScheRowList";
	}
	
	@RequestMapping(value="/sche/getTcNoteList.html", method=RequestMethod.POST)
	public String getTcNoteList(HttpServletRequest request, ModelMap model, ParamBean bean) throws Exception {
		model.addAttribute(Const.LIST, service.getTcNoteList(request, bean));
		
		return "sche/getTcNoteList";
	}
	
	@RequestMapping(value="/sche/saveNote.html", method=RequestMethod.POST)
	public String saveNote(HttpServletRequest request, ModelMap model, ScheTcNoteBean bean) throws Exception {
		model.addAllAttributes(service.saveNote(request, bean));
		
		return "share/result";
	}
	
	@RequestMapping(value="/sche/resultCrew.html")
	public String resultCrew(HttpServletRequest request, ModelMap model, ParamBean bean) throws Exception {
		model.addAllAttributes(service.resultCrew(request, bean));
		
		return "sche/resultCrew";
	}
	
	@RequestMapping(value="/sche/resultCrewSave.html", method=RequestMethod.POST)
	public String resultCrewSave(HttpServletRequest request, ModelMap model, ScheCrewListBean bean) throws Exception {
		model.addAllAttributes(service.resultCrewSave(request, bean));
		
		return "share/result";
	}
	
	@RequestMapping(value="/sche/resultInfo.html")
	public String resultInfo(HttpServletRequest request, ModelMap model, ParamBean bean) throws Exception {
		model.addAllAttributes(service.resultInfo(request, bean));
		
		return "sche/resultInfo";
	}
	
	@RequestMapping(value="/sche/resultInfoSave.html", method=RequestMethod.POST)
	public String resultInfoSave(HttpServletRequest request, ModelMap model, ScheTrialInfoBean bean) throws Exception {
		model.addAllAttributes(service.resultInfoSave(request, bean));
		
		return "share/result";
	}
	
	@RequestMapping(value="/sche/resultDailyReport.html")
	public String resultDailyReport(HttpServletRequest request, ModelMap model, ParamBean bean) throws Exception {
		model.addAllAttributes(service.resultDailyReport(request, bean));
		
		return "sche/resultDailyReport";
	}
	
	@RequestMapping(value="/sche/resultDailyReportSubmit.html", method=RequestMethod.POST)
	public String resultDailyReportSubmit(HttpServletRequest request, ModelMap model, ScheMailLogBean bean) throws Exception {
		model.addAllAttributes(service.resultDailyReportSubmit(request, bean));
		
		return "share/resultCode";
	}
	
	@RequestMapping(value="/sche/resultCompReport.html")
	public String resultCompReport(HttpServletRequest request, ModelMap model, ParamBean bean) throws Exception {
		model.addAllAttributes(service.resultCompReport(request, bean));
		
		return "sche/resultCompReport";
	}
	
	@RequestMapping(value="/sche/resultCompReportSubmit.html", method=RequestMethod.POST)
	public String resultCompReportSubmit(HttpServletRequest request, ModelMap model, ScheMailLogBean bean) throws Exception {
		model.addAllAttributes(service.resultCompReportSubmit(request, bean));
		
		return "share/resultCode";
	}
	
	@RequestMapping(value="/sche/searchEmail.html", method=RequestMethod.POST)
	public String searchEmail(HttpServletRequest request, ModelMap model, ParamBean bean) throws Exception {
		model.addAttribute(Const.LIST, service.searchEmail(bean));
		
		return "sche/searchEmail";
	}
	
	@RequestMapping(value="/sche/changeStatus.html", method=RequestMethod.POST)
	public String changeStatus(HttpServletRequest request, ModelMap model, ParamBean bean) throws Exception {
		model.addAllAttributes(service.changeStatus(request, bean));
		
		return "share/resultCode";
	}
	
	@RequestMapping(value="/sche/getScheTcNumSearchList.html")
	public String getScheduleTcNumSearchList(HttpServletRequest request, ModelMap model, ScheduleCodeDetailBean bean) throws Exception{
		model.addAllAttributes(service.getScheduleTcNumSearchList(request, bean));
		
		return "sche/getScheduleCodeDetList";
	}
	
	@RequestMapping(value="/sche/planReportSchedule.html")
	public String planReportSchedule(HttpServletRequest request, ModelMap model) throws Exception {
		model.addAllAttributes(service.reportSchedule(request));
		
		return "sche/planReportSchedule";
	}
	
	@RequestMapping(value="/sche/resultReportSchedule.html")
	public String resultReportSchedule(HttpServletRequest request, ModelMap model) throws Exception {
		model.addAllAttributes(service.reportSchedule(request));
		
		return "sche/resultReportSchedule";
	}
	
	@RequestMapping(value="/sche/getVesselReqInfoDetListByHullNum.html")
	public String getVesselReqInfoDetListByHullNum(HttpServletRequest request, ModelMap model, ParamBean bean) throws Exception {
		model.addAllAttributes(service.getVesselReqInfoDetListByHullNum(bean));

		return "sche/getVesselReqInfoDetList";
	}
	
	@RequestMapping(value="/sche/getShipCondList.html")
	public String getShipCondList(HttpServletRequest request, ModelMap model, ParamBean bean) throws Exception {
		model.addAttribute(Const.LIST, service.getShipCondList(bean));

		return "sche/getShipCondList";
	}
	
	@RequestMapping(value="/sche/mailing.html")
	public String mailing(HttpServletRequest request, ModelMap model) throws Exception {
		model.addAttribute(Const.LIST, service.mailing());
		
		return "sche/mailing";
	}
	
	@RequestMapping(value="/sche/mailingSave.html", method=RequestMethod.POST)
	public String mailingSave(HttpServletRequest request, ModelMap model, ScheMailBean bean) throws Exception {
		model.addAllAttributes(service.mailingSave(request, bean));
		
		return "share/result";
	}
}