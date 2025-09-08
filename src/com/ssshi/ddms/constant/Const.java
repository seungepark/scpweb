package com.ssshi.ddms.constant;

/********************************************************************************
 * 프로그램 개요 : Constant
 * 
 * 최초 작성자 : 김한준
 * 최초 작성일 : 2021-06-07
 * 
 * 최종 수정자 : 김한준
 * 최종 수정일 : 2025-06-25
 * 
 * 메모 : 없음
 * 
 * Copyright 2021 by HLab. Confidential and proprietary information
 * This document contains information, which is the property of HLab, 
 * and is furnished for the sole purpose of the operation and the maintenance.  
 * Copyright © 2021 HLab.  All rights reserved.
 *
 ********************************************************************************/

public interface Const {
	
	String RESULT = "result";				// 단순 결과 attribute
	String LIST = "list";					// 목록형 attribute
	String BEAN = "bean";					// 객체형 attribute
	String LIST_CNT = "listCnt";			// 목록 총 개수 attribute
	String ERRCODE = "errCode";				// 에러코드 attribute
	
	String OK = "OK";
	String FAIL = "FAIL";
	String ERRCODE_INVALID = "INVALID";
	String ERRCODE_CANT_CHANGE = "ECC";
	String ERRCODE_EXIST_USERID = "EEU";
	String ERRCODE_EXIST_SHIP = "EES";
	String ERRCODE_EXIST_CRON = "EEC";
	String ERRCODE_CANT_DELETE = "ECD";
	String ERRCODE_CANT_DELETE_PART = "ECDP";
	String ERRCODE_CANT_DELETE_ALL = "ECDA";
	String ERRCODE_CANT_DELETE_DOMAIN = "ECDD";
	String ERRCODE_EXIST_SCHED = "EESD";
	String ERRCODE_EMPTY_INFO = "EEI";
	String ERRCODE_EXIST_REPORT = "EER";
	String ERRCODE_ONGOTIME_OVER = "EOO";
	String ERRCODE_IS_OFFLINE = "EIO";
	String ERRCODE_EXIST_SCENARIO = "EESC";
	
	boolean SERVER_ON = true;
	String DATA_DUMMY = "ZDUMMY";
	
	String SS_USERINFO = "userInfo";				// 세션 : 사용자 정보
	String SS_AUTH = "auth";						// 세션 : 권한 정보
	String SS_AUTH_KIND = "authKind";				// 세션 : 권한 레벨
	String SS_SEARCH_AUTH_GROUP_UID = "searchUid";	// 세션 : 검색용 권한 uid (workBy)

	int CELL_TYPE_STRING = 1;
	int CELL_TYPE_NUMERIC = 0;
	int CELL_TYPE_BOOLEAN = 4;
	int CELL_TYPE_FORMULA = 2;
	int CELL_TYPE_BLANK = 3;
}
