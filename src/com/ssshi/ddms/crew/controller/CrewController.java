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
	
	//앵카링 발주
	@RequestMapping(value="/crew/anchOrderUpdate.html", method=RequestMethod.POST)
	public String anchOrderUpdate(HttpServletRequest request, ModelMap model, ParamBean bean) throws Exception {
		model.addAllAttributes(service.anchOrderUpdate(request, bean));
	   
	    return "share/resultCode";
	}
	
	//앵카링 양식 다운로드
		@RequestMapping(value="/crew/downAnchExcel.html")
		public void downAnchExcel(HttpServletRequest request, HttpServletResponse response) throws Exception {
			service.downAnchExcel(response);
		}
	
	//앵카링 식사 신청 파일 업로드
	@RequestMapping(value="/crew/anchorageMealDRM.html")
	public String anchorageMealDRM(HttpServletRequest request, ModelMap model, @RequestParam("file") MultipartFile file) throws Exception {
		
		// 암호화 해제
		String path = DRMUtil.getDecodingExcel(file);
		
		// 반환 값 오류 발생인 경우 오류 반환
		if(path.startsWith("ERROR")) {
			return "share/exception";
			
		}
		// 정상인 경우 엑셀 파일 기반으로 승선자 데이터 생성
		else {
			String rtnDataFormat = "crew/getAnchMealDRMList";
			
			XSSFWorkbook workbook = new XSSFWorkbook(path);
			
			Sheet sheet = workbook.getSheetAt(0);
			int rowNum = 0;

			try {
				List<AnchorageMealRequestBean> anchorageMealList = new ArrayList<AnchorageMealRequestBean>();
				for (Row row : sheet) {
					if (rowNum != 0) {
						AnchorageMealRequestBean anchBean = new AnchorageMealRequestBean();
						
						// 각 데이터 읽기
						String no = ExcelUtil.getCellValue(row.getCell(0)).toString();
						String kind = ExcelUtil.getCellValue(row.getCell(1)).toString();
						String domesticYn = ExcelUtil.getCellValue(row.getCell(2)).toString();
						String department = ExcelUtil.getCellValue(row.getCell(3)).toString();
						String mealDate = CommonUtil.excelDateStringFormatDate(ExcelUtil.getCellValue(row.getCell(4)).toString());
						
						String foodStyle =  ExcelUtil.getCellValue(row.getCell(5)).toString();
						int breakfastP = Integer.parseInt(ExcelUtil.getCellValue(row.getCell(6)).toString());
						int lunchP = Integer.parseInt(ExcelUtil.getCellValue(row.getCell(7)).toString());
						int dinnerP = Integer.parseInt(ExcelUtil.getCellValue(row.getCell(8)).toString());
						int lateNightP = Integer.parseInt(ExcelUtil.getCellValue(row.getCell(9)).toString());
						
						String orderStatus = ExcelUtil.getCellValue(row.getCell(10)).toString();
						String comment = ExcelUtil.getCellValue(row.getCell(11)).toString();
						
						// Bean에 데이터 입력
						anchBean.setCnt(Integer.parseInt(no));
						anchBean.setKind(kind);
						anchBean.setDomesticYn(domesticYn);
						anchBean.setDepartment(department);
						anchBean.setMealDate(mealDate);
						
						anchBean.setFoodStyle(foodStyle);
//						anchBean.setBreakfastP(breakfastP);
//						anchBean.setLunchP(lunchP);
//						anchBean.setDinnerP(dinnerP);
//						anchBean.setLateNightP(lateNightP);
						
						anchBean.setOrderStatus(orderStatus);
						anchBean.setComment(comment);
						
						// 수량
						List<AnchorageMealQtyBean> mealQtyList = new ArrayList<AnchorageMealQtyBean>();
						AnchorageMealQtyBean breakfastBean = new AnchorageMealQtyBean();
						AnchorageMealQtyBean lunchBean = new AnchorageMealQtyBean();
						AnchorageMealQtyBean dinnerBean = new AnchorageMealQtyBean();
						AnchorageMealQtyBean lateNightBean = new AnchorageMealQtyBean();
						
						if(breakfastP > 0) {
							breakfastBean.setPlanMealDate(mealDate);
							breakfastBean.setPlanMealGubun(foodStyle);
							breakfastBean.setPlanMealTime("조식");
							breakfastBean.setPlanMealQty(breakfastP);
						}
						if(lunchP > 0) {
							lunchBean.setPlanMealDate(mealDate);
							lunchBean.setPlanMealGubun(foodStyle);
							lunchBean.setPlanMealTime("중식");
							lunchBean.setPlanMealQty(lunchP);
						}
						if(dinnerP > 0) {
							dinnerBean.setPlanMealDate(mealDate);
							dinnerBean.setPlanMealGubun(foodStyle);
							dinnerBean.setPlanMealTime("석식");
							dinnerBean.setPlanMealQty(dinnerP);
						}
						if(lateNightP > 0) {
							lateNightBean.setPlanMealDate(mealDate);
							lateNightBean.setPlanMealGubun(foodStyle);
							lateNightBean.setPlanMealTime("야식");
							lateNightBean.setPlanMealQty(lateNightP);
						}
						
						mealQtyList.add(breakfastBean);
						mealQtyList.add(lunchBean);
						mealQtyList.add(dinnerBean);
						mealQtyList.add(lateNightBean);
						
						anchBean.setPlanList(mealQtyList);
						anchorageMealList.add(anchBean);
					}
					rowNum++;
				}
	
				// 워크북 닫기
				workbook.close();
	
				model.addAttribute(Const.LIST, anchorageMealList);
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