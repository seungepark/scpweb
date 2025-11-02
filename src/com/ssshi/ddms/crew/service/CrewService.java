package com.ssshi.ddms.crew.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.poi.hssf.util.HSSFColor;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.CellStyle;
import org.apache.poi.ss.usermodel.DataValidation;
import org.apache.poi.ss.usermodel.DataValidationConstraint;
import org.apache.poi.ss.usermodel.DataValidationHelper;
import org.apache.poi.ss.usermodel.Name;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.CreationHelper;
import org.apache.poi.ss.usermodel.DateUtil;

import org.apache.poi.ss.util.CellRangeAddressList;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ssshi.ddms.constant.Const;
import com.ssshi.ddms.constant.DBConst;
import com.ssshi.ddms.dto.ParamBean;
import com.ssshi.ddms.dto.ScheCrewInOutBean;
import com.ssshi.ddms.dto.UserInfoBean;
import com.ssshi.ddms.dto.RegistrationCrewBean;
import com.ssshi.ddms.dto.RegistrationCrewDetailBean;
import com.ssshi.ddms.dto.RegistrationCrewListBean;
import com.ssshi.ddms.mybatis.dao.ScheDaoI;
import com.ssshi.ddms.mybatis.dao.CrewDaoI;
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
 * Copyright 2024 by SiriusB. Confidential and proprietary information
 * This document contains information, which is the property of SiriusB, 
 * and is furnished for the sole purpose of the operation and the maintenance.  
 * Copyright © 2024 SiriusB.  All rights reserved.
 *
 ********************************************************************************/

@Service
public class CrewService implements CrewServiceI {

	@Autowired
	private ScheDaoI dao;
	
	@Autowired
	private CrewDaoI crewDao;
	
	@Override
	public Map<String, Object> registrationCrew(HttpServletRequest request, RegistrationCrewBean bean) throws Exception {
		Map<String, Object> resultMap = new HashMap<String, Object>();
		List<RegistrationCrewBean> crewList = null;
		
		// schedulerInfoUid가 있으면 해당 스케줄의 승선자 리스트 조회
		if(bean.getSchedulerInfoUid() > 0) {
			crewList = crewDao.getRegistrationCrewListBySchedulerInfoUid(bean.getSchedulerInfoUid());
		} else {
			//crewList = crewDao.getRegistrationCrewList(bean);
		}
		
		if(crewList != null) {
			for(int i = 0; i < crewList.size(); i++) {
				crewList.get(i).setInOutList(dao.getCrewInOutList(crewList.get(i).getUid()));
			}
		}
		
		// schedulerInfoUid가 있으면 해당 스케줄 정보 가져오기
		if(bean.getSchedulerInfoUid() > 0) {
			resultMap.put(Const.BEAN, dao.getScheduler(bean.getSchedulerInfoUid()));
			resultMap.put("status", dao.getTrialStatus(bean.getSchedulerInfoUid()));
		} else {
			resultMap.put(Const.BEAN, dao.getScheduler(bean.getUid()));
			resultMap.put("status", dao.getTrialStatus(bean.getUid()));
		}
		
		resultMap.put(Const.LIST, crewList);
		
		/* 조회조건 : 호선리스트 */
		resultMap.put(Const.LIST + "Ship", crewDao.getShipList());
		return resultMap;
	}
	
	@Override
	public Map<String, Object> getRegistrationCrewList(HttpServletRequest request, RegistrationCrewBean bean) throws Exception {
		Map<String, Object> resultMap = new HashMap<String, Object>();
		List<RegistrationCrewBean> crewList = crewDao.getRegistrationCrewList(bean);
		resultMap.put(Const.LIST_CNT, crewDao.getRegistrationCrewListCnt());

		if(crewList != null) {
			for(int i = 0; i < crewList.size(); i++) {
				crewList.get(i).setInOutList(dao.getCrewInOutList(crewList.get(i).getUid()));
			}
		}

		resultMap.put(Const.BEAN, dao.getScheduler(bean.getUid()));
		resultMap.put(Const.LIST, crewList);
		resultMap.put("status", dao.getTrialStatus(bean.getUid()));
		
		/* 조회조건 : 호선리스트 */
		resultMap.put(Const.LIST + "Ship", crewDao.getShipList());
		return resultMap;
	}
	
	@Override
	public Map<String, Object> registrationCrewSave(HttpServletRequest request, RegistrationCrewListBean bean) throws Exception {
		Map<String, Object> resultMap = new HashMap<String, Object>();
		System.out.println("registrationCrewSave1");
		boolean isResult = DBConst.FAIL;
		int userUid = ((UserInfoBean)(request.getSession().getAttribute(Const.SS_USERINFO))).getUid();

		System.out.println("오나용1234"+bean.getKind().length);
		//재저장
		for(int i = 0; i < bean.getKind().length; i++) {
			RegistrationCrewBean crew = new RegistrationCrewBean();
			
			System.out.println("오나용2222"+bean.getKind().length);
			System.out.println("오나용11141/ "+bean.getUid()[i]+"/ "+bean.getDepartment()[i]);
			
			//리스트 삭제
			if(bean.getUid()[i] != -1)
			{
				crewDao.deleteCrewList(bean.getUid()[i]);
				crewDao.deleteCrewInoutList(bean.getUid()[i]);
				crewDao.deleteCrewDetailList(bean.getUid()[i]);
			}
			
			//재저장
			crew.setSchedulerInfoUid(-1);
			crew.setKind(bean.getKind()[i]);
			crew.setTrialKey(bean.getTrialKey()[i]);
			crew.setProject(bean.getProject()[i]);
			crew.setCompany(bean.getCompany()[i]);
			crew.setDepartment(bean.getDepartment()[i]);
			crew.setName(bean.getName()[i]);
			crew.setRank(bean.getRank()[i]);
			crew.setIdNo(bean.getIdNo()[i]);
			crew.setWorkType1(bean.getWorkType1()[i]);
			crew.setWorkType2(bean.getWorkType2()[i]);
			crew.setWork(bean.getWork()[i]);
			crew.setMainSub(bean.getMainSub()[i]);
			crew.setFoodStyle(bean.getFoodStyle()[i]);
			crew.setPersonNo(bean.getPersonNo()[i]);
			crew.setGender(bean.getGender()[i]);
			crew.setPhone(bean.getPhone()[i]);
			crew.setIsPlan(DBConst.Y);
			crew.setUserUid(userUid);
			
			//승선자 저장 완료시, 승/하선일 저장
			//승선자 저장 완료시, 터미널 상세정보 저장
			if(crewDao.insertRegistrationCrew(crew) > DBConst.ZERO) {
				//승선일 
				if(!bean.getInDate()[i].isEmpty()) {
					ScheCrewInOutBean inOut = new ScheCrewInOutBean();
					inOut.setScheCrewUid(crew.getUid());
					inOut.setInOutDate(bean.getInDate()[i]);
					inOut.setSchedulerInOut(DBConst.SCHE_CREW_INOUT_IN);
					inOut.setPerformanceInOut(DBConst.SCHE_CREW_INOUT_NONE);
					inOut.setUserUid(userUid);
					dao.insertCrewInOut(inOut);
				}
				//하선일
				if(!bean.getOutDate()[i].isEmpty()) {
					ScheCrewInOutBean inOut = new ScheCrewInOutBean();
					inOut.setScheCrewUid(crew.getUid());
					inOut.setInOutDate(bean.getOutDate()[i]);
					inOut.setSchedulerInOut(DBConst.SCHE_CREW_INOUT_OUT);
					inOut.setPerformanceInOut(DBConst.SCHE_CREW_INOUT_NONE);
					inOut.setUserUid(userUid);
					dao.insertCrewInOut(inOut);
				}
				
				//터미널 상세정보
				//터미널, 노트북, 모델명, 시리얼번호, 외국인여부, 여권번호, 발주
			    if(!bean.getTerminal()[i].isEmpty()) { 
				    RegistrationCrewDetailBean detailCrew = new RegistrationCrewDetailBean();
				  
				    detailCrew.setScheCrewUid(crew.getUid());
				    detailCrew.setTerminal(bean.getTerminal()[i]);
				    detailCrew.setLaptop(bean.getLaptop()[i]);
				    detailCrew.setModelNm(bean.getModelNm()[i]);
				    detailCrew.setSerialNo(bean.getSerialNo()[i]);
				    detailCrew.setForeigner(bean.getForeigner()[i]);
				    detailCrew.setPassportNo(bean.getPassportNo()[i]);
				  
				    detailCrew.setUserUid(userUid);
				    System.out.println("오나용187888/ "+bean.getTerminal()[i]+"/ "+bean.getCompany()[i]);
				    crewDao.insertCrewDetail(detailCrew); 
			    }
				 
			}
		}
		
		isResult = DBConst.SUCCESS;
		resultMap.put(Const.RESULT, isResult);
		
		return resultMap;
	}
	
	@Override
	public Map<String, Object> registrationCrewRemove(HttpServletRequest request, ParamBean bean) throws Exception {
		Map<String, Object> resultMap = new HashMap<String, Object>();
		System.out.println("registrationCrewRemove");
		boolean isResult = DBConst.FAIL;
		//int userUid = ((UserInfoBean)(request.getSession().getAttribute(Const.SS_USERINFO))).getUid();
		
		for(int i = 0; i < bean.getUidArr().length; i++) {
			//리스트 삭제
			if(bean.getUidArr()[i] != -1)
			{
				System.out.println("오나용11131/ "+bean.getUidArr()[i]+"/ ");
				crewDao.deleteCrewList(bean.getUidArr()[i]);
				System.out.println("오나용11111/ "+bean.getUidArr()[i]+"/ ");
				crewDao.deleteCrewInoutList(bean.getUidArr()[i]);
				crewDao.deleteCrewDetailList(bean.getUidArr()[i]);
			}
		}
		
		isResult = DBConst.SUCCESS;
		resultMap.put(Const.RESULT, isResult);
		
		return resultMap;
	}
	
	@Override
	public Map<String, Object> crewOrderUpdate(HttpServletRequest request, ParamBean bean) throws Exception {
		Map<String, Object> resultMap = new HashMap<String, Object>();
		System.out.println("crewOrderUpdate");
		boolean isResult = DBConst.FAIL;
		//int userUid = ((UserInfoBean)(request.getSession().getAttribute(Const.SS_USERINFO))).getUid();
		
		for(int i = 0; i < bean.getUidArr().length; i++) {
			//리스트 삭제
			if(bean.getUidArr()[i] != -1)
			{
				 Map<String, Object> map = new HashMap<>();
			     map.put("userId", bean.getUuid());
			     map.put("crewUid", bean.getUidArr()[i]);
				    
				System.out.println("오나용11131/ "+bean.getUidArr()[i]+"/ "+bean.getUuid());
				crewDao.updateCrewOrder(map);
				/*
				 * System.out.println("오나용11111/ "+bean.getUidArr()[i]+"/ ");
				 * crewDao.deleteCrewInoutList(bean.getUidArr()[i]);
				 * crewDao.deleteCrewDetailList(bean.getUidArr()[i]);
				 */
			}
		}
		
		isResult = DBConst.SUCCESS;
		resultMap.put(Const.RESULT, isResult);
		
		return resultMap;
	}
	
	@Override
	public void downCrewExcel(HttpServletResponse response) throws Exception {
		System.out.println("downCrewExcel 오나요");
		
		//엑셀 양식 생성
		XSSFWorkbook wb = new XSSFWorkbook();
		Sheet sheet = wb.createSheet("승선자 등록");
		Sheet dataSheet = wb.createSheet("dataSheet");
		Row row = null;
		Cell cell = null;
		int rowNo = 0;
		int cellIdx = 0;
		
		/// Style *****/
		sheet.setColumnWidth(1, 3500);
		sheet.setColumnWidth(2, 3500);
		sheet.setColumnWidth(3, 3500);
		sheet.setColumnWidth(4, 3500);
		sheet.setColumnWidth(5, 3500);
		sheet.setColumnWidth(6, 3500);
		sheet.setColumnWidth(7, 3500);
		sheet.setColumnWidth(8, 3500);
		sheet.setColumnWidth(11, 3500);
		sheet.setColumnWidth(12, 3500);
		sheet.setColumnWidth(13, 3500);
		sheet.setColumnWidth(14, 3500);
		
		//업무, 성별, 터미널, 노트북, 모델명, 시리얼번호, 외국인여부, 여권번호, 발주
		sheet.setColumnWidth(15, 3500);
		sheet.setColumnWidth(16, 3500);
		sheet.setColumnWidth(17, 3500);
		sheet.setColumnWidth(18, 3500);
		sheet.setColumnWidth(19, 3500);
		sheet.setColumnWidth(20, 3500);
		sheet.setColumnWidth(21, 3500);
		sheet.setColumnWidth(22, 3500);
		sheet.setColumnWidth(23, 3500);
		
		dataSheet.setColumnWidth(0, 3500);
		dataSheet.setColumnWidth(1, 3500);
		dataSheet.setColumnWidth(2, 3500);
		dataSheet.setColumnWidth(3, 3500);
		dataSheet.setColumnWidth(4, 3500);
		
		/// Style *****/		
		CellStyle headStyle = wb.createCellStyle();
		headStyle.setBorderBottom(CellStyle.BORDER_THIN);
		headStyle.setBorderLeft(CellStyle.BORDER_THIN);
		headStyle.setBorderTop(CellStyle.BORDER_THIN);
		headStyle.setBorderRight(CellStyle.BORDER_THIN);
		headStyle.setFillForegroundColor(HSSFColor.LIGHT_YELLOW.index);
		headStyle.setFillPattern(CellStyle.SOLID_FOREGROUND);
		headStyle.setAlignment(CellStyle.ALIGN_CENTER);
		
		CellStyle bodyStyle = wb.createCellStyle();
		bodyStyle.setBorderBottom(CellStyle.BORDER_THIN);
		bodyStyle.setBorderLeft(CellStyle.BORDER_THIN);
		bodyStyle.setBorderTop(CellStyle.BORDER_THIN);
		bodyStyle.setBorderRight(CellStyle.BORDER_THIN);
		
		CellStyle bodyCenterStyle = wb.createCellStyle();
		bodyCenterStyle.setBorderBottom(CellStyle.BORDER_THIN);
		bodyCenterStyle.setBorderLeft(CellStyle.BORDER_THIN);
		bodyCenterStyle.setBorderTop(CellStyle.BORDER_THIN);
		bodyCenterStyle.setBorderRight(CellStyle.BORDER_THIN);
		bodyCenterStyle.setAlignment(CellStyle.ALIGN_CENTER);
		
		/// workType1, workType2 *****/
		String[] workType1Items = {"시운전", "생산", "설계연구소", "지원", "외부"};
		
        String[][] workType2Items = {
    		{"-", "코맨더", "기장운전", "선장운전", "전장운전", "항통", "안벽의장", "기타"},
    		{"-", "기관과", "기타"},
    		{"-", "종합설계", "기장설계", "선장설계", "전장설계", "진동연구", "기타"},
    		{"-", "안전", "캐터링", "QM", "PM", "기타"},
    		{"-", "Owner", "Class", "S/E", "선장", "항해사", "기관장", "라인맨", "기타"}
		};
        
        String[] workType1DataCell = {"A", "B", "C", "D", "E"};
        int maxWorkType2ItemsLength = 0;
        
        for(int i = 0; i < workType2Items.length; i++) {
        	if(workType2Items[i].length > maxWorkType2ItemsLength) {
        		maxWorkType2ItemsLength = workType2Items[i].length;
        	}
        }
        
        Row[] workType2DataRow = new Row[maxWorkType2ItemsLength];
        
        for(int i = 0; i < workType2DataRow.length; i++) {
        	workType2DataRow[i] = dataSheet.createRow(i);
        }

        for(int i = 0; i < workType1Items.length; i++) {
            String[] workType2List = workType2Items[i];
            
            for(int z = 0; z < workType2List.length; z++) {
                Cell c = workType2DataRow[z].createCell(i);
                c.setCellStyle(bodyStyle);
                c.setCellValue(workType2List[z]);
            }
        }
        
        for(int i = 0; i < workType1Items.length; i++) {
            String[] workType2List = workType2Items[i];
            String rangeName = "workType2_" + workType1Items[i];
            Name namedRange = wb.createName();
            namedRange.setNameName(rangeName);
            namedRange.setRefersToFormula("dataSheet!$" + workType1DataCell[i] + "$1:$" + workType1DataCell[i] + "$" + workType2List.length);
        }
   
		row = sheet.createRow(rowNo++);
		cell = row.createCell(cellIdx++);
		cell.setCellStyle(headStyle);
		cell.setCellValue("No.");
		cell = row.createCell(cellIdx++);
		cell.setCellStyle(headStyle);
		cell.setCellValue("구분");
		cell = row.createCell(cellIdx++);
		cell.setCellStyle(headStyle);
		cell.setCellValue("회사");
		cell = row.createCell(cellIdx++);
		cell.setCellStyle(headStyle);
		cell.setCellValue("부서");
		cell = row.createCell(cellIdx++);
		cell.setCellStyle(headStyle);
		cell.setCellValue("성명");
		cell = row.createCell(cellIdx++);
		cell.setCellStyle(headStyle);
		cell.setCellValue("직급");
		cell = row.createCell(cellIdx++);
		cell.setCellStyle(headStyle);
		cell.setCellValue("사번");
		cell = row.createCell(cellIdx++);
		cell.setCellStyle(headStyle);
		cell.setCellValue("역할1");
		cell = row.createCell(cellIdx++);
		cell.setCellStyle(headStyle);
		cell.setCellValue("역할2");
		cell = row.createCell(cellIdx++);
		cell.setCellStyle(headStyle);
		cell.setCellValue("업무");
		cell = row.createCell(cellIdx++);
		cell.setCellStyle(headStyle);
		cell.setCellValue("정/부");
		cell = row.createCell(cellIdx++);
		cell.setCellStyle(headStyle);
		cell.setCellValue("한식/양식");
		cell = row.createCell(cellIdx++);
		cell.setCellStyle(headStyle);
		cell.setCellValue("생년월일");
		cell = row.createCell(cellIdx++);
		cell.setCellStyle(headStyle);
		cell.setCellValue("성별");
		cell = row.createCell(cellIdx++);
		cell.setCellStyle(headStyle);
		cell.setCellValue("전화번호");
		cell = row.createCell(cellIdx++);
		cell.setCellStyle(headStyle);
		cell.setCellValue("승선일");
		cell = row.createCell(cellIdx++);
		cell.setCellStyle(headStyle);
		cell.setCellValue("하선일");
		cell = row.createCell(cellIdx++);
		cell.setCellStyle(headStyle);
		cell.setCellValue("터미널");
		cell = row.createCell(cellIdx++);
		cell.setCellStyle(headStyle);
		cell.setCellValue("노트북");
		cell = row.createCell(cellIdx++);
		cell.setCellStyle(headStyle);
		cell.setCellValue("모델명");
		cell = row.createCell(cellIdx++);
		cell.setCellStyle(headStyle);
		cell.setCellValue("시리얼번호");
		cell = row.createCell(cellIdx++);
		cell.setCellStyle(headStyle);
		cell.setCellValue("외국인여부");
		cell = row.createCell(cellIdx++);
		cell.setCellStyle(headStyle);
		cell.setCellValue("여권번호");
		cell = row.createCell(cellIdx++);
		cell.setCellStyle(headStyle);
		cell.setCellValue("발주");
		
		
		
		for(int i = 0; i < 100; i++) {
			cellIdx = 0;
			
			row = sheet.createRow(rowNo);
			
			cell = row.createCell(cellIdx++);
			cell.setCellStyle(bodyCenterStyle);
			cell.setCellValue(i + 1);
			
			cell = row.createCell(cellIdx++);
			cell.setCellStyle(bodyStyle);
			ExcelUtil.createSelectBox(sheet, cell, new String[]{"SHI-기술지원직", "SHI-생산직", "SHI-협력사", "외부"});
			cell.setCellValue("SHI-기술지원직");
			
			cell = row.createCell(cellIdx++);
			cell.setCellStyle(bodyStyle);
			cell.setCellType(Cell.CELL_TYPE_STRING);
			
			cell = row.createCell(cellIdx++);
			cell.setCellStyle(bodyStyle);
			cell.setCellType(Cell.CELL_TYPE_STRING);
			
			cell = row.createCell(cellIdx++);
			cell.setCellStyle(bodyStyle);
			cell.setCellType(Cell.CELL_TYPE_STRING);
			
			cell = row.createCell(cellIdx++);
			cell.setCellStyle(bodyStyle);
			cell.setCellType(Cell.CELL_TYPE_STRING);
			
			cell = row.createCell(cellIdx++);
			cell.setCellStyle(bodyStyle);
			cell.setCellType(Cell.CELL_TYPE_STRING);
			
			cell = row.createCell(cellIdx);
			cell.setCellStyle(bodyStyle);
			
	        DataValidationHelper validationHelper = sheet.getDataValidationHelper();
	        CellRangeAddressList workType1Range = new CellRangeAddressList(rowNo, rowNo, cellIdx, cellIdx);
	        DataValidationConstraint workType1Constraint = validationHelper.createExplicitListConstraint(workType1Items);
	        DataValidation workType1Validation = validationHelper.createValidation(workType1Constraint, workType1Range);
	        sheet.addValidationData(workType1Validation);
	        
	        cell.setCellValue("시운전");
	        cellIdx++;
	        
	        cell = row.createCell(cellIdx);
			cell.setCellStyle(bodyStyle);

	        for(int x = 0; x < workType1Items.length; x++) {
	            String rangeFormula = "INDIRECT(\"workType2_\" & $H$" + (rowNo + 1) + ")";
	            CellRangeAddressList workType2Range = new CellRangeAddressList(rowNo, rowNo, cellIdx, cellIdx);
	            DataValidationConstraint workType2Constraint = validationHelper.createFormulaListConstraint(rangeFormula);
	            DataValidation workType2Validation = validationHelper.createValidation(workType2Constraint, workType2Range);
	            sheet.addValidationData(workType2Validation);
	        }
	        
	        cell.setCellValue("-");
	        cellIdx++;
	        
	        //업무
	        cell = row.createCell(cellIdx++);
			cell.setCellStyle(bodyStyle);
			cell.setCellType(Cell.CELL_TYPE_STRING);
			
			cell = row.createCell(cellIdx++);
			cell.setCellStyle(bodyCenterStyle);
			ExcelUtil.createSelectBox(sheet, cell, new String[]{"-", "정", "부"});
			cell.setCellValue("-");
			
			cell = row.createCell(cellIdx++);
			cell.setCellStyle(bodyCenterStyle);
			ExcelUtil.createSelectBox(sheet, cell, new String[]{"한식", "양식(Normal Western)", "양식(Halal)", 
					"양식(Veg. fruitarian)", "양식(Veg. vegan)", "양식(Veg. lacto-veg.)", "양식(Veg. ovo-veg.)",
					"양식(Veg. lacto-ovo-veg.)", "양식(Veg. pesco-veg.)", "양식(Veg. pollo-veg.)", "양식(Veg. flexitarian)"});
			cell.setCellValue("한식");
			
			cell = row.createCell(cellIdx++);
			cell.setCellStyle(bodyStyle);
			cell.setCellType(Cell.CELL_TYPE_STRING);
			
			//성별
			cell = row.createCell(cellIdx++);
			cell.setCellStyle(bodyCenterStyle);
			ExcelUtil.createSelectBox(sheet, cell, new String[]{"남", "여"});
			cell.setCellValue("남");
			
			cell = row.createCell(cellIdx++);
			cell.setCellStyle(bodyCenterStyle);
			cell.setCellType(Cell.CELL_TYPE_STRING);
			
			cell = row.createCell(cellIdx++);
			cell.setCellStyle(bodyCenterStyle);
			cell.setCellType(Cell.CELL_TYPE_STRING);
			
			cell = row.createCell(cellIdx++);
			cell.setCellStyle(bodyCenterStyle);
			cell.setCellType(Cell.CELL_TYPE_STRING);
			
			//터미널
			cell = row.createCell(cellIdx++);
			cell.setCellStyle(bodyCenterStyle);
			ExcelUtil.createSelectBox(sheet, cell, new String[]{"-", "Y", "N"});
			cell.setCellValue("-");
			
			//노트북
			cell = row.createCell(cellIdx++);
			cell.setCellStyle(bodyCenterStyle);
			ExcelUtil.createSelectBox(sheet, cell, new String[]{"-", "Y", "N"});
			cell.setCellValue("-");
			
			//모델명
			cell = row.createCell(cellIdx++);
			cell.setCellStyle(bodyCenterStyle);
			cell.setCellType(Cell.CELL_TYPE_STRING);
			
			//시리얼번호
			cell = row.createCell(cellIdx++);
			cell.setCellStyle(bodyCenterStyle);
			cell.setCellType(Cell.CELL_TYPE_STRING);
			
			//외국인여부
			cell = row.createCell(cellIdx++);
			cell.setCellStyle(bodyCenterStyle);
			ExcelUtil.createSelectBox(sheet, cell, new String[]{"-", "Y", "N"});
			cell.setCellValue("-");			
			// H열 = workType1, I열 = workType2
			String mainSubFormula = "IF(AND(H" + (rowNo+1) + "=\"외부\", OR(I" + (rowNo+1) +
			                        "=\"Owner\", I" + (rowNo+1) + "=\"Class\", I" + (rowNo+1) +
			                        "=\"S/E\")), \"Y\", \"-\")";
			cell.setCellFormula(mainSubFormula);
			
			//여권번호
			cell = row.createCell(cellIdx++);
			cell.setCellStyle(bodyCenterStyle);
			cell.setCellType(Cell.CELL_TYPE_STRING);
			
			//발주
			cell = row.createCell(cellIdx++);
			cell.setCellStyle(bodyCenterStyle);
			ExcelUtil.createSelectBox(sheet, cell, new String[]{"-", "Y", "N"});
			cell.setCellValue("-");
			
			rowNo++;
		}
		
		response.setContentType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
		String outputFileName = new String("승선자_등록.xlsx".getBytes("KSC5601"), "8859_1");
		response.setHeader("Content-Disposition", "attachment; fileName=\"" + outputFileName + "\"");

		wb.write(response.getOutputStream());
		wb.close();
	}
	
	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	@Override
	public Map<String, Object> anchorageMealRequest(HttpServletRequest request, AnchorageMealRequestBean bean) throws Exception {
		System.out.println("오나용1234=0-=");
		Map<String, Object> resultMap = new HashMap<String, Object>();
		List<AnchorageMealRequestBean> anchList = crewDao.getAnchorageMealList(bean);
		System.out.println("오나용1234=0-=");
		//계획
		if(anchList != null) {
			System.out.println("오나용1234==");
			for(int i = 0; i < anchList.size(); i++) {
				anchList.get(i).setPlanList(crewDao.getAnchorageMealPlanQtyList(anchList.get(i).getUid()));
				System.out.println("getUid :"+ anchList.get(i).getUid());
				System.out.println("setPlanList :"+ anchList.get(i).getPlanList().size());
			}
			System.out.println("setPlanList2 :"+ anchList.size());
		}
		//실적
		if(anchList != null) {
			System.out.println("오나용123dfgdfg4");
			for(int z = 0; z < anchList.size(); z++) {
				anchList.get(z).setResultList(crewDao.getAnchorageMealResultQtyList(anchList.get(z).getUid()));
			}
			System.out.println("setResultList"+ anchList.size());
		}
		
		//resultMap.put(Const.BEAN, dao.getScheduler(bean.getUid()));
		resultMap.put(Const.LIST, anchList);
		//resultMap.put("status", dao.getTrialStatus(bean.getUid()));
		
		/* 조회조건 : 호선리스트 */
		resultMap.put(Const.LIST + "Ship", crewDao.getAnchShipList());
		return resultMap;
	}
	
	@Override
	public Map<String, Object> getAnchorageMealList(HttpServletRequest request, AnchorageMealRequestBean bean) throws Exception {
		Map<String, Object> resultMap = new HashMap<String, Object>();
		List<AnchorageMealRequestBean> anchList = crewDao.getAnchorageMealList(bean);
		resultMap.put(Const.LIST_CNT, crewDao.getAnchorageMealListCnt());

		//계획
		if(anchList != null) {
			System.out.println("오나용1234==");
			for(int i = 0; i < anchList.size(); i++) {
				anchList.get(i).setPlanList(crewDao.getAnchorageMealPlanQtyList(anchList.get(i).getUid()));
				System.out.println("getUid :"+ anchList.get(i).getUid());
				System.out.println("setPlanList :"+ anchList.get(i).getPlanList().size());
			}
			System.out.println("setPlanList2 :"+ anchList.size());
		}
		//실적
		if(anchList != null) {
			System.out.println("오나용123dfgdfg4");
			for(int z = 0; z < anchList.size(); z++) {
				anchList.get(z).setResultList(crewDao.getAnchorageMealResultQtyList(anchList.get(z).getUid()));
			}
			System.out.println("setResultList"+ anchList.size());
		}

		//resultMap.put(Const.BEAN, dao.getScheduler(bean.getUid()));
		resultMap.put(Const.LIST, anchList);
		//resultMap.put("status", dao.getTrialStatus(bean.getUid()));
		
		/* 조회조건 : 호선리스트 */
		resultMap.put(Const.LIST + "Ship", crewDao.getAnchShipList());
		return resultMap;
	}
	
	@Override
	public Map<String, Object> anchorageMealSave(HttpServletRequest request, AnchorageMealListBean bean) throws Exception {
		Map<String, Object> resultMap = new HashMap<String, Object>();
		System.out.println("RegistrationCrewListBean1");
		boolean isResult = DBConst.FAIL;
		int userUid = ((UserInfoBean)(request.getSession().getAttribute(Const.SS_USERINFO))).getUid();

		System.out.println("오나용1234"+bean.getKind().length);
		
		//재저장
		for(int i = 0; i < bean.getKind().length; i++) {
			AnchorageMealRequestBean anch = new AnchorageMealRequestBean();
			
			System.out.println("오나용2222"+bean.getKind().length);
			System.out.println("오나용11141/ "+bean.getUid()[i]+"/ "+bean.getProjNo()[i]);
			
			//리스트 삭제
			if(bean.getUid()[i] != -1)
			{
				crewDao.deleteAnchList(bean.getUid()[i]);
				crewDao.deleteAnchPlanList(bean.getUid()[i]);
				crewDao.deleteAnchResultList(bean.getUid()[i]);
			}
			
			//재저장 
			anch.setSchedulerInfoUid(-1);
			anch.setUid(bean.getUid()[i]);
			anch.setProjNo(bean.getProjNo()[i]);
			anch.setTrialKey(bean.getProjNo()[i]);
			anch.setKind(bean.getKind()[i]);
			anch.setDomesticYn(bean.getDomesticYn()[i]);
			anch.setDepartment(bean.getDepartment()[i]);
			anch.setMealDate(bean.getMealDate()[i]);
			anch.setOrderStatus(bean.getOrderStatus()[i]);
			anch.setOrderDate(bean.getOrderDate()[i]);
			anch.setOrderUid(bean.getOrderUid()[i]);
			anch.setDeleteYn(bean.getDeleteYn()[i]);
			anch.setComment(bean.getComment()[i]);
			anch.setIsPlan(DBConst.Y);
			anch.setUserUid(userUid);
			
			//승선자 저장 완료시, 승/하선일 저장
			//승선자 저장 완료시, 터미널 상세정보 저장
			if(crewDao.insertAnchorageMeal(anch) > DBConst.ZERO) {
				System.out.println("오나용9982"+anch.getUid());
				//계획
				//조식
				if(bean.getBreakfastP()[i] > 0) {
					AnchorageMealQtyBean mealQty = new AnchorageMealQtyBean();
					mealQty.setAnchorMealUid(anch.getUid());
					mealQty.setPlanMealQty(bean.getBreakfastP()[i]);
					mealQty.setPlanMealTime("조식");
					mealQty.setPlanMealGubun(bean.getFoodStyle()[i]);
					mealQty.setProjNo(bean.getProjNo()[i]);
					mealQty.setUuid(bean.getUuid());
					System.out.println("/오나용8888"+mealQty.getUuid());
					System.out.println("/오나용8888"+mealQty.getPlanMealQty());
					System.out.println("/오나용8888"+mealQty.getPlanMealTime());
					System.out.println("/오나용8888"+mealQty.getPlanMealGubun());
					System.out.println("/오나용8888"+mealQty.getAnchorMealUid());
					crewDao.insertMealQty(mealQty);
				}
				//중식
				if(bean.getLunchP()[i] > 0) {
					AnchorageMealQtyBean mealQty = new AnchorageMealQtyBean();
					mealQty.setAnchorMealUid(anch.getUid());
					mealQty.setPlanMealQty(bean.getLunchP()[i]);
					mealQty.setPlanMealTime("중식");
					mealQty.setPlanMealGubun(bean.getFoodStyle()[i]);
					mealQty.setProjNo(bean.getProjNo()[i]);
					mealQty.setUuid(bean.getUuid());
					crewDao.insertMealQty(mealQty);
				}
				//석식
				if(bean.getDinnerP()[i] > 0) {
					AnchorageMealQtyBean mealQty = new AnchorageMealQtyBean();
					mealQty.setAnchorMealUid(anch.getUid());
					mealQty.setPlanMealQty(bean.getDinnerP()[i]);
					mealQty.setPlanMealTime("석식");
					mealQty.setPlanMealGubun(bean.getFoodStyle()[i]);
					mealQty.setProjNo(bean.getProjNo()[i]);
					mealQty.setUuid(bean.getUuid());
					System.out.println("/오나용1888"+mealQty.getUuid());
					System.out.println("/오나용1888"+mealQty.getPlanMealQty());
					System.out.println("/오나용1888"+mealQty.getPlanMealTime());
					System.out.println("/오나용1888"+mealQty.getPlanMealGubun());
					System.out.println("/오나용1888"+mealQty.getAnchorMealUid());
					crewDao.insertMealQty(mealQty);
				}
				//야식
				if(bean.getLateNightP()[i] > 0) {
					AnchorageMealQtyBean mealQty = new AnchorageMealQtyBean();
					mealQty.setAnchorMealUid(anch.getUid());
					mealQty.setPlanMealQty(bean.getLateNightP()[i]);
					mealQty.setPlanMealTime("야식");
					mealQty.setPlanMealGubun(bean.getFoodStyle()[i]);
					mealQty.setProjNo(bean.getProjNo()[i]);
					mealQty.setUuid(bean.getUuid());
					System.out.println("/오나용7888"+mealQty.getUuid());
					System.out.println("/오나용7888"+mealQty.getPlanMealQty());
					System.out.println("/오나용7888"+mealQty.getPlanMealTime());
					System.out.println("/오나용7888"+mealQty.getPlanMealGubun());
					System.out.println("/오나용7888"+mealQty.getAnchorMealUid());
					crewDao.insertMealQty(mealQty);
				}
			}
		}
		
		isResult = DBConst.SUCCESS;
		resultMap.put(Const.RESULT, isResult);
		
		return resultMap;
	}
	
	@Override
	public Map<String, Object> anchorageMealRemove(HttpServletRequest request, ParamBean bean) throws Exception {
		Map<String, Object> resultMap = new HashMap<String, Object>();
		System.out.println("anchorageMealRemove");
		boolean isResult = DBConst.FAIL;
		//int userUid = ((UserInfoBean)(request.getSession().getAttribute(Const.SS_USERINFO))).getUid();
		
		for(int i = 0; i < bean.getUidArr().length; i++) {
			//리스트 삭제
			if(bean.getUidArr()[i] != -1)
			{
				System.out.println("오나용11131/ "+bean.getUidArr()[i]+"/ ");
				crewDao.deleteAnchList(bean.getUidArr()[i]);
				System.out.println("오나용11111/ "+bean.getUidArr()[i]+"/ ");
				crewDao.deleteAnchPlanList(bean.getUidArr()[i]);
				crewDao.deleteAnchResultList(bean.getUidArr()[i]);
			}
		}
		
		isResult = DBConst.SUCCESS;
		resultMap.put(Const.RESULT, isResult);
		
		return resultMap;
	}
	
	@Override
	public Map<String, Object> anchOrderUpdate(HttpServletRequest request, ParamBean bean) throws Exception {
		Map<String, Object> resultMap = new HashMap<String, Object>();
		System.out.println("anchOrderUpdate");
		boolean isResult = DBConst.FAIL;
		//int userUid = ((UserInfoBean)(request.getSession().getAttribute(Const.SS_USERINFO))).getUid();
		
		for(int i = 0; i < bean.getUidArr().length; i++) {
			//리스트 삭제
			if(bean.getUidArr()[i] != -1)
			{
				 Map<String, Object> map = new HashMap<>();
			     map.put("userId", bean.getUuid());
			     map.put("anchUid", bean.getUidArr()[i]);
				    
				System.out.println("오나용11131/ "+bean.getUidArr()[i]+"/ "+bean.getUuid());
				crewDao.updateAnchOrder(map);
				/*
				 * System.out.println("오나용11111/ "+bean.getUidArr()[i]+"/ ");
				 * crewDao.deleteCrewInoutList(bean.getUidArr()[i]);
				 * crewDao.deleteCrewDetailList(bean.getUidArr()[i]);
				 */
			}
		}
		
		isResult = DBConst.SUCCESS;
		resultMap.put(Const.RESULT, isResult);
		
		return resultMap;
	}
	
	@Override
	public void downAnchExcel(HttpServletResponse response) throws Exception {
		System.out.println("downCrewExcel 오나요");
		
		//엑셀 양식 생성
		XSSFWorkbook wb = new XSSFWorkbook();
		Sheet sheet = wb.createSheet("앵카링 식사신청");
		//Sheet dataSheet = wb.createSheet("dataSheet");
		Row row = null;
		Cell cell = null;
		int rowNo = 0;
		int cellIdx = 0;
		double startDate = DateUtil.getExcelDate(java.sql.Date.valueOf("2000-01-01"));
		double endDate = DateUtil.getExcelDate(java.sql.Date.valueOf("2100-12-31"));
		
		/// Columm *****/
		/// No., 구분, 내국/외국, 부서, 날자, 한식/양식, 발주, 특이사항
		sheet.setColumnWidth(1, 3500);
		sheet.setColumnWidth(2, 3500);
		sheet.setColumnWidth(3, 3500);
		sheet.setColumnWidth(4, 3500);
		sheet.setColumnWidth(5, 3500);
		sheet.setColumnWidth(6, 3500);
		sheet.setColumnWidth(7, 3500);
		sheet.setColumnWidth(8, 3500);
		sheet.setColumnWidth(9, 3500);
		sheet.setColumnWidth(10, 3500);
		sheet.setColumnWidth(11, 3500);
		sheet.setColumnWidth(12, 3500);
		
		/// Style *****/		
		CellStyle headStyle = wb.createCellStyle();
		headStyle.setBorderBottom(CellStyle.BORDER_THIN);
		headStyle.setBorderLeft(CellStyle.BORDER_THIN);
		headStyle.setBorderTop(CellStyle.BORDER_THIN);
		headStyle.setBorderRight(CellStyle.BORDER_THIN);
		headStyle.setFillForegroundColor(HSSFColor.LIGHT_YELLOW.index);
		headStyle.setFillPattern(CellStyle.SOLID_FOREGROUND);
		headStyle.setAlignment(CellStyle.ALIGN_CENTER);
		
		CellStyle bodyStyle = wb.createCellStyle();
		bodyStyle.setBorderBottom(CellStyle.BORDER_THIN);
		bodyStyle.setBorderLeft(CellStyle.BORDER_THIN);
		bodyStyle.setBorderTop(CellStyle.BORDER_THIN);
		bodyStyle.setBorderRight(CellStyle.BORDER_THIN);
		
		CellStyle bodyCenterStyle = wb.createCellStyle();
		bodyCenterStyle.setBorderBottom(CellStyle.BORDER_THIN);
		bodyCenterStyle.setBorderLeft(CellStyle.BORDER_THIN);
		bodyCenterStyle.setBorderTop(CellStyle.BORDER_THIN);
		bodyCenterStyle.setBorderRight(CellStyle.BORDER_THIN);
		bodyCenterStyle.setAlignment(CellStyle.ALIGN_CENTER);
		
		// 날짜 입력 형식(DatePicker 스타일)
		CreationHelper creationHelper = wb.getCreationHelper();
		CellStyle dateStyle = wb.createCellStyle();
		dateStyle.cloneStyleFrom(bodyStyle);
		short dateFormat = creationHelper.createDataFormat().getFormat("yyyy-MM-dd");
		dateStyle.setDataFormat(dateFormat);
		
		/// Head
		row = sheet.createRow(rowNo++);
		cell = row.createCell(cellIdx++);
		cell.setCellStyle(headStyle);
		cell.setCellValue("No.");
		cell = row.createCell(cellIdx++);
		cell.setCellStyle(headStyle);
		cell.setCellValue("구분");
		cell = row.createCell(cellIdx++);
		cell.setCellStyle(headStyle);
		cell.setCellValue("내국/외국");
		cell = row.createCell(cellIdx++);
		cell.setCellStyle(headStyle);
		cell.setCellValue("부서");
		cell = row.createCell(cellIdx++);
		cell.setCellStyle(headStyle);
		cell.setCellValue("날짜");
		cell = row.createCell(cellIdx++);
		cell.setCellStyle(headStyle);
		cell.setCellValue("한식/양식");
		cell = row.createCell(cellIdx++);
		cell.setCellStyle(headStyle);
		cell.setCellValue("조식(계획)");
		cell = row.createCell(cellIdx++);
		cell.setCellStyle(headStyle);
		cell.setCellValue("중식(계획)");
		cell = row.createCell(cellIdx++);
		cell.setCellStyle(headStyle);
		cell.setCellValue("석식(계획)");
		cell = row.createCell(cellIdx++);
		cell.setCellStyle(headStyle);
		cell.setCellValue("야식(계획)");
		cell = row.createCell(cellIdx++);
		cell.setCellStyle(headStyle);
		cell.setCellValue("발주");
		cell = row.createCell(cellIdx++);
		cell.setCellStyle(headStyle);
		cell.setCellValue("특이사항");
		
		for(int i = 0; i < 20; i++) {
			cellIdx = 0;
			
			row = sheet.createRow(rowNo);
			
			cell = row.createCell(cellIdx++);
			cell.setCellStyle(bodyCenterStyle);
			cell.setCellValue(i + 1);
			
			cell = row.createCell(cellIdx++);
			cell.setCellStyle(bodyStyle);
			ExcelUtil.createSelectBox(sheet, cell, new String[]{"직영", "협력사", "방문객", "Owner/Class"});
			cell.setCellValue("직영");
			
			cell = row.createCell(cellIdx++);
			cell.setCellStyle(bodyStyle);
			ExcelUtil.createSelectBox(sheet, cell, new String[]{"내국", "외국"});
			cell.setCellValue("내국");
			
			//부서
			cell = row.createCell(cellIdx++);
			cell.setCellStyle(bodyStyle);
			cell.setCellType(Cell.CELL_TYPE_STRING);
			
			//날짜
			cell = row.createCell(cellIdx++);
			cell.setCellStyle(bodyStyle);
			cell.setCellType(Cell.CELL_TYPE_STRING);

//			// 날짜(yyyy-mm-dd 양식에 맞추기)
//			cell = row.createCell(cellIdx++);
//			cell.setCellStyle(dateStyle);
//			cell.setCellValue(""); // 빈 값 초기화
//
//			// 데이터 유효성 검사(달력 입력 유도)
//			DataValidationHelper dvHelper = sheet.getDataValidationHelper();
//			DataValidationConstraint dvConstraint = dvHelper.createNumericConstraint(
//			        DataValidationConstraint.ValidationType.DECIMAL,
//			        DataValidationConstraint.OperatorType.BETWEEN,
//			        String.valueOf(startDate),
//			        String.valueOf(endDate)
//			);
//			CellRangeAddressList addressList = new CellRangeAddressList(1, 20, 4, 4); // 5번째 컬럼(인덱스 4)
//			DataValidation validation = dvHelper.createValidation(dvConstraint, addressList);
//			validation.setSuppressDropDownArrow(true);
//			validation.setShowErrorBox(true);
//			sheet.addValidationData(validation);

			cell = row.createCell(cellIdx++);
			cell.setCellStyle(bodyStyle);
			ExcelUtil.createSelectBox(sheet, cell, new String[]{"한식", "양식(Normal Western)", "양식(Halal)", 
					"양식(Veg. fruitarian)", "양식(Veg. vegan)", "양식(Veg. lacto-veg.)", "양식(Veg. ovo-veg.)",
					"양식(Veg. lacto-ovo-veg.)", "양식(Veg. pesco-veg.)", "양식(Veg. pollo-veg.)", "양식(Veg. flexitarian)"});
			cell.setCellValue("한식");
			
			cell = row.createCell(cellIdx++);
			cell.setCellStyle(bodyCenterStyle);
			cell.setCellType(Cell.CELL_TYPE_NUMERIC);
			
			cell = row.createCell(cellIdx++);
			cell.setCellStyle(bodyCenterStyle);
			cell.setCellType(Cell.CELL_TYPE_NUMERIC);
			
			cell = row.createCell(cellIdx++);
			cell.setCellStyle(bodyCenterStyle);
			cell.setCellType(Cell.CELL_TYPE_NUMERIC);
			
			cell = row.createCell(cellIdx++);
			cell.setCellStyle(bodyCenterStyle);
			cell.setCellType(Cell.CELL_TYPE_NUMERIC);
			
			//발주
			cell = row.createCell(cellIdx++);
			cell.setCellStyle(bodyCenterStyle);
			ExcelUtil.createSelectBox(sheet, cell, new String[]{ "Y", "N"});
			cell.setCellValue("N");
			
			//특이사항
			cell = row.createCell(cellIdx++);
			cell.setCellStyle(bodyStyle);
			cell.setCellType(Cell.CELL_TYPE_STRING);
			
			rowNo++;
		}
		
		response.setContentType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
		String outputFileName = new String("앵카링_식사신청.xlsx".getBytes("KSC5601"), "8859_1");
		response.setHeader("Content-Disposition", "attachment; fileName=\"" + outputFileName + "\"");

		wb.write(response.getOutputStream());
		wb.close();
	}
}
