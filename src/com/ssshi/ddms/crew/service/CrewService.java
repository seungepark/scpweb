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
import org.springframework.web.multipart.MultipartFile;

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
import com.ssshi.ddms.util.DRMUtil;

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
	///	Map<String, Object> resultMap = new HashMap<String, Object>();
	
	
	@Override
	public Map<String, Object> anchorageMealRequest(HttpServletRequest request, AnchorageMealRequestBean bean) throws Exception {
		Map<String, Object> resultMap = new HashMap<String, Object>();
		List<AnchorageMealRequestBean> anchList = null;
		
		// schedulerInfoUid가 있으면 해당 스케줄의 승선자 리스트 조회
		if(bean.getSchedulerInfoUid() > 0) {
			anchList = crewDao.getAnchorageMealListBySchedulerInfoUid(bean.getSchedulerInfoUid());
		} else {
			//crewList = crewDao.getRegistrationCrewList(bean);
		}
		
		//anchList = crewDao.getAnchorageMealList(bean);
		//계획
		if(anchList != null) {
			for(int i = 0; i < anchList.size(); i++) {
				anchList.get(i).setPlanList(crewDao.getAnchorageMealPlanQtyList(anchList.get(i).getUid()));
				System.out.println("getUid :"+ anchList.get(i).getUid());
				System.out.println("setPlanList :"+ anchList.get(i).getPlanList().size());
			}
			System.out.println("setPlanList :"+ anchList.size());
		}
		//실적
		if(anchList != null) {
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
	
	@Override
	public Map<String, Object> resultMeal(HttpServletRequest request, AnchorageMealRequestBean bean) throws Exception {
		Map<String, Object> resultMap = new HashMap<String, Object>();
		List<AnchorageMealRequestBean> anchList = crewDao.getMealResultList(bean);
		resultMap.put(Const.LIST_CNT, crewDao.getAnchorageMealListCnt());
		System.out.println("getInDate : "+bean.getInDate());

		//계획
		if(anchList != null) {				
			for(int i = 0; i < anchList.size(); i++) {
				anchList.get(i).setPlanList(crewDao.getMealResultPlanQtyList(anchList.get(i).getUid()));
				System.out.println("getUid1 :"+ anchList.get(i).getUid());
				System.out.println("setPlanList:"+ anchList.get(i).getPlanList().size());
			}
			System.out.println("setPlanList :"+ anchList.size());
		}
		//실적
		if(anchList != null) {
			for(int z = 0; z < anchList.size(); z++) {
				AnchorageMealQtyBean anchResultQty = new AnchorageMealQtyBean();
				anchResultQty.setProjNo(anchList.get(z).getProjNo());
				anchResultQty.setDepartment(anchList.get(z).getDepartment());
				anchResultQty.setMealDate(anchList.get(z).getMealDate());
				anchList.get(z).setResultList(crewDao.getMealResultQtyList(anchResultQty));
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
		//실적
		if(anchList != null) {
			for(int z = 0; z < anchList.size(); z++) {
				AnchorageMealQtyBean anchResultQty = new AnchorageMealQtyBean();
				anchResultQty.setProjNo(anchList.get(z).getProjNo());
				anchResultQty.setDepartment(anchList.get(z).getDepartment());
				anchResultQty.setMealDate(anchList.get(z).getMealDate());
				anchList.get(z).setResultList(crewDao.getMealResultQtyList(anchResultQty));
			}
			System.out.println("setResultList"+ anchList.size());
		}

		resultMap.put(Const.LIST, anchList);
		
		/* 조회조건 : 호선리스트 */
		resultMap.put(Const.LIST + "Ship", crewDao.getAnchShipList());
		return resultMap;
	}
	
	@Override
	public Map<String, Object> roomAssignmentUpload(HttpServletRequest request, HttpServletResponse response, 
			MultipartFile file, int schedulerInfoUid, String trialKey, String projNo) throws Exception {
		Map<String, Object> resultMap = new HashMap<String, Object>();
		int userUid = ((UserInfoBean)(request.getSession().getAttribute(Const.SS_USERINFO))).getUid();
		String username = ((UserInfoBean)(request.getSession().getAttribute(Const.SS_USERINFO))).getFirstName()+ ((UserInfoBean)(request.getSession().getAttribute(Const.SS_USERINFO))).getLastName();
		
		String path = null;
		try {
			// DRM 파일인 경우
			if(file.getOriginalFilename().contains("DRM") || file.getInputStream().toString().contains("Fasoo")) {
				path = DRMUtil.getDecodingExcel(file);
				if(path.startsWith("ERROR")) {
					resultMap.put(Const.RESULT, DBConst.FAIL);
					resultMap.put("msg", "DRM 파일 해제 실패");
					return resultMap;
				}
			} else {
				// 일반 파일인 경우 임시 저장
				java.io.File tempFile = java.io.File.createTempFile("room_assignment_", ".xlsx");
				file.transferTo(tempFile);
				path = tempFile.getAbsolutePath();
			}
			
			// 엑셀 파일 읽기
			XSSFWorkbook workbook = new XSSFWorkbook(new java.io.FileInputStream(path));
			
			// SCHEDULERINFOUID가 동일한 기존 데이터 삭제 (방정보, 방배정명단)
			if(schedulerInfoUid > 0) {
				crewDao.deleteMobileRoomInfoBySchedulerInfoUid(schedulerInfoUid);
				crewDao.deleteMobileRoomUserlistBySchedulerInfoUid(schedulerInfoUid);
			}
			
			// Step 1: 2번째 탭 읽기 (인덱스 1) - 방정보
			Sheet sheetRoomInfo = workbook.getSheetAt(1);
			if(sheetRoomInfo == null) {
				resultMap.put(Const.RESULT, DBConst.FAIL);
				resultMap.put("msg", "2번째 탭(방정보)을 찾을 수 없습니다.");
				workbook.close();
				return resultMap;
			}
			
			int rowNum = 0;
			int roomInfoSuccessCount = 0;
			int roomInfoFailCount = 0;
			StringBuilder errorMsg = new StringBuilder();
			
			// Step 1: 방정보 저장
			for (Row row : sheetRoomInfo) {
				if (rowNum == 0) {
					// 헤더 행 건너뛰기
					rowNum++;
					continue;
				}
				
				try {
					// 셀 값 읽기 (엑셀 양식: 1줄은 헤더, 실제 데이터는 2줄부터)
					// 컬럼 순서: 호선(PROJ_NO), 스케줄넘버(TRIALKEY), DECK, ROOM_NO, ROOM_NAME, TEL, 크기(SIZE_M2), 침대수(BED_COUNT), 화장실(BATHROOM_YN)
					String projNoFromExcel = ExcelUtil.getCellValue(row.getCell(0)) != null ? ExcelUtil.getCellValue(row.getCell(0)).toString().trim() : "";
					String trialKeyFromExcel = ExcelUtil.getCellValue(row.getCell(1)) != null ? ExcelUtil.getCellValue(row.getCell(1)).toString().trim() : "";
					String deck = ExcelUtil.getCellValue(row.getCell(2)) != null ? ExcelUtil.getCellValue(row.getCell(2)).toString().trim() : "";
					String roomNo = ExcelUtil.getCellValue(row.getCell(3)) != null ? ExcelUtil.getCellValue(row.getCell(3)).toString().trim() : "";
					String roomName = ExcelUtil.getCellValue(row.getCell(4)) != null ? ExcelUtil.getCellValue(row.getCell(4)).toString().trim() : "";
					String tel = ExcelUtil.getCellValue(row.getCell(5)) != null ? ExcelUtil.getCellValue(row.getCell(5)).toString().trim() : "";
					String sizeM2Str = ExcelUtil.getCellValue(row.getCell(6)) != null ? ExcelUtil.getCellValue(row.getCell(6)).toString().trim() : "";
					String bedCountStr = ExcelUtil.getCellValue(row.getCell(7)) != null ? ExcelUtil.getCellValue(row.getCell(7)).toString().trim() : "";
					String bathroomYnRaw = ExcelUtil.getCellValue(row.getCell(8)) != null ? ExcelUtil.getCellValue(row.getCell(8)).toString().trim() : "";
					
					// BATHROOM_YN 값 매핑 (varchar(20): Y:있음, N:없음)
					String bathroomYn = null;
					if(!bathroomYnRaw.isEmpty()) {
						// 값 매핑: "있음", "O", "o", "Y", "y" -> "Y", "없음", "X", "x", "N", "n" -> "N"
						String mappedValue = bathroomYnRaw.toUpperCase();
						if(mappedValue.contains("있음") || mappedValue.equals("O") || mappedValue.equals("Y")) {
							bathroomYn = "Y";
						} else if(mappedValue.contains("없음") || mappedValue.equals("X") || mappedValue.equals("N")) {
							bathroomYn = "N";
						} else if(mappedValue.length() <= 20) {
							// 20자 이하면 그대로 사용
							bathroomYn = mappedValue;
						} else {
							// 20자 초과면 첫 20자만 사용
							bathroomYn = mappedValue.substring(0, 20);
						}
					}
					
					// 필수값 체크
					if(deck.isEmpty() || roomNo.isEmpty()) {
						roomInfoFailCount++;
						errorMsg.append("[방정보] 행 ").append(rowNum + 1).append(": DECK 또는 ROOM_NO가 비어있습니다.\n");
						rowNum++;
						continue;
					}
					
					// Bean 생성
					com.ssshi.ddms.dto.MobileRoomInfoBean roomBean = new com.ssshi.ddms.dto.MobileRoomInfoBean();
					// 엑셀에서 읽은 값이 있으면 우선 사용, 없으면 파라미터 값 사용
					roomBean.setProjNo(projNoFromExcel.isEmpty() ? projNo : projNoFromExcel);
					roomBean.setSchedulerInfoUid(schedulerInfoUid > 0 ? schedulerInfoUid : null);
					roomBean.setTrialKey(trialKeyFromExcel.isEmpty() ? trialKey : trialKeyFromExcel);
					roomBean.setDeck(deck);
					roomBean.setRoomNo(roomNo);
					roomBean.setRoomName(roomName.isEmpty() ? null : roomName);
					roomBean.setTel(tel.isEmpty() ? null : tel);
					
					// SIZE_M2 파싱
					if(!sizeM2Str.isEmpty()) {
						try {
							roomBean.setSizeM2(new java.math.BigDecimal(sizeM2Str));
						} catch(Exception e) {
							// 숫자 변환 실패 시 null
							roomBean.setSizeM2(null);
						}
					}
					
					// BED_COUNT 파싱
					if(!bedCountStr.isEmpty()) {
						try {
							roomBean.setBedCount(Integer.parseInt(bedCountStr));
						} catch(Exception e) {
							// 숫자 변환 실패 시 null
							roomBean.setBedCount(null);
						}
					}
					
					roomBean.setBathroomYn(bathroomYn);
					roomBean.setStatus("AVAILABLE"); // 기본값
					roomBean.setDelYn("N");
					roomBean.setRegUsername(username);
					roomBean.setUpdateUsername(username);
					
					// DB 저장
					crewDao.insertMobileRoomInfo(roomBean);
					roomInfoSuccessCount++;
					
				} catch(Exception e) {
					roomInfoFailCount++;
					errorMsg.append("[방정보] 행 ").append(rowNum + 1).append(": ").append(e.getMessage()).append("\n");
					e.printStackTrace();
				}
				
				rowNum++;
			}
			
			// Step 2: 1번째 탭 읽기 (인덱스 0) - 방배정명단
			Sheet sheetUserlist = workbook.getSheetAt(0);
			if(sheetUserlist == null) {
				resultMap.put(Const.RESULT, DBConst.FAIL);
				resultMap.put("msg", "1번째 탭(방배정명단)을 찾을 수 없습니다.");
				workbook.close();
				return resultMap;
			}
			
			rowNum = 0;
			int userlistSuccessCount = 0;
			int userlistFailCount = 0;
			
			for (Row row : sheetUserlist) {
				if (rowNum == 0) {
					// 헤더 행 건너뛰기
					rowNum++;
					continue;
				}
				
				try {
					// 셀 값 읽기 (엑셀 양식: 1줄은 헤더, 실제 데이터는 2줄부터)
					// 컬럼 순서: 호선(PROJ_NO), 스케줄넘버(TRIALKEY), 방번호(ROOM_NO), 부서(DEPARTMENT), 이름(NAME), 휴대폰번호(PHONE), USER_UID, 입실일(CHECK_IN_DATE), 퇴실일(CHECK_OUT_DATE)
					String projNoFromExcel = ExcelUtil.getCellValue(row.getCell(0)) != null ? ExcelUtil.getCellValue(row.getCell(0)).toString().trim() : "";
					String trialKeyFromExcel = ExcelUtil.getCellValue(row.getCell(1)) != null ? ExcelUtil.getCellValue(row.getCell(1)).toString().trim() : "";
					String roomNo = ExcelUtil.getCellValue(row.getCell(2)) != null ? ExcelUtil.getCellValue(row.getCell(2)).toString().trim() : "";
					String department = ExcelUtil.getCellValue(row.getCell(3)) != null ? ExcelUtil.getCellValue(row.getCell(3)).toString().trim() : "";
					String name = ExcelUtil.getCellValue(row.getCell(4)) != null ? ExcelUtil.getCellValue(row.getCell(4)).toString().trim() : "";
					String phone = ExcelUtil.getCellValue(row.getCell(5)) != null ? ExcelUtil.getCellValue(row.getCell(5)).toString().trim() : "";
					Object userUidObj = ExcelUtil.getCellValue(row.getCell(6));
					Object checkInDateObj = ExcelUtil.getCellValue(row.getCell(7));
					Object checkOutDateObj = ExcelUtil.getCellValue(row.getCell(8));
					
					// 필수값 체크
					if(roomNo.isEmpty() || name.isEmpty()) {
						userlistFailCount++;
						errorMsg.append("[방배정명단] 행 ").append(rowNum + 1).append(": ROOM_NO 또는 NAME이 비어있습니다.\n");
						rowNum++;
						continue;
					}
					
					// Bean 생성
					com.ssshi.ddms.dto.MobileRoomUserlistBean userlistBean = new com.ssshi.ddms.dto.MobileRoomUserlistBean();
					// 엑셀에서 읽은 값이 있으면 우선 사용, 없으면 파라미터 값 사용
					userlistBean.setProjNo(projNoFromExcel.isEmpty() ? projNo : projNoFromExcel);
					userlistBean.setSchedulerInfoUid(schedulerInfoUid > 0 ? schedulerInfoUid : null);
					userlistBean.setTrialKey(trialKeyFromExcel.isEmpty() ? trialKey : trialKeyFromExcel);
					userlistBean.setRoomNo(roomNo);
					userlistBean.setDepartment(department.isEmpty() ? null : department);
					userlistBean.setName(name);
					userlistBean.setPhone(phone.isEmpty() ? null : phone);
					
					// USER_UID 처리
					userUid = -1;
					if(userUidObj != null) {
						try {
							if(userUidObj instanceof Number) {
								userUid = ((Number)userUidObj).intValue();
							} else {
								String userUidStr = userUidObj.toString().trim();
								if(!userUidStr.isEmpty()) {
									userUid = Integer.parseInt(userUidStr);
								}
							}
						} catch(Exception e) {
							// 숫자 변환 실패 시 null
							userUid =  -1;
						}
					}
					userlistBean.setUserUid(userUid);
					
					// 날짜 파싱 (YYYY-MM-DD 형식으로 변환)
					String checkInDateStr = null;
					if(checkInDateObj != null && !checkInDateObj.toString().trim().isEmpty()) {
						if(checkInDateObj instanceof java.util.Date) {
							// Date 객체인 경우
							java.text.SimpleDateFormat sdf = new java.text.SimpleDateFormat("yyyy-MM-dd");
							checkInDateStr = sdf.format((java.util.Date)checkInDateObj);
						} else {
							// 문자열인 경우
							String dateStr = checkInDateObj.toString().trim();
							// CommonUtil을 사용하여 날짜 형식 변환
							checkInDateStr = com.ssshi.ddms.util.CommonUtil.excelDateStringFormatDate(dateStr);
							// yyyy-MM-dd 형식이 아니면 null로 설정
							if(!checkInDateStr.matches("\\d{4}-\\d{2}-\\d{2}")) {
								checkInDateStr = null;
							}
						}
					}
					userlistBean.setCheckInDate(checkInDateStr);
					
					String checkOutDateStr = null;
					if(checkOutDateObj != null && !checkOutDateObj.toString().trim().isEmpty()) {
						if(checkOutDateObj instanceof java.util.Date) {
							java.text.SimpleDateFormat sdf = new java.text.SimpleDateFormat("yyyy-MM-dd");
							checkOutDateStr = sdf.format((java.util.Date)checkOutDateObj);
						} else {
							String dateStr = checkOutDateObj.toString().trim();
							checkOutDateStr = com.ssshi.ddms.util.CommonUtil.excelDateStringFormatDate(dateStr);
							if(!checkOutDateStr.matches("\\d{4}-\\d{2}-\\d{2}")) {
								checkOutDateStr = null;
							}
						}
					}
					userlistBean.setCheckOutDate(checkOutDateStr);
					
					userlistBean.setStatus("CHECKED_IN"); // 기본값
					userlistBean.setDelYn("N");
					userlistBean.setRegUsername(username);
					userlistBean.setUpdateUsername(username);
					
					// DB 저장
					crewDao.insertMobileRoomUserlist(userlistBean);
					userlistSuccessCount++;
					
				} catch(Exception e) {
					userlistFailCount++;
					errorMsg.append("[방배정명단] 행 ").append(rowNum + 1).append(": ").append(e.getMessage()).append("\n");
					e.printStackTrace();
				}
				
				rowNum++;
			}
			
			workbook.close();
			
			// 임시 파일 삭제
			if(path != null && !path.contains("DRM")) {
				java.io.File tempFile = new java.io.File(path);
				if(tempFile.exists()) {
					tempFile.delete();
				}
			}
			
			resultMap.put(Const.RESULT, DBConst.SUCCESS);
			resultMap.put("roomInfoSuccessCount", roomInfoSuccessCount);
			resultMap.put("roomInfoFailCount", roomInfoFailCount);
			resultMap.put("userlistSuccessCount", userlistSuccessCount);
			resultMap.put("userlistFailCount", userlistFailCount);
			resultMap.put("successCount", roomInfoSuccessCount + userlistSuccessCount); // 총 성공 건수
			resultMap.put("failCount", roomInfoFailCount + userlistFailCount); // 총 실패 건수
			
			if(errorMsg.length() > 0) {
				resultMap.put("msg", errorMsg.toString());
			}
			
			// 완료 메시지 생성
			String msg = "방정보 " + roomInfoSuccessCount + "건, 방배정인원 " + userlistSuccessCount + "건 업로드가 완료되었습니다.";
			if(roomInfoFailCount > 0 || userlistFailCount > 0) {
				msg += " (방정보 실패: " + roomInfoFailCount + "건, 방배정인원 실패: " + userlistFailCount + "건)";
			}
			resultMap.put("msg", msg);
			
		} catch(Exception e) {
			e.printStackTrace();
			resultMap.put(Const.RESULT, DBConst.FAIL);
			resultMap.put("msg", "업로드 중 오류가 발생했습니다: " + e.getMessage());
		}
		
		return resultMap;
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
					if(bean.getSizeM2() != null) {
						cell.setCellType(Cell.CELL_TYPE_NUMERIC);
						cell.setCellValue(bean.getSizeM2().doubleValue());
					} else {
						cell.setCellValue("");
					}
					
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
}
