package com.ssshi.ddms.mybatis.dao;

import com.ssshi.ddms.dto.AuditLogBean;

/********************************************************************************
 * 프로그램 개요 : Log
 * 
 * 최초 작성자 : 김한준
 * 최초 작성일 : 2021-11-25
 * 
 * 최종 수정자 : 김한준
 * 최종 수정일 : 2024-11-18
 * 
 * 메모 : 없음
 * 
 * Copyright 2021 by HLab. Confidential and proprietary information
 * This document contains information, which is the property of HLab, 
 * and is furnished for the sole purpose of the operation and the maintenance.  
 * Copyright © 2021 HLab.  All rights reserved.
 *
 ********************************************************************************/

public interface LogDaoI {

	int insertAudit(AuditLogBean bean) throws Exception;
}
