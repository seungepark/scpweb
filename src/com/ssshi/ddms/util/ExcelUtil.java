package com.ssshi.ddms.util;

import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.DataFormatter;
import org.apache.poi.ss.usermodel.DataValidation;
import org.apache.poi.ss.usermodel.DataValidationConstraint;
import org.apache.poi.ss.usermodel.DataValidationHelper;
import org.apache.poi.ss.usermodel.DateUtil;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.util.CellRangeAddressList;

import com.ssshi.ddms.constant.Const;

/********************************************************************************
 * 프로그램 개요 : Excel Util
 * 
 * 최초 작성자 : KHJ
 * 최초 작성일 : 2024-04-01
 * 
 * 최종 수정자 : KHJ
 * 최종 수정일 : 2024-04-18
 * 
 * 메모 : 없음
 * 
 * Copyright 2024 by SiriusB. Confidential and proprietary information
 * This document contains information, which is the property of SiriusB, 
 * and is furnished for the sole purpose of the operation and the maintenance.  
 * Copyright © 2024 SiriusB.  All rights reserved.
 *
 ********************************************************************************/

public class ExcelUtil {

	public static void createSelectBox(Sheet sheet, Cell cell, String[] vals) {
		// 데이터 유효성 검사 설정.
		DataValidationHelper validationHelper = sheet.getDataValidationHelper();
		DataValidationConstraint constraint = validationHelper.createExplicitListConstraint(vals);
		
		// 셀에 데이터 유효성 검사 적용.
		DataValidation validation = validationHelper.createValidation(constraint, new CellRangeAddressList(cell.getRowIndex(), cell.getRowIndex(), cell.getColumnIndex(), cell.getColumnIndex()));
		validation.setSuppressDropDownArrow(true);
		validation.setShowErrorBox(true);
		validation.setErrorStyle(DataValidation.ErrorStyle.STOP);
		
		sheet.addValidationData(validation);
	}
	
	public static Object getCellValue(Cell cell) {
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
}
