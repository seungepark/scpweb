package com.ssshi.ddms.constant;

/********************************************************************************
 * 프로그램 개요 : DB Constant
 * 
 * 최초 작성자 : 김한준
 * 최초 작성일 : 2021-06-07
 * 
 * 최종 수정자 : 김한준
 * 최종 수정일 : 2025-04-30
 * 
 * 메모 : 없음
 * 
 * Copyright 2021 by HLab. Confidential and proprietary information
 * This document contains information, which is the property of HLab, 
 * and is furnished for the sole purpose of the operation and the maintenance.  
 * Copyright © 2021 HLab.  All rights reserved.
 *
 ********************************************************************************/

public interface DBConst {

	// Result
	int ZERO = 0;
	int ONE = 1;
	int ALREADY = -3;
	int ERR = -1;
	
	boolean SUCCESS = true;
	boolean FAIL = false;
	
	// Value
	int YES = 1;
	int NO = 0;
	String Y = "Y";
	String N = "N";
	
	// Etc
	int MAX_LENGTH = 1500;
	
	String STATUS_ACTIVE = "ACT";
	String STATUS_INACTIVE = "INACT";
	
	String AUTH_KIND_ADMIN = "ADMIN";
	String AUTH_KIND_SYS = "SYS";
	String AUTH_KIND_CAPTAIN = "CAPTAIN";
	String AUTH_KIND_GROUP = "GROUP";
	String AUTH_KIND_WORKER = "WORKER";
	
	String DOMAIN_DATATYPE_SY = "SYNONYM";

	String DOMAIN_CREW_BARKING = "BARKING";
	String DOMAIN_CREW_CATE = "CREWCATE";
	String DOMAIN_CREW_POSITION = "CREWPOSITION";

	String CREW_CATEGORY_PLAN = "PLAN";
	String CREW_CATEGORY_EXEC = "EXEC";
	String CREW_POSITION_SHI = "SHI";
	String CREW_POSITION_SE = "SE";
	String CREW_POSITION_SE_CORPS = "CORPS";
	String CREW_POSITION_OWNER_CLASS = "OWNER";
	String CREW_BARKING_BOARD = "BOARD";
	String CREW_BARKING_UNBOARD = "UNBOARD";
	
	String SCHE_CREW_INOUT_IN = "B";
	String SCHE_CREW_INOUT_OUT = "U";
	String SCHE_CREW_INOUT_NONE = "N";
	
	String SCHE_TRIAL_INFO_TRIALSTATUS_DEPARTURE = "DEPART";
	String SCHE_TRIAL_INFO_TRIALSTATUS_ONGOING = "ONGO";
	String SCHE_TRIAL_INFO_TRIALSTATUS_ARRIVAL = "ARRIVE";
	
	String SCHE_MAIL_LOG_TOSTEP_DEPART = "DEPART";
	String SCHE_MAIL_LOG_TOSTEP_DAILY = "DAILY";
	String SCHE_MAIL_LOG_TOSTEP_COMP = "COMP";
	String SCHE_MAIL_LOG_TOSTEP_LAST = "LAST";
	
	String SCHE_MAIL_LOG_KIND_TO = "TO";
	String SCHE_MAIL_LOG_KIND_CC = "CC";
	String SCHE_MAIL_LOG_KIND_BCC = "BCC";
	
	String DOMAIN_NOTE_UP = "NOTE_UP";
	String DOMAIN_NOTE_DOWN = "NOTE_DOWN";
	
	String CREW_BOARD = "B";
	String CREW_UNBOARD = "U";
	
	String SCHEDTYPE_SEA = "SEA";
	String SCHEDTYPE_GAS = "GAS";
	String SCHEDTYPE_TOTAL = "TOTAL";
	
	String KEY_SCHEDTYPE_SEA = "_ST";
	String KEY_SCHEDTYPE_GAS = "_GT";
	String KEY_SCHEDTYPE_TOTAL = "_SGT";
	
	String REV_KIND_DEPARTURE = "DEPART";
	String REV_KIND_DAILY = "DAILY";
	String REV_KIND_COMP = "COMP";
}
