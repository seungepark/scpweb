package com.ssshi.ddms.crew.controller;

import java.io.Console;
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
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;

import com.ssshi.ddms.constant.Const;
import com.ssshi.ddms.constant.DBConst;
import com.ssshi.ddms.crew.service.CrewServiceI;
import com.ssshi.ddms.dto.ParamBean;
import com.ssshi.ddms.dto.RegistrationCrewBean;
import com.ssshi.ddms.dto.RegistrationCrewListBean;
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
import com.ssshi.ddms.util.CommonUtil;
import com.ssshi.ddms.util.DRMUtil;
import com.ssshi.ddms.util.ExcelUtil;

/********************************************************************************
 * 프로그램 개요 : Crew
 * 
 * 최초 작성자 : GMJ
 * 최초 작성일 : 2025-09-01
 * 
 * 최종 수정자 : GMJ
 * 최종 수정일 : 2025-09-01
 * 
 * 메모 : 없음
 * 
 * Copyright 2025 by SiriusB. Confidential and proprietary information
 * This document contains information, which is the property of SiriusB, 
 * and is furnished for the sole purpose of the operation and the maintenance.  
 * Copyright © 2025 SiriusB.  All rights reserved.
 *
 ********************************************************************************/

@Controller
public class CrewController {

	@Autowired
	private CrewServiceI service;
	
	//Main(시운전 승선자 신청)
	@RequestMapping(value="/crew/registrationCrew.html")
	public String registrationCrew(HttpServletRequest request, ModelMap model, RegistrationCrewBean bean) throws Exception {
		model.addAllAttributes(service.registrationCrew(request, bean));
		
		return "crew/registrationCrew";
	}
	
	//승선자 조회
	@RequestMapping(value="/crew/getRegistrationCrewList.html", method=RequestMethod.GET)
	public String getRegistrationCrewList(HttpServletRequest request, ModelMap model, RegistrationCrewBean bean) throws Exception {		
		model.addAllAttributes(service.getRegistrationCrewList(request, bean));

		return "crew/getRegistrationCrewList";
	}
	
	//승선자 저장
	@RequestMapping(value="/crew/registrationCrewSave.html", method=RequestMethod.POST)
	public String registrationCrewSave(HttpServletRequest request, ModelMap model, RegistrationCrewListBean bean) throws Exception {
		model.addAllAttributes(service.registrationCrewSave(request, bean));
		
		return "share/resultCode";
	}
	
	//Main(앵카링 식사 신청)
	@RequestMapping(value="/crew/anchorageMealRequest.html")
	public String anchorageMealRequest(HttpServletRequest request, ModelMap model, RegistrationCrewBean bean) throws Exception {
		model.addAllAttributes(service.registrationCrew(request, bean));
		
		return "crew/anchorageMealRequest";
	}
	
	//Main(실적 확인)
	@RequestMapping(value="/crew/resultMeal.html")
	public String resultMeal(HttpServletRequest request, ModelMap model, RegistrationCrewBean bean) throws Exception {
		model.addAllAttributes(service.registrationCrew(request, bean));
		
		return "crew/resultMeal";
	}
	
	
	
	
	
	/*
	 * @RequestMapping(value="/crew/getRegistrationCrewList.html",
	 * method=RequestMethod.GET)
	 * 
	 * @ResponseBody public Map<String, Object>
	 * getRegistrationCrewList(RegistrationCrewBean bean) throws Exception {
	 * Map<String, Object> result = new HashMap<>(); List<RegistrationCrewBean> list
	 * = service.getRegistrationCrewList(bean); result.put("list", list);
	 * result.put("listCnt", list.size()); return result; }
	 */
	
	
	

	
	@RequestMapping(value="/crew/scheChart.html")
	public String scheChart(HttpServletRequest request, ModelMap model, ParamBean bean) throws Exception {
		model.addAllAttributes(service.scheChart(request, bean));
		String status = (String) model.get("status");
		
		if(DBConst.SCHE_TRIAL_INFO_TRIALSTATUS_ONGOING.equals(status) || DBConst.SCHE_TRIAL_INFO_TRIALSTATUS_ARRIVAL.equals(status)) {
			return "forward:/crew/resultChart.html";
		}else {
			return "forward:/crew/planChart.html";
		}
	}
	
	@RequestMapping(value="/crew/planChart.html")
	public String planChart(HttpServletRequest request, ModelMap model, ParamBean bean) throws Exception {
		model.addAllAttributes(service.planChart(request, bean));
		
		return "crew/planChart";
	}
	
	@RequestMapping(value="/crew/planChartSave.html", method=RequestMethod.POST)
	public String planChartSave(HttpServletRequest request, ModelMap model, SchedulerInfoBean bean) throws Exception{
		model.addAllAttributes(service.planChartSave(request, bean));
		
		return "share/resultCode";
	}
	
//	@RequestMapping(value="/crew/planCrew.html")
//	public String planCrew(HttpServletRequest request, ModelMap model, ParamBean bean) throws Exception {
//		model.addAllAttributes(service.planCrew(request, bean));
//		
//		return "crew/planCrew";
//	}
//	

	
	@RequestMapping(value="/crew/downCrewExcel.html")
	public void downCrewExcel(HttpServletRequest request, HttpServletResponse response, ParamBean bean) throws Exception {
		service.downCrewExcel(response, bean);
	}
	
	@RequestMapping(value="/crew/planCrewSave.html", method=RequestMethod.POST)
	public String planCrewSave(HttpServletRequest request, ModelMap model, ScheCrewListBean bean) throws Exception {
		model.addAllAttributes(service.planCrewSave(request, bean));
		
		return "share/resultCode";
	}
	
	@RequestMapping(value="/crew/planCrewDRM.html")
	public String planCrewDRM(HttpServletRequest request, ModelMap model, @RequestParam("file") MultipartFile file) throws Exception {
		
		// 암호화 해제
		String path = DRMUtil.getDecodingExcel(file);
		
		// 반환 값 오류 발생인 경우 오류 반환
		if(path.startsWith("ERROR")) {
			return "share/exception";
			
		}
		// 정상인 경우 엑셀 파일 기반으로 승선자 데이터 생성
		else {
			String rtnDataFormat = "crew/getPlanCrewDRMList";
			
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
	
	@RequestMapping(value="/crew/planInfo.html")
	public String planInfo(HttpServletRequest request, ModelMap model, ParamBean bean) throws Exception {
		model.addAllAttributes(service.planInfo(request, bean));
		
		return "crew/planInfo";
	}
	
	@RequestMapping(value="/crew/searchTrial.html", method=RequestMethod.POST)
	public String searchTrial(HttpServletRequest request, ModelMap model, ParamBean bean) throws Exception {
		model.addAttribute(Const.LIST, service.searchTrial(bean));
		
		return "crew/searchTrial";
	}
	
	@RequestMapping(value="/crew/planInfoSave.html", method=RequestMethod.POST)
	public String planInfoSave(HttpServletRequest request, ModelMap model, ScheTrialInfoBean bean) throws Exception {
		model.addAllAttributes(service.planInfoSave(request, bean));
		
		return "share/resultCode";
	}
	
	@RequestMapping(value="/crew/planDepartureReport.html")
	public String planDepartureReport(HttpServletRequest request, ModelMap model, ParamBean bean) throws Exception {
		model.addAllAttributes(service.planDepartureReport(request, bean));
		
		return "crew/planDepartureReport";
	}
	
	@RequestMapping(value="/crew/planDepartureReportSubmit.html", method=RequestMethod.POST)
	public String planDepartureReportSubmit(HttpServletRequest request, ModelMap model, ScheMailLogBean bean) throws Exception {
		model.addAllAttributes(service.planDepartureReportSubmit(request, bean));
		
		return "share/resultCode";
	}
	
	@RequestMapping(value="/crew/resultChart.html")
	public String resultChart(HttpServletRequest request, ModelMap model, ParamBean bean) throws Exception {
		model.addAllAttributes(service.resultChart(request, bean));
		
		return "crew/resultChart";
	}
	
	@RequestMapping(value="/crew/resultChartSave.html", method=RequestMethod.POST)
	public String resultChartSave(HttpServletRequest request, ModelMap model, SchedulerInfoBean bean) throws Exception{
		model.addAllAttributes(service.resultChartSave(request, bean));
		
		return "share/resultCode";
	}
	
	// ManagerController.getDetailSchedulerRowData
	@RequestMapping(value="/crew/getScheRowList.html")
	public String getScheRowList(HttpServletRequest request, ModelMap model, SchedulerDetailInfoBean bean) throws Exception{
		model.addAllAttributes(service.getScheRowList(bean));
		
		return "crew/getScheRowList";
	}
	
	@RequestMapping(value="/crew/getTcNoteList.html", method=RequestMethod.POST)
	public String getTcNoteList(HttpServletRequest request, ModelMap model, ParamBean bean) throws Exception {
		model.addAttribute(Const.LIST, service.getTcNoteList(request, bean));
		
		return "crew/getTcNoteList";
	}
	
	@RequestMapping(value="/crew/saveNote.html", method=RequestMethod.POST)
	public String saveNote(HttpServletRequest request, ModelMap model, ScheTcNoteBean bean) throws Exception {
		model.addAllAttributes(service.saveNote(request, bean));
		
		return "share/result";
	}
	
	@RequestMapping(value="/crew/resultCrew.html")
	public String resultCrew(HttpServletRequest request, ModelMap model, ParamBean bean) throws Exception {
		model.addAllAttributes(service.resultCrew(request, bean));
		
		return "crew/resultCrew";
	}
	
	@RequestMapping(value="/crew/resultCrewSave.html", method=RequestMethod.POST)
	public String resultCrewSave(HttpServletRequest request, ModelMap model, ScheCrewListBean bean) throws Exception {
		model.addAllAttributes(service.resultCrewSave(request, bean));
		
		return "share/result";
	}
	
	@RequestMapping(value="/crew/resultInfo.html")
	public String resultInfo(HttpServletRequest request, ModelMap model, ParamBean bean) throws Exception {
		model.addAllAttributes(service.resultInfo(request, bean));
		
		return "crew/resultInfo";
	}
	
	@RequestMapping(value="/crew/resultInfoSave.html", method=RequestMethod.POST)
	public String resultInfoSave(HttpServletRequest request, ModelMap model, ScheTrialInfoBean bean) throws Exception {
		model.addAllAttributes(service.resultInfoSave(request, bean));
		
		return "share/result";
	}
	
	@RequestMapping(value="/crew/resultDailyReport.html")
	public String resultDailyReport(HttpServletRequest request, ModelMap model, ParamBean bean) throws Exception {
		model.addAllAttributes(service.resultDailyReport(request, bean));
		
		return "crew/resultDailyReport";
	}
	
	@RequestMapping(value="/crew/resultDailyReportSubmit.html", method=RequestMethod.POST)
	public String resultDailyReportSubmit(HttpServletRequest request, ModelMap model, ScheMailLogBean bean) throws Exception {
		model.addAllAttributes(service.resultDailyReportSubmit(request, bean));
		
		return "share/resultCode";
	}
	
	@RequestMapping(value="/crew/resultCompReport.html")
	public String resultCompReport(HttpServletRequest request, ModelMap model, ParamBean bean) throws Exception {
		model.addAllAttributes(service.resultCompReport(request, bean));
		
		return "crew/resultCompReport";
	}
	
	@RequestMapping(value="/crew/resultCompReportSubmit.html", method=RequestMethod.POST)
	public String resultCompReportSubmit(HttpServletRequest request, ModelMap model, ScheMailLogBean bean) throws Exception {
		model.addAllAttributes(service.resultCompReportSubmit(request, bean));
		
		return "share/resultCode";
	}
	
	@RequestMapping(value="/crew/searchEmail.html", method=RequestMethod.POST)
	public String searchEmail(HttpServletRequest request, ModelMap model, ParamBean bean) throws Exception {
		model.addAttribute(Const.LIST, service.searchEmail(bean));
		
		return "crew/searchEmail";
	}
	
	@RequestMapping(value="/crew/changeStatus.html", method=RequestMethod.POST)
	public String changeStatus(HttpServletRequest request, ModelMap model, ParamBean bean) throws Exception {
		model.addAllAttributes(service.changeStatus(request, bean));
		
		return "share/resultCode";
	}
	
	@RequestMapping(value="/crew/getScheTcNumSearchList.html")
	public String getScheduleTcNumSearchList(HttpServletRequest request, ModelMap model, ScheduleCodeDetailBean bean) throws Exception{
		model.addAllAttributes(service.getScheduleTcNumSearchList(request, bean));
		
		return "crew/getScheduleCodeDetList";
	}
	
	@RequestMapping(value="/crew/planReportSchedule.html")
	public String planReportSchedule(HttpServletRequest request, ModelMap model) throws Exception {
		model.addAllAttributes(service.reportSchedule(request));
		
		return "crew/planReportSchedule";
	}
	
	@RequestMapping(value="/crew/resultReportSchedule.html")
	public String resultReportSchedule(HttpServletRequest request, ModelMap model) throws Exception {
		model.addAllAttributes(service.reportSchedule(request));
		
		return "crew/resultReportSchedule";
	}
	
	@RequestMapping(value="/crew/getVesselReqInfoDetListByHullNum.html")
	public String getVesselReqInfoDetListByHullNum(HttpServletRequest request, ModelMap model, ParamBean bean) throws Exception {
		model.addAllAttributes(service.getVesselReqInfoDetListByHullNum(bean));

		return "crew/getVesselReqInfoDetList";
	}
	
	@RequestMapping(value="/crew/getShipCondList.html")
	public String getShipCondList(HttpServletRequest request, ModelMap model, ParamBean bean) throws Exception {
		model.addAttribute(Const.LIST, service.getShipCondList(bean));

		return "crew/getShipCondList";
	}
	
	@RequestMapping(value="/crew/mailing.html")
	public String mailing(HttpServletRequest request, ModelMap model) throws Exception {
		model.addAttribute(Const.LIST, service.mailing());
		
		return "crew/mailing";
	}
	
	@RequestMapping(value="/crew/mailingSave.html", method=RequestMethod.POST)
	public String mailingSave(HttpServletRequest request, ModelMap model, ScheMailBean bean) throws Exception {
		model.addAllAttributes(service.mailingSave(request, bean));
		
		return "share/result";
	}
}