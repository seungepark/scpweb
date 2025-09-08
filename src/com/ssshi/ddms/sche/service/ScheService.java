package com.ssshi.ddms.sche.service;

import java.io.File;
import java.util.ArrayList;
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
import org.apache.poi.ss.util.CellRangeAddressList;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.ssshi.ddms.constant.Const;
import com.ssshi.ddms.constant.DBConst;
import com.ssshi.ddms.dto.ParamBean;
import com.ssshi.ddms.dto.ScheCrewBean;
import com.ssshi.ddms.dto.ScheCrewCntBean;
import com.ssshi.ddms.dto.ScheCrewInOutBean;
import com.ssshi.ddms.dto.ScheCrewListBean;
import com.ssshi.ddms.dto.ScheDateTimeBean;
import com.ssshi.ddms.dto.ScheMailBean;
import com.ssshi.ddms.dto.ScheMailLogBean;
import com.ssshi.ddms.dto.ScheReportCompBean;
import com.ssshi.ddms.dto.ScheReportDailyBean;
import com.ssshi.ddms.dto.ScheReportDepartureBean;
import com.ssshi.ddms.dto.ScheTcNoteBean;
import com.ssshi.ddms.dto.ScheTcNoteFileInfoBean;
import com.ssshi.ddms.dto.ScheTcNoteTcInfoBean;
import com.ssshi.ddms.dto.ScheTrialInfoBean;
import com.ssshi.ddms.dto.ScheduleBean;
import com.ssshi.ddms.dto.ScheduleCodeDetailBean;
import com.ssshi.ddms.dto.SchedulerDetailInfoBean;
import com.ssshi.ddms.dto.SchedulerInfoBean;
import com.ssshi.ddms.dto.SchedulerVersionInfoBean;
import com.ssshi.ddms.dto.ShipCondBean;
import com.ssshi.ddms.dto.UserInfoBean;
import com.ssshi.ddms.mybatis.dao.DbDaoI;
import com.ssshi.ddms.mybatis.dao.ManagerDaoI;
import com.ssshi.ddms.mybatis.dao.RevDaoI;
import com.ssshi.ddms.mybatis.dao.ScheDaoI;
import com.ssshi.ddms.mybatis.dao.SystemDaoI;
import com.ssshi.ddms.util.CommonUtil;
import com.ssshi.ddms.util.ExcelUtil;
import com.ssshi.ddms.util.FileUtil;
import com.ssshi.ddms.util.SmtpUtil;
import com.ssshi.ddms.util.ValidUtil;

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

@Service
public class ScheService implements ScheServiceI {

	@Autowired
	private ScheDaoI dao;
	
	@Autowired
	private ManagerDaoI mngDao;
	
	@Autowired
	private SystemDaoI sysDao;
	
	@Autowired
	private DbDaoI dbDao;
	
	@Autowired
	private RevDaoI revDao;
	
	// ManagerServiceI.getSchedulerDepartureList
	@Override
	public Map<String, Object> getScheList(SchedulerInfoBean bean) throws Exception {
		Map<String, Object> resultMap = new HashMap<String, Object>();
		bean.setStart(CommonUtil.getListStart(bean.getPage()));
		bean.setLimit(CommonUtil.LIST_LIMIT);

		resultMap.put(Const.LIST, dao.getScheList(bean));
		resultMap.put(Const.LIST_CNT, dao.getScheListCnt());

		return resultMap;
	}

	@Override
	public Map<String, Object> scheChart(HttpServletRequest request, ParamBean bean) throws Exception {
		Map<String, Object> resultMap = new HashMap<String, Object>();
		ParamBean userBean = new ParamBean();
		userBean.setUid(((UserInfoBean)(request.getSession().getAttribute(Const.SS_USERINFO))).getUid());

		resultMap.put(Const.BEAN, dao.getScheduler(bean.getUid()));
		resultMap.put(Const.LIST + "Ship", mngDao.getShipType());
		resultMap.put(Const.LIST + "ctype", dbDao.getDomainInfoListByDomainID("ctype"));
		resultMap.put(Const.LIST + "dtype", dbDao.getDomainInfoListByDomainID("dtype"));
		resultMap.put(Const.LIST + "schedtype", dbDao.getDomainInfoListByDomainID("schedtype"));
		resultMap.put(Const.SS_USERINFO, sysDao.getUser(userBean));
		resultMap.put("status", dao.getTrialStatus(bean.getUid()));

		return resultMap;
	}
	
	@Override
	public Map<String, Object> planChart(HttpServletRequest request, ParamBean bean) throws Exception {
		Map<String, Object> resultMap = new HashMap<String, Object>();
		ParamBean userBean = new ParamBean();
		userBean.setUid(((UserInfoBean)(request.getSession().getAttribute(Const.SS_USERINFO))).getUid());

		resultMap.put(Const.BEAN, dao.getScheduler(bean.getUid()));
		resultMap.put(Const.LIST + "Ship", mngDao.getShipType());
		resultMap.put(Const.LIST + "ctype", dbDao.getDomainInfoListByDomainID("ctype"));
		resultMap.put(Const.LIST + "dtype", dbDao.getDomainInfoListByDomainID("dtype"));
		resultMap.put(Const.LIST + "schedtype", dbDao.getDomainInfoListByDomainID("schedtype"));
		resultMap.put(Const.SS_USERINFO, sysDao.getUser(userBean));
		resultMap.put("status", dao.getTrialStatus(bean.getUid()));
		resultMap.put(Const.LIST + "Code", dao.get1LevelCodeList());

		return resultMap;
	}
	
	// ManagerService.updateScheduler
	@Override
	public Map<String, Object> planChartSave(HttpServletRequest request, SchedulerInfoBean bean) throws Exception {
		Map<String, Object> resultMap = new HashMap<String, Object>();
		boolean isResult = DBConst.FAIL;
		String status = dao.getTrialStatus(bean.getUid());
		
		if(DBConst.SCHE_TRIAL_INFO_TRIALSTATUS_ONGOING.equals(status) || DBConst.SCHE_TRIAL_INFO_TRIALSTATUS_ARRIVAL.equals(status)) {
			resultMap.put(Const.ERRCODE, status);
		}else {
			if(DBConst.Y.equals(dao.isOfflineMode(bean.getUid()))) {
				resultMap.put(Const.ERRCODE, Const.ERRCODE_IS_OFFLINE);
			}else {
				bean.setUserUid(((UserInfoBean)(request.getSession().getAttribute(Const.SS_USERINFO))).getUid());
				
				mngDao.updateScheduler(bean);

				if(bean.getUidList() != null) {
					for(int i = 0; i < bean.getUidList().length; i++) {
						if(!"R".equalsIgnoreCase(bean.getFlagList()[i])) {
							SchedulerDetailInfoBean detBean = new SchedulerDetailInfoBean();
							
							detBean.setUid(bean.getUidList()[i]);
							detBean.setCategory(bean.getCateList()[i]);
							detBean.setTcnum(bean.getTcnumList()[i]);
							detBean.setDescription(bean.getDescList()[i]);
							detBean.setLoadrate(ValidUtil.getNumOrNullData(bean.getLoadList()[i]));
							detBean.setSdate(bean.getSdateList()[i]);
							detBean.setStime(bean.getStimeList()[i]);
							detBean.setEdate(bean.getEdateList()[i]);
							detBean.setEtime(bean.getEtimeList()[i]);
							detBean.setSeq(ValidUtil.getNumOrNullData(bean.getSeqList()[i]));
							detBean.setPer(ValidUtil.getNumOrNullData(bean.getPerList()[i]));
							detBean.setFlag(bean.getFlagList()[i]);
							detBean.setCtype(bean.getCtypeList()[i]);
							detBean.setDtype(bean.getDtypeList()[i]);
							detBean.setReadytime(ValidUtil.getNumOrNullData(bean.getReadyTmList()[i]));
							detBean.setCodedetuid(ValidUtil.getNumOrNullData(bean.getCodedetuidList()[i]));
							detBean.setSametcnum(bean.getSametcnumList()[i]);
							detBean.setSchedinfouid(bean.getUid());
							detBean.setUserUid(bean.getUserUid());
							detBean.setCodedetdesc(bean.getCodedetdescList()[i]);
							detBean.setCodedettcnum(bean.getCodedettcnumList()[i]);
						
							if("C".equalsIgnoreCase(detBean.getFlag())) {
								mngDao.insertSchedulerDetail(detBean);
							}else if(detBean.getUid() > 0 && "U".equalsIgnoreCase(detBean.getFlag())) {
								mngDao.updateSchedulerDetail(detBean);
							}else if(detBean.getUid() > 0 &&"D".equalsIgnoreCase(detBean.getFlag())) {
								// schetcnote.uid 검색
								// schetcnotefileinfo.savename 목록
								// schetcnote 삭제
								// schetcnotetcinfo 삭제
								// schetcnotefileinfo 삭제
								// 파일 삭제
								Integer noteUid = dao.getScheTcNoteUid(detBean.getUid());
								
								if(noteUid != null && noteUid > DBConst.ZERO) {
									List<String> fileNameList = dao.getScheTcNoteFileInfoSaveNameList(noteUid);
									
									dao.deleteScheTcNote(noteUid);
									dao.deleteScheTcNoteTcInfoList(noteUid);
									dao.deleteScheTcNoteFileInfoList(noteUid);
									
									try {
										if(fileNameList != null) {
											for(int x = 0; x < fileNameList.size(); x++) {
												FileUtil.deleteFile(FileUtil.FILE_DIR_FOR_NOTE + "/" + fileNameList.get(x));
											}
										}
									}catch(Exception e) {}
								}
								
								mngDao.deleteSchedulerDetail(detBean.getUid());
							}
						}
					}
				}
				
				isResult = DBConst.SUCCESS;
			}
		}
		
		resultMap.put(Const.RESULT, isResult);
		
		return resultMap;
	}

	@Override
	public Map<String, Object> planCrew(HttpServletRequest request, ParamBean bean) throws Exception {
		Map<String, Object> resultMap = new HashMap<String, Object>();
		List<ScheCrewBean> crewList = dao.getCrewList(bean.getUid());
		
		if(crewList != null) {
			for(int i = 0; i < crewList.size(); i++) {
				crewList.get(i).setInOutList(dao.getCrewInOutList(crewList.get(i).getUid()));
			}
		}
		
		resultMap.put(Const.BEAN, dao.getScheduler(bean.getUid()));
		resultMap.put(Const.LIST, crewList);
		resultMap.put("status", dao.getTrialStatus(bean.getUid()));
		
		return resultMap;
	}
	
	@Override
	public void downCrewExcel(HttpServletResponse response, ParamBean bean) throws Exception {
		List<ScheCrewBean> crewList = dao.getCrewList(bean.getUid());
		int crewCnt = 0;
		
		if(crewList != null) {
			crewCnt = crewList.size();
			
			for(int i = 0; i < crewCnt; i++) {
				crewList.get(i).setInOutList(dao.getCrewInOutList(crewList.get(i).getUid()));
			}
		}
		
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
		
		dataSheet.setColumnWidth(0, 3500);
		dataSheet.setColumnWidth(1, 3500);
		dataSheet.setColumnWidth(2, 3500);
		dataSheet.setColumnWidth(3, 3500);
		dataSheet.setColumnWidth(4, 3500);
		
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
		/// Style *****/
		
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
        
//        for(int i = 0; i < workType1Items.length; i++) {
//        	String[] workType2List = workType2Items[i];
//        	Sheet workType2Sheet = wb.createSheet(workType1Items[i]);
//        	
//        	for(int z = 0; z < workType2List.length; z++) {
//        		Row r = workType2Sheet.createRow(z);
//        		Cell c = r.createCell(0);
//        		c.setCellValue(workType2List[z]);
//        	}
//        }
//        
//        for(int i = 0; i < workType1Items.length; i++) {
//        	String[] workType2List = workType2Items[i];
//        	String rangeName = "workType2_" + workType1Items[i];
//        	Name namedRange = wb.createName();
//        	namedRange.setNameName(rangeName);
//        	namedRange.setRefersToFormula(workType1Items[i] + "!$A$1:$A$" + workType2List.length);
//        }
        /// workType1, workType2 *****/
		
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
		cell.setCellValue("정/부");
		cell = row.createCell(cellIdx++);
		cell.setCellStyle(headStyle);
		cell.setCellValue("한식/양식");
		cell = row.createCell(cellIdx++);
		cell.setCellStyle(headStyle);
		cell.setCellValue("생년월일");
		cell = row.createCell(cellIdx++);
		cell.setCellStyle(headStyle);
		cell.setCellValue("전화번호");
		cell = row.createCell(cellIdx++);
		cell.setCellStyle(headStyle);
		cell.setCellValue("승선일");
		cell = row.createCell(cellIdx++);
		cell.setCellStyle(headStyle);
		cell.setCellValue("하선일");
		
		if(crewCnt > 0) {
			for(int i = 0; i < crewCnt; i++) {
				ScheCrewBean crew = crewList.get(i);
				cellIdx = 0;
				
				row = sheet.createRow(rowNo);
				
				cell = row.createCell(cellIdx++);
				cell.setCellStyle(bodyCenterStyle);
				cell.setCellType(Cell.CELL_TYPE_STRING);
				cell.setCellValue(i + 1);
				
				cell = row.createCell(cellIdx++);
				cell.setCellStyle(bodyStyle);
				ExcelUtil.createSelectBox(sheet, cell, new String[]{"SHI-기술지원직", "SHI-생산직", "SHI-협력사", "외부"});
				
				if("SHI-A".equals(crew.getKind())) {
					cell.setCellValue("SHI-기술지원직");
				}else if("SHI-B".equals(crew.getKind())) {
					cell.setCellValue("SHI-생산직");
				}else if("SHI-C".equals(crew.getKind())) {
					cell.setCellValue("SHI-협력사");
				}else if("OUTSIDE".equals(crew.getKind())) {
					cell.setCellValue("외부");
				}
				
				cell = row.createCell(cellIdx++);
				cell.setCellStyle(bodyStyle);
				cell.setCellType(Cell.CELL_TYPE_STRING);
				cell.setCellValue(crew.getCompany());
				
				cell = row.createCell(cellIdx++);
				cell.setCellStyle(bodyStyle);
				cell.setCellType(Cell.CELL_TYPE_STRING);
				cell.setCellValue(crew.getDepartment());
				
				cell = row.createCell(cellIdx++);
				cell.setCellStyle(bodyStyle);
				cell.setCellType(Cell.CELL_TYPE_STRING);
				cell.setCellValue(crew.getName());
				
				cell = row.createCell(cellIdx++);
				cell.setCellStyle(bodyStyle);
				cell.setCellType(Cell.CELL_TYPE_STRING);
				cell.setCellValue(crew.getRank());
				
				cell = row.createCell(cellIdx++);
				cell.setCellStyle(bodyStyle);
				cell.setCellType(Cell.CELL_TYPE_STRING);
				cell.setCellValue(crew.getIdNo());
				
				cell = row.createCell(cellIdx);
				cell.setCellStyle(bodyStyle);
				
		        DataValidationHelper validationHelper = sheet.getDataValidationHelper();
		        CellRangeAddressList workType1Range = new CellRangeAddressList(rowNo, rowNo, cellIdx, cellIdx);
		        DataValidationConstraint workType1Constraint = validationHelper.createExplicitListConstraint(workType1Items);
		        DataValidation workType1Validation = validationHelper.createValidation(workType1Constraint, workType1Range);
		        sheet.addValidationData(workType1Validation);
		        
				if("A".equals(crew.getWorkType1())) {
					cell.setCellValue("시운전");
				}else if("B".equals(crew.getWorkType1())) {
					cell.setCellValue("생산");
				}else if("C".equals(crew.getWorkType1())) {
					cell.setCellValue("설계연구소");
				}else if("D".equals(crew.getWorkType1())) {
					cell.setCellValue("지원");
				}else if("E".equals(crew.getWorkType1())) {
					cell.setCellValue("외부");
				}
		        
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
		        
		        if("A0".equals(crew.getWorkType2())) cell.setCellValue("-");
				else if("A1".equals(crew.getWorkType2())) cell.setCellValue("코맨더");
				else if("A2".equals(crew.getWorkType2())) cell.setCellValue("기장운전");
				else if("A3".equals(crew.getWorkType2())) cell.setCellValue("선장운전");
				else if("A4".equals(crew.getWorkType2())) cell.setCellValue("전장운전");
				else if("A5".equals(crew.getWorkType2())) cell.setCellValue("항통");
				else if("A6".equals(crew.getWorkType2())) cell.setCellValue("안벽의장");
				else if("A7".equals(crew.getWorkType2())) cell.setCellValue("기타");
				else if("B0".equals(crew.getWorkType2())) cell.setCellValue("-");
				else if("B1".equals(crew.getWorkType2())) cell.setCellValue("기관과");
				else if("B2".equals(crew.getWorkType2())) cell.setCellValue("기타");
				else if("C0".equals(crew.getWorkType2())) cell.setCellValue("-");
				else if("C1".equals(crew.getWorkType2())) cell.setCellValue("종합설계");
				else if("C2".equals(crew.getWorkType2())) cell.setCellValue("기장설계");
				else if("C3".equals(crew.getWorkType2())) cell.setCellValue("선장설계");
				else if("C4".equals(crew.getWorkType2())) cell.setCellValue("전장설계");
				else if("C5".equals(crew.getWorkType2())) cell.setCellValue("진동연구");
				else if("C6".equals(crew.getWorkType2())) cell.setCellValue("기타");
				else if("D0".equals(crew.getWorkType2())) cell.setCellValue("-");
				else if("D1".equals(crew.getWorkType2())) cell.setCellValue("안전");
				else if("D2".equals(crew.getWorkType2())) cell.setCellValue("캐터링");
				else if("D3".equals(crew.getWorkType2())) cell.setCellValue("QM");
				else if("D4".equals(crew.getWorkType2())) cell.setCellValue("PM");
				else if("D5".equals(crew.getWorkType2())) cell.setCellValue("기타");
				else if("E0".equals(crew.getWorkType2())) cell.setCellValue("-");
				else if("E1".equals(crew.getWorkType2())) cell.setCellValue("Owner");
				else if("E2".equals(crew.getWorkType2())) cell.setCellValue("Class");
				else if("E3".equals(crew.getWorkType2())) cell.setCellValue("S/E");
				else if("E4".equals(crew.getWorkType2())) cell.setCellValue("선장");
				else if("E5".equals(crew.getWorkType2())) cell.setCellValue("항해사");
				else if("E6".equals(crew.getWorkType2())) cell.setCellValue("기관장");
				else if("E7".equals(crew.getWorkType2())) cell.setCellValue("라인맨");
				else if("E8".equals(crew.getWorkType2())) cell.setCellValue("기타");

		        cellIdx++;
				
				cell = row.createCell(cellIdx++);
				cell.setCellStyle(bodyCenterStyle);
				ExcelUtil.createSelectBox(sheet, cell, new String[]{"-", "정", "부"});
				
				if("M".equals(crew.getMainSub())) {
					cell.setCellValue("정");
				}else if("S".equals(crew.getMainSub())) {
					cell.setCellValue("부");
				}else {
					cell.setCellValue("-");
				}
				
				cell = row.createCell(cellIdx++);
				cell.setCellStyle(bodyCenterStyle);
				ExcelUtil.createSelectBox(sheet, cell, new String[]{"한식", "양식"});
				
				if("W".equals(crew.getFoodStyle())) {
					cell.setCellValue("양식");
				}else {
					cell.setCellValue("한식");
				}
				
				cell = row.createCell(cellIdx++);
				cell.setCellStyle(bodyStyle);
				cell.setCellType(Cell.CELL_TYPE_STRING);
				cell.setCellValue(crew.getPersonNo());
				
				cell = row.createCell(cellIdx++);
				cell.setCellStyle(bodyStyle);
				cell.setCellType(Cell.CELL_TYPE_STRING);
				cell.setCellValue(crew.getPhone());
				
				String inDate = "";
				String outDate = "";
				
				if(crew.getInOutList() != null && !crew.getInOutList().isEmpty()) {
					for(int x = 0; x < crew.getInOutList().size(); x++) {
						ScheCrewInOutBean crewInOut = crew.getInOutList().get(x);
						
						if(DBConst.SCHE_CREW_INOUT_IN.equals(crewInOut.getSchedulerInOut())) {
							inDate = crewInOut.getInOutDate();
						}else if(DBConst.SCHE_CREW_INOUT_OUT.equals(crewInOut.getSchedulerInOut())) {
							outDate = crewInOut.getInOutDate();
						}
					}
				}
				
				cell = row.createCell(cellIdx++);
				cell.setCellStyle(bodyCenterStyle);
				cell.setCellType(Cell.CELL_TYPE_STRING);
				cell.setCellValue(inDate);
				
				cell = row.createCell(cellIdx++);
				cell.setCellStyle(bodyCenterStyle);
				cell.setCellType(Cell.CELL_TYPE_STRING);
				cell.setCellValue(outDate);
				
				rowNo++;
			}
		}
		
		for(int i = 0; i < 100; i++) {
			cellIdx = 0;
			
			row = sheet.createRow(rowNo);
			
			cell = row.createCell(cellIdx++);
			cell.setCellStyle(bodyCenterStyle);
			cell.setCellValue(crewCnt + i + 1);
			
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
			
			cell = row.createCell(cellIdx++);
			cell.setCellStyle(bodyCenterStyle);
			ExcelUtil.createSelectBox(sheet, cell, new String[]{"-", "정", "부"});
			cell.setCellValue("-");
			
			cell = row.createCell(cellIdx++);
			cell.setCellStyle(bodyCenterStyle);
			ExcelUtil.createSelectBox(sheet, cell, new String[]{"한식", "양식"});
			cell.setCellValue("한식");
			
			cell = row.createCell(cellIdx++);
			cell.setCellStyle(bodyStyle);
			cell.setCellType(Cell.CELL_TYPE_STRING);
			
			cell = row.createCell(cellIdx++);
			cell.setCellStyle(bodyStyle);
			cell.setCellType(Cell.CELL_TYPE_STRING);
			
			cell = row.createCell(cellIdx++);
			cell.setCellStyle(bodyCenterStyle);
			cell.setCellType(Cell.CELL_TYPE_STRING);
			
			cell = row.createCell(cellIdx++);
			cell.setCellStyle(bodyCenterStyle);
			cell.setCellType(Cell.CELL_TYPE_STRING);
			
			rowNo++;
		}
		
		response.setContentType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
		String outputFileName = new String("승선자_등록.xlsx".getBytes("KSC5601"), "8859_1");
		response.setHeader("Content-Disposition", "attachment; fileName=\"" + outputFileName + "\"");

		wb.write(response.getOutputStream());
		wb.close();
	}
	
	@Override
	public Map<String, Object> planCrewSave(HttpServletRequest request, ScheCrewListBean bean) throws Exception {
		Map<String, Object> resultMap = new HashMap<String, Object>();
		boolean isResult = DBConst.FAIL;
		String status = dao.getTrialStatus(bean.getSchedulerInfoUid());
		
		if(DBConst.SCHE_TRIAL_INFO_TRIALSTATUS_ONGOING.equals(status) || DBConst.SCHE_TRIAL_INFO_TRIALSTATUS_ARRIVAL.equals(status)) {
			resultMap.put(Const.ERRCODE, status);
		}else {
			if(DBConst.Y.equals(dao.isOfflineMode(bean.getSchedulerInfoUid()))) {
				resultMap.put(Const.ERRCODE, Const.ERRCODE_IS_OFFLINE);
			}else {
				int userUid = ((UserInfoBean)(request.getSession().getAttribute(Const.SS_USERINFO))).getUid();
				
				List<Integer> crewUidList = dao.getCrewUidList(bean.getSchedulerInfoUid());
				dao.deleteCrewList(bean.getSchedulerInfoUid());
				
				if(crewUidList != null) {
					for(int i = 0; i < crewUidList.size(); i++) {
						dao.deleteCrewInoutList(crewUidList.get(i));
					}
				}
				
				for(int i = 0; i < bean.getKind().length; i++) {
					ScheCrewBean crew = new ScheCrewBean();
					crew.setSchedulerInfoUid(bean.getSchedulerInfoUid());
					crew.setKind(bean.getKind()[i]);
					crew.setCompany(bean.getCompany()[i]);
					crew.setDepartment(bean.getDepartment()[i]);
					crew.setName(bean.getName()[i]);
					crew.setRank(bean.getRank()[i]);
					crew.setIdNo(bean.getIdNo()[i]);
					crew.setWorkType1(bean.getWorkType1()[i]);
					crew.setWorkType2(bean.getWorkType2()[i]);
					crew.setMainSub(bean.getMainSub()[i]);
					crew.setFoodStyle(bean.getFoodStyle()[i]);
					crew.setPersonNo(bean.getPersonNo()[i]);
					crew.setPhone(bean.getPhone()[i]);
					crew.setIsPlan(DBConst.Y);
					crew.setUserUid(userUid);
					
					if(dao.insertCrew(crew) > DBConst.ZERO) {
						if(!bean.getInDate()[i].isEmpty()) {
							ScheCrewInOutBean inOut = new ScheCrewInOutBean();
							inOut.setScheCrewUid(crew.getUid());
							inOut.setInOutDate(bean.getInDate()[i]);
							inOut.setSchedulerInOut(DBConst.SCHE_CREW_INOUT_IN);
							inOut.setPerformanceInOut(DBConst.SCHE_CREW_INOUT_NONE);
							inOut.setUserUid(userUid);
							dao.insertCrewInOut(inOut);
						}
						
						if(!bean.getOutDate()[i].isEmpty()) {
							ScheCrewInOutBean inOut = new ScheCrewInOutBean();
							inOut.setScheCrewUid(crew.getUid());
							inOut.setInOutDate(bean.getOutDate()[i]);
							inOut.setSchedulerInOut(DBConst.SCHE_CREW_INOUT_OUT);
							inOut.setPerformanceInOut(DBConst.SCHE_CREW_INOUT_NONE);
							inOut.setUserUid(userUid);
							dao.insertCrewInOut(inOut);
						}
					}
				}
				
				isResult = DBConst.SUCCESS;
			}
		}
		
		resultMap.put(Const.RESULT, isResult);
		
		return resultMap;
	}

	@Override
	public Map<String, Object> planInfo(HttpServletRequest request, ParamBean bean) throws Exception {
		Map<String, Object> resultMap = new HashMap<String, Object>();
		List<ScheCrewBean> mainCrewList = new ArrayList<ScheCrewBean>();
		
		ScheCrewBean crew = new ScheCrewBean();
		crew.setSchedulerInfoUid(bean.getUid());
		
		crew.setWorkType2("A2");
		mainCrewList.add(dao.getMainCrewInfo(crew));
		crew.setWorkType2("A3");
		mainCrewList.add(dao.getMainCrewInfo(crew));
		crew.setWorkType2("A4");
		mainCrewList.add(dao.getMainCrewInfo(crew));
		crew.setWorkType2("C1");
		mainCrewList.add(dao.getMainCrewInfo(crew));
		crew.setWorkType2("D3");
		mainCrewList.add(dao.getMainCrewInfo(crew));
		
		resultMap.put(Const.BEAN, dao.getScheduler(bean.getUid()));
		resultMap.put(Const.LIST + "Commander", dao.getCommanderInfoList(bean.getUid()));
		resultMap.put(Const.LIST + "MainCrew", mainCrewList);
		resultMap.put(Const.LIST + "CrewCnt", dao.getCrewCntInfoList(bean.getUid()));
		resultMap.put(Const.BEAN + "Info", dao.getTrialInfo(bean.getUid()));
		resultMap.put(Const.LIST + "TcCnt", dao.getTcCntList(bean.getUid()));
		resultMap.put(Const.LIST + "Series", dao.getSeriesList());
		resultMap.put("status", dao.getTrialStatus(bean.getUid()));
		
		return resultMap;
	}
	
	@Override
	public List<SchedulerInfoBean> searchTrial(ParamBean bean) throws Exception {
		return dao.searchTrial(bean);
	}
	
	@Override
	public Map<String, Object> planInfoSave(HttpServletRequest request, ScheTrialInfoBean bean) throws Exception {
		Map<String, Object> resultMap = new HashMap<String, Object>();
		boolean isResult = DBConst.FAIL;
		String status = dao.getTrialStatus(bean.getSchedulerInfoUid());
		
		if(DBConst.SCHE_TRIAL_INFO_TRIALSTATUS_ONGOING.equals(status) || DBConst.SCHE_TRIAL_INFO_TRIALSTATUS_ARRIVAL.equals(status)) {
			resultMap.put(Const.ERRCODE, status);
		}else {
			if(DBConst.Y.equals(dao.isOfflineMode(bean.getSchedulerInfoUid()))) {
				resultMap.put(Const.ERRCODE, Const.ERRCODE_IS_OFFLINE);
			}else {
				int userUid = ((UserInfoBean)(request.getSession().getAttribute(Const.SS_USERINFO))).getUid();
				bean.setUserUid(userUid);
				
				dao.deleteTrialInfo(bean.getSchedulerInfoUid());
				dao.insertTrialInfo(bean);
				isResult = DBConst.SUCCESS;
			}
		}
		
		resultMap.put(Const.RESULT, isResult);
		
		return resultMap;
	}

	@Override
	public Map<String, Object> planDepartureReport(HttpServletRequest request, ParamBean bean) throws Exception {
		Map<String, Object> resultMap = new HashMap<String, Object>();
		List<ScheCrewBean> mainCrewList = new ArrayList<ScheCrewBean>();
		ScheTrialInfoBean infoBean = dao.getTrialInfo(bean.getUid());
		
		ScheCrewBean crew = new ScheCrewBean();
		crew.setSchedulerInfoUid(bean.getUid());
		
		crew.setWorkType2("A2");
		mainCrewList.add(dao.getMainCrewInfo(crew));
		crew.setWorkType2("A3");
		mainCrewList.add(dao.getMainCrewInfo(crew));
		crew.setWorkType2("A4");
		mainCrewList.add(dao.getMainCrewInfo(crew));
		crew.setWorkType2("C1");
		mainCrewList.add(dao.getMainCrewInfo(crew));
		crew.setWorkType2("D3");
		mainCrewList.add(dao.getMainCrewInfo(crew));
		
		if(infoBean != null) {
			infoBean.setCrewRemark(ValidUtil.forHtml(infoBean.getCrewRemark()));
			infoBean.setRemark(ValidUtil.forHtml(infoBean.getRemark()));
			
			if(infoBean.getTrial1SchedulerInfoUid() > 0) {
				infoBean.setTrial1Time(dao.getTotalTrialTime(infoBean.getTrial1SchedulerInfoUid()));
				resultMap.put(Const.BEAN + "Trial1", dao.getTrialFuel(infoBean.getTrial1SchedulerInfoUid()));
			}
			
			if(infoBean.getTrial2SchedulerInfoUid() > 0) {
				infoBean.setTrial2Time(dao.getTotalTrialTime(infoBean.getTrial2SchedulerInfoUid()));
				resultMap.put(Const.BEAN + "Trial2", dao.getTrialFuel(infoBean.getTrial2SchedulerInfoUid()));
			}
		}
		
		resultMap.put(Const.BEAN, dao.getScheduler(bean.getUid()));
		resultMap.put(Const.LIST + "Commander", dao.getCommanderInfoList(bean.getUid()));
		resultMap.put(Const.LIST + "MainCrew", mainCrewList);
		resultMap.put(Const.LIST + "CrewCnt", dao.getCrewCntInfoList(bean.getUid()));
		resultMap.put(Const.BEAN + "Info", infoBean);
		resultMap.put(Const.LIST + "TcCnt", dao.getTcCntList(bean.getUid()));
		resultMap.put(Const.BEAN + "Sche", dao.getScheduleDateTime(bean.getUid()));
		resultMap.put("PlanTime", dao.getTotalPlanTime(bean.getUid()));
		resultMap.put("status", dao.getTrialStatus(bean.getUid()));
		
		/// 250317 추가 - 250415 수정 /// 
		List<ScheMailBean> mailList = dao.getLastMailList(bean.getUid());
		
		if(mailList == null || mailList.size() == 0) {
			mailList = dao.getMailList();
		}
		
		resultMap.put(Const.LIST + "Mail", mailList);
		///-- 250317 추가 - 250415 수정 --///
		
		return resultMap;
	}
	
	@Override
	public Map<String, Object> planDepartureReportSubmit(HttpServletRequest request, ScheMailLogBean bean) throws Exception {
		Map<String, Object> resultMap = new HashMap<String, Object>();
		boolean isResult = DBConst.FAIL;
		int schedulerInfoUid = bean.getSchedulerInfoUid();
		String status = dao.getTrialStatus(schedulerInfoUid);
		
		if(DBConst.SCHE_TRIAL_INFO_TRIALSTATUS_ONGOING.equals(status) || DBConst.SCHE_TRIAL_INFO_TRIALSTATUS_ARRIVAL.equals(status)) {
			resultMap.put(Const.ERRCODE, status);
		}else {
			if(DBConst.Y.equals(dao.isOfflineMode(schedulerInfoUid))) {
				resultMap.put(Const.ERRCODE, Const.ERRCODE_IS_OFFLINE);
			}else {
				ScheTrialInfoBean infoBean = dao.getTrialInfo(schedulerInfoUid);
				
				if(infoBean != null && infoBean.getUid() > 0) {
					int userUid = ((UserInfoBean)(request.getSession().getAttribute(Const.SS_USERINFO))).getUid();
					bean.setInsertBy(userUid);
					
					SchedulerInfoBean scheBean = dao.getScheduler(schedulerInfoUid);
					List<ScheCrewBean> commanderList = dao.getCommanderInfoList(schedulerInfoUid);
					ScheCrewBean mainCrewA2 = new ScheCrewBean();
					ScheCrewBean mainCrewA3 = new ScheCrewBean();
					ScheCrewBean mainCrewA4 = new ScheCrewBean();
					ScheCrewBean mainCrewC1 = new ScheCrewBean();
					ScheCrewBean mainCrewD3 = new ScheCrewBean();
					List<ScheCrewBean> crewCntList = dao.getCrewCntInfoList(schedulerInfoUid);
					List<Integer> tcCntList = dao.getTcCntList(schedulerInfoUid);
					
					ScheCrewBean crew = new ScheCrewBean();
					crew.setSchedulerInfoUid(schedulerInfoUid);
					
					crew.setWorkType2("A2");
					mainCrewA2 = dao.getMainCrewInfo(crew);
					crew.setWorkType2("A3");
					mainCrewA3 = dao.getMainCrewInfo(crew);
					crew.setWorkType2("A4");
					mainCrewA4 = dao.getMainCrewInfo(crew);
					crew.setWorkType2("C1");
					mainCrewC1 = dao.getMainCrewInfo(crew);
					crew.setWorkType2("D3");
					mainCrewD3 = dao.getMainCrewInfo(crew);
					
					ScheReportDepartureBean report = new ScheReportDepartureBean();
					report.setUserUid(userUid);
					report.setSchedulerInfoUid(schedulerInfoUid);
					report.setTrial1SchedulerInfoUid(infoBean.getTrial1SchedulerInfoUid());
					report.setTrial2SchedulerInfoUid(infoBean.getTrial2SchedulerInfoUid());
					report.setItpTotalRemain(infoBean.getItpTotalRemain());
					report.setItpTotalBase(infoBean.getItpTotalBase());
					report.setItpTrialRemain(infoBean.getItpTrialRemain());
					report.setItpTrialBase(infoBean.getItpTrialBase());
					report.setItpOutfittingRemain(infoBean.getItpOutfittingRemain());
					report.setItpOutfittingBase(infoBean.getItpOutfittingBase());
					report.setPunchTotal(infoBean.getPunchTotal());
					report.setPunchTrial(infoBean.getPunchTrial());
					report.setPunchOutfitting(infoBean.getPunchOutfitting());
					report.setFuelHfo(infoBean.getFuelHfoScheduler());
					report.setFuelMgo(infoBean.getFuelMgoScheduler());
					report.setFuelMdo(infoBean.getFuelMdoScheduler());
					report.setFuelLng(infoBean.getFuelLngScheduler());
					report.setDraftFwd(infoBean.getDraftFwdScheduler());
					report.setDraftMid(infoBean.getDraftMidScheduler());
					report.setDraftAft(infoBean.getDraftAftScheduler());
					report.setRemark(infoBean.getRemark());
					
					if(mainCrewA2 != null) {
						report.setCrewName3(mainCrewA2.getName());
						report.setCrewPhone3(mainCrewA2.getPhone());
					}
					
					if(mainCrewA3 != null) {
						report.setCrewName4(mainCrewA3.getName());
						report.setCrewPhone4(mainCrewA3.getPhone());
					}
					
					if(mainCrewA4 != null) {
						report.setCrewName5(mainCrewA4.getName());
						report.setCrewPhone5(mainCrewA4.getPhone());
					}
					
					if(mainCrewC1 != null) {
						report.setCrewName6(mainCrewC1.getName());
						report.setCrewPhone6(mainCrewC1.getPhone());
					}
					
					if(mainCrewD3 != null) {
						report.setCrewName7(mainCrewD3.getName());
						report.setCrewPhone7(mainCrewD3.getPhone());
					}
					
					if(commanderList != null) {
						for(int i = 0; i < commanderList.size(); i++) {
							ScheCrewBean scBean = commanderList.get(i);
							
							if("M".equals(scBean.getMainSub())) {
								report.setCrewName1(scBean.getName());
								report.setCrewPhone1(scBean.getPhone());
							}else {
								report.setCrewName2(scBean.getName());
								report.setCrewPhone2(scBean.getPhone());
							}
						}
					}
					
					for(int i = 0; i < crewCntList.size(); i++) {
						ScheCrewBean scBean = crewCntList.get(i);
						String kind = scBean.getKind();
						int cnt = scBean.getCnt();
						
						if("TOTAL".equals(kind)) {
							report.setCrewCntTotal(cnt);
						}else if("SHI".equals(kind)) {
							report.setCrewCnt1(cnt);
						}else if("OUT".equals(kind)) {
							report.setCrewCnt2(cnt);
						}else if("OWNER".equals(kind)) {
							report.setCrewCnt3(cnt);
						}else if("CLASS".equals(kind)) {
							report.setCrewCnt4(cnt);
						}else if("SE".equals(kind)) {
							report.setCrewCnt5(cnt);
						}else if("CAPTAIN".equals(kind)) {
							report.setCrewCnt6(cnt);
						}else if("MATE".equals(kind)) {
							report.setCrewCnt7(cnt);
						}else if("ENG".equals(kind)) {
							report.setCrewCnt8(cnt);
						}else if("ETC".equals(kind)) {
							report.setCrewCnt9(cnt);
						}
					}
					
					if(tcCntList != null && tcCntList.size() == 4) {
						report.setSeaTrialTest(tcCntList.get(0));
						report.setHull(tcCntList.get(1));
						report.setMachinery(tcCntList.get(2));
						report.setElectric(tcCntList.get(3));
					}
					
					if(dao.insertReportDeparture(report) > DBConst.ZERO) {
						ScheTrialInfoBean trial = new ScheTrialInfoBean();
						trial.setSchedulerInfoUid(schedulerInfoUid);
						trial.setTrialStatus(DBConst.SCHE_TRIAL_INFO_TRIALSTATUS_ONGOING);
						trial.setUserUid(userUid);
						
						if(dao.updateTrialStatus(trial) > DBConst.ZERO) {
							/// 데이터 개정 추가 (25.02.26)
							// REVSCHEDULERINFO
							// REVSCHEDULERVERSIONINFO
							// REVSCHEDULERDETAIL
							// REVSCHEDATETIME
							// REVSCHETRIALINFO
							// REVSCHECREW
							// REVSCHECREWINOUT
							// REVSCHETCNOTE
							// REVSCHETCNOTEFILEINFO
							// REVSCHETCNOTETCINFO
							
							SchedulerInfoBean revSchedulerInfoBean = revDao.getSchedulerInfo(schedulerInfoUid);
							SchedulerVersionInfoBean revSchedulerVersionInfoBean = null;
							List<SchedulerDetailInfoBean> revSchedulerDetailInfoList = revDao.getSchedulerDetailList(schedulerInfoUid);
							List<ScheDateTimeBean> revScheDateTimeList = revDao.getScheDatetimeList(schedulerInfoUid);
							ScheTrialInfoBean revScheTrialInfoBean = revDao.getScheTrialInfo(schedulerInfoUid);
							List<ScheCrewBean> revScheCrewList = revDao.getScheCrewList(schedulerInfoUid);
							List<ScheCrewInOutBean> revScheCrewInOutList = revDao.getScheCrewInOutList(schedulerInfoUid);
							List<ScheTcNoteBean> revScheTcNoteList = revDao.getScheTcNoteList(schedulerInfoUid);
							List<ScheTcNoteFileInfoBean> revScheTcNoteFileInfoList = revDao.getScheTcNoteFileInfoList(schedulerInfoUid);
							List<ScheTcNoteTcInfoBean> revScheTcNoteTcInfoList = revDao.getScheTcNoteTcInfoList(schedulerInfoUid);
							String revKind = DBConst.REV_KIND_DEPARTURE;
							String revDay = CommonUtil.getDateStr(false);
							
							if(revSchedulerInfoBean != null && revSchedulerInfoBean.getSchedulerVersionInfoUid() > 0) {
								revSchedulerVersionInfoBean = revDao.getSchedulerVersionInfo(revSchedulerInfoBean.getSchedulerVersionInfoUid());
							}
							
							if(revSchedulerInfoBean != null) {
								revSchedulerInfoBean.setRevKind(revKind);
								revSchedulerInfoBean.setRevDay(revDay);
								revDao.insertSchedulerInfo(revSchedulerInfoBean);
							}
							
							if(revSchedulerVersionInfoBean != null) {
								revSchedulerVersionInfoBean.setRevKind(revKind);
								revSchedulerVersionInfoBean.setRevDay(revDay);
								revDao.insertSchedulerVersionInfo(revSchedulerVersionInfoBean);
							}
							
							if(revSchedulerDetailInfoList != null) {
								for(int i = 0; i < revSchedulerDetailInfoList.size(); i++) {
									SchedulerDetailInfoBean revBean = revSchedulerDetailInfoList.get(i);
									revBean.setRevKind(revKind);
									revBean.setRevDay(revDay);
									revDao.insertSchedulerDetail(revBean);
								}
							}
							
							if(revScheDateTimeList != null) {
								for(int i = 0; i < revScheDateTimeList.size(); i++) {
									ScheDateTimeBean revBean = revScheDateTimeList.get(i);
									revBean.setRevKind(revKind);
									revBean.setRevDay(revDay);
									revDao.insertScheDatetime(revBean);
								}
							}
							
							if(revScheTrialInfoBean != null) {
								revScheTrialInfoBean.setRevKind(revKind);
								revScheTrialInfoBean.setRevDay(revDay);
								revDao.insertScheTrialInfo(revScheTrialInfoBean);
							}
							
							if(revScheCrewList != null) {
								for(int i = 0; i < revScheCrewList.size(); i++) {
									ScheCrewBean revBean = revScheCrewList.get(i);
									revBean.setRevKind(revKind);
									revBean.setRevDay(revDay);
									revDao.insertScheCrew(revBean);
								}
							}
							
							if(revScheCrewInOutList != null) {
								for(int i = 0; i < revScheCrewInOutList.size(); i++) {
									ScheCrewInOutBean revBean = revScheCrewInOutList.get(i);
									revBean.setRevKind(revKind);
									revBean.setRevDay(revDay);
									revDao.insertScheCrewInOut(revBean);
								}
							}
							
							if(revScheTcNoteList != null) {
								for(int i = 0; i < revScheTcNoteList.size(); i++) {
									ScheTcNoteBean revBean = revScheTcNoteList.get(i);
									revBean.setRevKind(revKind);
									revBean.setRevDay(revDay);
									revDao.insertScheTcNote(revBean);
								}
							}
							
							if(revScheTcNoteFileInfoList != null) {
								for(int i = 0; i < revScheTcNoteFileInfoList.size(); i++) {
									ScheTcNoteFileInfoBean revBean = revScheTcNoteFileInfoList.get(i);
									revBean.setRevKind(revKind);
									revBean.setRevDay(revDay);
									revDao.insertScheTcNoteFileInfo(revBean);
								}
							}
							
							if(revScheTcNoteTcInfoList != null) {
								for(int i = 0; i < revScheTcNoteTcInfoList.size(); i++) {
									ScheTcNoteTcInfoBean revBean = revScheTcNoteTcInfoList.get(i);
									revBean.setRevKind(revKind);
									revBean.setRevDay(revDay);
									revDao.insertScheTcNoteTcInfo(revBean);
								}
							}
							///-- 데이터 개정 추가 (25.02.26)
							
							bean.setTitle("[SCP] " + scheBean.getHullnum() + " 해상 시운전 출항 보고 (" + scheBean.getDescription() + ")");
							bean.setDesc("[SCP] " + scheBean.getHullnum() + " 해상 시운전 출항 보고입니다. (" + scheBean.getDescription() + ")");
							bean.setFileName("scp_report.pdf");
							
							try {
								// 250317 추가 //
								if(bean.getToList() != null && bean.getToList().length > 0) {
									dao.deleteLastMailList(schedulerInfoUid);		
									
									for(int i = 0; i < bean.getToList().length; i++) {
										ScheMailLogBean mailLog = new ScheMailLogBean();
										mailLog.setSchedulerInfoUid(schedulerInfoUid);
										mailLog.setToStep(DBConst.SCHE_MAIL_LOG_TOSTEP_LAST);
										mailLog.setToStepUid(report.getUid());
										mailLog.setKind(DBConst.SCHE_MAIL_LOG_KIND_TO);
										mailLog.setEmail(bean.getToList()[i]);
										mailLog.setInsertBy(userUid);
										dao.insertMailLog(mailLog);
									}
								}
								//-- 250317 추가 --//
								
								if(SmtpUtil.sendEmail(bean)) {
									if(bean.getToList() != null) {
										for(int i = 0; i < bean.getToList().length; i++) {
											ScheMailLogBean mailLog = new ScheMailLogBean();
											mailLog.setSchedulerInfoUid(schedulerInfoUid);
											mailLog.setToStep(DBConst.SCHE_MAIL_LOG_TOSTEP_DEPART);
											mailLog.setToStepUid(report.getUid());
											mailLog.setKind(DBConst.SCHE_MAIL_LOG_KIND_TO);
											mailLog.setEmail(bean.getToList()[i]);
											mailLog.setInsertBy(userUid);
											dao.insertMailLog(mailLog);
										}
									}
									
									if(bean.getCcList() != null) {
										for(int i = 0; i < bean.getCcList().length; i++) {
											ScheMailLogBean mailLog = new ScheMailLogBean();
											mailLog.setSchedulerInfoUid(schedulerInfoUid);
											mailLog.setToStep(DBConst.SCHE_MAIL_LOG_TOSTEP_DEPART);
											mailLog.setToStepUid(report.getUid());
											mailLog.setKind(DBConst.SCHE_MAIL_LOG_KIND_CC);
											mailLog.setEmail(bean.getCcList()[i]);
											mailLog.setInsertBy(userUid);
											dao.insertMailLog(mailLog);
										}
									}
									
									if(bean.getBccList() != null) {
										for(int i = 0; i < bean.getBccList().length; i++) {
											ScheMailLogBean mailLog = new ScheMailLogBean();
											mailLog.setSchedulerInfoUid(schedulerInfoUid);
											mailLog.setToStep(DBConst.SCHE_MAIL_LOG_TOSTEP_DEPART);
											mailLog.setToStepUid(report.getUid());
											mailLog.setKind(DBConst.SCHE_MAIL_LOG_KIND_BCC);
											mailLog.setEmail(bean.getBccList()[i]);
											mailLog.setInsertBy(userUid);
											dao.insertMailLog(mailLog);
										}
									}
								}
							}catch(Exception e) {}
							
							isResult = DBConst.SUCCESS;
						}
					}
				}else {
					resultMap.put(Const.ERRCODE, Const.ERRCODE_EMPTY_INFO);
				}
			}
		}
		
		resultMap.put(Const.RESULT, isResult);
		
		return resultMap;
	}
	
	@Override
	public Map<String, Object> resultChart(HttpServletRequest request, ParamBean bean) throws Exception {
		Map<String, Object> resultMap = new HashMap<String, Object>();
		ParamBean userBean = new ParamBean();
		userBean.setUid(((UserInfoBean)(request.getSession().getAttribute(Const.SS_USERINFO))).getUid());

		resultMap.put(Const.BEAN, dao.getScheduler(bean.getUid()));
		resultMap.put(Const.LIST + "Ship", mngDao.getShipType());
		resultMap.put(Const.LIST + "ctype", dbDao.getDomainInfoListByDomainID("ctype"));
		resultMap.put(Const.LIST + "dtype", dbDao.getDomainInfoListByDomainID("dtype"));
		resultMap.put(Const.LIST + "schedtype", dbDao.getDomainInfoListByDomainID("schedtype"));
		resultMap.put(Const.SS_USERINFO, sysDao.getUser(userBean));
		resultMap.put(Const.LIST + "NoteUp", dao.getDomainInfoList(DBConst.DOMAIN_NOTE_UP));
		resultMap.put(Const.LIST + "NoteDown", dao.getDomainInfoList(DBConst.DOMAIN_NOTE_DOWN));
		resultMap.put("status", dao.getTrialStatus(bean.getUid()));
		resultMap.put("ongoMin", dao.getOngoChangeDateMinute(bean.getUid()));
		resultMap.put(Const.LIST + "Code", dao.get1LevelCodeList());

		return resultMap;
	}
	
	// ManagerService.updateScheduler
	@Override
	public Map<String, Object> resultChartSave(HttpServletRequest request, SchedulerInfoBean bean) throws Exception {
		Map<String, Object> resultMap = new HashMap<String, Object>();
		boolean isResult = DBConst.FAIL;
		String status = dao.getTrialStatus(bean.getUid());
		
		if(!DBConst.SCHE_TRIAL_INFO_TRIALSTATUS_ONGOING.equals(status)) {
			resultMap.put(Const.ERRCODE, status);
		}else {
			if(DBConst.Y.equals(dao.isOfflineMode(bean.getUid()))) {
				resultMap.put(Const.ERRCODE, Const.ERRCODE_IS_OFFLINE);
			}else {
				bean.setUserUid(((UserInfoBean)(request.getSession().getAttribute(Const.SS_USERINFO))).getUid());
				
				mngDao.updateScheduler(bean);

				if(bean.getUidList() != null) {
					for(int i = 0; i < bean.getUidList().length; i++) {
						if(!"R".equalsIgnoreCase(bean.getFlagList()[i])) {
							SchedulerDetailInfoBean detBean = new SchedulerDetailInfoBean();
							
							detBean.setUid(bean.getUidList()[i]);
							detBean.setCategory(bean.getCateList()[i]);
							detBean.setTcnum(bean.getTcnumList()[i]);
							detBean.setDescription(bean.getDescList()[i]);
							detBean.setLoadrate(ValidUtil.getNumOrNullData(bean.getLoadList()[i]));
							detBean.setSdate(bean.getSdateList()[i]);
							detBean.setStime(bean.getStimeList()[i]);
							detBean.setEdate(bean.getEdateList()[i]);
							detBean.setEtime(bean.getEtimeList()[i]);
							detBean.setSeq(ValidUtil.getNumOrNullData(bean.getSeqList()[i]));
							detBean.setPer(ValidUtil.getNumOrNullData(bean.getPerList()[i]));
							detBean.setFlag(bean.getFlagList()[i]);
							detBean.setCtype(bean.getCtypeList()[i]);
							detBean.setDtype(bean.getDtypeList()[i]);
							detBean.setReadytime(ValidUtil.getNumOrNullData(bean.getReadyTmList()[i]));
							detBean.setCodedetuid(ValidUtil.getNumOrNullData(bean.getCodedetuidList()[i]));
							detBean.setSametcnum(bean.getSametcnumList()[i]);
							detBean.setSchedinfouid(bean.getUid());
							detBean.setUserUid(bean.getUserUid());
							
							detBean.setPerformancesdate(bean.getPerformancesdateList()[i]);
							detBean.setPerformancestime(bean.getPerformancestimeList()[i]);
							detBean.setPerformanceedate(bean.getPerformanceedateList()[i]);
							detBean.setPerformanceetime(bean.getPerformanceetimeList()[i]);
							
							detBean.setCodedetdesc(bean.getCodedetdescList()[i]);
							detBean.setCodedettcnum(bean.getCodedettcnumList()[i]);
						
							if("C".equalsIgnoreCase(detBean.getFlag())) {
								mngDao.insertSchedulerDetail(detBean);
							}else if(detBean.getUid() > 0 && "U".equalsIgnoreCase(detBean.getFlag())) {
								mngDao.updateSchedulerDetail(detBean);
							}else if(detBean.getUid() > 0 &&"D".equalsIgnoreCase(detBean.getFlag())) {
								// schetcnote.uid 검색
								// schetcnotefileinfo.savename 목록
								// schetcnote 삭제
								// schetcnotetcinfo 삭제
								// schetcnotefileinfo 삭제
								// 파일 삭제
								Integer noteUid = dao.getScheTcNoteUid(detBean.getUid());
								
								if(noteUid != null && noteUid > DBConst.ZERO) {
									List<String> fileNameList = dao.getScheTcNoteFileInfoSaveNameList(noteUid);
									
									dao.deleteScheTcNote(noteUid);
									dao.deleteScheTcNoteTcInfoList(noteUid);
									dao.deleteScheTcNoteFileInfoList(noteUid);
									
									try {
										if(fileNameList != null) {
											for(int x = 0; x < fileNameList.size(); x++) {
												FileUtil.deleteFile(FileUtil.FILE_DIR_FOR_NOTE + "/" + fileNameList.get(x));
											}
										}
									}catch(Exception e) {}
								}
								
								mngDao.deleteSchedulerDetail(detBean.getUid());
							}
						}
					}
				}
				
				isResult = DBConst.SUCCESS;
			}
		}
		
		resultMap.put(Const.RESULT, isResult);
		
		return resultMap;
	}
	
	// ManagerService.getSchedulerRowDataList
	@Override
	public Map<String, Object> getScheRowList(SchedulerDetailInfoBean bean) throws Exception {
		Map<String, Object> resultMap = new HashMap<String, Object>();
		resultMap.put(Const.BEAN, dao.getScheduler(bean.getUid()));
		resultMap.put(Const.LIST, dao.getSchedulerRowDataList(bean));
		
		return resultMap;
	}
	
	@Override
	public List<ScheTcNoteBean> getTcNoteList(HttpServletRequest request, ParamBean bean) throws Exception {
		List<ScheTcNoteBean> noteList = dao.getTcNoteList(bean.getUid());
		
		if(noteList != null) {
			for(int i = 0; i < noteList.size(); i++) {
				ScheTcNoteBean note = noteList.get(i);
				int uid = note.getUid();
				note.setTcList(dao.getTcNoteTcList(uid));
				note.setFileList(dao.getTcNoteFileList(uid));
				note.setRemark(ValidUtil.forJson(note.getRemark()));
			}
		}
		
		return noteList;
	}
	
	@Override
	public Map<String, Object> saveNote(HttpServletRequest request, ScheTcNoteBean bean) throws Exception {
		Map<String, Object> resultMap = new HashMap<String, Object>();
		boolean isResult = DBConst.FAIL;
		int userUid = ((UserInfoBean)(request.getSession().getAttribute(Const.SS_USERINFO))).getUid();
		bean.setUserUid(userUid);
		
		if(DBConst.Y.equals(dao.isOfflineMode(bean.getSchedulerInfoUid()))) {
			isResult = DBConst.FAIL;
		}else {
			if(bean.getUid() > 0) {
				if(dao.updateTcNote(bean) > DBConst.ZERO) {
					int uid = bean.getUid();
					dao.deleteTcNoteTcList(uid);
					
					if(bean.getTcUidList() != null) {
						ScheTcNoteTcInfoBean tc = new ScheTcNoteTcInfoBean();
						tc.setSchedulerInfoUid(bean.getSchedulerInfoUid());
						tc.setScheTcNoteUid(uid);
						tc.setUserUid(userUid);
						
						for(int i = 0; i < bean.getTcUidList().length; i++) {
							tc.setSchedulerDetailUid(bean.getTcUidList()[i]);
							dao.insertTcNoteTc(tc);
						}
					}
					
					List<ScheTcNoteFileInfoBean> fileList = dao.getTcNoteFileList(uid);
					
					if(fileList != null) {
						if(bean.getExistFileUidList() != null && bean.getExistFileUidList().length > 0) {
							for(int i = 0; i < fileList.size(); i++) {
								boolean isDelete = true;
								
								for(int x = 0; x < bean.getExistFileUidList().length; x++) {
									if(fileList.get(i).getUid() == bean.getExistFileUidList()[x]) {
										isDelete = false;
										break;
									}
								}
								
								if(isDelete) {
									FileUtil.deleteFile(FileUtil.FILE_DIR_FOR_NOTE + "/" + fileList.get(i).getSaveName());
									dao.deleteTcNoteFile(fileList.get(i).getUid());
								}
							}
						}else {
							for(int i = 0; i < fileList.size(); i++) {
								FileUtil.deleteFile(FileUtil.FILE_DIR_FOR_NOTE + "/" + fileList.get(i).getSaveName());
							}
							
							dao.deleteTcNoteFileList(uid);
						}
					}
					
					if(bean.getFiles() != null) {
						try {
							ScheTcNoteFileInfoBean fileBean = new ScheTcNoteFileInfoBean();
							fileBean.setSchedulerInfoUid(bean.getSchedulerInfoUid());
							fileBean.setScheTcNoteUid(uid);
							fileBean.setUserUid(userUid);
							
							for(int i = 0; i < bean.getFiles().size(); i++) {
								MultipartFile file = bean.getFiles().get(i);
								String saveName = FileUtil.getSaveFileName(FileUtil.NOTE_FILE);
								
								file.transferTo(new File(FileUtil.FILE_DIR_ROOT + FileUtil.FILE_DIR_FOR_NOTE + "/" + saveName));
								
								fileBean.setFileName(file.getOriginalFilename());
								fileBean.setSaveName(saveName);
								fileBean.setFileSize(file.getSize());
								fileBean.setFileType(FileUtil.getFileType(file.getOriginalFilename()));
								dao.insertTcNoteFile(fileBean);
							}
						}catch(Exception e) {
							
						}
					}
					
					isResult = DBConst.SUCCESS;
				}
			}else {
				if(dao.insertTcNote(bean) > DBConst.ZERO) {
					int uid = bean.getUid();
					
					if(bean.getTcUidList() != null) {
						ScheTcNoteTcInfoBean tc = new ScheTcNoteTcInfoBean();
						tc.setSchedulerInfoUid(bean.getSchedulerInfoUid());
						tc.setScheTcNoteUid(uid);
						tc.setUserUid(userUid);
						
						for(int i = 0; i < bean.getTcUidList().length; i++) {
							tc.setSchedulerDetailUid(bean.getTcUidList()[i]);
							dao.insertTcNoteTc(tc);
						}
					}
					
					if(bean.getFiles() != null) {
						try {
							ScheTcNoteFileInfoBean fileBean = new ScheTcNoteFileInfoBean();
							fileBean.setSchedulerInfoUid(bean.getSchedulerInfoUid());
							fileBean.setScheTcNoteUid(uid);
							fileBean.setUserUid(userUid);
							
							for(int i = 0; i < bean.getFiles().size(); i++) {
								MultipartFile file = bean.getFiles().get(i);
								String saveName = FileUtil.getSaveFileName(FileUtil.NOTE_FILE);
								
								file.transferTo(new File(FileUtil.FILE_DIR_ROOT + FileUtil.FILE_DIR_FOR_NOTE + "/" + saveName));
								
								fileBean.setFileName(file.getOriginalFilename());
								fileBean.setSaveName(saveName);
								fileBean.setFileSize(file.getSize());
								fileBean.setFileType(FileUtil.getFileType(file.getOriginalFilename()));
								dao.insertTcNoteFile(fileBean);
							}
						}catch(Exception e) {
							
						}
					}
					
					isResult = DBConst.SUCCESS;
				}
			}
		}
		
		resultMap.put(Const.RESULT, isResult);
		
		return resultMap;
	}

	@Override
	public Map<String, Object> resultCrew(HttpServletRequest request, ParamBean bean) throws Exception {
		Map<String, Object> resultMap = new HashMap<String, Object>();
		List<ScheCrewBean> crewList = dao.getCrewList(bean.getUid());
		
		if(crewList != null) {
			for(int i = 0; i < crewList.size(); i++) {
				crewList.get(i).setInOutList(dao.getCrewInOutList(crewList.get(i).getUid()));
			}
		}
		
		resultMap.put(Const.BEAN, dao.getScheduler(bean.getUid()));
		resultMap.put(Const.LIST, crewList);
		resultMap.put("status", dao.getTrialStatus(bean.getUid()));
		resultMap.put("ongoMin", dao.getOngoChangeDateMinute(bean.getUid()));
		
		return resultMap;
	}
	
	@Override
	public Map<String, Object> resultCrewSave(HttpServletRequest request, ScheCrewListBean bean) throws Exception {
		Map<String, Object> resultMap = new HashMap<String, Object>();
		boolean isResult = DBConst.FAIL;
		String status = dao.getTrialStatus(bean.getSchedulerInfoUid());
		
		if(!DBConst.SCHE_TRIAL_INFO_TRIALSTATUS_ONGOING.equals(status)) {
			resultMap.put(Const.ERRCODE, status);
		}else {
			if(DBConst.Y.equals(dao.isOfflineMode(bean.getSchedulerInfoUid()))) {
				resultMap.put(Const.ERRCODE, Const.ERRCODE_IS_OFFLINE);
			}else {
				int userUid = ((UserInfoBean)(request.getSession().getAttribute(Const.SS_USERINFO))).getUid();
				
				List<Integer> crewUidList = dao.getCrewUidListForDelete(bean);
				
				if(crewUidList != null) {
					for(int i = 0; i < crewUidList.size(); i++) {
						dao.deleteCrew(crewUidList.get(i));
						dao.deleteCrewInoutList(crewUidList.get(i));
					}
				}
				
				if(bean.getUidArr() != null) {
					for(int i = 0; i < bean.getUidArr().length; i++) {
						dao.deleteCrewInoutPerformanceList(bean.getUidArr()[i]);
						
						if(!bean.getOldInDate()[i].isEmpty()) {
							ScheCrewInOutBean inOut = new ScheCrewInOutBean();
							inOut.setScheCrewUid(bean.getUidArr()[i]);
							inOut.setInOutDate(bean.getOldInDate()[i]);
							inOut.setSchedulerInOut(DBConst.SCHE_CREW_INOUT_NONE);
							inOut.setPerformanceInOut(DBConst.SCHE_CREW_INOUT_IN);
							inOut.setUserUid(userUid);
							dao.insertCrewInOut(inOut);
						}
						
						if(!bean.getOldOutDate()[i].isEmpty()) {
							ScheCrewInOutBean inOut = new ScheCrewInOutBean();
							inOut.setScheCrewUid(bean.getUidArr()[i]);
							inOut.setInOutDate(bean.getOldOutDate()[i]);
							inOut.setSchedulerInOut(DBConst.SCHE_CREW_INOUT_NONE);
							inOut.setPerformanceInOut(DBConst.SCHE_CREW_INOUT_OUT);
							inOut.setUserUid(userUid);
							dao.insertCrewInOut(inOut);
						}
					}
				}
				
				if(bean.getKind() != null) {
					for(int i = 0; i < bean.getKind().length; i++) {
						ScheCrewBean crew = new ScheCrewBean();
						crew.setSchedulerInfoUid(bean.getSchedulerInfoUid());
						crew.setKind(bean.getKind()[i]);
						crew.setCompany(bean.getCompany()[i]);
						crew.setDepartment(bean.getDepartment()[i]);
						crew.setName(bean.getName()[i]);
						crew.setRank(bean.getRank()[i]);
						crew.setIdNo(bean.getIdNo()[i]);
						crew.setWorkType1(bean.getWorkType1()[i]);
						crew.setWorkType2(bean.getWorkType2()[i]);
						crew.setMainSub(bean.getMainSub()[i]);
						crew.setFoodStyle(bean.getFoodStyle()[i]);
						crew.setPersonNo(bean.getPersonNo()[i]);
						crew.setPhone(bean.getPhone()[i]);
						crew.setIsPlan(DBConst.N);
						crew.setUserUid(userUid);
						
						if(dao.insertCrew(crew) > DBConst.ZERO) {
							if(!bean.getInDate()[i].isEmpty()) {
								ScheCrewInOutBean inOut = new ScheCrewInOutBean();
								inOut.setScheCrewUid(crew.getUid());
								inOut.setInOutDate(bean.getInDate()[i]);
								inOut.setSchedulerInOut(DBConst.SCHE_CREW_INOUT_NONE);
								inOut.setPerformanceInOut(DBConst.SCHE_CREW_INOUT_IN);
								inOut.setUserUid(userUid);
								dao.insertCrewInOut(inOut);
							}
							
							if(!bean.getOutDate()[i].isEmpty()) {
								ScheCrewInOutBean inOut = new ScheCrewInOutBean();
								inOut.setScheCrewUid(crew.getUid());
								inOut.setInOutDate(bean.getOutDate()[i]);
								inOut.setSchedulerInOut(DBConst.SCHE_CREW_INOUT_NONE);
								inOut.setPerformanceInOut(DBConst.SCHE_CREW_INOUT_OUT);
								inOut.setUserUid(userUid);
								dao.insertCrewInOut(inOut);
							}
						}
					}
				}
				
				isResult = DBConst.SUCCESS;
			}
		}
		
		resultMap.put(Const.RESULT, isResult);
		
		return resultMap;
	}

	@Override
	public Map<String, Object> resultInfo(HttpServletRequest request, ParamBean bean) throws Exception {
		Map<String, Object> resultMap = new HashMap<String, Object>();
		List<ScheCrewBean> mainCrewList = new ArrayList<ScheCrewBean>();
		
		ScheCrewBean crew = new ScheCrewBean();
		crew.setSchedulerInfoUid(bean.getUid());
		
		crew.setWorkType2("A2");
		mainCrewList.add(dao.getMainCrewInfo(crew));
		crew.setWorkType2("A3");
		mainCrewList.add(dao.getMainCrewInfo(crew));
		crew.setWorkType2("A4");
		mainCrewList.add(dao.getMainCrewInfo(crew));
		crew.setWorkType2("C1");
		mainCrewList.add(dao.getMainCrewInfo(crew));
		crew.setWorkType2("D3");
		mainCrewList.add(dao.getMainCrewInfo(crew));
		
		resultMap.put(Const.BEAN, dao.getScheduler(bean.getUid()));
		resultMap.put(Const.LIST + "Commander", dao.getCommanderInfoList(bean.getUid()));
		resultMap.put(Const.LIST + "MainCrew", mainCrewList);
		resultMap.put(Const.LIST + "CrewCnt", dao.getCrewCntInfoList(bean.getUid()));
		resultMap.put(Const.BEAN + "Info", dao.getTrialInfoForResult(bean.getUid()));
		resultMap.put(Const.LIST + "TcCnt", dao.getTcCntList(bean.getUid()));
		resultMap.put("status", dao.getTrialStatus(bean.getUid()));
		resultMap.put("ongoMin", dao.getOngoChangeDateMinute(bean.getUid()));
		
		return resultMap;
	}
	
	@Override
	public Map<String, Object> resultInfoSave(HttpServletRequest request, ScheTrialInfoBean bean) throws Exception {
		Map<String, Object> resultMap = new HashMap<String, Object>();
		boolean isResult = DBConst.FAIL;
		String status = dao.getTrialStatus(bean.getSchedulerInfoUid());
		
		if(!DBConst.SCHE_TRIAL_INFO_TRIALSTATUS_ONGOING.equals(status)) {
			resultMap.put(Const.ERRCODE, status);
		}else {
			if(DBConst.Y.equals(dao.isOfflineMode(bean.getSchedulerInfoUid()))) {
				resultMap.put(Const.ERRCODE, Const.ERRCODE_IS_OFFLINE);
			}else {
				int userUid = ((UserInfoBean)(request.getSession().getAttribute(Const.SS_USERINFO))).getUid();
				bean.setUserUid(userUid);
				
				dao.updateTrialInfo(bean);
				
				isResult = DBConst.SUCCESS;
			}
		}
		
		resultMap.put(Const.RESULT, isResult);
		
		return resultMap;
	}

	@Override
	public Map<String, Object> resultDailyReport(HttpServletRequest request, ParamBean bean) throws Exception {
		Map<String, Object> resultMap = new HashMap<String, Object>();
		int schedulerInfoUid = bean.getUid();
		
		// 현재값 (temp : fuel, draft) (up, down : fuel)
		// 이전값 (마지막 일일보고 or 계획값)
		ScheTrialInfoBean infoBean = dao.getTrialInfoForResult(schedulerInfoUid);
		List<ScheCrewBean> crewList = dao.getCrewListForDaily(schedulerInfoUid);
		ScheReportDailyBean lastReport = dao.getLastDailyReport(schedulerInfoUid);
		boolean isFirst = false;
		
		if(infoBean != null && lastReport == null) {
			infoBean.setCrewRemark(ValidUtil.forHtml(infoBean.getCrewRemark()));
			infoBean.setRemark(ValidUtil.forHtml(infoBean.getRemark()));
			
			isFirst = true;
			lastReport = new ScheReportDailyBean();
			lastReport.setFuelHfo(infoBean.getFuelHfoScheduler());
			lastReport.setFuelMgo(infoBean.getFuelMgoScheduler());
			lastReport.setFuelMdo(infoBean.getFuelMdoScheduler());
			lastReport.setFuelLng(infoBean.getFuelLngScheduler());
			lastReport.setDraftFwd(infoBean.getDraftFwdScheduler());
			lastReport.setDraftMid(infoBean.getDraftMidScheduler());
			lastReport.setDraftAft(infoBean.getDraftAftScheduler());
		}
		
		/// 250309 수정 ///
		SchedulerInfoBean schedulerInfoBean = dao.getScheduler(schedulerInfoUid);
		String sDate = schedulerInfoBean.getSdate();
		String eDate = schedulerInfoBean.getEdate();
		int dateCnt = CommonUtil.calculateDateDifference(sDate, eDate) + 1;
		
		ScheCrewInOutBean tempBean = new ScheCrewInOutBean();
		tempBean.setInOutDate(sDate);
		
		List<ScheCrewCntBean> scheCrewCntList = new ArrayList<ScheCrewCntBean>();
		
		for(int i = 0; i < dateCnt; i++) {
			int crewTotal = 0;
			int crewShi = 0;
			int crewOut = 0;
			int crewOwner = 0;
			int crewClass = 0;
			int crewSe = 0;
			int crewCaptain = 0;
			int crewMate = 0;
			int crewEng = 0;
			int crewEtc = 0;
			
			tempBean.setAddDay(i);
			
			for(int x = 0; x < crewList.size(); x++) {
				ScheCrewBean crew = crewList.get(x);
				tempBean.setScheCrewUid(crew.getUid());
				List<String> inOutList = dao.getPerformanceInOutForCrewDay(tempBean);
				
				if(inOutList != null) {
					boolean isBoard = false;
					boolean isUnBoard = false;
					
					for(int z = 0; z < inOutList.size(); z++) {
						String vl = inOutList.get(z);
						
						if(DBConst.CREW_BOARD.equals(vl)) {
							isBoard = true;
						}else {
							isUnBoard = true;
							break;
						}
					}
					
					if(isBoard && !isUnBoard) {
						String workType1 = crew.getWorkType1();
						String workType2 = crew.getWorkType2();
						
						if("A".equals(workType1) || "B".equals(workType1) || "C".equals(workType1) || "D".equals(workType1)) {
							crewShi++;
						}else if("E".equals(workType1)) {
							crewOut++;
						}
						
						if("E1".equals(workType2)) {
							crewOwner++;
						}else if("E2".equals(workType2)) {
							crewClass++;
						}else if("E3".equals(workType2)) {
							crewSe++;
						}else if("E4".equals(workType2)) {
							crewCaptain++;
						}else if("E5".equals(workType2)) {
							crewMate++;
						}else if("E6".equals(workType2)) {
							crewEng++;
						}else if("E0".equals(workType2) || "E7".equals(workType2) || "E8".equals(workType2)) {
							crewEtc++;
						}
					}
				}
			}
			
			crewTotal = crewShi + crewOut;
			
			ScheCrewCntBean scheCrewCntBean = new ScheCrewCntBean();
			scheCrewCntBean.setCrewTotal(crewTotal);
			scheCrewCntBean.setCrewShi(crewShi);
			scheCrewCntBean.setCrewOut(crewOut);
			scheCrewCntBean.setCrewOwner(crewOwner);
			scheCrewCntBean.setCrewClass(crewClass);
			scheCrewCntBean.setCrewSe(crewSe);
			scheCrewCntBean.setCrewCaptain(crewCaptain);
			scheCrewCntBean.setCrewMate(crewMate);
			scheCrewCntBean.setCrewEng(crewEng);
			scheCrewCntBean.setCrewEtc(crewEtc);
			
			scheCrewCntList.add(scheCrewCntBean);
		}
		
		SchedulerDetailInfoBean detailBean = new SchedulerDetailInfoBean();
		detailBean.setUid(schedulerInfoUid);
		
		resultMap.put(Const.LIST + "DetailInfo", dao.getSchedulerRowDataList(detailBean));
		resultMap.put(Const.BEAN, schedulerInfoBean);
		
		resultMap.put(Const.LIST + "Commander", dao.getCommanderInfoList(schedulerInfoUid));
		resultMap.put(Const.BEAN + "Info", infoBean);
		resultMap.put(Const.BEAN + "Last", lastReport);
		resultMap.put(Const.LIST + "TcCnt", dao.getTcCntList(schedulerInfoUid));
		resultMap.put("status", dao.getTrialStatus(schedulerInfoUid));
		resultMap.put("ongoMin", dao.getOngoChangeDateMinute(schedulerInfoUid));
		resultMap.put("isExist", dao.getExistDailyReport(schedulerInfoUid) != null ? true : false);
		
		resultMap.put(Const.LIST + "CrewDateCnt", scheCrewCntList);
		resultMap.put(Const.BEAN + "DateInfo", dao.getDateInfoForCrewDay(schedulerInfoUid));
		resultMap.put(Const.LIST + "FuelDate", dao.getFuelDateList(schedulerInfoUid));
		///--- 250309 수정 ---///
		
		/// 250317 추가 - 250415 수정  ///
		resultMap.put(Const.LIST + "Tc", dao.getDailyReportTcList(schedulerInfoUid));
		
		List<ScheMailBean> mailList = dao.getLastMailList(schedulerInfoUid);
		
		if(mailList == null || mailList.size() == 0) {
			mailList = dao.getMailList();
		}
		
		resultMap.put(Const.LIST + "Mail", mailList);
		///-- 250317 추가  - 250415 수정 --///
		
		/// 250408 추가 ///
		List<ScheduleBean> scheduleList = new ArrayList<ScheduleBean>();
		ScheduleBean scheDepart = dao.getScheduleDateTimeDeparture(schedulerInfoUid);
		ScheduleBean schePlan = dao.getScheduleDateTimePlan(schedulerInfoUid);
		
		if(scheDepart != null) {
			scheduleList.add(scheDepart);
		}else {
			scheduleList.add(schePlan);
		}
		
		scheduleList.add(schePlan);
		resultMap.put(Const.LIST + "Sche", scheduleList);
		///-- 250408 추가---///
		
		return resultMap;
	}
	
	@Override
	public Map<String, Object> resultDailyReportSubmit(HttpServletRequest request, ScheMailLogBean bean) throws Exception {
		Map<String, Object> resultMap = new HashMap<String, Object>();
		boolean isResult = DBConst.FAIL;
		int schedulerInfoUid = bean.getSchedulerInfoUid();
		String status = dao.getTrialStatus(schedulerInfoUid);
		
		if(!DBConst.SCHE_TRIAL_INFO_TRIALSTATUS_ONGOING.equals(status)) {
			resultMap.put(Const.ERRCODE, status);
		}else if(dao.getExistDailyReport(schedulerInfoUid) != null) {
			resultMap.put(Const.ERRCODE, Const.ERRCODE_EXIST_REPORT);
		}else {
			if(DBConst.Y.equals(dao.isOfflineMode(schedulerInfoUid))) {
				resultMap.put(Const.ERRCODE, Const.ERRCODE_IS_OFFLINE);
			}else {
				ScheTrialInfoBean infoBean = dao.getTrialInfoForResult(schedulerInfoUid);
				
				if(infoBean != null) {
					int userUid = ((UserInfoBean)(request.getSession().getAttribute(Const.SS_USERINFO))).getUid();
					bean.setInsertBy(userUid);
					ScheReportDailyBean report = new ScheReportDailyBean();
					SchedulerInfoBean scheBean = dao.getScheduler(schedulerInfoUid);
					
					report.setSchedulerInfoUid(schedulerInfoUid);
					report.setUserUid(userUid);
					report.setRemark(infoBean.getRemark());
					
					/// 250408 추가 ///
					List<ScheduleBean> scheduleList = new ArrayList<ScheduleBean>();
					ScheduleBean scheDepart = dao.getScheduleDateTimeDeparture(schedulerInfoUid);
					ScheduleBean schePlan = dao.getScheduleDateTimePlan(schedulerInfoUid);
					
					if(scheDepart != null) {
						scheduleList.add(scheDepart);
					}else {
						scheduleList.add(schePlan);
					}
					
					scheduleList.add(schePlan);
					///-- 250408 추가---///
					
					if(scheduleList != null && scheduleList.size() > 0) {
						ScheduleBean schedule = scheduleList.get(0);
						String[] start = schedule.getStartDate().split(" ");
						String[] end = schedule.getEndDate().split(" ");
						
						if(start != null && start.length == 2) {
							report.setStartDate(start[0]);
							report.setStartTime(start[1]);
						}
						
						if(end != null && end.length == 2) {
							report.setEndDate(end[0]);
							report.setEndTime(end[1]);
						}
						
						if(scheduleList.size() > 1) {
							schedule = scheduleList.get(1);
							
							if(schedule != null && schedule.getStartDate() != null && schedule.getEndDate() != null) {
								start = schedule.getStartDate().split(" ");
								end = schedule.getEndDate().split(" ");
								
								if(start != null && start.length == 2) {
									report.setPredStartDate(start[0]);
									report.setPredStartTime(start[1]);
								}
								
								if(end != null && end.length == 2) {
									report.setPredEndDate(end[0]);
									report.setPredEndTime(end[1]);
								}
							}
						}
						
					}
					
					List<ScheCrewBean> commanderList = dao.getCommanderInfoList(schedulerInfoUid);
					
					if(commanderList != null) {
						for(int i = 0; i < commanderList.size(); i++) {
							ScheCrewBean scBean = commanderList.get(i);
							
							if("M".equals(scBean.getMainSub())) {
								report.setCrewName1(scBean.getName());
								report.setCrewPhone1(scBean.getPhone());
							}else {
								report.setCrewName2(scBean.getName());
								report.setCrewPhone2(scBean.getPhone());
							}
						}
					}
					
					// 카운팅
						// 현재 인원수 : 
							// 승선자 목록
								// 승선자별 오늘 기준으로 승선, 하선 체크 : 승선만 되어있으면 1
								// 체크된 숫자 분류별로 더하기
						// 어제 카운팅 인원수 - 오늘 카운팅 인원수 (가장 최근 일일보고 데이터, 없으면 계획 인원수)
					List<ScheCrewBean> crewList = dao.getCrewListForDaily(schedulerInfoUid);
					ScheReportDailyBean lastReport = dao.getLastDailyReport(schedulerInfoUid);
					boolean isFirst = false;
					
					if(lastReport == null) {
						isFirst = true;
						lastReport = new ScheReportDailyBean();
						lastReport.setFuelHfo(infoBean.getFuelHfoScheduler());
						lastReport.setFuelMgo(infoBean.getFuelMgoScheduler());
						lastReport.setFuelMdo(infoBean.getFuelMdoScheduler());
						lastReport.setFuelLng(infoBean.getFuelLngScheduler());
						lastReport.setDraftFwd(infoBean.getDraftFwdScheduler());
						lastReport.setDraftMid(infoBean.getDraftMidScheduler());
						lastReport.setDraftAft(infoBean.getDraftAftScheduler());
						
						List<ScheCrewBean> crewCntList = dao.getCrewCntInfoList(schedulerInfoUid);
						
						if(crewCntList != null) {
							for(int i = 0; i < crewCntList.size(); i++) {
								int cnt = crewCntList.get(i).getCnt();
								String kind = crewCntList.get(i).getKind();
								
								if("TOTAL".equals(kind)) {
									lastReport.setCrewCntTotal(cnt);
								}else if("SHI".equals(kind)) {
									lastReport.setCrewCnt1(cnt);
								}else if("OUT".equals(kind)) {
									lastReport.setCrewCnt2(cnt);
								}else if("OWNER".equals(kind)) {
									lastReport.setCrewCnt3(cnt);
								}else if("CLASS".equals(kind)) {
									lastReport.setCrewCnt4(cnt);
								}else if("SE".equals(kind)) {
									lastReport.setCrewCnt5(cnt);
								}else if("CAPTAIN".equals(kind)) {
									lastReport.setCrewCnt6(cnt);
								}else if("MATE".equals(kind)) {
									lastReport.setCrewCnt7(cnt);
								}else if("ENG".equals(kind)) {
									lastReport.setCrewCnt8(cnt);
								}else if("ETC".equals(kind)) {
									lastReport.setCrewCnt9(cnt);
								}
							}
						}
					}
					
					if(crewList != null) {
						int crewTotal = crewList.size();
						int crewShi = 0;
						int crewOut = 0;
						int crewOwner = 0;
						int crewClass = 0;
						int crewSe = 0;
						int crewCaptain = 0;
						int crewMate = 0;
						int crewEng = 0;
						int crewEtc = 0;
						
						for(int i = 0; i < crewList.size(); i++) {
							ScheCrewBean crew = crewList.get(i);
							
							List<ScheCrewInOutBean> inOutList = dao.getCrewInOutListForDaily(crew.getUid());
							
							if(inOutList != null) {
								for(int x = 0; x < inOutList.size(); x++) {
									ScheCrewInOutBean inOut = inOutList.get(x);
									
									if(DBConst.CREW_BOARD.equals(inOut.getPerformanceInOut())) {
										crew.setBoard(true);
									}
									
									if(DBConst.CREW_UNBOARD.equals(inOut.getPerformanceInOut())) {
										crew.setUnboard(true);
									}
								}
								
								if(crew.isBoard() && !crew.isUnboard()) {
									String workType1 = crew.getWorkType1();
									String workType2 = crew.getWorkType2();
									
									if("A".equals(workType1) || "B".equals(workType1) || "C".equals(workType1) || "D".equals(workType1)) {
										crewShi++;
									}else if("E".equals(workType1)) {
										crewOut++;
									}
									
									if("E1".equals(workType2)) {
										crewOwner++;
									}else if("E2".equals(workType2)) {
										crewClass++;
									}else if("E3".equals(workType2)) {
										crewSe++;
									}else if("E4".equals(workType2)) {
										crewCaptain++;
									}else if("E5".equals(workType2)) {
										crewMate++;
									}else if("E6".equals(workType2)) {
										crewEng++;
									}else if("E0".equals(workType2) || "E7".equals(workType2) || "E8".equals(workType2)) {
										crewEtc++;
									}
								}
							}
						}
						
						crewTotal = crewShi + crewOut;
						
						report.setCrewCntTotal(crewTotal);
						report.setCrewCnt1(crewShi);
						report.setCrewCnt2(crewOut);
						report.setCrewCnt3(crewOwner);
						report.setCrewCnt4(crewClass);
						report.setCrewCnt5(crewSe);
						report.setCrewCnt6(crewCaptain);
						report.setCrewCnt7(crewMate);
						report.setCrewCnt8(crewEng);
						report.setCrewCnt9(crewEtc);
						
						if(isFirst) {
							report.setCrewCntTotalChange(0);
							report.setCrewCnt1Change(0);
							report.setCrewCnt2Change(0);
							report.setCrewCnt3Change(0);
							report.setCrewCnt4Change(0);
							report.setCrewCnt5Change(0);
							report.setCrewCnt6Change(0);
							report.setCrewCnt7Change(0);
							report.setCrewCnt8Change(0);
							report.setCrewCnt9Change(0);
						}else {
							report.setCrewCntTotalChange(crewTotal - lastReport.getCrewCntTotal());
							report.setCrewCnt1Change(crewShi - lastReport.getCrewCnt1());
							report.setCrewCnt2Change(crewOut - lastReport.getCrewCnt2());
							report.setCrewCnt3Change(crewOwner - lastReport.getCrewCnt3());
							report.setCrewCnt4Change(crewClass - lastReport.getCrewCnt4());
							report.setCrewCnt5Change(crewSe - lastReport.getCrewCnt5());
							report.setCrewCnt6Change(crewCaptain - lastReport.getCrewCnt6());
							report.setCrewCnt7Change(crewMate - lastReport.getCrewCnt7());
							report.setCrewCnt8Change(crewEng - lastReport.getCrewCnt8());
							report.setCrewCnt9Change(crewEtc - lastReport.getCrewCnt9());
						}
					}
					
					if(infoBean.getFuelHfoTemp() != null) {
						report.setFuelHfo(infoBean.getFuelHfoTemp());
					}else if(infoBean.getFuelHfoPerformance() != null) {
						report.setFuelHfo(infoBean.getFuelHfoPerformance());
					}else {
						report.setFuelHfo(infoBean.getFuelHfoScheduler());
					}
					
					if(infoBean.getFuelMgoTemp() != null) {
						report.setFuelMgo(infoBean.getFuelMgoTemp());
					}else if(infoBean.getFuelMgoPerformance() != null) {
						report.setFuelMgo(infoBean.getFuelMgoPerformance());
					}else {
						report.setFuelMgo(infoBean.getFuelMgoScheduler());
					}
					
					if(infoBean.getFuelMdoTemp() != null) {
						report.setFuelMdo(infoBean.getFuelMdoTemp());
					}else if(infoBean.getFuelMdoPerformance() != null) {
						report.setFuelMdo(infoBean.getFuelMdoPerformance());
					}else {
						report.setFuelMdo(infoBean.getFuelMdoScheduler());
					}
					
					if(infoBean.getFuelLngTemp() != null) {
						report.setFuelLng(infoBean.getFuelLngTemp());
					}else if(infoBean.getFuelLngPerformance() != null) {
						report.setFuelLng(infoBean.getFuelLngPerformance());
					}else {
						report.setFuelLng(infoBean.getFuelLngScheduler());
					}
					
					if(infoBean.getDraftFwdTemp() != null) {
						report.setDraftFwd(infoBean.getDraftFwdTemp());
					}else if(infoBean.getDraftFwdPerformance() != null) {
						report.setDraftFwd(infoBean.getDraftFwdPerformance());
					}else {
						report.setDraftFwd(infoBean.getDraftFwdScheduler());
					}
					
					if(infoBean.getDraftMidTemp() != null) {
						report.setDraftMid(infoBean.getDraftMidTemp());
					}else if(infoBean.getDraftMidPerformance() != null) {
						report.setDraftMid(infoBean.getDraftMidPerformance());
					}else {
						report.setDraftMid(infoBean.getDraftMidScheduler());
					}
					
					if(infoBean.getDraftAftTemp() != null) {
						report.setDraftAft(infoBean.getDraftAftTemp());
					}else if(infoBean.getDraftAftPerformance() != null) {
						report.setDraftAft(infoBean.getDraftAftPerformance());
					}else {
						report.setDraftAft(infoBean.getDraftAftScheduler());
					}
					
					report.setFuelHfoUp(infoBean.getFuelHfoUp());
					report.setFuelMgoUp(infoBean.getFuelMgoUp());
					report.setFuelMdoUp(infoBean.getFuelMdoUp());
					report.setFuelLngUp(infoBean.getFuelLngUp());
					
					report.setFuelHfoDown(infoBean.getFuelHfoDown());
					report.setFuelMgoDown(infoBean.getFuelMgoDown());
					report.setFuelMdoDown(infoBean.getFuelMdoDown());
					report.setFuelLngDown(infoBean.getFuelLngDown());
					
					report.setFuelHfoPrev(lastReport.getFuelHfo());
					report.setFuelMgoPrev(lastReport.getFuelMgo());
					report.setFuelMdoPrev(lastReport.getFuelMdo());
					report.setFuelLngPrev(lastReport.getFuelLng());
					
					report.setDraftFwdPrev(lastReport.getDraftFwd());
					report.setDraftMidPrev(lastReport.getDraftMid());
					report.setDraftAftPrev(lastReport.getDraftAft());
					
					List<Integer> tcCntList = dao.getTcCntList(schedulerInfoUid);
					
					if(tcCntList != null && tcCntList.size() == 4) {
						report.setSeaTrialTest(tcCntList.get(0));
						report.setHull(tcCntList.get(1));
						report.setMachinery(tcCntList.get(2));
						report.setElectric(tcCntList.get(3));
					}
						
					if(dao.insertReportDaily(report) > DBConst.ZERO) {
						// temp -> performance (fuel, draft)
						// temp : null (fuel, draft)
						// up : null (fuel)
						// down : null (fuel)
						ScheTrialInfoBean trial = new ScheTrialInfoBean();
						trial.setSchedulerInfoUid(schedulerInfoUid);
						trial.setUserUid(userUid);
						trial.setFuelHfoPerformance(report.getFuelHfo());
						trial.setFuelMgoPerformance(report.getFuelMgo());
						trial.setFuelMdoPerformance(report.getFuelMdo());
						trial.setFuelLngPerformance(report.getFuelLng());
						trial.setDraftFwdPerformance(report.getDraftFwd());
						trial.setDraftMidPerformance(report.getDraftMid());
						trial.setDraftAftPerformance(report.getDraftAft());
						
						if(dao.updateTrialInfoForDaily(trial) > DBConst.ZERO) {
							List<SchedulerDetailInfoBean> tcPerformanceList = dao.getTcPerformanceDateTimeListForDaily(schedulerInfoUid);
							
							if(tcPerformanceList != null) {
								for(int i = 0; i < tcPerformanceList.size(); i++) {
									SchedulerDetailInfoBean tc = tcPerformanceList.get(i);
									tc.setUserUid(userUid);
									dao.insertTcPerformanceDateTimeForDaily(tc);
								}
							}
							
							/// 데이터 개정 추가 (25.02.26)
							// REVSCHEDULERINFO
							// REVSCHEDULERVERSIONINFO
							// REVSCHEDULERDETAIL
							// REVSCHEDATETIME
							// REVSCHETRIALINFO
							// REVSCHECREW
							// REVSCHECREWINOUT
							// REVSCHETCNOTE
							// REVSCHETCNOTEFILEINFO
							// REVSCHETCNOTETCINFO
							
							SchedulerInfoBean revSchedulerInfoBean = revDao.getSchedulerInfo(schedulerInfoUid);
							SchedulerVersionInfoBean revSchedulerVersionInfoBean = null;
							List<SchedulerDetailInfoBean> revSchedulerDetailInfoList = revDao.getSchedulerDetailList(schedulerInfoUid);
							List<ScheDateTimeBean> revScheDateTimeList = revDao.getScheDatetimeList(schedulerInfoUid);
							ScheTrialInfoBean revScheTrialInfoBean = revDao.getScheTrialInfo(schedulerInfoUid);
							List<ScheCrewBean> revScheCrewList = revDao.getScheCrewList(schedulerInfoUid);
							List<ScheCrewInOutBean> revScheCrewInOutList = revDao.getScheCrewInOutList(schedulerInfoUid);
							List<ScheTcNoteBean> revScheTcNoteList = revDao.getScheTcNoteList(schedulerInfoUid);
							List<ScheTcNoteFileInfoBean> revScheTcNoteFileInfoList = revDao.getScheTcNoteFileInfoList(schedulerInfoUid);
							List<ScheTcNoteTcInfoBean> revScheTcNoteTcInfoList = revDao.getScheTcNoteTcInfoList(schedulerInfoUid);
							String revKind = DBConst.REV_KIND_DAILY;
							String revDay = CommonUtil.getDateStr(false);
							
							if(revSchedulerInfoBean != null && revSchedulerInfoBean.getSchedulerVersionInfoUid() > 0) {
								revSchedulerVersionInfoBean = revDao.getSchedulerVersionInfo(revSchedulerInfoBean.getSchedulerVersionInfoUid());
							}
							
							if(revSchedulerInfoBean != null) {
								revSchedulerInfoBean.setRevKind(revKind);
								revSchedulerInfoBean.setRevDay(revDay);
								revDao.insertSchedulerInfo(revSchedulerInfoBean);
							}
							
							if(revSchedulerVersionInfoBean != null) {
								revSchedulerVersionInfoBean.setRevKind(revKind);
								revSchedulerVersionInfoBean.setRevDay(revDay);
								revDao.insertSchedulerVersionInfo(revSchedulerVersionInfoBean);
							}
							
							if(revSchedulerDetailInfoList != null) {
								for(int i = 0; i < revSchedulerDetailInfoList.size(); i++) {
									SchedulerDetailInfoBean revBean = revSchedulerDetailInfoList.get(i);
									revBean.setRevKind(revKind);
									revBean.setRevDay(revDay);
									revDao.insertSchedulerDetail(revBean);
								}
							}
							
							if(revScheDateTimeList != null) {
								for(int i = 0; i < revScheDateTimeList.size(); i++) {
									ScheDateTimeBean revBean = revScheDateTimeList.get(i);
									revBean.setRevKind(revKind);
									revBean.setRevDay(revDay);
									revDao.insertScheDatetime(revBean);
								}
							}
							
							if(revScheTrialInfoBean != null) {
								revScheTrialInfoBean.setRevKind(revKind);
								revScheTrialInfoBean.setRevDay(revDay);
								revDao.insertScheTrialInfo(revScheTrialInfoBean);
							}
							
							if(revScheCrewList != null) {
								for(int i = 0; i < revScheCrewList.size(); i++) {
									ScheCrewBean revBean = revScheCrewList.get(i);
									revBean.setRevKind(revKind);
									revBean.setRevDay(revDay);
									revDao.insertScheCrew(revBean);
								}
							}
							
							if(revScheCrewInOutList != null) {
								for(int i = 0; i < revScheCrewInOutList.size(); i++) {
									ScheCrewInOutBean revBean = revScheCrewInOutList.get(i);
									revBean.setRevKind(revKind);
									revBean.setRevDay(revDay);
									revDao.insertScheCrewInOut(revBean);
								}
							}
							
							if(revScheTcNoteList != null) {
								for(int i = 0; i < revScheTcNoteList.size(); i++) {
									ScheTcNoteBean revBean = revScheTcNoteList.get(i);
									revBean.setRevKind(revKind);
									revBean.setRevDay(revDay);
									revDao.insertScheTcNote(revBean);
								}
							}
							
							if(revScheTcNoteFileInfoList != null) {
								for(int i = 0; i < revScheTcNoteFileInfoList.size(); i++) {
									ScheTcNoteFileInfoBean revBean = revScheTcNoteFileInfoList.get(i);
									revBean.setRevKind(revKind);
									revBean.setRevDay(revDay);
									revDao.insertScheTcNoteFileInfo(revBean);
								}
							}
							
							if(revScheTcNoteTcInfoList != null) {
								for(int i = 0; i < revScheTcNoteTcInfoList.size(); i++) {
									ScheTcNoteTcInfoBean revBean = revScheTcNoteTcInfoList.get(i);
									revBean.setRevKind(revKind);
									revBean.setRevDay(revDay);
									revDao.insertScheTcNoteTcInfo(revBean);
								}
							}
							///-- 데이터 개정 추가 (25.02.26)
							
							String date = CommonUtil.getDateStr(false);
							bean.setTitle("[SCP " + date + "] " + scheBean.getHullnum() + " 해상 시운전 일일 보고 (" + scheBean.getDescription() + ")");
							bean.setDesc("[SCP " + date + "] " + scheBean.getHullnum() + " 해상 시운전 일일 보고입니다. (" + scheBean.getDescription() + ")");
							bean.setFileName("scp_report.pdf");

							try {
								// 250317 추가 //
								if(bean.getToList() != null && bean.getToList().length > 0) {
									dao.deleteLastMailList(schedulerInfoUid);		
									
									for(int i = 0; i < bean.getToList().length; i++) {
										ScheMailLogBean mailLog = new ScheMailLogBean();
										mailLog.setSchedulerInfoUid(schedulerInfoUid);
										mailLog.setToStep(DBConst.SCHE_MAIL_LOG_TOSTEP_LAST);
										mailLog.setToStepUid(report.getUid());
										mailLog.setKind(DBConst.SCHE_MAIL_LOG_KIND_TO);
										mailLog.setEmail(bean.getToList()[i]);
										mailLog.setInsertBy(userUid);
										dao.insertMailLog(mailLog);
									}
								}
								//-- 250317 추가 --//
								
								if(SmtpUtil.sendEmail(bean)) {
									if(bean.getToList() != null) {
										for(int i = 0; i < bean.getToList().length; i++) {
											ScheMailLogBean mailLog = new ScheMailLogBean();
											mailLog.setSchedulerInfoUid(schedulerInfoUid);
											mailLog.setToStep(DBConst.SCHE_MAIL_LOG_TOSTEP_DAILY);
											mailLog.setToStepUid(report.getUid());
											mailLog.setKind(DBConst.SCHE_MAIL_LOG_KIND_TO);
											mailLog.setEmail(bean.getToList()[i]);
											mailLog.setInsertBy(userUid);
											dao.insertMailLog(mailLog);
										}
									}
									
									if(bean.getCcList() != null) {
										for(int i = 0; i < bean.getCcList().length; i++) {
											ScheMailLogBean mailLog = new ScheMailLogBean();
											mailLog.setSchedulerInfoUid(schedulerInfoUid);
											mailLog.setToStep(DBConst.SCHE_MAIL_LOG_TOSTEP_DAILY);
											mailLog.setToStepUid(report.getUid());
											mailLog.setKind(DBConst.SCHE_MAIL_LOG_KIND_CC);
											mailLog.setEmail(bean.getCcList()[i]);
											mailLog.setInsertBy(userUid);
											dao.insertMailLog(mailLog);
										}
									}
									
									if(bean.getBccList() != null) {
										for(int i = 0; i < bean.getBccList().length; i++) {
											ScheMailLogBean mailLog = new ScheMailLogBean();
											mailLog.setSchedulerInfoUid(schedulerInfoUid);
											mailLog.setToStep(DBConst.SCHE_MAIL_LOG_TOSTEP_DAILY);
											mailLog.setToStepUid(report.getUid());
											mailLog.setKind(DBConst.SCHE_MAIL_LOG_KIND_BCC);
											mailLog.setEmail(bean.getBccList()[i]);
											mailLog.setInsertBy(userUid);
											dao.insertMailLog(mailLog);
										}
									}
								}
							}catch(Exception e) {}
							
							isResult = DBConst.SUCCESS;
						}
					}
				}else {
					resultMap.put(Const.ERRCODE, Const.ERRCODE_EMPTY_INFO);
				}
			}
		}
		
		resultMap.put(Const.RESULT, isResult);
		
		return resultMap;
	}

	@Override
	public Map<String, Object> resultCompReport(HttpServletRequest request, ParamBean bean) throws Exception {
		Map<String, Object> resultMap = new HashMap<String, Object>();
		int schedulerInfoUid = bean.getUid();
		ScheTrialInfoBean infoBean = dao.getTrialInfoForResult(schedulerInfoUid);
		List<ScheTcNoteBean> noteList = dao.getTcNoteListForComp(schedulerInfoUid);
		
		if(infoBean != null) {
			infoBean.setCrewRemark(ValidUtil.forHtml(infoBean.getCrewRemark()));
			infoBean.setRemark(ValidUtil.forHtml(infoBean.getRemark()));
			infoBean.setTrialTime(dao.getTotalTrialTime(schedulerInfoUid));
			
			if(infoBean.getTrial1SchedulerInfoUid() > 0) {
				infoBean.setTrial1Time(dao.getTotalTrialTime(infoBean.getTrial1SchedulerInfoUid()));
				resultMap.put(Const.BEAN + "Trial1", dao.getTrialFuel(infoBean.getTrial1SchedulerInfoUid()));
				resultMap.put(Const.BEAN + "Trial1Comp", dao.getTrialCompData(infoBean.getTrial1SchedulerInfoUid()));	// 250309
			}
			
			if(infoBean.getTrial2SchedulerInfoUid() > 0) {
				infoBean.setTrial2Time(dao.getTotalTrialTime(infoBean.getTrial2SchedulerInfoUid()));
				resultMap.put(Const.BEAN + "Trial2", dao.getTrialFuel(infoBean.getTrial2SchedulerInfoUid()));
				resultMap.put(Const.BEAN + "Trial2Comp", dao.getTrialCompData(infoBean.getTrial2SchedulerInfoUid()));	// 250309
			}
		}
		
		if(noteList != null) {
			for(int i = 0; i < noteList.size(); i++) {
				ScheTcNoteBean note = noteList.get(i);
				note.setTcList(dao.getTcNoteTcListForComp(note.getUid()));
				note.setFileList(dao.getTcNoteFileListForComp(note.getUid()));
			}
		}
		
		/// 250309 수정 ///
		SchedulerInfoBean schedulerInfoBean = dao.getScheduler(schedulerInfoUid);
		String sDate = schedulerInfoBean.getSdate();
		String eDate = schedulerInfoBean.getEdate();
		int dateCnt = CommonUtil.calculateDateDifference(sDate, eDate) + 1;
		
		ScheCrewInOutBean tempBean = new ScheCrewInOutBean();
		tempBean.setInOutDate(sDate);
		
		List<ScheCrewBean> crewList = dao.getCrewListForDaily(schedulerInfoUid);
		List<ScheCrewCntBean> scheCrewCntList = new ArrayList<ScheCrewCntBean>();
		
		for(int i = 0; i < dateCnt; i++) {
			int crewTotal = 0;
			int crewShi = 0;
			int crewOut = 0;
			int crewOwner = 0;
			int crewClass = 0;
			int crewSe = 0;
			int crewCaptain = 0;
			int crewMate = 0;
			int crewEng = 0;
			int crewEtc = 0;
			
			tempBean.setAddDay(i);
			
			for(int x = 0; x < crewList.size(); x++) {
				ScheCrewBean crew = crewList.get(x);
				tempBean.setScheCrewUid(crew.getUid());
				List<String> inOutList = dao.getPerformanceInOutForCrewDay(tempBean);
				
				if(inOutList != null) {
					boolean isBoard = false;
					boolean isUnBoard = false;
					
					for(int z = 0; z < inOutList.size(); z++) {
						String vl = inOutList.get(z);
						
						if(DBConst.CREW_BOARD.equals(vl)) {
							isBoard = true;
						}else {
							isUnBoard = true;
							break;
						}
					}
					
					if(isBoard && !isUnBoard) {
						String workType1 = crew.getWorkType1();
						String workType2 = crew.getWorkType2();
						
						if("A".equals(workType1) || "B".equals(workType1) || "C".equals(workType1) || "D".equals(workType1)) {
							crewShi++;
						}else if("E".equals(workType1)) {
							crewOut++;
						}
						
						if("E1".equals(workType2)) {
							crewOwner++;
						}else if("E2".equals(workType2)) {
							crewClass++;
						}else if("E3".equals(workType2)) {
							crewSe++;
						}else if("E4".equals(workType2)) {
							crewCaptain++;
						}else if("E5".equals(workType2)) {
							crewMate++;
						}else if("E6".equals(workType2)) {
							crewEng++;
						}else if("E0".equals(workType2) || "E7".equals(workType2) || "E8".equals(workType2)) {
							crewEtc++;
						}
					}
				}
			}
			
			crewTotal = crewShi + crewOut;
			
			ScheCrewCntBean scheCrewCntBean = new ScheCrewCntBean();
			scheCrewCntBean.setCrewTotal(crewTotal);
			scheCrewCntBean.setCrewShi(crewShi);
			scheCrewCntBean.setCrewOut(crewOut);
			scheCrewCntBean.setCrewOwner(crewOwner);
			scheCrewCntBean.setCrewClass(crewClass);
			scheCrewCntBean.setCrewSe(crewSe);
			scheCrewCntBean.setCrewCaptain(crewCaptain);
			scheCrewCntBean.setCrewMate(crewMate);
			scheCrewCntBean.setCrewEng(crewEng);
			scheCrewCntBean.setCrewEtc(crewEtc);
			
			scheCrewCntList.add(scheCrewCntBean);
		}
		
		resultMap.put(Const.BEAN, schedulerInfoBean);
		
		resultMap.put(Const.BEAN + "Info", infoBean);
		resultMap.put(Const.LIST + "Commander", dao.getCommanderInfoList(schedulerInfoUid));
		resultMap.put(Const.BEAN + "FuelDown", dao.getTotalFuelDown(schedulerInfoUid));
		resultMap.put(Const.LIST + "TcCnt", dao.getTcCntList(schedulerInfoUid));
		resultMap.put(Const.LIST + "CrewCnt", dao.getCrewCntInfoListForComp(schedulerInfoUid));
		resultMap.put(Const.LIST + "Note", noteList);
		resultMap.put("status", dao.getTrialStatus(schedulerInfoUid));
		resultMap.put("ongoMin", dao.getOngoChangeDateMinute(schedulerInfoUid));
		
		resultMap.put(Const.LIST + "CrewDateCnt", scheCrewCntList);
		resultMap.put(Const.BEAN + "DateInfo", dao.getDateInfoForCrewDay(schedulerInfoUid));
		resultMap.put(Const.LIST + "FuelDate", dao.getFuelDateList(schedulerInfoUid));
		///--- 250309 수정 ---///
		
		/// 250317 추가  - 250415 수정 ///
		List<ScheMailBean> mailList = dao.getLastMailList(schedulerInfoUid);
		
		if(mailList == null || mailList.size() == 0) {
			mailList = dao.getMailList();
		}
		
		resultMap.put(Const.LIST + "Mail", mailList);
		///-- 250317 추가  - 250415 수정 --///
		
		/// 250408 추가 ///
		List<ScheduleBean> scheduleList = new ArrayList<ScheduleBean>();
		ScheduleBean scheDepart = dao.getScheduleDateTimeDeparture(schedulerInfoUid);
		ScheduleBean schePerformance = dao.getScheduleDateTimePerformance(schedulerInfoUid);
		
		if(scheDepart != null) {
			scheduleList.add(scheDepart);
		}else {
			scheduleList.add(dao.getScheduleDateTimePlan(schedulerInfoUid));
		}
		
		if(schePerformance != null) {
			scheduleList.add(schePerformance);
		}
		
		resultMap.put(Const.LIST + "Sche", scheduleList);
		///-- 250408 추가---///
		
		return resultMap;
	}
	
	@Override
	public Map<String, Object> resultCompReportSubmit(HttpServletRequest request, ScheMailLogBean bean) throws Exception {
		Map<String, Object> resultMap = new HashMap<String, Object>();
		boolean isResult = DBConst.FAIL;
		int schedulerInfoUid = bean.getSchedulerInfoUid();
		String status = dao.getTrialStatus(schedulerInfoUid);
		
		if(!DBConst.SCHE_TRIAL_INFO_TRIALSTATUS_ONGOING.equals(status)) {
			resultMap.put(Const.ERRCODE, status);
		}else {
			if(DBConst.Y.equals(dao.isOfflineMode(schedulerInfoUid))) {
				resultMap.put(Const.ERRCODE, Const.ERRCODE_IS_OFFLINE);
			}else {
				ScheTrialInfoBean infoBean = dao.getTrialInfoForResult(schedulerInfoUid);
				
				if(infoBean != null) {
					int userUid = ((UserInfoBean)(request.getSession().getAttribute(Const.SS_USERINFO))).getUid();
					bean.setInsertBy(userUid);
					ScheReportCompBean report = new ScheReportCompBean();
					SchedulerInfoBean scheBean = dao.getScheduler(schedulerInfoUid);
					
					report.setSchedulerInfoUid(schedulerInfoUid);
					report.setUserUid(userUid);
					report.setRemark(infoBean.getRemark());
					
					/// 250408 추가 ///
					List<ScheduleBean> scheduleList = new ArrayList<ScheduleBean>();
					ScheduleBean scheDepart = dao.getScheduleDateTimeDeparture(schedulerInfoUid);
					ScheduleBean schePerformance = dao.getScheduleDateTimePerformance(schedulerInfoUid);
					
					if(scheDepart != null) {
						scheduleList.add(scheDepart);
					}else {
						scheduleList.add(dao.getScheduleDateTimePlan(schedulerInfoUid));
					}
					
					if(schePerformance != null) {
						scheduleList.add(schePerformance);
					}
					///-- 250408 추가---///
					
					if(scheduleList != null && scheduleList.size() > 0) {
						ScheduleBean schedule = scheduleList.get(0);
						String[] start = schedule.getStartDate().split(" ");
						String[] end = schedule.getEndDate().split(" ");
						
						if(start != null && start.length == 2) {
							report.setStartDate(start[0]);
							report.setStartTime(start[1]);
						}
						
						if(end != null && end.length == 2) {
							report.setEndDate(end[0]);
							report.setEndTime(end[1]);
						}
						
						if(scheduleList.size() > 1) {
							schedule = scheduleList.get(1);
							
							if(schedule != null && schedule.getStartDate() != null && schedule.getEndDate() != null) {
								start = schedule.getStartDate().split(" ");
								end = schedule.getEndDate().split(" ");
								
								if(start != null && start.length == 2) {
									report.setPerformanceStartDate(start[0]);
									report.setPerformanceStartTime(start[1]);
								}
								
								if(end != null && end.length == 2) {
									report.setPerformanceEndDate(end[0]);
									report.setPerformanceEndTime(end[1]);
								}
							}
						}
						
					}
					
					List<ScheCrewBean> commanderList = dao.getCommanderInfoList(schedulerInfoUid);
					
					if(commanderList != null) {
						for(int i = 0; i < commanderList.size(); i++) {
							ScheCrewBean scBean = commanderList.get(i);
							
							if("M".equals(scBean.getMainSub())) {
								report.setCrewName1(scBean.getName());
								report.setCrewPhone1(scBean.getPhone());
							}else {
								report.setCrewName2(scBean.getName());
								report.setCrewPhone2(scBean.getPhone());
							}
						}
					}
					
					report.setTrial1SchedulerInfoUid(infoBean.getTrial1SchedulerInfoUid());
					report.setTrial2SchedulerInfoUid(infoBean.getTrial2SchedulerInfoUid());
					
					List<Integer> tcCntList = dao.getTcCntList(schedulerInfoUid);
					
					if(tcCntList != null && tcCntList.size() == 4) {
						report.setSeaTrialTest(tcCntList.get(0));
						report.setHull(tcCntList.get(1));
						report.setMachinery(tcCntList.get(2));
						report.setElectric(tcCntList.get(3));
					}
					
					if(infoBean.getFuelHfoScheduler() != null) {
						if(infoBean.getFuelHfoTemp() != null) {
							report.setFuelHfo(infoBean.getFuelHfoTemp());
						}else if(infoBean.getFuelHfoPerformance() != null) {
							report.setFuelHfo(infoBean.getFuelHfoPerformance());
						}else {
							report.setFuelHfo(infoBean.getFuelHfoScheduler());
						}
					}
					
					if(infoBean.getFuelMgoScheduler() != null) {
						if(infoBean.getFuelMgoTemp() != null) {
							report.setFuelMgo(infoBean.getFuelMgoTemp());
						}else if(infoBean.getFuelMgoPerformance() != null) {
							report.setFuelMgo(infoBean.getFuelMgoPerformance());
						}else {
							report.setFuelMgo(infoBean.getFuelMgoScheduler());
						}
					}
					
					if(infoBean.getFuelMdoScheduler() != null) {
						if(infoBean.getFuelMdoTemp() != null) {
							report.setFuelMdo(infoBean.getFuelMdoTemp());
						}else if(infoBean.getFuelMdoPerformance() != null) {
							report.setFuelMdo(infoBean.getFuelMdoPerformance());
						}else {
							report.setFuelMdo(infoBean.getFuelMdoScheduler());
						}
					}
					
					if(infoBean.getFuelLngScheduler() != null) {
						if(infoBean.getFuelLngTemp() != null) {
							report.setFuelLng(infoBean.getFuelLngTemp());
						}else if(infoBean.getFuelLngPerformance() != null) {
							report.setFuelLng(infoBean.getFuelLngPerformance());
						}else {
							report.setFuelLng(infoBean.getFuelLngScheduler());
						}
					}
					
					List<ScheCrewBean> crewCntList = dao.getCrewCntInfoListForComp(schedulerInfoUid);
					
					if(crewCntList != null) {
						for(int i = 0; i < crewCntList.size(); i++) {
							int cnt = crewCntList.get(i).getCnt();
							String kind = crewCntList.get(i).getKind();
							
							if("TOTAL".equals(kind)) {
								report.setCrewCntTotal(cnt);
							}else if("SHI".equals(kind)) {
								report.setCrewCnt1(cnt);
							}else if("OUT".equals(kind)) {
								report.setCrewCnt2(cnt);
							}else if("OWNER".equals(kind)) {
								report.setCrewCnt3(cnt);
							}else if("CLASS".equals(kind)) {
								report.setCrewCnt4(cnt);
							}else if("SE".equals(kind)) {
								report.setCrewCnt5(cnt);
							}else if("CAPTAIN".equals(kind)) {
								report.setCrewCnt6(cnt);
							}else if("MATE".equals(kind)) {
								report.setCrewCnt7(cnt);
							}else if("ENG".equals(kind)) {
								report.setCrewCnt8(cnt);
							}else if("ETC".equals(kind)) {
								report.setCrewCnt9(cnt);
							}
						}
					}
					
					if(dao.insertReportComp(report) > DBConst.ZERO) {
						ScheTrialInfoBean trial = new ScheTrialInfoBean();
						trial.setSchedulerInfoUid(schedulerInfoUid);
						trial.setTrialStatus(DBConst.SCHE_TRIAL_INFO_TRIALSTATUS_ARRIVAL);
						trial.setUserUid(userUid);
						
						if(dao.updateTrialStatus(trial) > DBConst.ZERO) {
							/// 데이터 개정 추가 (25.02.26)
							// REVSCHEDULERINFO
							// REVSCHEDULERVERSIONINFO
							// REVSCHEDULERDETAIL
							// REVSCHEDATETIME
							// REVSCHETRIALINFO
							// REVSCHECREW
							// REVSCHECREWINOUT
							// REVSCHETCNOTE
							// REVSCHETCNOTEFILEINFO
							// REVSCHETCNOTETCINFO
							
							SchedulerInfoBean revSchedulerInfoBean = revDao.getSchedulerInfo(schedulerInfoUid);
							SchedulerVersionInfoBean revSchedulerVersionInfoBean = null;
							List<SchedulerDetailInfoBean> revSchedulerDetailInfoList = revDao.getSchedulerDetailList(schedulerInfoUid);
							List<ScheDateTimeBean> revScheDateTimeList = revDao.getScheDatetimeList(schedulerInfoUid);
							ScheTrialInfoBean revScheTrialInfoBean = revDao.getScheTrialInfo(schedulerInfoUid);
							List<ScheCrewBean> revScheCrewList = revDao.getScheCrewList(schedulerInfoUid);
							List<ScheCrewInOutBean> revScheCrewInOutList = revDao.getScheCrewInOutList(schedulerInfoUid);
							List<ScheTcNoteBean> revScheTcNoteList = revDao.getScheTcNoteList(schedulerInfoUid);
							List<ScheTcNoteFileInfoBean> revScheTcNoteFileInfoList = revDao.getScheTcNoteFileInfoList(schedulerInfoUid);
							List<ScheTcNoteTcInfoBean> revScheTcNoteTcInfoList = revDao.getScheTcNoteTcInfoList(schedulerInfoUid);
							String revKind = DBConst.REV_KIND_COMP;
							String revDay = CommonUtil.getDateStr(false);
							
							if(revSchedulerInfoBean != null && revSchedulerInfoBean.getSchedulerVersionInfoUid() > 0) {
								revSchedulerVersionInfoBean = revDao.getSchedulerVersionInfo(revSchedulerInfoBean.getSchedulerVersionInfoUid());
							}
							
							if(revSchedulerInfoBean != null) {
								revSchedulerInfoBean.setRevKind(revKind);
								revSchedulerInfoBean.setRevDay(revDay);
								revDao.insertSchedulerInfo(revSchedulerInfoBean);
							}
							
							if(revSchedulerVersionInfoBean != null) {
								revSchedulerVersionInfoBean.setRevKind(revKind);
								revSchedulerVersionInfoBean.setRevDay(revDay);
								revDao.insertSchedulerVersionInfo(revSchedulerVersionInfoBean);
							}
							
							if(revSchedulerDetailInfoList != null) {
								for(int i = 0; i < revSchedulerDetailInfoList.size(); i++) {
									SchedulerDetailInfoBean revBean = revSchedulerDetailInfoList.get(i);
									revBean.setRevKind(revKind);
									revBean.setRevDay(revDay);
									revDao.insertSchedulerDetail(revBean);
								}
							}
							
							if(revScheDateTimeList != null) {
								for(int i = 0; i < revScheDateTimeList.size(); i++) {
									ScheDateTimeBean revBean = revScheDateTimeList.get(i);
									revBean.setRevKind(revKind);
									revBean.setRevDay(revDay);
									revDao.insertScheDatetime(revBean);
								}
							}
							
							if(revScheTrialInfoBean != null) {
								revScheTrialInfoBean.setRevKind(revKind);
								revScheTrialInfoBean.setRevDay(revDay);
								revDao.insertScheTrialInfo(revScheTrialInfoBean);
							}
							
							if(revScheCrewList != null) {
								for(int i = 0; i < revScheCrewList.size(); i++) {
									ScheCrewBean revBean = revScheCrewList.get(i);
									revBean.setRevKind(revKind);
									revBean.setRevDay(revDay);
									revDao.insertScheCrew(revBean);
								}
							}
							
							if(revScheCrewInOutList != null) {
								for(int i = 0; i < revScheCrewInOutList.size(); i++) {
									ScheCrewInOutBean revBean = revScheCrewInOutList.get(i);
									revBean.setRevKind(revKind);
									revBean.setRevDay(revDay);
									revDao.insertScheCrewInOut(revBean);
								}
							}
							
							if(revScheTcNoteList != null) {
								for(int i = 0; i < revScheTcNoteList.size(); i++) {
									ScheTcNoteBean revBean = revScheTcNoteList.get(i);
									revBean.setRevKind(revKind);
									revBean.setRevDay(revDay);
									revDao.insertScheTcNote(revBean);
								}
							}
							
							if(revScheTcNoteFileInfoList != null) {
								for(int i = 0; i < revScheTcNoteFileInfoList.size(); i++) {
									ScheTcNoteFileInfoBean revBean = revScheTcNoteFileInfoList.get(i);
									revBean.setRevKind(revKind);
									revBean.setRevDay(revDay);
									revDao.insertScheTcNoteFileInfo(revBean);
								}
							}
							
							if(revScheTcNoteTcInfoList != null) {
								for(int i = 0; i < revScheTcNoteTcInfoList.size(); i++) {
									ScheTcNoteTcInfoBean revBean = revScheTcNoteTcInfoList.get(i);
									revBean.setRevKind(revKind);
									revBean.setRevDay(revDay);
									revDao.insertScheTcNoteTcInfo(revBean);
								}
							}
							///-- 데이터 개정 추가 (25.02.26)
							
							bean.setTitle("[SCP] " + scheBean.getHullnum() + " 해상 시운전 완료 보고 (" + scheBean.getDescription() + ")");
							bean.setDesc("[SCP] " + scheBean.getHullnum() + " 해상 시운전 완료 보고입니다. (" + scheBean.getDescription() + ")");
							bean.setFileName("scp_report.pdf");
							
							try {
								// 250317 추가 //
								if(bean.getToList() != null && bean.getToList().length > 0) {
									dao.deleteLastMailList(schedulerInfoUid);		
									
									for(int i = 0; i < bean.getToList().length; i++) {
										ScheMailLogBean mailLog = new ScheMailLogBean();
										mailLog.setSchedulerInfoUid(schedulerInfoUid);
										mailLog.setToStep(DBConst.SCHE_MAIL_LOG_TOSTEP_LAST);
										mailLog.setToStepUid(report.getUid());
										mailLog.setKind(DBConst.SCHE_MAIL_LOG_KIND_TO);
										mailLog.setEmail(bean.getToList()[i]);
										mailLog.setInsertBy(userUid);
										dao.insertMailLog(mailLog);
									}
								}
								//-- 250317 추가 --//
								
								if(SmtpUtil.sendEmail(bean)) {
									if(bean.getToList() != null) {
										for(int i = 0; i < bean.getToList().length; i++) {
											ScheMailLogBean mailLog = new ScheMailLogBean();
											mailLog.setSchedulerInfoUid(schedulerInfoUid);
											mailLog.setToStep(DBConst.SCHE_MAIL_LOG_TOSTEP_COMP);
											mailLog.setToStepUid(report.getUid());
											mailLog.setKind(DBConst.SCHE_MAIL_LOG_KIND_TO);
											mailLog.setEmail(bean.getToList()[i]);
											mailLog.setInsertBy(userUid);
											dao.insertMailLog(mailLog);
										}
									}
									
									if(bean.getCcList() != null) {
										for(int i = 0; i < bean.getCcList().length; i++) {
											ScheMailLogBean mailLog = new ScheMailLogBean();
											mailLog.setSchedulerInfoUid(schedulerInfoUid);
											mailLog.setToStep(DBConst.SCHE_MAIL_LOG_TOSTEP_COMP);
											mailLog.setToStepUid(report.getUid());
											mailLog.setKind(DBConst.SCHE_MAIL_LOG_KIND_CC);
											mailLog.setEmail(bean.getCcList()[i]);
											mailLog.setInsertBy(userUid);
											dao.insertMailLog(mailLog);
										}
									}
									
									if(bean.getBccList() != null) {
										for(int i = 0; i < bean.getBccList().length; i++) {
											ScheMailLogBean mailLog = new ScheMailLogBean();
											mailLog.setSchedulerInfoUid(schedulerInfoUid);
											mailLog.setToStep(DBConst.SCHE_MAIL_LOG_TOSTEP_COMP);
											mailLog.setToStepUid(report.getUid());
											mailLog.setKind(DBConst.SCHE_MAIL_LOG_KIND_BCC);
											mailLog.setEmail(bean.getBccList()[i]);
											mailLog.setInsertBy(userUid);
											dao.insertMailLog(mailLog);
										}
									}
								}
							}catch(Exception e) {}
							
							isResult = DBConst.SUCCESS;
						}
					}
				}else {
					resultMap.put(Const.ERRCODE, Const.ERRCODE_EMPTY_INFO);
				}
			}
		}
		
		resultMap.put(Const.RESULT, isResult);
		
		return resultMap;
	}

	@Override
	public List<ScheMailBean> searchEmail(ParamBean bean) throws Exception {
		return dao.searchEmail(bean);
	}

	@Override
	public Map<String, Object> changeStatus(HttpServletRequest request, ParamBean bean) throws Exception {
		// 상태 체크
		// ongo 시간 체크
		// 실적에서 생성한 승선자의 승하선정보 삭제 schecrewinout
		// 실적에서 생성한 승선자 삭제 schecrew
		// 승하선실적 초기화 schecrewinout
		// 실적정보 삭제 schedatetime
		// 일일보고서 삭제 schereportdaily
		// 출항보고서 삭제 schereportdeparture
		// 메일링이력 삭제 schemaillog
		// TC 초기화 schedulerdetail
		// 시운전정보 초기화 및 상태정보 변경 schetrialinfo
		Map<String, Object> resultMap = new HashMap<String, Object>();
		boolean isResult = DBConst.FAIL;
		int schedulerInfoUid = bean.getUid();
		String status = dao.getTrialStatus(schedulerInfoUid);
		Integer ongoMin = dao.getOngoChangeDateMinute(schedulerInfoUid);
		
		if(!DBConst.SCHE_TRIAL_INFO_TRIALSTATUS_ONGOING.equals(status)) {
			resultMap.put(Const.ERRCODE, status);
		}else if(ongoMin != null && ongoMin > 60) {
			resultMap.put(Const.ERRCODE, Const.ERRCODE_ONGOTIME_OVER);
		}else {
			if(DBConst.Y.equals(dao.isOfflineMode(schedulerInfoUid))) {
				resultMap.put(Const.ERRCODE, Const.ERRCODE_IS_OFFLINE);
			}else {
				int userUid = ((UserInfoBean)(request.getSession().getAttribute(Const.SS_USERINFO))).getUid();
				bean.setUserUid(userUid);
				
				dao.deleteCrewInoutForRollback(schedulerInfoUid);
				dao.deleteCrewForRollback(schedulerInfoUid);
				dao.resetCrewInoutForRollback(bean);
				dao.deleteDateTimeForRollback(schedulerInfoUid);
				dao.deleteReportDailyForRollback(schedulerInfoUid);
				dao.deleteReportDepartureForRollback(schedulerInfoUid);
				dao.deleteMailLogForRollback(schedulerInfoUid);			
				dao.resetSchedulerDetailForRollback(bean);
				dao.resetTrialInfoForRollback(bean);
				
				/// 데이터 개정 삭제 (25.02.26)
				// REVSCHEDULERINFO
				// REVSCHEDULERVERSIONINFO
				// REVSCHEDULERDETAIL
				// REVSCHEDATETIME
				// REVSCHETRIALINFO
				// REVSCHECREW
				// REVSCHECREWINOUT
				// REVSCHETCNOTE
				// REVSCHETCNOTEFILEINFO
				// REVSCHETCNOTETCINFO
				revDao.deleteScheTcNoteTcInfo(schedulerInfoUid);
				revDao.deleteScheTcNoteFileInfo(schedulerInfoUid);
				revDao.deleteScheTcNote(schedulerInfoUid);
				revDao.deleteScheCrewInOut(schedulerInfoUid);
				revDao.deleteScheCrew(schedulerInfoUid);
				revDao.deleteScheTrialInfo(schedulerInfoUid);
				revDao.deleteScheDatetime(schedulerInfoUid);
				revDao.deleteSchedulerDetail(schedulerInfoUid);
				revDao.deleteSchedulerVersionInfo(schedulerInfoUid);
				revDao.deleteSchedulerInfo(schedulerInfoUid);
				///-- 데이터 개정 삭제 (25.02.26)
				
				isResult = DBConst.SUCCESS;
			}
		}
		
		resultMap.put(Const.RESULT, isResult);
		
		return resultMap;
	}
	
	@Override
	public Map<String, Object> getScheduleTcNumSearchList(HttpServletRequest request, ScheduleCodeDetailBean bean) throws Exception {
		Map<String, Object> resultMap = new HashMap<String, Object>();
		bean.setStart(CommonUtil.getListStart(bean.getPage()));
		bean.setLimit(CommonUtil.LIST_LIMIT);
		
		resultMap.put(Const.LIST, dao.getScheduleTcNumSearchList(bean));
		resultMap.put(Const.LIST_CNT, dao.getScheduleTcNumSearchListCnt());
		
		return resultMap;
	}
	
	@Override
	public Map<String, Object> reportSchedule(HttpServletRequest request) throws Exception {
		Map<String, Object> resultMap = new HashMap<String, Object>();
		
		resultMap.put(Const.LIST, dao.getDomainInfoListByDomainId("shipcondtype"));
		resultMap.put(Const.LIST + "Code", dao.get1LevelCodeList());
		
		return resultMap;
	}
	
	@Override
	public Map<String, Object> getVesselReqInfoDetListByHullNum(ParamBean bean) throws Exception {
		Map<String, Object> resultMap = new HashMap<String, Object>();
		
		resultMap.put(Const.LIST, dao.getVesselReqInfoDetListBySchedinfoUid(bean));
		resultMap.put(Const.LIST_CNT, dao.getVesselReqInfoDetListBySchedinfoUidCnt());
		resultMap.put(Const.BEAN, dao.getVesselReqInfoBySchedinfoUid(bean));
		
		return resultMap;
	}
	
	@Override
	public List<ShipCondBean> getShipCondList(ParamBean bean) throws Exception {
		return dao.getShipCondList(bean);
	}

	@Override
	public List<ScheMailBean> mailing() throws Exception {
		return dao.mailing();
	}
	
	@Override
	public Map<String, Object> mailingSave(HttpServletRequest request, ScheMailBean bean) throws Exception {
		Map<String, Object> resultMap = new HashMap<String, Object>();
		int userUid = ((UserInfoBean)(request.getSession().getAttribute(Const.SS_USERINFO))).getUid();
		
		dao.deleteMailing();
		
		if(bean.getEmailArr() != null) {
			for(int i = 0; i < bean.getEmailArr().length; i++) {
				ScheMailBean mail = new ScheMailBean();
				mail.setName(bean.getNameArr()[i]);
				mail.setCompany(bean.getCompanyArr()[i]);
				mail.setDepartment(bean.getDepartmentArr()[i]);
				mail.setRank(bean.getRankArr()[i]);
				mail.setEmail(bean.getEmailArr()[i]);
				mail.setUserUid(userUid);
				dao.insertMailing(mail);
			}
		}
		
		resultMap.put(Const.RESULT, DBConst.SUCCESS);
		
		return resultMap;
	}
}
