package com.ssshi.ddms.crew.service;

import java.io.File;
import java.io.FileInputStream;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;

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
import org.springframework.web.multipart.MultipartFile;
import org.springframework.transaction.annotation.Transactional;

import com.ssshi.ddms.constant.Const;
import com.ssshi.ddms.constant.DBConst;
import com.ssshi.ddms.dto.ParamBean;
import com.ssshi.ddms.dto.ScheCrewInOutBean;
import com.ssshi.ddms.dto.ScheCrewBean;
import com.ssshi.ddms.dto.SchedulerInfoBean;
import com.ssshi.ddms.dto.UserInfoBean;
import com.ssshi.ddms.dto.RegistrationCrewBean;
import com.ssshi.ddms.dto.RegistrationCrewDetailBean;
import com.ssshi.ddms.dto.RegistrationCrewListBean;
import com.ssshi.ddms.mybatis.dao.ScheDaoI;
import com.ssshi.ddms.mybatis.dao.CrewDaoI;
import com.ssshi.ddms.util.ExcelUtil;
import com.ssshi.ddms.util.DRMUtil;

import com.ssshi.ddms.dto.AnchorageMealRequestBean;
import com.ssshi.ddms.dto.AnchorageMealQtyBean;
import com.ssshi.ddms.dto.AnchorageMealListBean;
import com.ssshi.ddms.dto.RegistrationCrewRequestBean;
import com.ssshi.ddms.dto.SmsRequestBean;
import com.ssshi.ddms.dto.RegistrationCrewQtyBean;

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
		
		crewList = filterCrewListByPeriod(crewList, bean.getInDate(), bean.getOutDate());
		
		// schedulerInfoUid가 있으면 해당 스케줄 정보 가져오기
		int schedulerInfoUid = bean.getSchedulerInfoUid() > 0 ? bean.getSchedulerInfoUid() : bean.getUid();
		if(schedulerInfoUid > 0) {
			resultMap.put(Const.BEAN, dao.getScheduler(schedulerInfoUid));
			resultMap.put("status", dao.getTrialStatus(schedulerInfoUid));
		}else {
			resultMap.put(Const.BEAN, null);
			resultMap.put("status", null);
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

		crewList = filterCrewListByPeriod(crewList, bean.getInDate(), bean.getOutDate());
		
		int schedulerInfoUid = bean.getSchedulerInfoUid() > 0 ? bean.getSchedulerInfoUid() : bean.getUid();
		if(schedulerInfoUid > 0) {
			resultMap.put(Const.BEAN, dao.getScheduler(schedulerInfoUid));
			resultMap.put("status", dao.getTrialStatus(schedulerInfoUid));
		}else {
			resultMap.put(Const.BEAN, null);
			resultMap.put("status", null);
		}
		resultMap.put(Const.LIST, crewList);
		
		/* 조회조건 : 호선리스트 */
		resultMap.put(Const.LIST + "Ship", crewDao.getShipList());
		return resultMap;
	}
	
	@Override
	public Map<String, Object> registrationCrewSave(HttpServletRequest request, RegistrationCrewListBean bean) throws Exception {
		Map<String, Object> resultMap = new HashMap<String, Object>();
		System.out.println("registrationCrewSave1");
		boolean isResult = DBConst.FAIL;
		String selectedShipText = request.getParameter("selectedShipText");
		String[] scheduleUidArr = bean.getScheduleUid();
		String hullNumberFromSelection = "";
		
		if(selectedShipText != null) {
			selectedShipText = selectedShipText.trim();
			
			if(selectedShipText.length() >= 6) {
				hullNumberFromSelection = selectedShipText.substring(0, 6);
			}else {
				hullNumberFromSelection = selectedShipText;
			}
		}
		int userUid = ((UserInfoBean)(request.getSession().getAttribute(Const.SS_USERINFO))).getUid();

		System.out.println("오나용1234"+bean.getKind().length);
		//재저장
		for(int i = 0; i < bean.getKind().length; i++) {
			RegistrationCrewBean crew = new RegistrationCrewBean();
			
			System.out.println("오나용2222"+bean.getKind().length);
			System.out.println("오나용11141/ "+bean.getUid()[i]+"/ "+bean.getDepartment()[i]);
			
			String scheduleUidVal = (scheduleUidArr != null && scheduleUidArr.length > i) ? scheduleUidArr[i] : null;
			int schedulerInfoUid = -1;
			
			if(scheduleUidVal != null && scheduleUidVal.trim().length() > 0) {
				try {
					schedulerInfoUid = Integer.parseInt(scheduleUidVal.trim());
				}catch(NumberFormatException e) {
					schedulerInfoUid = -1;
				}
			}
			
			if(schedulerInfoUid <= 0) {
				String shipValue = request.getParameter("ship");
				if(shipValue != null && shipValue.trim().length() > 0) {
					try {
						schedulerInfoUid = Integer.parseInt(shipValue.trim());
					}catch(NumberFormatException e) {
						schedulerInfoUid = -1;
					}
				}
			}
			
			if(schedulerInfoUid <= 0 && bean.getSchedulerInfoUid() != null) {
				schedulerInfoUid = bean.getSchedulerInfoUid();
			}
			
			int currentUid = bean.getUid()[i];
			boolean isUpdate = currentUid != -1;
			if(isUpdate) {
				crew.setUid(currentUid);
			}
			
			crew.setSchedulerInfoUid(schedulerInfoUid);
			crew.setKind(bean.getKind()[i]);
			
			String trialKey = bean.getTrialKey()[i];
			String project = bean.getProject()[i];
			
			if((trialKey == null || trialKey.trim().isEmpty()) && !hullNumberFromSelection.isEmpty()) {
				trialKey = hullNumberFromSelection;
			}
			
			if((project == null || project.trim().isEmpty()) && !hullNumberFromSelection.isEmpty()) {
				project = hullNumberFromSelection;
			}
			
			crew.setTrialKey(trialKey);
			crew.setProject(project);
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
			
			boolean isSuccess = false;
			if(isUpdate) {
				if(crewDao.updateRegistrationCrew(crew) > DBConst.ZERO) {
					crewDao.deleteCrewInoutList(currentUid);
					crewDao.deleteCrewDetailList(currentUid);
					isSuccess = true;
				}
			}else {
				if(crewDao.insertRegistrationCrew(crew) > DBConst.ZERO) {
					currentUid = crew.getUid();
					isSuccess = true;
				}
			}
			
			//승선자 저장 완료시, 승/하선일 저장
			//승선자 저장 완료시, 터미널 상세정보 저장
			if(isSuccess) {
				//승선일 
				if(!isEmpty(bean.getInDate()[i])) {
					ScheCrewInOutBean inOut = new ScheCrewInOutBean();
					inOut.setScheCrewUid(crew.getUid());
					inOut.setInOutDate(bean.getInDate()[i]);
					inOut.setSchedulerInOut(DBConst.SCHE_CREW_INOUT_IN);
					inOut.setPerformanceInOut(DBConst.SCHE_CREW_INOUT_NONE);
					inOut.setUserUid(userUid);
					inOut.setSchedulerInfoUid(schedulerInfoUid > 0 ? schedulerInfoUid : null);
					dao.insertCrewInOut(inOut);
				}
				//하선일
				if(!isEmpty(bean.getOutDate()[i])) {
					ScheCrewInOutBean inOut = new ScheCrewInOutBean();
					inOut.setScheCrewUid(crew.getUid());
					inOut.setInOutDate(bean.getOutDate()[i]);
					inOut.setSchedulerInOut(DBConst.SCHE_CREW_INOUT_OUT);
					inOut.setPerformanceInOut(DBConst.SCHE_CREW_INOUT_NONE);
					inOut.setUserUid(userUid);
					inOut.setSchedulerInfoUid(schedulerInfoUid > 0 ? schedulerInfoUid : null);
					dao.insertCrewInOut(inOut);
				}
				
				//터미널 상세정보
				//터미널, 노트북, 모델명, 시리얼번호, 외국인여부, 여권번호, 발주
			    if(!isEmpty(bean.getTerminal()[i])) { 
				    RegistrationCrewDetailBean detailCrew = new RegistrationCrewDetailBean();
				  
				    detailCrew.setScheCrewUid(crew.getUid());
				    detailCrew.setSchedulerInfoUid(schedulerInfoUid);
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
	///	Map<String, Object> resultMap = new HashMap<String, Object>();
	
	
	@Override
	public Map<String, Object> anchorageMealRequest(HttpServletRequest request, AnchorageMealRequestBean bean) throws Exception {
		Map<String, Object> resultMap = new HashMap<String, Object>();
		List<AnchorageMealRequestBean> anchList = null;
		
		// schedulerInfoUid가 있으면 해당 스케줄의 승선자 리스트 조회
		if(bean.getSchedulerInfoUid() > 0) {
			anchList = crewDao.getAnchorageMealListBySchedulerInfoUid(bean.getSchedulerInfoUid());
		 
			//계획
			if(anchList != null) {
				for(int i = 0; i < anchList.size(); i++) {
					anchList.get(i).setPlanList(crewDao.getAnchorageMealPlanQtyList(anchList.get(i).getUid()));
					System.out.println("getUid :"+ anchList.get(i).getUid());
					System.out.println("setPlanList :"+ anchList.get(i).getPlanList().size());
				}
				
			// 실적
				System.out.println("setPlanList :"+ anchList.size());
		 
				// 전체 실적 리스트를 한번에 조회
				List<AnchorageMealQtyBean> allResultListForAnchorage = crewDao.getAnchorageMealResultQtyList(bean);
				
				// 각 항목별로 부서, 날짜에 맞는 실적 필터링
				for(int z = 0; z < anchList.size(); z++) {
					AnchorageMealRequestBean item = anchList.get(z);
					List<AnchorageMealQtyBean> filteredResultList = new ArrayList<AnchorageMealQtyBean>();
					
					if(allResultListForAnchorage != null) {
						for(AnchorageMealQtyBean result : allResultListForAnchorage) {
							// 부서, 날짜, 호선이 일치하는 실적만 추가
							boolean deptMatch = (item.getDepartment() == null && result.getDepartment() == null) ||
											   (item.getDepartment() != null && item.getDepartment().equals(result.getDepartment()));
							String itemDate = item.getMealDate() != null ? item.getMealDate().substring(0, Math.min(10, item.getMealDate().length())) : null;
							String resultDate = result.getResultMealDate() != null && result.getResultMealDate().length() >= 10 ? result.getResultMealDate().substring(0, 10) : result.getResultMealDate();
							boolean dateMatch = (itemDate == null && resultDate == null) ||
											   (itemDate != null && resultDate != null && itemDate.equals(resultDate));
							boolean projMatch = (item.getProjNo() == null && result.getProjNo() == null) ||
											   (item.getProjNo() != null && item.getProjNo().equals(result.getProjNo()));
							
							if(deptMatch && dateMatch && projMatch) {
								filteredResultList.add(result);
							}
						}
					}
					item.setResultList(filteredResultList);
				}
				System.out.println("setResultList"+ anchList.size());
			 
				// 전체 실적 리스트를 전달하여 호출
				anchList = ensureResultOnlyDepartmentsIncluded(anchList, bean, allResultListForAnchorage);
				
				//resultMap.put(Const.BEAN, dao.getScheduler(bean.getUid()));
				resultMap.put(Const.LIST, anchList);
				List<String> departmentListForInitial = crewDao.getMealDepartmentList(bean);
				resultMap.put("departmentList", departmentListForInitial);
			}
			//resultMap.put("status", dao.getTrialStatus(bean.getUid()));
		}
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
		
		//부서별, 한식/양식별로 ROW 분리
		List<AnchorageMealRequestBean> expandedList = new ArrayList<AnchorageMealRequestBean>();
		if(anchList != null) {
			for(int i = 0; i < anchList.size(); i++) {
				AnchorageMealRequestBean originalBean = anchList.get(i);
				List<AnchorageMealQtyBean> planList = originalBean.getPlanList();
				
				if(planList != null && planList.size() > 0) {
					// planList에서 고유한 MEAL_GUBUN 추출
					Set<String> mealGubunSet = new HashSet<String>();
					for(AnchorageMealQtyBean plan : planList) {
						if(plan.getPlanMealGubun() != null && !plan.getPlanMealGubun().isEmpty()) {
							mealGubunSet.add(plan.getPlanMealGubun());
						}
					}
					
					// MEAL_GUBUN이 없으면 원본 그대로 추가
					if(mealGubunSet.isEmpty()) {
						expandedList.add(originalBean);
					} else {
						// 각 MEAL_GUBUN별로 별도의 ROW 생성
						for(String mealGubun : mealGubunSet) {
							AnchorageMealRequestBean newBean = new AnchorageMealRequestBean();
							// 원본 Bean의 정보 복사
							newBean.setUid(originalBean.getUid());
							newBean.setSchedulerInfoUid(originalBean.getSchedulerInfoUid());
							newBean.setProjNo(originalBean.getProjNo());
							newBean.setTrialKey(originalBean.getTrialKey());
							newBean.setKind(originalBean.getKind());
							newBean.setDomesticYn(originalBean.getDomesticYn());
							newBean.setDepartment(originalBean.getDepartment());
							newBean.setMealDate(originalBean.getMealDate());
							newBean.setOrderStatus(originalBean.getOrderStatus());
							newBean.setOrderDate(originalBean.getOrderDate());
							newBean.setOrderUid(originalBean.getOrderUid());
							newBean.setDeleteYn(originalBean.getDeleteYn());
							newBean.setComment(originalBean.getComment());
							newBean.setInputDate(originalBean.getInputDate());
							newBean.setInputUid(originalBean.getInputUid());
							newBean.setFoodStyle(mealGubun);
							
							// 해당 MEAL_GUBUN에 맞는 planList 필터링
							List<AnchorageMealQtyBean> filteredPlanList = new ArrayList<AnchorageMealQtyBean>();
							for(AnchorageMealQtyBean plan : planList) {
								if(mealGubun.equals(plan.getPlanMealGubun())) {
									filteredPlanList.add(plan);
								}
							}
							newBean.setPlanList(filteredPlanList);
							expandedList.add(newBean);
						}
					}
				} else {
					// planList가 없으면 원본 그대로 추가
					expandedList.add(originalBean);
				}
			}
		}
		anchList = expandedList;
		
		//실적 - 조회기간 전체에 대한 실적을 한번에 조회
		if(anchList != null) {
			// 조회기간 전체에 대한 실적을 한번에 조회
			List<AnchorageMealQtyBean> allResultListForAnchorage = crewDao.getAnchorageMealResultQtyList(bean);
			
			// 각 항목별로 부서, 날짜에 맞는 실적 필터링
			for(int z = 0; z < anchList.size(); z++) {
				AnchorageMealRequestBean item = anchList.get(z);
				List<AnchorageMealQtyBean> filteredResultList = new ArrayList<AnchorageMealQtyBean>();
				
				if(allResultListForAnchorage != null) {
					for(AnchorageMealQtyBean result : allResultListForAnchorage) {
						// 부서, 날짜, 호선이 일치하는 실적만 추가
						boolean deptMatch = (item.getDepartment() == null && result.getDepartment() == null) ||
										   (item.getDepartment() != null && item.getDepartment().equals(result.getDepartment()));
						String itemDate = item.getMealDate() != null ? item.getMealDate().substring(0, Math.min(10, item.getMealDate().length())) : null;
						String resultDate = result.getResultMealDate() != null && result.getResultMealDate().length() >= 10 ? result.getResultMealDate().substring(0, 10) : result.getResultMealDate();
						boolean dateMatch = (itemDate == null && resultDate == null) ||
										   (itemDate != null && resultDate != null && itemDate.equals(resultDate));
						boolean projMatch = (item.getProjNo() == null && result.getProjNo() == null) ||
										   (item.getProjNo() != null && item.getProjNo().equals(result.getProjNo()));
						
						// 식사구분도 일치하는지 확인 (foodStyle이 있는 경우)
						boolean mealGubunMatch = true;
						if(item.getFoodStyle() != null && !item.getFoodStyle().isEmpty()) {
							String itemFoodStyle = item.getFoodStyle();
							String resultFoodStyle = result.getResultMealGubun();
							// 한식/양식 매칭 (K=한식, W=양식)
							if("K".equals(itemFoodStyle) || "한식".equals(itemFoodStyle)) {
								mealGubunMatch = ("K".equals(resultFoodStyle) || "한식".equals(resultFoodStyle));
							} else if("W".equals(itemFoodStyle) || "양식".equals(resultFoodStyle)) {
								mealGubunMatch = ("W".equals(resultFoodStyle) || "양식".equals(resultFoodStyle));
							}
						}
						
						if(deptMatch && dateMatch && projMatch && mealGubunMatch) {
							filteredResultList.add(result);
						}
					}
				}
				item.setResultList(filteredResultList);
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
	
	@Override
	public Map<String, Object> crewResultMeal(HttpServletRequest request, RegistrationCrewRequestBean bean) throws Exception {
		
		Map<String, Object> resultMap = new HashMap<String, Object>();
		
		/* 조회조건 : 호선리스트 */
		resultMap.put(Const.LIST + "Ship", crewDao.getShipList());
		
		// 조회 조건 확인: inDate와 outDate가 모두 있어야 조회 수행
		boolean hasSearchCondition = (bean.getInDate() != null && !bean.getInDate().isEmpty()) 
								  && (bean.getOutDate() != null && !bean.getOutDate().isEmpty());
		
		if(!hasSearchCondition) {
			System.out.println("[crewResultMeal] 조회 조건이 없어 조회를 수행하지 않습니다. (inDate 또는 outDate가 없음)");
			resultMap.put(Const.LIST, new ArrayList<RegistrationCrewRequestBean>());
			resultMap.put(Const.LIST_CNT, 0);
			resultMap.put(Const.LIST + "Ship", crewDao.getShipList());
			return resultMap;
		}
		
		System.out.println("[crewResultMeal] getMealResultList 쿼리 조회 시작");
		List<RegistrationCrewRequestBean> crewList = crewDao.getCrewMealResultList(bean);
		System.out.println("[crewResultMeal] getMealResultList 쿼리 조회 완료 - 결과 건수: " + (crewList != null ? crewList.size() : 0));
		
		// UID가 NULL인 항목(실적 전용 행)을 별도로 필터링
		List<RegistrationCrewRequestBean> filteredAnchList = new ArrayList<RegistrationCrewRequestBean>();
		List<RegistrationCrewRequestBean> resultOnlyList = new ArrayList<RegistrationCrewRequestBean>();
		if(crewList != null) {
			for(RegistrationCrewRequestBean item : crewList) {
				if(item.getUid() > 0) {
					// 계획이 있는 항목 (UID가 있음)
					filteredAnchList.add(item);
				} else {
					// 실적만 있는 항목 (UID가 NULL)
					resultOnlyList.add(item);
					System.out.println("[crewResultMeal] 실적 전용 행 발견 - 부서: " + item.getDepartment() + ", 날짜: " + item.getMealDate() + ", 호선: " + item.getProjNo());
				}
			}
		}
		System.out.println("[crewResultMeal] 계획 행 필터링 완료 - 계획 행: " + filteredAnchList.size() + ", 실적 전용 행: " + resultOnlyList.size());
		
		crewList = filteredAnchList;  // 계획 행만 사용
		
		resultMap.put(Const.LIST_CNT, crewDao.getCrewMealListCnt());
		System.out.println("[crewResultMeal] LIST_CNT: " + crewDao.getCrewMealListCnt());

		//계획
		System.out.println("[crewResultMeal] 계획(plan) 리스트 설정 시작");
		if(crewList != null) {				
			for(int i = 0; i < crewList.size(); i++) {
				RegistrationCrewRequestBean item = crewList.get(i);
				System.out.println("[crewResultMeal] 계획 조회 - UID: " + item.getUid() + ", 부서: " + item.getDepartment() + ", 날짜: " + item.getMealDate());
				if(item.getUid() > 0) {
					List<RegistrationCrewQtyBean> planList = crewDao.getCrewPlanQtyList(item.getUid());
					item.setPlanList(planList);
					System.out.println("[crewResultMeal]   -> 계획 건수: " + (planList != null ? planList.size() : 0));
					if(planList != null && planList.size() > 0) {
						for(int j = 0; j < planList.size(); j++) {
							RegistrationCrewQtyBean plan = planList.get(j);
							System.out.println("[crewResultMeal]     계획 상세[" + j + "]: 날짜=" + plan.getPlanMealDate() + ", 시간=" + plan.getPlanMealTime() + ", 구분=" + plan.getPlanMealGubun() + ", 수량=" + plan.getPlanMealQty());
						}
					}
				} else {
					System.out.println("[crewResultMeal]   -> UID가 없어 계획 조회 스킵");
					item.setPlanList(new ArrayList<RegistrationCrewQtyBean>());
				}
			}
			System.out.println("[crewResultMeal] 계획(plan) 리스트 설정 완료 - 전체 항목 수: " + crewList.size());
		}
		
		//실적 - 조회기간 전체에 대한 실적을 한번에 조회
		System.out.println("[crewResultMeal] 실적(result) 수량 조회 시작");
		if(crewList != null) {
			// 조회기간 전체에 대한 실적을 한번에 조회
			RegistrationCrewQtyBean allResultQty = new RegistrationCrewQtyBean();
			allResultQty.setProjNo(bean.getShip() != null && !bean.getShip().isEmpty() && !bean.getShip().equals("ALL") ? bean.getShip() : null);
			
			allResultQty.setInDate(bean.getInDate());
			allResultQty.setOutDate(bean.getOutDate());
			
			
			System.out.println("[crewResultMeal] getCrewResultQtyList 쿼리 파라미터:");
			System.out.println("  - projNo: " + allResultQty.getProjNo());
			System.out.println("  - inDate: " + allResultQty.getInDate());
			System.out.println("  - outDate: " + allResultQty.getOutDate());
			
			System.out.println("[crewResultMeal] getCrewResultQtyList 쿼리 실행 시작");
			List<RegistrationCrewQtyBean> allResultList = crewDao.getCrewResultQtyList(allResultQty);
			System.out.println("[v] getCrewResultQtyList 쿼리 실행 완료 - 전체 실적 건수: " + (allResultList != null ? allResultList.size() : 0));
			
			// 각 항목별로 부서, 날짜에 맞는 실적 필터링
			System.out.println("[crewResultMeal] 항목별 실적 필터링 시작");
			for(int z = 0; z < crewList.size(); z++) {
				RegistrationCrewRequestBean item = crewList.get(z);
				List<RegistrationCrewQtyBean> filteredResultList = new ArrayList<RegistrationCrewQtyBean>();
				
				System.out.println("[crewResultMeal] 항목[" + z + "] 필터링 - 부서: " + item.getDepartment() + ", 날짜: " + item.getMealDate() + ", 호선: " + item.getProjNo());
				
				if(allResultList != null) {
					int matchCount = 0;
					for(RegistrationCrewQtyBean result : allResultList) {
						// 부서, 날짜, 호선이 일치하는 실적만 추가
						boolean deptMatch = (item.getDepartment() == null && result.getDepartment() == null) ||
										   (item.getDepartment() != null && item.getDepartment().equals(result.getDepartment()));
						String itemDate = item.getMealDate() != null ? item.getMealDate().substring(0, Math.min(10, item.getMealDate().length())) : null;
						String resultDate = result.getResultMealDate() != null && result.getResultMealDate().length() >= 10 ? result.getResultMealDate().substring(0, 10) : result.getResultMealDate();
						boolean dateMatch = (itemDate == null && resultDate == null) ||
										   (itemDate != null && resultDate != null && itemDate.equals(resultDate));
						boolean projMatch = (item.getProjNo() == null && result.getProjNo() == null) ||
										   (item.getProjNo() != null && item.getProjNo().equals(result.getProjNo()));
						
						if(deptMatch && dateMatch && projMatch) {
							filteredResultList.add(result);
							matchCount++;
							System.out.println("[crewResultMeal]   -> 매칭된 실적: 부서=" + result.getDepartment() + ", 날짜=" + resultDate + ", 시간=" + result.getResultMealTime() + ", 구분=" + result.getResultMealGubun() + ", 수량=" + result.getResultMealQty());
						}
					}
					System.out.println("[crewResultMeal] 항목[" + z + "] 필터링 완료 - 매칭된 실적 건수: " + matchCount);
				}
				item.setResultList(filteredResultList);
			}
			System.out.println("[crewResultMeal] 항목별 실적 필터링 완료 - 전체 항목 수: " + crewList.size());
		}

		// 전체 실적 리스트를 조회하여 전달
		System.out.println("[crewResultMeal] ensureResultOnlyDepartmentsIncluded_Crew 호출 시작");
		// ensureResultOnlyDepartmentsIncluded 호출 전 계획 데이터 확인
		if(crewList != null) {
			System.out.println("[crewResultMeal] ensureResultOnlyDepartmentsIncluded_Crew 호출 전 계획 데이터 확인:");
			for(int i = 0; i < crewList.size(); i++) {
				RegistrationCrewRequestBean item = crewList.get(i);
				System.out.println("[crewResultMeal]   항목[" + i + "] UID: " + item.getUid() + ", 계획 건수: " + (item.getPlanList() != null ? item.getPlanList().size() : 0));
			}
		}
		RegistrationCrewQtyBean allResultQtyForInclude = new RegistrationCrewQtyBean();
		allResultQtyForInclude.setProjNo(bean.getShip() != null && !bean.getShip().isEmpty() && !bean.getShip().equals("ALL") ? bean.getShip() : null);
		allResultQtyForInclude.setInDate(bean.getInDate());
		allResultQtyForInclude.setOutDate(bean.getOutDate());
		List<RegistrationCrewQtyBean> allResultListForInclude = crewDao.getCrewResultQtyList(allResultQtyForInclude);
		System.out.println("[crewResultMeal] ensureResultOnlyDepartmentsIncluded 호출 전 - crewList 건수: " + (crewList != null ? crewList.size() : 0));
		crewList = ensureResultOnlyDepartmentsIncluded_Crew(crewList, bean, allResultListForInclude);
		System.out.println("[crewResultMeal] ensureResultOnlyDepartmentsIncluded 호출 후 - crewList 건수: " + (crewList != null ? crewList.size() : 0));
		// ensureResultOnlyDepartmentsIncluded 호출 후 계획 데이터 확인
		if(crewList != null) {
			System.out.println("[crewResultMeal] ensureResultOnlyDepartmentsIncluded 호출 후 계획 데이터 확인:");
			for(int i = 0; i < crewList.size(); i++) {
				RegistrationCrewRequestBean item = crewList.get(i);
				System.out.println("[crewResultMeal]   항목[" + i + "] UID: " + item.getUid() + ", 계획 건수: " + (item.getPlanList() != null ? item.getPlanList().size() : 0));
			}
		}

		//resultMap.put(Const.BEAN, dao.getScheduler(bean.getUid()));
		resultMap.put(Const.LIST, crewList);
		//resultMap.put("status", dao.getTrialStatus(bean.getUid()));
		
		
		
		System.out.println("[crewResultMeal] 최종 결과 - anchList 건수: " + (crewList != null ? crewList.size() : 0));
		
		// anchList 상세 데이터 로그 출력
//		if(anchList != null && anchList.size() > 0) {
//			System.out.println("[resultMeal] ========== anchList 상세 데이터 ==========");
//			for(int i = 0; i < anchList.size(); i++) {
//				AnchorageMealRequestBean item = anchList.get(i);
//				System.out.println("[resultMeal] 항목[" + i + "]:");
//				System.out.println("  - UID: " + item.getUid());
//				System.out.println("  - 호선(PROJ_NO): " + item.getProjNo());
//				System.out.println("  - 부서(DEPT_NAME): " + item.getDepartment());
//				System.out.println("  - 날짜(MEAL_DATE): " + item.getMealDate());
//				System.out.println("  - 구분(KIND): " + item.getKind());
//				System.out.println("  - 내외국(DOMESTIC_YN): " + item.getDomesticYn());
//				System.out.println("  - 발주상태(ORDER_STATUS): " + item.getOrderStatus());
//				System.out.println("  - 식사구분(FOODSTYLE): " + item.getFoodStyle());
//				
//				// 계획(plan) 리스트
//				List<AnchorageMealQtyBean> planList = item.getPlanList();
//				if(planList != null && planList.size() > 0) {
//					System.out.println("  - 계획(planList) 건수: " + planList.size());
//					for(int j = 0; j < planList.size(); j++) {
//						AnchorageMealQtyBean plan = planList.get(j);
//						System.out.println("    계획[" + j + "]: 날짜=" + plan.getPlanMealDate() + ", 시간=" + plan.getPlanMealTime() + ", 구분=" + plan.getPlanMealGubun() + ", 수량=" + plan.getPlanMealQty());
//					}
//				} else {
//					System.out.println("  - 계획(planList): 없음");
//				}
//				
//				// 실적(result) 리스트
//				List<AnchorageMealQtyBean> resultList = item.getResultList();
//				if(resultList != null && resultList.size() > 0) {
//					System.out.println("  - 실적(resultList) 건수: " + resultList.size());
//					for(int j = 0; j < resultList.size(); j++) {
//						AnchorageMealQtyBean result = resultList.get(j);
//						System.out.println("    실적[" + j + "]: 날짜=" + result.getResultMealDate() + ", 시간=" + result.getResultMealTime() + ", 구분=" + result.getResultMealGubun() + ", 부서=" + result.getDepartment() + ", 호선=" + result.getProjNo() + ", 수량=" + result.getResultMealQty());
//					}
//				} else {
//					System.out.println("  - 실적(resultList): 없음");
//				}
//				System.out.println("");
//			}
//			System.out.println("[resultMeal] ==============================================");
//		} else {
//			System.out.println("[resultMeal] anchList가 비어있습니다.");
//		}
//		
		System.out.println("========== crewResultMeal() 함수 종료 ==========");
		return resultMap;
	}
	
	
	@Override
	public Map<String, Object> resultMeal(HttpServletRequest request, AnchorageMealRequestBean bean) throws Exception {
		
		Map<String, Object> resultMap = new HashMap<String, Object>();
		
		/* 조회조건 : 호선리스트 */
		resultMap.put(Const.LIST + "Ship", crewDao.getAnchShipList());
		
		// 조회 조건 확인: inDate와 outDate가 모두 있어야 조회 수행
		boolean hasSearchCondition = (bean.getInDate() != null && !bean.getInDate().isEmpty()) 
								  && (bean.getOutDate() != null && !bean.getOutDate().isEmpty());
		
		if(!hasSearchCondition) {
			System.out.println("[resultMeal] 조회 조건이 없어 조회를 수행하지 않습니다. (inDate 또는 outDate가 없음)");
			resultMap.put(Const.LIST, new ArrayList<AnchorageMealRequestBean>());
			resultMap.put(Const.LIST_CNT, 0);
			resultMap.put(Const.LIST + "Ship", crewDao.getAnchShipList());
			return resultMap;
		}
		
		System.out.println("[resultMeal] getMealResultList 쿼리 조회 시작");
		List<AnchorageMealRequestBean> anchList = crewDao.getMealResultList(bean);
		System.out.println("[resultMeal] getMealResultList 쿼리 조회 완료 - 결과 건수: " + (anchList != null ? anchList.size() : 0));
		
		// UID가 NULL인 항목(실적 전용 행)을 별도로 필터링
		List<AnchorageMealRequestBean> filteredAnchList = new ArrayList<AnchorageMealRequestBean>();
		List<AnchorageMealRequestBean> resultOnlyList = new ArrayList<AnchorageMealRequestBean>();
		if(anchList != null) {
			for(AnchorageMealRequestBean item : anchList) {
				if(item.getUid() > 0) {
					// 계획이 있는 항목 (UID가 있음)
					filteredAnchList.add(item);
				} else {
					// 실적만 있는 항목 (UID가 NULL)
					resultOnlyList.add(item);
					System.out.println("[resultMeal] 실적 전용 행 발견 - 부서: " + item.getDepartment() + ", 날짜: " + item.getMealDate() + ", 호선: " + item.getProjNo());
				}
			}
		}
		System.out.println("[resultMeal] 계획 행 필터링 완료 - 계획 행: " + filteredAnchList.size() + ", 실적 전용 행: " + resultOnlyList.size());
		
		anchList = filteredAnchList;  // 계획 행만 사용
		
		resultMap.put(Const.LIST_CNT, crewDao.getAnchorageMealListCnt());
		System.out.println("[resultMeal] LIST_CNT: " + crewDao.getAnchorageMealListCnt());

		//계획
		System.out.println("[resultMeal] 계획(plan) 리스트 설정 시작");
		if(anchList != null) {				
			for(int i = 0; i < anchList.size(); i++) {
				AnchorageMealRequestBean item = anchList.get(i);
				System.out.println("[resultMeal] 계획 조회 - UID: " + item.getUid() + ", 부서: " + item.getDepartment() + ", 날짜: " + item.getMealDate());
				if(item.getUid() > 0) {
					List<AnchorageMealQtyBean> planList = crewDao.getMealResultPlanQtyList(item.getUid());
					item.setPlanList(planList);
					System.out.println("[resultMeal]   -> 계획 건수: " + (planList != null ? planList.size() : 0));
					if(planList != null && planList.size() > 0) {
						for(int j = 0; j < planList.size(); j++) {
							AnchorageMealQtyBean plan = planList.get(j);
							System.out.println("[resultMeal]     계획 상세[" + j + "]: 날짜=" + plan.getPlanMealDate() + ", 시간=" + plan.getPlanMealTime() + ", 구분=" + plan.getPlanMealGubun() + ", 수량=" + plan.getPlanMealQty());
						}
					}
				} else {
					System.out.println("[resultMeal]   -> UID가 없어 계획 조회 스킵");
					item.setPlanList(new ArrayList<AnchorageMealQtyBean>());
				}
			}
			System.out.println("[resultMeal] 계획(plan) 리스트 설정 완료 - 전체 항목 수: " + anchList.size());
		}
		
		//실적 - 조회기간 전체에 대한 실적을 한번에 조회
		System.out.println("[resultMeal] 실적(result) 수량 조회 시작");
		if(anchList != null) {
			// 조회기간 전체에 대한 실적을 한번에 조회
			AnchorageMealQtyBean allResultQty = new AnchorageMealQtyBean();
			allResultQty.setProjNo(bean.getShip() != null && !bean.getShip().isEmpty() && !bean.getShip().equals("ALL") ? bean.getShip() : null);
			allResultQty.setInDate(bean.getInDate());
			allResultQty.setOutDate(bean.getOutDate());
			
			System.out.println("[resultMeal] getMealResultQtyList 쿼리 파라미터:");
			System.out.println("  - projNo: " + allResultQty.getProjNo());
			System.out.println("  - inDate: " + allResultQty.getInDate());
			System.out.println("  - outDate: " + allResultQty.getOutDate());
			
			System.out.println("[resultMeal] getMealResultQtyList 쿼리 실행 시작");
			List<AnchorageMealQtyBean> allResultList = crewDao.getMealResultQtyList(allResultQty);
			System.out.println("[resultMeal] getMealResultQtyList 쿼리 실행 완료 - 전체 실적 건수: " + (allResultList != null ? allResultList.size() : 0));
			
			// 각 항목별로 부서, 날짜에 맞는 실적 필터링
			System.out.println("[resultMeal] 항목별 실적 필터링 시작");
			for(int z = 0; z < anchList.size(); z++) {
				AnchorageMealRequestBean item = anchList.get(z);
				List<AnchorageMealQtyBean> filteredResultList = new ArrayList<AnchorageMealQtyBean>();
				
				System.out.println("[resultMeal] 항목[" + z + "] 필터링 - 부서: " + item.getDepartment() + ", 날짜: " + item.getMealDate() + ", 호선: " + item.getProjNo());
				
				if(allResultList != null) {
					int matchCount = 0;
					for(AnchorageMealQtyBean result : allResultList) {
						// 부서, 날짜, 호선이 일치하는 실적만 추가
						boolean deptMatch = (item.getDepartment() == null && result.getDepartment() == null) ||
										   (item.getDepartment() != null && item.getDepartment().equals(result.getDepartment()));
						String itemDate = item.getMealDate() != null ? item.getMealDate().substring(0, Math.min(10, item.getMealDate().length())) : null;
						String resultDate = result.getResultMealDate() != null && result.getResultMealDate().length() >= 10 ? result.getResultMealDate().substring(0, 10) : result.getResultMealDate();
						boolean dateMatch = (itemDate == null && resultDate == null) ||
										   (itemDate != null && resultDate != null && itemDate.equals(resultDate));
						boolean projMatch = (item.getProjNo() == null && result.getProjNo() == null) ||
										   (item.getProjNo() != null && item.getProjNo().equals(result.getProjNo()));
						
						if(deptMatch && dateMatch && projMatch) {
							filteredResultList.add(result);
							matchCount++;
							System.out.println("[resultMeal]   -> 매칭된 실적: 부서=" + result.getDepartment() + ", 날짜=" + resultDate + ", 시간=" + result.getResultMealTime() + ", 구분=" + result.getResultMealGubun() + ", 수량=" + result.getResultMealQty());
						}
					}
					System.out.println("[resultMeal] 항목[" + z + "] 필터링 완료 - 매칭된 실적 건수: " + matchCount);
				}
				item.setResultList(filteredResultList);
			}
			System.out.println("[resultMeal] 항목별 실적 필터링 완료 - 전체 항목 수: " + anchList.size());
		}

		// 전체 실적 리스트를 조회하여 전달
		System.out.println("[resultMeal] ensureResultOnlyDepartmentsIncluded 호출 시작");
		// ensureResultOnlyDepartmentsIncluded 호출 전 계획 데이터 확인
		if(anchList != null) {
			System.out.println("[resultMeal] ensureResultOnlyDepartmentsIncluded 호출 전 계획 데이터 확인:");
			for(int i = 0; i < anchList.size(); i++) {
				AnchorageMealRequestBean item = anchList.get(i);
				System.out.println("[resultMeal]   항목[" + i + "] UID: " + item.getUid() + ", 계획 건수: " + (item.getPlanList() != null ? item.getPlanList().size() : 0));
			}
		}
		AnchorageMealQtyBean allResultQtyForInclude = new AnchorageMealQtyBean();
		allResultQtyForInclude.setProjNo(bean.getShip() != null && !bean.getShip().isEmpty() && !bean.getShip().equals("ALL") ? bean.getShip() : null);
		allResultQtyForInclude.setInDate(bean.getInDate());
		allResultQtyForInclude.setOutDate(bean.getOutDate());
		List<AnchorageMealQtyBean> allResultListForInclude = crewDao.getMealResultQtyList(allResultQtyForInclude);
		System.out.println("[resultMeal] ensureResultOnlyDepartmentsIncluded 호출 전 - anchList 건수: " + (anchList != null ? anchList.size() : 0));
		anchList = ensureResultOnlyDepartmentsIncluded(anchList, bean, allResultListForInclude);
		System.out.println("[resultMeal] ensureResultOnlyDepartmentsIncluded 호출 후 - anchList 건수: " + (anchList != null ? anchList.size() : 0));
		// ensureResultOnlyDepartmentsIncluded 호출 후 계획 데이터 확인
		if(anchList != null) {
			System.out.println("[resultMeal] ensureResultOnlyDepartmentsIncluded 호출 후 계획 데이터 확인:");
			for(int i = 0; i < anchList.size(); i++) {
				AnchorageMealRequestBean item = anchList.get(i);
				System.out.println("[resultMeal]   항목[" + i + "] UID: " + item.getUid() + ", 계획 건수: " + (item.getPlanList() != null ? item.getPlanList().size() : 0));
			}
		}

		//resultMap.put(Const.BEAN, dao.getScheduler(bean.getUid()));
		resultMap.put(Const.LIST, anchList);
		//resultMap.put("status", dao.getTrialStatus(bean.getUid()));
		
		
		
		System.out.println("[resultMeal] 최종 결과 - anchList 건수: " + (anchList != null ? anchList.size() : 0));
		
		// anchList 상세 데이터 로그 출력
//		if(anchList != null && anchList.size() > 0) {
//			System.out.println("[resultMeal] ========== anchList 상세 데이터 ==========");
//			for(int i = 0; i < anchList.size(); i++) {
//				AnchorageMealRequestBean item = anchList.get(i);
//				System.out.println("[resultMeal] 항목[" + i + "]:");
//				System.out.println("  - UID: " + item.getUid());
//				System.out.println("  - 호선(PROJ_NO): " + item.getProjNo());
//				System.out.println("  - 부서(DEPT_NAME): " + item.getDepartment());
//				System.out.println("  - 날짜(MEAL_DATE): " + item.getMealDate());
//				System.out.println("  - 구분(KIND): " + item.getKind());
//				System.out.println("  - 내외국(DOMESTIC_YN): " + item.getDomesticYn());
//				System.out.println("  - 발주상태(ORDER_STATUS): " + item.getOrderStatus());
//				System.out.println("  - 식사구분(FOODSTYLE): " + item.getFoodStyle());
//				
//				// 계획(plan) 리스트
//				List<AnchorageMealQtyBean> planList = item.getPlanList();
//				if(planList != null && planList.size() > 0) {
//					System.out.println("  - 계획(planList) 건수: " + planList.size());
//					for(int j = 0; j < planList.size(); j++) {
//						AnchorageMealQtyBean plan = planList.get(j);
//						System.out.println("    계획[" + j + "]: 날짜=" + plan.getPlanMealDate() + ", 시간=" + plan.getPlanMealTime() + ", 구분=" + plan.getPlanMealGubun() + ", 수량=" + plan.getPlanMealQty());
//					}
//				} else {
//					System.out.println("  - 계획(planList): 없음");
//				}
//				
//				// 실적(result) 리스트
//				List<AnchorageMealQtyBean> resultList = item.getResultList();
//				if(resultList != null && resultList.size() > 0) {
//					System.out.println("  - 실적(resultList) 건수: " + resultList.size());
//					for(int j = 0; j < resultList.size(); j++) {
//						AnchorageMealQtyBean result = resultList.get(j);
//						System.out.println("    실적[" + j + "]: 날짜=" + result.getResultMealDate() + ", 시간=" + result.getResultMealTime() + ", 구분=" + result.getResultMealGubun() + ", 부서=" + result.getDepartment() + ", 호선=" + result.getProjNo() + ", 수량=" + result.getResultMealQty());
//					}
//				} else {
//					System.out.println("  - 실적(resultList): 없음");
//				}
//				System.out.println("");
//			}
//			System.out.println("[resultMeal] ==============================================");
//		} else {
//			System.out.println("[resultMeal] anchList가 비어있습니다.");
//		}
//		
		System.out.println("========== resultMeal() 함수 종료 ==========");
		return resultMap;
	}
	
	@Override
	public Map<String, Object> getMealResultList(HttpServletRequest request, AnchorageMealRequestBean bean) throws Exception {
		Map<String, Object> resultMap = new HashMap<String, Object>();
		List<AnchorageMealRequestBean> anchList = crewDao.getMealResultList(bean);
		resultMap.put(Const.LIST_CNT, crewDao.getAnchorageMealListCnt());

		//계획
		if(anchList != null) {				
			for(int i = 0; i < anchList.size(); i++) {
				anchList.get(i).setPlanList(crewDao.getMealResultPlanQtyList(anchList.get(i).getUid()));
				System.out.println("getUid :"+ anchList.get(i).getUid());
				System.out.println("setPlanList:"+ anchList.get(i).getPlanList().size());
			}
			System.out.println("setPlanList :"+ anchList.size());
		}
		//실적 - 조회기간 전체에 대한 실적을 한번에 조회
		if(anchList != null) {
			// 조회기간 전체에 대한 실적을 한번에 조회
			AnchorageMealQtyBean allResultQty = new AnchorageMealQtyBean();
			allResultQty.setProjNo(bean.getShip() != null && !bean.getShip().isEmpty() && !bean.getShip().equals("ALL") ? bean.getShip() : null);
			allResultQty.setInDate(bean.getInDate());
			allResultQty.setOutDate(bean.getOutDate());
			List<AnchorageMealQtyBean> allResultList = crewDao.getMealResultQtyList(allResultQty);
			
			// 각 항목별로 부서, 날짜에 맞는 실적 필터링
			for(int z = 0; z < anchList.size(); z++) {
				AnchorageMealRequestBean item = anchList.get(z);
				List<AnchorageMealQtyBean> filteredResultList = new ArrayList<AnchorageMealQtyBean>();
				
				if(allResultList != null) {
					for(AnchorageMealQtyBean result : allResultList) {
						// 부서, 날짜, 호선이 일치하는 실적만 추가
						boolean deptMatch = (item.getDepartment() == null && result.getDepartment() == null) ||
										   (item.getDepartment() != null && item.getDepartment().equals(result.getDepartment()));
						String itemDate = item.getMealDate() != null ? item.getMealDate().substring(0, Math.min(10, item.getMealDate().length())) : null;
						String resultDate = result.getResultMealDate() != null && result.getResultMealDate().length() >= 10 ? result.getResultMealDate().substring(0, 10) : result.getResultMealDate();
						boolean dateMatch = (itemDate == null && resultDate == null) ||
										   (itemDate != null && resultDate != null && itemDate.equals(resultDate));
						boolean projMatch = (item.getProjNo() == null && result.getProjNo() == null) ||
										   (item.getProjNo() != null && item.getProjNo().equals(result.getProjNo()));
						
						if(deptMatch && dateMatch && projMatch) {
							filteredResultList.add(result);
						}
					}
				}
				anchList.get(z).setResultList(filteredResultList);
			}
			System.out.println("setResultList"+ anchList.size());
		}

		// 전체 실적 리스트를 조회하여 전달
		AnchorageMealQtyBean allResultQtyForInclude = new AnchorageMealQtyBean();
		allResultQtyForInclude.setProjNo(bean.getShip() != null && !bean.getShip().isEmpty() && !bean.getShip().equals("ALL") ? bean.getShip() : null);
		allResultQtyForInclude.setInDate(bean.getInDate());
		allResultQtyForInclude.setOutDate(bean.getOutDate());
		List<AnchorageMealQtyBean> allResultListForInclude = crewDao.getMealResultQtyList(allResultQtyForInclude);
		anchList = ensureResultOnlyDepartmentsIncluded(anchList, bean, allResultListForInclude);

		resultMap.put(Const.LIST, anchList);
		List<String> departmentList = crewDao.getMealDepartmentList(bean);
		resultMap.put("departmentList", departmentList);
		
		/* 조회조건 : 호선리스트 */
		resultMap.put(Const.LIST + "Ship", crewDao.getAnchShipList());
		return resultMap;
	}
	
	private List<AnchorageMealRequestBean> ensureResultOnlyDepartmentsIncluded(List<AnchorageMealRequestBean> anchList, AnchorageMealRequestBean filterBean, List<AnchorageMealQtyBean> allResultList) throws Exception {
		if (anchList == null) {
			anchList = new ArrayList<>();
		}
		
		Map<String, AnchorageMealRequestBean> anchorMap = new LinkedHashMap<>();
		for (AnchorageMealRequestBean item : anchList) {
			String key = buildMealDepartmentKey(item.getProjNo(), item.getDepartment(), item.getMealDate());
			anchorMap.put(key, item);
		}
		
		List<AnchorageMealRequestBean> resultCombos = crewDao.getMealResultDeptCombinations(filterBean);
		if (resultCombos != null) {
			for (AnchorageMealRequestBean combo : resultCombos) {
				String key = buildMealDepartmentKey(combo.getProjNo(), combo.getDepartment(), combo.getMealDate());
				AnchorageMealRequestBean existing = anchorMap.get(key);
				if (existing == null) {
					AnchorageMealRequestBean newBean = new AnchorageMealRequestBean();
					newBean.setProjNo(combo.getProjNo());
					newBean.setDepartment(combo.getDepartment());
					newBean.setMealDate(combo.getMealDate());
					newBean.setPlanList(new ArrayList<AnchorageMealQtyBean>());
					
					// 전체 실적 리스트에서 필터링
					List<AnchorageMealQtyBean> filteredResultListForNew = new ArrayList<AnchorageMealQtyBean>();
					if(allResultList != null) {
						for(AnchorageMealQtyBean result : allResultList) {
							boolean deptMatch = (combo.getDepartment() == null && result.getDepartment() == null) ||
											   (combo.getDepartment() != null && combo.getDepartment().equals(result.getDepartment()));
							String comboDate = combo.getMealDate() != null ? combo.getMealDate().substring(0, Math.min(10, combo.getMealDate().length())) : null;
							String resultDate = result.getResultMealDate() != null && result.getResultMealDate().length() >= 10 ? result.getResultMealDate().substring(0, 10) : result.getResultMealDate();
							boolean dateMatch = (comboDate == null && resultDate == null) ||
											   (comboDate != null && resultDate != null && comboDate.equals(resultDate));
							boolean projMatch = (combo.getProjNo() == null && result.getProjNo() == null) ||
											   (combo.getProjNo() != null && combo.getProjNo().equals(result.getProjNo()));
							
							if(deptMatch && dateMatch && projMatch) {
								filteredResultListForNew.add(result);
							}
						}
					}
					newBean.setResultList(filteredResultListForNew);
					
					anchList.add(newBean);
					anchorMap.put(key, newBean);
				} else if (existing.getResultList() == null || existing.getResultList().isEmpty()) {
					// 전체 실적 리스트에서 필터링
					List<AnchorageMealQtyBean> filteredResultListForExisting = new ArrayList<AnchorageMealQtyBean>();
					if(allResultList != null) {
						for(AnchorageMealQtyBean result : allResultList) {
							boolean deptMatch = (combo.getDepartment() == null && result.getDepartment() == null) ||
											   (combo.getDepartment() != null && combo.getDepartment().equals(result.getDepartment()));
							String comboDate = combo.getMealDate() != null ? combo.getMealDate().substring(0, Math.min(10, combo.getMealDate().length())) : null;
							String resultDate = result.getResultMealDate() != null && result.getResultMealDate().length() >= 10 ? result.getResultMealDate().substring(0, 10) : result.getResultMealDate();
							boolean dateMatch = (comboDate == null && resultDate == null) ||
											   (comboDate != null && resultDate != null && comboDate.equals(resultDate));
							boolean projMatch = (combo.getProjNo() == null && result.getProjNo() == null) ||
											   (combo.getProjNo() != null && combo.getProjNo().equals(result.getProjNo()));
							
							if(deptMatch && dateMatch && projMatch) {
								filteredResultListForExisting.add(result);
							}
						}
					}
					existing.setResultList(filteredResultListForExisting);
				}
			}
		}
		return anchList;
	}
	
	private List<RegistrationCrewRequestBean> ensureResultOnlyDepartmentsIncluded_Crew(List<RegistrationCrewRequestBean> crewList, RegistrationCrewRequestBean filterBean, List<RegistrationCrewQtyBean> allResultList) throws Exception {
		if (crewList == null) {
			crewList = new ArrayList<>();
		}
		
		Map<String, RegistrationCrewRequestBean> crewMap = new LinkedHashMap<>();
		for (RegistrationCrewRequestBean item : crewList) {
			String key = buildMealDepartmentKey(item.getProjNo(), item.getDepartment(), item.getMealDate());
			crewMap.put(key, item);
		}
		
		List<RegistrationCrewRequestBean> resultCombos = crewDao.getCrewResultDeptCombinations(filterBean);
		if (resultCombos != null) {
			for (RegistrationCrewRequestBean combo : resultCombos) {
				String key = buildMealDepartmentKey(combo.getProjNo(), combo.getDepartment(), combo.getMealDate());
				RegistrationCrewRequestBean existing = crewMap.get(key);
				if (existing == null) {
					RegistrationCrewRequestBean newBean = new RegistrationCrewRequestBean();
					newBean.setProjNo(combo.getProjNo());
					newBean.setDepartment(combo.getDepartment());
					newBean.setMealDate(combo.getMealDate());
					newBean.setPlanList(new ArrayList<RegistrationCrewQtyBean>());
					
					// 전체 실적 리스트에서 필터링
					List<RegistrationCrewQtyBean> filteredResultListForNew = new ArrayList<RegistrationCrewQtyBean>();
					if(allResultList != null) {
						for(RegistrationCrewQtyBean result : allResultList) {
							boolean deptMatch = (combo.getDepartment() == null && result.getDepartment() == null) ||
											   (combo.getDepartment() != null && combo.getDepartment().equals(result.getDepartment()));
							String comboDate = combo.getMealDate() != null ? combo.getMealDate().substring(0, Math.min(10, combo.getMealDate().length())) : null;
							String resultDate = result.getResultMealDate() != null && result.getResultMealDate().length() >= 10 ? result.getResultMealDate().substring(0, 10) : result.getResultMealDate();
							boolean dateMatch = (comboDate == null && resultDate == null) ||
											   (comboDate != null && resultDate != null && comboDate.equals(resultDate));
							boolean projMatch = (combo.getProjNo() == null && result.getProjNo() == null) ||
											   (combo.getProjNo() != null && combo.getProjNo().equals(result.getProjNo()));
							
							if(deptMatch && dateMatch && projMatch) {
								filteredResultListForNew.add(result);
							}
						}
					}
					newBean.setResultList(filteredResultListForNew);
					
					crewList.add(newBean);
					crewMap.put(key, newBean);
				} else if (existing.getResultList() == null || existing.getResultList().isEmpty()) {
					// 전체 실적 리스트에서 필터링
					List<RegistrationCrewQtyBean> filteredResultListForExisting = new ArrayList<RegistrationCrewQtyBean>();
					if(allResultList != null) {
						for(RegistrationCrewQtyBean result : allResultList) {
							boolean deptMatch = (combo.getDepartment() == null && result.getDepartment() == null) ||
											   (combo.getDepartment() != null && combo.getDepartment().equals(result.getDepartment()));
							String comboDate = combo.getMealDate() != null ? combo.getMealDate().substring(0, Math.min(10, combo.getMealDate().length())) : null;
							String resultDate = result.getResultMealDate() != null && result.getResultMealDate().length() >= 10 ? result.getResultMealDate().substring(0, 10) : result.getResultMealDate();
							boolean dateMatch = (comboDate == null && resultDate == null) ||
											   (comboDate != null && resultDate != null && comboDate.equals(resultDate));
							boolean projMatch = (combo.getProjNo() == null && result.getProjNo() == null) ||
											   (combo.getProjNo() != null && combo.getProjNo().equals(result.getProjNo()));
							
							if(deptMatch && dateMatch && projMatch) {
								filteredResultListForExisting.add(result);
							}
						}
					}
					existing.setResultList(filteredResultListForExisting);
				}
			}
		}
		return crewList;
	}
	
	private String buildMealDepartmentKey(String projNo, String department, String mealDate) {
		String safeProjNo = projNo == null ? "" : projNo.trim();
		String safeDept = department == null ? "" : department.trim();
		String safeDate = mealDate == null ? "" : mealDate.trim();
		return safeProjNo + "|" + safeDept + "|" + safeDate;
	}
	
	@Transactional(rollbackFor = Exception.class)
	@Override
	public Map<String, Object> roomAssignmentUpload(HttpServletRequest request, HttpServletResponse response, 
			MultipartFile file, int schedulerInfoUid, String trialKey, String projNo) throws Exception {
		
		if(schedulerInfoUid <= 0) {
			throw new IllegalArgumentException("스케줄번호를 선택해주세요.");
		}

		UserInfoBean userInfo = (UserInfoBean)(request.getSession().getAttribute(Const.SS_USERINFO));
		int userUid = userInfo.getUid();
		String username = safeConcat(userInfo.getFirstName(), userInfo.getLastName());

		SchedulerInfoBean schedulerBean = dao.getScheduler(schedulerInfoUid);
		if(schedulerBean == null) {
			throw new IllegalArgumentException("선택한 스케줄 정보를 찾을 수 없습니다.");
		}

		String normalizedTrialKey = sanitize(trialKey);
		if(isEmpty(normalizedTrialKey)) {
			normalizedTrialKey = sanitize(schedulerBean.getTrialKey());
		}
		if(isEmpty(normalizedTrialKey)) {
			throw new IllegalArgumentException("선택한 스케줄의 Trial Key 정보를 확인해주세요.");
		}

		String normalizedProjNo = sanitize(projNo);
		if(isEmpty(normalizedProjNo)) {
			normalizedProjNo = extractProjNo(normalizedTrialKey);
		}
		if(isEmpty(normalizedProjNo)) {
			normalizedProjNo = sanitize(schedulerBean.getHullnum());
		}
		if(isEmpty(normalizedProjNo)) {
			throw new IllegalArgumentException("선택한 스케줄의 호선 정보를 확인해주세요.");
		}

		Map<String, Integer> phoneUidMap = buildPhoneUidMap(schedulerInfoUid);
		if(phoneUidMap.isEmpty()) {
			throw new IllegalArgumentException("선택한 스케줄에 등록된 승선자 정보를 찾을 수 없습니다.");
		}

		File tempFile = null;
		String path = null;
		XSSFWorkbook workbook = null;
		try {
			if(isDrmFile(file)) {
				path = DRMUtil.getDecodingExcel(file);
				if(path == null || path.startsWith("ERROR")) {
					throw new IllegalArgumentException("DRM 파일 해제에 실패했습니다.");
				}
						} else {
				tempFile = File.createTempFile("room_assignment_", ".xlsx");
				file.transferTo(tempFile);
				path = tempFile.getAbsolutePath();
			}

			workbook = new XSSFWorkbook(new FileInputStream(path));

			crewDao.deleteMobileRoomInfoBySchedulerInfoUid(schedulerInfoUid);
			crewDao.deleteMobileRoomUserlistBySchedulerInfoUid(schedulerInfoUid);

			processRoomInfoSheet(workbook, normalizedProjNo, schedulerInfoUid, normalizedTrialKey, username);
			processRoomUserListSheet(workbook, normalizedProjNo, schedulerInfoUid, normalizedTrialKey, username, phoneUidMap);

			Map<String, Object> resultMap = new HashMap<String, Object>();
			resultMap.put(Const.RESULT, DBConst.SUCCESS);
			resultMap.put("msg", "방배정 데이터가 업로드되었습니다.");
				return resultMap;
		} finally {
			if(workbook != null) {
				try { workbook.close(); } catch(Exception ignore) {}
			}
			if(tempFile != null && tempFile.exists()) {
					tempFile.delete();
				}
			if(path != null) {
				File decodedFile = new File(path);
				if((tempFile == null || !path.equals(tempFile.getAbsolutePath())) && decodedFile.exists()) {
					decodedFile.delete();
				}
			}
		}
	}
	
	@Override
	public void downRoomAssignmentExcel(HttpServletResponse response, int schedulerInfoUid) throws Exception {
		XSSFWorkbook wb = null;
		java.io.ByteArrayOutputStream baos = null;
		
		try {
			// 데이터 조회
			List<com.ssshi.ddms.dto.MobileRoomInfoBean> roomInfoList = crewDao.getMobileRoomInfoList(schedulerInfoUid);
			List<com.ssshi.ddms.dto.MobileRoomUserlistBean> userlist = crewDao.getMobileRoomUserlist(schedulerInfoUid);
			
			// 엑셀 파일 생성
			wb = new XSSFWorkbook();
			
			// 스타일 정의
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
			
			// 날짜 스타일
			CreationHelper creationHelper = wb.getCreationHelper();
			CellStyle dateStyle = wb.createCellStyle();
			dateStyle.cloneStyleFrom(bodyStyle);
			short dateFormat = creationHelper.createDataFormat().getFormat("yyyy-MM-dd");
			dateStyle.setDataFormat(dateFormat);
			
			// Step 1: 첫번째 탭 - 필수)방배정명단
			Sheet sheetUserlist = wb.createSheet("필수)방배정명단");
			sheetUserlist.setColumnWidth(0, 3500); // 호선
			sheetUserlist.setColumnWidth(1, 4000); // 스케줄넘버
			sheetUserlist.setColumnWidth(2, 3000); // 방번호
			sheetUserlist.setColumnWidth(3, 3500); // 부서
			sheetUserlist.setColumnWidth(4, 3000); // 이름
			sheetUserlist.setColumnWidth(5, 3500); // 휴대폰번호
			sheetUserlist.setColumnWidth(6, 3000); // USER_UID
			sheetUserlist.setColumnWidth(7, 3500); // 입실일
			sheetUserlist.setColumnWidth(8, 3500); // 퇴실일
			
			int rowNo = 0;
			int cellIdx = 0;
			
			// 헤더
			Row headerRow = sheetUserlist.createRow(rowNo++);
			cellIdx = 0;
			Cell headerCell = headerRow.createCell(cellIdx++);
			headerCell.setCellStyle(headStyle);
			headerCell.setCellValue("호선");
			headerCell = headerRow.createCell(cellIdx++);
			headerCell.setCellStyle(headStyle);
			headerCell.setCellValue("스케줄넘버");
			headerCell = headerRow.createCell(cellIdx++);
			headerCell.setCellStyle(headStyle);
			headerCell.setCellValue("방번호");
			headerCell = headerRow.createCell(cellIdx++);
			headerCell.setCellStyle(headStyle);
			headerCell.setCellValue("부서");
			headerCell = headerRow.createCell(cellIdx++);
			headerCell.setCellStyle(headStyle);
			headerCell.setCellValue("이름");
			headerCell = headerRow.createCell(cellIdx++);
			headerCell.setCellStyle(headStyle);
			headerCell.setCellValue("휴대폰번호");
			headerCell = headerRow.createCell(cellIdx++);
			headerCell.setCellStyle(headStyle);
			headerCell.setCellValue("USER_UID");
			headerCell = headerRow.createCell(cellIdx++);
			headerCell.setCellStyle(headStyle);
			headerCell.setCellValue("방사용시작일");
			headerCell = headerRow.createCell(cellIdx++);
			headerCell.setCellStyle(headStyle);
			headerCell.setCellValue("방사용종료일");
			
			// 데이터 행
			if(userlist != null) {
				for(com.ssshi.ddms.dto.MobileRoomUserlistBean bean : userlist) {
					Row row = sheetUserlist.createRow(rowNo++);
					cellIdx = 0;
					
					Cell cell = row.createCell(cellIdx++);
					cell.setCellStyle(bodyStyle);
					cell.setCellValue(bean.getProjNo() != null ? bean.getProjNo() : "");
					
					cell = row.createCell(cellIdx++);
					cell.setCellStyle(bodyStyle);
					cell.setCellValue(bean.getTrialKey() != null ? bean.getTrialKey() : "");
					
					cell = row.createCell(cellIdx++);
					cell.setCellStyle(bodyCenterStyle);
					cell.setCellValue(bean.getRoomNo() != null ? bean.getRoomNo() : "");
					
					cell = row.createCell(cellIdx++);
					cell.setCellStyle(bodyStyle);
					cell.setCellValue(bean.getDepartment() != null ? bean.getDepartment() : "");
					
					cell = row.createCell(cellIdx++);
					cell.setCellStyle(bodyStyle);
					cell.setCellValue(bean.getName() != null ? bean.getName() : "");
					
					cell = row.createCell(cellIdx++);
					cell.setCellStyle(bodyCenterStyle);
					cell.setCellValue(bean.getPhone() != null ? bean.getPhone() : "");
					
					cell = row.createCell(cellIdx++);
					cell.setCellStyle(bodyCenterStyle);
					if(bean.getUserUid() != null && bean.getUserUid() > 0) {
						cell.setCellType(Cell.CELL_TYPE_NUMERIC);
						cell.setCellValue(bean.getUserUid());
					} else {
						cell.setCellValue("");
					}
					
					cell = row.createCell(cellIdx++);
					cell.setCellStyle(dateStyle);
					if(bean.getCheckInDate() != null && !bean.getCheckInDate().isEmpty()) {
						try {
							java.text.SimpleDateFormat sdf = new java.text.SimpleDateFormat("yyyy-MM-dd");
							java.util.Date date = sdf.parse(bean.getCheckInDate());
							cell.setCellValue(date);
						} catch(Exception e) {
							cell.setCellValue(bean.getCheckInDate());
						}
					}
					
					cell = row.createCell(cellIdx++);
					cell.setCellStyle(dateStyle);
					if(bean.getCheckOutDate() != null && !bean.getCheckOutDate().isEmpty()) {
						try {
							java.text.SimpleDateFormat sdf = new java.text.SimpleDateFormat("yyyy-MM-dd");
							java.util.Date date = sdf.parse(bean.getCheckOutDate());
							cell.setCellValue(date);
						} catch(Exception e) {
							cell.setCellValue(bean.getCheckOutDate());
						}
					}
				}
			}
			
			// Step 2: 두번째 탭 - 필수)방정보
			Sheet sheetRoomInfo = wb.createSheet("필수)방정보");
			sheetRoomInfo.setColumnWidth(0, 3500); // 호선
			sheetRoomInfo.setColumnWidth(1, 4000); // 스케줄넘버
			sheetRoomInfo.setColumnWidth(2, 2500); // DECK
			sheetRoomInfo.setColumnWidth(3, 3000); // ROOM_NO
			sheetRoomInfo.setColumnWidth(4, 4000); // ROOM_NAME
			sheetRoomInfo.setColumnWidth(5, 3500); // TEL
			sheetRoomInfo.setColumnWidth(6, 3000); // 크기
			sheetRoomInfo.setColumnWidth(7, 3000); // 침대수
			sheetRoomInfo.setColumnWidth(8, 3000); // 화장실
			
			rowNo = 0;
			cellIdx = 0;
			
			// 헤더
			headerRow = sheetRoomInfo.createRow(rowNo++);
			cellIdx = 0;
			headerCell = headerRow.createCell(cellIdx++);
			headerCell.setCellStyle(headStyle);
			headerCell.setCellValue("호선");
			headerCell = headerRow.createCell(cellIdx++);
			headerCell.setCellStyle(headStyle);
			headerCell.setCellValue("스케줄넘버");
			headerCell = headerRow.createCell(cellIdx++);
			headerCell.setCellStyle(headStyle);
			headerCell.setCellValue("DECK");
			headerCell = headerRow.createCell(cellIdx++);
			headerCell.setCellStyle(headStyle);
			headerCell.setCellValue("ROOM_NO");
			headerCell = headerRow.createCell(cellIdx++);
			headerCell.setCellStyle(headStyle);
			headerCell.setCellValue("ROOM_NAME");
			headerCell = headerRow.createCell(cellIdx++);
			headerCell.setCellStyle(headStyle);
			headerCell.setCellValue("TEL");
			headerCell = headerRow.createCell(cellIdx++);
			headerCell.setCellStyle(headStyle);
			headerCell.setCellValue("크기");
			headerCell = headerRow.createCell(cellIdx++);
			headerCell.setCellStyle(headStyle);
			headerCell.setCellValue("침대수");
			headerCell = headerRow.createCell(cellIdx++);
			headerCell.setCellStyle(headStyle);
			headerCell.setCellValue("화장실");
			
			// 데이터 행
			if(roomInfoList != null) {
				for(com.ssshi.ddms.dto.MobileRoomInfoBean bean : roomInfoList) {
					Row row = sheetRoomInfo.createRow(rowNo++);
					cellIdx = 0;
					
					Cell cell = row.createCell(cellIdx++);
					cell.setCellStyle(bodyStyle);
					cell.setCellValue(bean.getProjNo() != null ? bean.getProjNo() : "");
					
					cell = row.createCell(cellIdx++);
					cell.setCellStyle(bodyStyle);
					cell.setCellValue(bean.getTrialKey() != null ? bean.getTrialKey() : "");
					
					cell = row.createCell(cellIdx++);
					cell.setCellStyle(bodyCenterStyle);
					cell.setCellValue(bean.getDeck() != null ? bean.getDeck() : "");
					
					cell = row.createCell(cellIdx++);
					cell.setCellStyle(bodyCenterStyle);
					cell.setCellValue(bean.getRoomNo() != null ? bean.getRoomNo() : "");
					
					cell = row.createCell(cellIdx++);
					cell.setCellStyle(bodyStyle);
					cell.setCellValue(bean.getRoomName() != null ? bean.getRoomName() : "");
					
					cell = row.createCell(cellIdx++);
					cell.setCellStyle(bodyCenterStyle);
					cell.setCellValue(bean.getTel() != null ? bean.getTel() : "");
					
					cell = row.createCell(cellIdx++);
					cell.setCellStyle(bodyCenterStyle);
					cell.setCellValue(bean.getSizeM2() != null ? bean.getSizeM2() : "");
					
					cell = row.createCell(cellIdx++);
					cell.setCellStyle(bodyCenterStyle);
					if(bean.getBedCount() != null) {
						cell.setCellType(Cell.CELL_TYPE_NUMERIC);
						cell.setCellValue(bean.getBedCount());
					} else {
						cell.setCellValue("");
					}
					
					cell = row.createCell(cellIdx++);
					cell.setCellStyle(bodyCenterStyle);
					cell.setCellValue(bean.getBathroomYn() != null ? bean.getBathroomYn() : "");
				}
			}
			
			// 엑셀 파일을 메모리에 먼저 작성
			baos = new java.io.ByteArrayOutputStream();
			wb.write(baos);
			baos.flush();
			
			// 파일명 생성 (현재시간 포함)
			java.text.SimpleDateFormat sdf = new java.text.SimpleDateFormat("yyyyMMdd_HHmmss");
			String timestamp = sdf.format(new java.util.Date());
			String fileName = "방배정양식_rev1_" + timestamp + ".xlsx";
			
			// 응답 설정 (엑셀 생성이 완료된 후에만 설정)
			response.setContentType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
			String outputFileName = new String(fileName.getBytes("KSC5601"), "8859_1");
			response.setHeader("Content-Disposition", "attachment; fileName=\"" + outputFileName + "\"");
			response.setContentLength(baos.size());
			
			// 응답 스트림에 쓰기
			baos.writeTo(response.getOutputStream());
			response.getOutputStream().flush();
			
		} catch(Exception e) {
			e.printStackTrace();
			// 예외 발생 시 응답이 커밋되지 않았으면 에러 페이지로 이동 가능
			if(!response.isCommitted()) {
				response.reset();
				throw e;
			} else {
				throw e;
			}
		} finally {
			// 리소스 정리
			if(wb != null) {
				try {
					wb.close();
				} catch(Exception e) {
					e.printStackTrace();
				}
			}
			if(baos != null) {
				try {
					baos.close();
				} catch(Exception e) {
					e.printStackTrace();
				}
			}
		}
	}

	private void processRoomInfoSheet(XSSFWorkbook workbook, String projNo, int schedulerInfoUid, String trialKey, String username) throws Exception {
		if(workbook.getNumberOfSheets() <= 1) {
			throw new IllegalArgumentException("엑셀 2번째 탭(방정보)을 찾을 수 없습니다.");
		}

		Sheet sheet = workbook.getSheetAt(1);
		if(sheet == null) {
			throw new IllegalArgumentException("엑셀 2번째 탭(방정보)을 찾을 수 없습니다.");
		}

		for(int rowIndex = 1; rowIndex <= sheet.getLastRowNum(); rowIndex++) {
			Row row = sheet.getRow(rowIndex);
			if(isRowEmpty(row, 9)) {
				continue;
			}

			String deck = getCellTrim(row, 2);
			String roomNo = getCellTrim(row, 3);

			if(isEmpty(deck) || isEmpty(roomNo)) {
				throw buildRowException(rowIndex, "DECK 또는 ROOM_NO가 비어 있습니다.");
			}

			String roomName = getCellTrim(row, 4);
			String tel = getCellTrim(row, 5);
			String sizeM2Str = getCellTrim(row, 6);
			String bedCountStr = getCellTrim(row, 7);
			String bathroomYnRaw = getCellTrim(row, 8);
			String bathroomYn = mapBathroomYn(bathroomYnRaw);

			com.ssshi.ddms.dto.MobileRoomInfoBean roomBean = new com.ssshi.ddms.dto.MobileRoomInfoBean();
			roomBean.setProjNo(projNo);
			roomBean.setSchedulerInfoUid(Integer.valueOf(schedulerInfoUid));
			roomBean.setTrialKey(trialKey);
			roomBean.setDeck(deck);
			roomBean.setRoomNo(roomNo);
			roomBean.setRoomName(isEmpty(roomName) ? null : roomName);
			roomBean.setTel(isEmpty(tel) ? null : tel);

			if(!isEmpty(sizeM2Str) && sizeM2Str.length() > 200) {
				throw buildRowException(rowIndex, "면적(크기) 값이 너무 깁니다.(최대 200자)");
			}
			roomBean.setSizeM2(isEmpty(sizeM2Str) ? null : sizeM2Str);

			if(!isEmpty(bedCountStr)) {
				try {
					roomBean.setBedCount(Integer.parseInt(bedCountStr));
				} catch(NumberFormatException ex) {
					throw buildRowException(rowIndex, "침대수 값이 올바르지 않습니다.");
				}
			}

			roomBean.setBathroomYn(bathroomYn);
			roomBean.setStatus("AVAILABLE");
			roomBean.setDelYn("N");
			roomBean.setRegUsername(username);
			roomBean.setUpdateUsername(username);

			crewDao.insertMobileRoomInfo(roomBean);
		}
	}

	private void processRoomUserListSheet(XSSFWorkbook workbook, String projNo, int schedulerInfoUid, String trialKey,
			String username, Map<String, Integer> phoneUidMap) throws Exception {

		if(workbook.getNumberOfSheets() == 0) {
			throw new IllegalArgumentException("엑셀 1번째 탭(방배정명단)을 찾을 수 없습니다.");
		}

		Sheet sheet = workbook.getSheetAt(0);
		if(sheet == null) {
			throw new IllegalArgumentException("엑셀 1번째 탭(방배정명단)을 찾을 수 없습니다.");
		}

		for(int rowIndex = 1; rowIndex <= sheet.getLastRowNum(); rowIndex++) {
			Row row = sheet.getRow(rowIndex);
			if(isRowEmpty(row, 9)) {
				continue;
			}

			String roomNo = getCellTrim(row, 2);
			String name = getCellTrim(row, 4);

			if(isEmpty(roomNo) || isEmpty(name)) {
				throw buildRowException(rowIndex, "ROOM_NO 또는 NAME이 비어 있습니다.");
			}

			String department = getCellTrim(row, 3);
			String phone = getCellTrim(row, 5);
			if(isEmpty(phone)) {
				throw buildRowException(rowIndex, "휴대폰 번호가 비어 있습니다.");
			}

			String normalizedPhone = normalizePhone(phone);
			Integer matchedUid = phoneUidMap.get(normalizedPhone);
			if(matchedUid == null) {
				throw buildRowException(rowIndex, "휴대폰 번호와 일치하는 승선자를 찾을 수 없습니다.");
			}

			String checkInDate = convertExcelDate(ExcelUtil.getCellValue(row != null ? row.getCell(7) : null));
			String checkOutDate = convertExcelDate(ExcelUtil.getCellValue(row != null ? row.getCell(8) : null));

			com.ssshi.ddms.dto.MobileRoomUserlistBean userlistBean = new com.ssshi.ddms.dto.MobileRoomUserlistBean();
			userlistBean.setProjNo(projNo);
			userlistBean.setSchedulerInfoUid(Integer.valueOf(schedulerInfoUid));
			userlistBean.setTrialKey(trialKey);
			userlistBean.setRoomNo(roomNo);
			userlistBean.setDepartment(isEmpty(department) ? null : department);
			userlistBean.setName(name);
			userlistBean.setPhone(phone);
			userlistBean.setUserUid(matchedUid);
			userlistBean.setCheckInDate(checkInDate);
			userlistBean.setCheckOutDate(checkOutDate);
			userlistBean.setStatus("CHECKED_IN");
			userlistBean.setDelYn("N");
			userlistBean.setRegUsername(username);
			userlistBean.setUpdateUsername(username);

			crewDao.insertMobileRoomUserlist(userlistBean);
		}
	}

	private Map<String, Integer> buildPhoneUidMap(int schedulerInfoUid) throws Exception {
		List<ScheCrewBean> crewList = dao.getCrewList(schedulerInfoUid);
		Map<String, Integer> map = new HashMap<String, Integer>();
		if(crewList != null) {
			for(ScheCrewBean crew : crewList) {
				String normalizedPhone = normalizePhone(crew.getPhone());
				if(!isEmpty(normalizedPhone) && !map.containsKey(normalizedPhone)) {
					map.put(normalizedPhone, crew.getUid());
				}
			}
		}
		return map;
	}

	private boolean isDrmFile(MultipartFile file) {
		String fileName = file.getOriginalFilename();
		String lowerName = fileName != null ? fileName.toLowerCase() : "";
		if(lowerName.contains("drm")) {
			return true;
		}
		String contentType = file.getContentType();
		return contentType != null && contentType.toLowerCase().contains("drm");
	}

	private String extractProjNo(String value) {
		if(isEmpty(value)) {
			return "";
		}
		return value.substring(0, Math.min(6, value.length()));
	}

	private String sanitize(String value) {
		return value == null ? "" : value.trim();
	}

	private boolean isEmpty(String value) {
		return value == null || value.trim().isEmpty();
	}

	private String safeConcat(String first, String last) {
		return sanitize(first) + sanitize(last);
	}

	private String getCellTrim(Row row, int index) {
		if(row == null || index < 0) {
			return "";
		}
		Object value = ExcelUtil.getCellValue(row.getCell(index));
		return value == null ? "" : value.toString().trim();
	}

	private boolean isRowEmpty(Row row, int maxColumn) {
		if(row == null) {
			return true;
		}
		int lastColumn = Math.min(maxColumn, Math.max(row.getLastCellNum(), maxColumn));
		for(int i = 0; i < lastColumn; i++) {
			if(!isEmpty(getCellTrim(row, i))) {
				return false;
			}
		}
		return true;
	}

	private String mapBathroomYn(String rawValue) {
		if(isEmpty(rawValue)) {
			return null;
		}
		String upper = rawValue.toUpperCase();
		if(upper.contains("있음") || "O".equals(upper) || "Y".equals(upper)) {
			return "Y";
		}
		if(upper.contains("없음") || "X".equals(upper) || "N".equals(upper)) {
			return "N";
		}
		return upper.length() <= 20 ? upper : upper.substring(0, 20);
	}

	private String convertExcelDate(Object cellValue) {
		if(cellValue == null) {
			return null;
		}
		if(cellValue instanceof java.util.Date) {
			java.text.SimpleDateFormat sdf = new java.text.SimpleDateFormat("yyyy-MM-dd");
			return sdf.format((java.util.Date)cellValue);
		}
		String value = cellValue.toString().trim();
		if(value.isEmpty()) {
			return null;
		}
		String converted = com.ssshi.ddms.util.CommonUtil.excelDateStringFormatDate(value);
		if(converted != null && converted.matches("\\d{4}-\\d{2}-\\d{2}")) {
			return converted;
		}
		return null;
	}

	private String normalizePhone(String phone) {
		if(isEmpty(phone)) {
			return "";
		}
		String digits = phone.replaceAll("[^0-9]", "");
		if(digits.startsWith("82") && digits.length() > 2) {
			digits = "0" + digits.substring(2);
		}
		return digits;
	}

	private IllegalArgumentException buildRowException(int rowIndex, String message) {
		return new IllegalArgumentException("엑셀 " + (rowIndex + 1) + "행 데이터를 다시 확인해 주세요. (" + message + ")");
	}

	private List<RegistrationCrewBean> filterCrewListByPeriod(List<RegistrationCrewBean> crewList, String from, String to) throws Exception {
		if(crewList == null || crewList.isEmpty() || (isEmpty(from) && isEmpty(to))) {
			return crewList;
		}
		
		List<RegistrationCrewBean> filteredList = new ArrayList<RegistrationCrewBean>();
		
		for(int i = 0; i < crewList.size(); i++) {
			RegistrationCrewBean crew = crewList.get(i);
			String crewInDate = null;
			String crewOutDate = null;
			
			if(crew.getInOutList() != null) {
				for(int j = 0; j < crew.getInOutList().size(); j++) {
					ScheCrewInOutBean inOut = crew.getInOutList().get(j);
					
					if(DBConst.SCHE_CREW_INOUT_IN.equals(inOut.getSchedulerInOut())) {
						crewInDate = trimToDate(inOut.getInOutDate());
					}else if(DBConst.SCHE_CREW_INOUT_OUT.equals(inOut.getSchedulerInOut())) {
						crewOutDate = trimToDate(inOut.getInOutDate());
					}
				}
			}
			
			if(isCrewWithinRange(crewInDate, crewOutDate, from, to)) {
				filteredList.add(crew);
			}
		}
		
		return filteredList;
	}
	
	private boolean isCrewWithinRange(String crewIn, String crewOut, String from, String to) {
		String rangeStart = isEmpty(from) ? "0000-00-00" : from;
		String rangeEnd = isEmpty(to) ? "9999-12-31" : to;
		
		String start = isEmpty(crewIn) ? "0000-00-00" : crewIn;
		String end = isEmpty(crewOut) ? "9999-12-31" : crewOut;
		
		return start.compareTo(rangeEnd) <= 0 && end.compareTo(rangeStart) >= 0;
	}
	
	private String trimToDate(String value) {
		if(isEmpty(value)) {
			return value;
		}
		
		return value.length() >= 10 ? value.substring(0, 10) : value;
	}
	
	@Override
	public Map<String, Object> crewQRSend(HttpServletRequest request, List<SmsRequestBean> smsList) throws Exception {
		Map<String, Object> resultMap = new HashMap<String, Object>();
		
		// SMS API URL
		String apiUrl = "http://pse.iptime.org:7090/scp_mapi/mobileAppAPI/smsSendMessage";
		
		if(smsList == null || smsList.isEmpty()) {
			resultMap.put(Const.RESULT, DBConst.FAIL);
			resultMap.put("msg", "발송할 데이터가 없습니다.");
			return resultMap;
		}
		
		// 유효한 SMS 목록 필터링
		java.util.List<SmsRequestBean> validSmsList = new ArrayList<SmsRequestBean>();
		for(int i = 0; i < smsList.size(); i++) {
			SmsRequestBean sms = smsList.get(i);
			
			if(sms == null || sms.getReceiver() == null || sms.getReceiver().trim().isEmpty() 
				|| sms.getContent() == null || sms.getContent().trim().isEmpty()) {
				continue;
			}
			
			// qrType 기본값 설정
			if(sms.getQrType() == null || sms.getQrType().trim().isEmpty()) {
				sms.setQrType("SCH");
			}
			
			validSmsList.add(sms);
		}
		
		int validCount = validSmsList.size();
		
		if(validCount == 0) {
			resultMap.put(Const.RESULT, DBConst.FAIL);
			resultMap.put("msg", "발송할 유효한 데이터가 없습니다.");
			return resultMap;
		}
		
		// 각 항목을 하나씩 개별 호출
		int successCount = 0;
		int failCount = 0;
		int lastResponseCode = 0;
		String lastErrorMsg = "";
		
		for(int i = 0; i < validSmsList.size(); i++) {
			SmsRequestBean sms = validSmsList.get(i);
			
			// 단일 객체 JSON 생성
			String jsonBody;
			try {
				com.google.gson.Gson gson = new com.google.gson.Gson();
				jsonBody = gson.toJson(sms);
			} catch (Exception e) {
				// Gson이 없을 경우 수동 생성
				String qrType = sms.getQrType() != null ? sms.getQrType() : "SCH";
				jsonBody = "{\"qrType\":\"" + escapeJson(qrType) + "\",\"receiver\":\"" 
					+ escapeJson(sms.getReceiver()) + "\",\"content\":\"" 
					+ escapeJson(sms.getContent()) + "\"}";
			}
			
			try {
				java.net.URL url = new java.net.URL(apiUrl);
				java.net.HttpURLConnection conn = (java.net.HttpURLConnection) url.openConnection();
				
				// POST 요청 설정
				conn.setRequestMethod("POST");
				conn.setRequestProperty("Content-Type", "application/json; charset=UTF-8");
				conn.setDoOutput(true);
				conn.setConnectTimeout(10000);
				conn.setReadTimeout(10000);
				
				// JSON 단일 객체 데이터 전송
				try (java.io.OutputStream os = conn.getOutputStream()) {
					byte[] input = jsonBody.getBytes("UTF-8");
					os.write(input, 0, input.length);
				}
				
				// 응답 확인
				int responseCode = conn.getResponseCode();
				lastResponseCode = responseCode;
				
				// 응답 읽기
				String responseBody = "";
				try (java.io.BufferedReader br = new java.io.BufferedReader(
						new java.io.InputStreamReader(
							responseCode >= 200 && responseCode < 300 ? conn.getInputStream() : conn.getErrorStream(), "UTF-8"))) {
					StringBuilder response = new StringBuilder();
					String responseLine;
					while ((responseLine = br.readLine()) != null) {
						response.append(responseLine);
					}
					responseBody = response.toString();
				} catch(Exception ex) {
					// 응답 읽기 실패 시 무시
				}
				
				conn.disconnect();
				
				if(responseCode == 200 || responseCode == 201) {
					successCount++;
				} else {
					failCount++;
					// 오류 응답 본문 로깅 (디버깅용 - 서버 로그에만 기록)
					System.err.println("========================================");
					System.err.println("QR SMS API 호출 실패 [" + (i+1) + "/" + validCount + "]: 응답코드=" + responseCode);
					System.err.println("요청 URL: " + apiUrl);
					System.err.println("요청 JSON: " + jsonBody);
					System.err.println("응답 본문: " + responseBody);
					System.err.println("========================================");
					
					lastErrorMsg = "응답코드: " + responseCode;
					if(responseCode == 400) {
						lastErrorMsg += " - 잘못된 요청 형식";
					} else if(responseCode == 404) {
						lastErrorMsg += " - API 경로 없음";
					} else if(responseCode == 500) {
						lastErrorMsg += " - 서버 내부 오류";
					}
				}
			} catch(Exception e) {
				failCount++;
				lastResponseCode = 0;
				lastErrorMsg = "오류: " + e.getMessage();
				System.err.println("QR SMS API 호출 중 예외 발생 [" + (i+1) + "/" + validCount + "]: " + e.getMessage());
				e.printStackTrace();
			}
		}
		
		// 결과 집계
		if(failCount == 0) {
			resultMap.put(Const.RESULT, DBConst.SUCCESS);
			resultMap.put("msg", "QR발송이 완료되었습니다. (발송: " + successCount + "건)");
			resultMap.put("responseCode", 200);
			resultMap.put("successCount", successCount);
			resultMap.put("failCount", 0);
		} else if(successCount > 0) {
			resultMap.put(Const.RESULT, DBConst.SUCCESS);
			resultMap.put("msg", "QR발송 완료. (성공: " + successCount + "건, 실패: " + failCount + "건, 마지막 오류: " + lastErrorMsg + ")");
			resultMap.put("responseCode", lastResponseCode);
			resultMap.put("successCount", successCount);
			resultMap.put("failCount", failCount);
		} else {
			resultMap.put(Const.RESULT, DBConst.FAIL);
			resultMap.put("msg", "QR발송에 실패했습니다. (" + lastErrorMsg + ")");
			resultMap.put("responseCode", lastResponseCode);
			resultMap.put("successCount", 0);
			resultMap.put("failCount", failCount);
		}
		
		return resultMap;
	}
	
	// JSON 문자열 이스케이프 처리
	private String escapeJson(String str) {
		if(str == null) {
			return "";
		}
		return str.replace("\\", "\\\\")
				 .replace("\"", "\\\"")
				 .replace("\n", "\\n")
				 .replace("\r", "\\r")
				 .replace("\t", "\\t");
	}
}
	

