package com.ssshi.ddms.util;

/********************************************************************************
 * 프로그램 개요 : Valid Util
 * 
 * 최초 작성자 : 김한준
 * 최초 작성일 : 2021-06-07
 * 
 * 최종 수정자 : 김한준
 * 최종 수정일 : 2024-05-13
 * 
 * 메모 : 없음
 * 
 * Copyright 2021 by HLab. Confidential and proprietary information
 * This document contains information, which is the property of HLab, 
 * and is furnished for the sole purpose of the operation and the maintenance.  
 * Copyright © 2021 HLab.  All rights reserved.
 *
 ********************************************************************************/

public class ValidUtil {

	public static final boolean VALID_OK = true;
	public static final boolean VALID_NO = false;
	
	public static boolean isEmpty(String str) {
		if(str == null || "".equals(str)) {
			return VALID_OK;
		}else {
			return VALID_NO;
		}
	}
	
	public static boolean isNotEmpty(String str) {
		if(str != null && !"".equals(str)) {
			return VALID_OK;
		}else {
			return VALID_NO;
		}
	}
	
	public static String forJson(String str) {
		if(str != null) {
			return str.replace("\"", "&quot;").replace("\n", "\\n").replace("\r", "");
		}else {
			return "";
		}
	}
	
	public static String forHtml(String str) {
		if(str != null) {
			return str.replace("\n", "<br/>");
		}else {
			return "";
		}
	}
	
	// 숫자 값 컬럼에 필요 시 null 입력용 함수 (ManagerService.getNumOrNullData)
	public static String getNumOrNullData(String val) {
		return val == null || "".equals(val) ? null : val;
	}
}
