package com.ssshi.ddms.mybatis.dao;

import java.util.List;

import com.ssshi.ddms.dto.ScheCrewBean;
import com.ssshi.ddms.dto.ScheCrewInOutBean;
import com.ssshi.ddms.dto.ScheDateTimeBean;
import com.ssshi.ddms.dto.ScheTcNoteBean;
import com.ssshi.ddms.dto.ScheTcNoteFileInfoBean;
import com.ssshi.ddms.dto.ScheTcNoteTcInfoBean;
import com.ssshi.ddms.dto.ScheTrialInfoBean;
import com.ssshi.ddms.dto.SchedulerDetailInfoBean;
import com.ssshi.ddms.dto.SchedulerInfoBean;
import com.ssshi.ddms.dto.SchedulerVersionInfoBean;

/********************************************************************************
 * 프로그램 개요 : Revision
 * 
 * 최초 작성자 : KHJ
 * 최초 작성일 : 2025-02-26
 * 
 * 최종 수정자 : KHJ
 * 최종 수정일 : 2025-02-26
 * 
 * 메모 : 없음
 * 
 * Copyright 2025 by SiriusB. Confidential and proprietary information
 * This document contains information, which is the property of SiriusB, 
 * and is furnished for the sole purpose of the operation and the maintenance.  
 * Copyright © 2025 SiriusB.  All rights reserved.
 *
 ********************************************************************************/

public interface RevDaoI {
	
	SchedulerInfoBean getSchedulerInfo(int uid) throws Exception;
	
	SchedulerVersionInfoBean getSchedulerVersionInfo(int uid) throws Exception;
	
	List<SchedulerDetailInfoBean> getSchedulerDetailList(int schedulerInfoUid) throws Exception;
	
	List<ScheDateTimeBean> getScheDatetimeList(int schedulerInfoUid) throws Exception;
	
	ScheTrialInfoBean getScheTrialInfo(int schedulerInfoUid) throws Exception;
	
	List<ScheCrewBean> getScheCrewList(int schedulerInfoUid) throws Exception;
	
	List<ScheCrewInOutBean> getScheCrewInOutList(int schedulerInfoUid) throws Exception;
	
	List<ScheTcNoteBean> getScheTcNoteList(int schedulerInfoUid) throws Exception;
	
	List<ScheTcNoteFileInfoBean> getScheTcNoteFileInfoList(int schedulerInfoUid) throws Exception;
	
	List<ScheTcNoteTcInfoBean> getScheTcNoteTcInfoList(int schedulerInfoUid) throws Exception;
	
	int insertSchedulerInfo(SchedulerInfoBean bean) throws Exception;
	
	int insertSchedulerVersionInfo(SchedulerVersionInfoBean bean) throws Exception;
	
	int insertSchedulerDetail(SchedulerDetailInfoBean bean) throws Exception;
	
	int insertScheDatetime(ScheDateTimeBean bean) throws Exception;
	
	int insertScheTrialInfo(ScheTrialInfoBean bean) throws Exception;
	
	int insertScheCrew(ScheCrewBean bean) throws Exception;
	
	int insertScheCrewInOut(ScheCrewInOutBean bean) throws Exception;
	
	int insertScheTcNote(ScheTcNoteBean bean) throws Exception;
	
	int insertScheTcNoteFileInfo(ScheTcNoteFileInfoBean bean) throws Exception;
	
	int insertScheTcNoteTcInfo(ScheTcNoteTcInfoBean bean) throws Exception;
	
	int deleteScheTcNoteTcInfo(int schedulerInfoUid) throws Exception;
	
	int deleteScheTcNoteFileInfo(int schedulerInfoUid) throws Exception;
	
	int deleteScheTcNote(int schedulerInfoUid) throws Exception;
	
	int deleteScheCrewInOut(int schedulerInfoUid) throws Exception;
	
	int deleteScheCrew(int schedulerInfoUid) throws Exception;
	
	int deleteScheTrialInfo(int schedulerInfoUid) throws Exception;
	
	int deleteScheDatetime(int schedulerInfoUid) throws Exception;
	
	int deleteSchedulerDetail(int schedulerInfoUid) throws Exception;
	
	int deleteSchedulerVersionInfo(int schedulerInfoUid) throws Exception;
	
	int deleteSchedulerInfo(int uid) throws Exception;
	
	
	
	
	
	
	
	
	
}
