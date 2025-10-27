package com.ssshi.ddms.crew.controller;

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
import com.ssshi.ddms.crew.service.CrewServiceI;
import com.ssshi.ddms.dto.ParamBean;
import com.ssshi.ddms.dto.RegistrationCrewBean;
import com.ssshi.ddms.dto.RegistrationCrewListBean;
import com.ssshi.ddms.dto.ScheCrewBean;
import com.ssshi.ddms.dto.ScheCrewInOutBean;
import com.ssshi.ddms.util.CommonUtil;
import com.ssshi.ddms.util.DRMUtil;
import com.ssshi.ddms.util.ExcelUtil;
import com.ssshi.ddms.dto.AnchorageMealRequestBean;
import com.ssshi.ddms.dto.AnchorageMealQtyBean;
import com.ssshi.ddms.dto.AnchorageMealListBean;

/********************************************************************************
 * 프로그램 개요 : Crew
 * 
 * 최초 작성자 : 
 * 최초 작성일 : 
 * 
 * 최종 수정자 : 
 * 최종 수정일 :
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
	
	//승선자 양식 다운로드
	@RequestMapping(value="/crew/downCrewExcel.html")
	public void downCrewExcel(HttpServletRequest request, HttpServletResponse response) throws Exception {
		service.downCrewExcel(response);
	}
	
	//승선자 삭제
	@RequestMapping(value="/crew/registrationCrewRemove.html", method=RequestMethod.POST)
	public String registrationCrewRemove(HttpServletRequest request, ModelMap model, ParamBean bean) throws Exception {
		model.addAllAttributes(service.registrationCrewRemove(request, bean));
	   
	    return "share/resultCode";
	}
	
	//승선자 발주
	@RequestMapping(value="/crew/crewOrderUpdate.html", method=RequestMethod.POST)
	public String crewOrderUpdate(HttpServletRequest request, ModelMap model, ParamBean bean) throws Exception {
		model.addAllAttributes(service.crewOrderUpdate(request, bean));
	   
	    return "share/resultCode";
	}
	
	
	//Main(앵카링 식사 신청)
	@RequestMapping(value="/crew/anchorageMealRequest.html")
	public String anchorageMealRequest(HttpServletRequest request, ModelMap model, AnchorageMealRequestBean bean) throws Exception {
		model.addAllAttributes(service.anchorageMealRequest(request, bean));
		
		return "crew/anchorageMealRequest";
	}
	
	@RequestMapping(value="/crew/getAnchorageMealList.html", method=RequestMethod.GET)
	public String getAnchorageMealList(HttpServletRequest request, ModelMap model, AnchorageMealRequestBean bean) throws Exception {		
		model.addAllAttributes(service.getAnchorageMealList(request, bean));

		return "crew/anchorageMealRequestList";
	}
	
	@RequestMapping(value="/crew/anchorageMealSave.html", method=RequestMethod.POST)
	public String anchorageMealSave(HttpServletRequest request, ModelMap model, AnchorageMealListBean bean) throws Exception {
		model.addAllAttributes(service.anchorageMealSave(request, bean));
		
		return "share/resultCode";
	}
	
	//앵카링 식사 신청 삭제
	@RequestMapping(value="/crew/anchorageMealRemove.html", method=RequestMethod.POST)
	public String anchorageMealRemove(HttpServletRequest request, ModelMap model, ParamBean bean) throws Exception {
		model.addAllAttributes(service.anchorageMealRemove(request, bean));
	   
	    return "share/resultCode";
	}
	
	//승선자 발주
	@RequestMapping(value="/crew/anchOrderUpdate.html", method=RequestMethod.POST)
	public String anchOrderUpdate(HttpServletRequest request, ModelMap model, ParamBean bean) throws Exception {
		model.addAllAttributes(service.anchOrderUpdate(request, bean));
	   
	    return "share/resultCode";
	}
	
	//앵카링 식사 신청 파일 업로드
	@RequestMapping(value="/sche/anchorageMealDRM.html")
	public String anchorageMealDRM(HttpServletRequest request, ModelMap model, @RequestParam("file") MultipartFile file) throws Exception {
		
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
	
	//Main(실적 확인)
	@RequestMapping(value="/crew/resultMeal.html")
	public String resultMeal(HttpServletRequest request, ModelMap model, RegistrationCrewBean bean) throws Exception {
		model.addAllAttributes(service.registrationCrew(request, bean));
		
		return "crew/resultMeal";
	}
}