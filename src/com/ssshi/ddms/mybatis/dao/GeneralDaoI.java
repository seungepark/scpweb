package com.ssshi.ddms.mybatis.dao;

import java.util.List;

import com.ssshi.ddms.dto.DomainBean;
import com.ssshi.ddms.dto.DomainInfoBean;
import com.ssshi.ddms.dto.FileInfoBean;
import com.ssshi.ddms.dto.ParamBean;
import com.ssshi.ddms.dto.ScdvmEvntSchBean;
import com.ssshi.ddms.dto.SchedulerInfoBean;
import com.ssshi.ddms.dto.UserInfoBean;

/********************************************************************************
 * 프로그램 개요 : General
 * 
 * 최초 작성자 : 김한준
 * 최초 작성일 : 2021-06-07
 * 
 * 최종 수정자 : KHJ
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

public interface GeneralDaoI {
	
	UserInfoBean login(ParamBean bean) throws Exception;
	
	List<String> getAuthList(int userUid) throws Exception;
	
	List<String> getAuthKindList(int userUid) throws Exception;
	
	List<Integer> getSearchAuthGroupUidList(ParamBean bean) throws Exception;
	
	int changePw(ParamBean bean) throws Exception;
	
	FileInfoBean getProfileFile(int uid) throws Exception;
	
	int delProfileFile(int uid) throws Exception;
	
	int insertProfileFile(FileInfoBean bean) throws Exception;
	
	DomainBean getDomain(ParamBean bean) throws Exception;
	
	List<DomainBean> getDomainList(ParamBean bean) throws Exception;
	
	List<DomainInfoBean> getDomainInfoList(int uid) throws Exception;
	
	List<Integer> getDashTrialCnt() throws Exception;
	
	List<Integer> getDashTrialHour() throws Exception;
	
	List<SchedulerInfoBean> getDashAtSeaList() throws Exception;
	
	List<SchedulerInfoBean> getDashQuayList() throws Exception;
	
	List<ScdvmEvntSchBean> getDashEventList() throws Exception;
}
