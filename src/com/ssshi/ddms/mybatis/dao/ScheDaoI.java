package com.ssshi.ddms.mybatis.dao;

import java.util.List;

import com.ssshi.ddms.dto.DomainInfoBean;
import com.ssshi.ddms.dto.ParamBean;
import com.ssshi.ddms.dto.ScheCrewBean;
import com.ssshi.ddms.dto.ScheCrewInOutBean;
import com.ssshi.ddms.dto.ScheCrewListBean;
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
import com.ssshi.ddms.dto.ScheduleHierarchyBean;
import com.ssshi.ddms.dto.SchedulerDetailInfoBean;
import com.ssshi.ddms.dto.SchedulerInfoBean;
import com.ssshi.ddms.dto.ShipCondBean;
import com.ssshi.ddms.dto.ShipInfoBean;
import com.ssshi.ddms.dto.VesselReqInfoBean;
import com.ssshi.ddms.dto.VesselReqInfoDetailBean;

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

public interface ScheDaoI {
	
	// 실적관리 목록. (ManagerDaoI.getSchedulerDepartureList)
	List<SchedulerInfoBean> getScheList(SchedulerInfoBean bean) throws Exception;

	// 실적관리 목록 개수. (ManagerDaoI.getSchedulerDepartureListCnt)
	int getScheListCnt() throws Exception;
	
	// 시운전 상태 (계획, 결과)
	String getTrialStatus(int schedulerInfoUid) throws Exception;
	
	// OnGoing 상태 변경 시간 차이 분 (결과)
	Integer getOngoChangeDateMinute(int schedulerInfoUid) throws Exception;
	
	// 승선자 목록 (계획, 결과).
	List<ScheCrewBean> getCrewList(int schedulerInfoUid) throws Exception;
	
	// 승선자별 승하선 정보 (계획, 결과).
	List<ScheCrewInOutBean> getCrewInOutList(int scheCrewUid) throws Exception;
	
	// 승선자 UID 목록 (계획).
	List<Integer> getCrewUidList(int schedulerInfoUid) throws Exception;
	
	// 기존 승선자 목록 삭제 (계획).
	int deleteCrewList(int schedulerInfoUid) throws Exception;
	
	// 기존 승선자 승하선 정보 삭제 (계획, 결과).
	int deleteCrewInoutList(int scheCrewUid) throws Exception;
	
	// 승선자 입력 (계획, 결과).
	int insertCrew(ScheCrewBean bean) throws Exception;
	
	// 승선자 승하선 정보 입력 (계획, 결과).
	int insertCrewInOut(ScheCrewInOutBean bean) throws Exception;
	
	// 커맨더 정보 (계획, 결과).
	List<ScheCrewBean> getCommanderInfoList(int schedulerInfoUid) throws Exception;
	
	// 주요 승선자 정보 (계획).
	ScheCrewBean getMainCrewInfo(ScheCrewBean bean) throws Exception;
	
	// 승선자 수 정보 (계획, 결과).
	List<ScheCrewBean> getCrewCntInfoList(int schedulerInfoUid) throws Exception;
	
	// 승선자 수 정보 (결과 - 완료 보고).
	List<ScheCrewBean> getCrewCntInfoListForComp(int schedulerInfoUid) throws Exception;
	
	// 시운전 정보 (계획).
	ScheTrialInfoBean getTrialInfo(int schedulerInfoUid) throws Exception;
	
	// 시운전 항목 개수 정보 (계획, 결과).
	List<Integer> getTcCntList(int schedulerInfoUid) throws Exception;
	
	// 시리즈 선박 정보 (계획).
	List<ShipInfoBean> getSeriesList() throws Exception;
	
	// 시운전 실적 검색 (계획).
	List<SchedulerInfoBean> searchTrial(ParamBean bean) throws Exception;
	
	// 기존 시운전 정보 삭제 (계획).
	int deleteTrialInfo(int schedulerInfoUid) throws Exception;
	
	// 시운전 정보 입력 (계획).
	int insertTrialInfo(ScheTrialInfoBean bean) throws Exception;
	
	// 출항 보고서 스케줄 정보 (계획).
	ScheduleBean getScheduleDateTime(int uid) throws Exception;
	
	// 출항 보고서 시운전 실적 - 해당 시운전 계획 수행 시간 (계획).
	int getTotalPlanTime(int uid) throws Exception;
	
	// 출항/완료 보고서 시운전 실적 - 이전 시운전 실적 수행 시간 (계획, 결과).
	int getTotalTrialTime(int uid) throws Exception;
	
	// 출항/완료 보고서 시운전 실적 - Fuel 연료 실적 (계획, 결과).
	ScheReportCompBean getTrialFuel(int uid) throws Exception;
	
	// 출항 보고서 입력 (계획).
	int insertReportDeparture(ScheReportDepartureBean bean) throws Exception;
	
	// 시운전정보 시운전상태 업데이트 (계획, 결과).
	int updateTrialStatus(ScheTrialInfoBean bean) throws Exception;
	
	// 메일링 이력 입력 (계획, 결과).
	int insertMailLog(ScheMailLogBean bean) throws Exception;
	
	// 도메인 값 가져오기 (결과).
	List<DomainInfoBean> getDomainInfoList(String domain) throws Exception;
	
	// 시운전 스케줄 정보 조회 (ManagerDaoI).
	SchedulerInfoBean getScheduler(int uid) throws Exception;
	
	// 시운전 스케줄 상세 목록 조회 (ManagerDaoI)
	List<SchedulerDetailInfoBean> getSchedulerRowDataList(SchedulerDetailInfoBean bean) throws Exception;
	
	// 특이사항 목록 (결과).
	List<ScheTcNoteBean> getTcNoteList(int uid) throws Exception;
	
	// 특이사항 관련 TC 목록 (결과).
	List<ScheTcNoteTcInfoBean> getTcNoteTcList(int uid) throws Exception;
	
	// 특이사항 파일 목록 (결과).
	List<ScheTcNoteFileInfoBean> getTcNoteFileList(int uid) throws Exception;
	
	// 특이사항 신규 생성 (결과).
	int insertTcNote(ScheTcNoteBean bean) throws Exception;
	
	// 특이사항 수정 (결과).
	int updateTcNote(ScheTcNoteBean bean) throws Exception;
	
	// 특이사항 관련 TC 목록 전체 삭제 (결과).
	int deleteTcNoteTcList(int uid) throws Exception;
	
	// 특이사항 관련 TC 생성 (결과).
	int insertTcNoteTc(ScheTcNoteTcInfoBean bean) throws Exception;
	
	// 특이사항 파일 삭제 (결과).
	int deleteTcNoteFile(int uid) throws Exception;
	
	// 특이사항 파일 전체 삭제 (결과).
	int deleteTcNoteFileList(int uid) throws Exception;
	
	// 특이사항 파일 생성 (결과).
	int insertTcNoteFile(ScheTcNoteFileInfoBean bean) throws Exception;
		
	// 삭제 가능한 (계획에서 생성 X, 이전에 결과에서 생성 X) 승선자 UID 목록 (결과).
	List<Integer> getCrewUidListForDelete(ScheCrewListBean bean) throws Exception;
	
	// 승선자 삭제 (결과).
	int deleteCrew(int scheCrewUid) throws Exception;
	
	// 승선자 승하선 실적 업데이트 (결과).
	int updateCrewInOut(ScheCrewInOutBean bean) throws Exception;
	
	// 시운전 정보 (결과).
	ScheTrialInfoBean getTrialInfoForResult(int schedulerInfoUid) throws Exception;
	
	// 시운전 정보 업데이트 (결과).
	int updateTrialInfo(ScheTrialInfoBean bean) throws Exception;
	
	// 일일 보고서 존재 여부 (결과).
	Integer getExistDailyReport(int uid) throws Exception;
	
	// 마지막 일일 보고서 (결과).
	ScheReportDailyBean getLastDailyReport(int uid) throws Exception;
	
	// 일일 보고를 위한 승선자 목록 (결과).
	List<ScheCrewBean> getCrewListForDaily(int schedulerInfoUid) throws Exception;
	
	// 일일 보고를 위한 승선자별 승하선 정보 (결과).
	List<ScheCrewInOutBean> getCrewInOutListForDaily(int scheCrewUid) throws Exception;
	
	// 일일 보고서 입력 (결과).
	int insertReportDaily(ScheReportDailyBean bean) throws Exception;
	
	// 시운전정보 일일보고 후 초기화 (결과).
	int updateTrialInfoForDaily(ScheTrialInfoBean bean) throws Exception;
	
	// 날짜/시간 실적 정보 복사 (결과).
	List<SchedulerDetailInfoBean> getTcPerformanceDateTimeListForDaily(int schedulerInfoUid) throws Exception;
	
	// 날짜/시간 실적 정보 복사생성 (결과).
	int insertTcPerformanceDateTimeForDaily(SchedulerDetailInfoBean bean) throws Exception;
	
	// 시운전 연료 사용량 계산 (결과).
	ScheTrialInfoBean getTotalFuelDown(int schedulerInfoUid) throws Exception;
	
	// 완료보고서 표시 특이사항 목록 (결과).
	List<ScheTcNoteBean> getTcNoteListForComp(int schedulerInfoUid) throws Exception;
	
	// 완료보고서 표시 특이사항 TC 목록 (결과).
	List<ScheTcNoteTcInfoBean> getTcNoteTcListForComp(int scheTcNoteUid) throws Exception;
	
	// 완료보고서 표시 특이사항 파일 목록 (결과).
	List<ScheTcNoteFileInfoBean> getTcNoteFileListForComp(int scheTcNoteUid) throws Exception;
	
	// 완료 보고서 입력 (결과).
	int insertReportComp(ScheReportCompBean bean) throws Exception;
	
	// 이메일 검색.
	List<ScheMailBean> searchEmail(ParamBean bean) throws Exception;
	
	// 실적에서 생성한 승선자의 승하선정보 삭제 (상태변경)
	int deleteCrewInoutForRollback(int schedulerInfoUid) throws Exception;
	
	// 실적에서 생성한 승선자 삭제 (상태변경)
	int deleteCrewForRollback(int schedulerInfoUid) throws Exception;
	
	// 승하선실적 초기화 (상태변경)
	int resetCrewInoutForRollback(ParamBean bean) throws Exception;
	
	// 실적정보 삭제 (상태변경)
	int deleteDateTimeForRollback(int schedulerInfoUid) throws Exception;
	
	// 일일보고서 삭제 (상태변경)
	int deleteReportDailyForRollback(int schedulerInfoUid) throws Exception;
	
	// 출항보고서 삭제 (상태변경)
	int deleteReportDepartureForRollback(int schedulerInfoUid) throws Exception;
	
	// 메일링이력 삭제 (상태변경)
	int deleteMailLogForRollback(int schedulerInfoUid) throws Exception;
	
	// TC 초기화 (상태변경)
	int resetSchedulerDetailForRollback(ParamBean bean) throws Exception;
	
	// 시운전정보 초기화 및 상태정보 변경 (상태변경)
	int resetTrialInfoForRollback(ParamBean bean) throws Exception;
	
	// 오프라인 모드 여부.
	String isOfflineMode(int uid) throws Exception;
	
	// TC번호 검색.
	List<ScheduleCodeDetailBean> getScheduleTcNumSearchList(ScheduleCodeDetailBean bean) throws Exception;
	
	// TC번호 검색 전체 개수.
	int getScheduleTcNumSearchListCnt() throws Exception;
	
	// TC삭제용 schetcnote.uid 검색
	Integer getScheTcNoteUid(int detailUid) throws Exception;
	
	// TC삭제용 schetcnotefileinfo.savename 목록 검색
	List<String> getScheTcNoteFileInfoSaveNameList(int noteUid) throws Exception;
	
	// TC삭제용 schetcnote 삭제
	int deleteScheTcNote(int uid) throws Exception;
	
	// TC삭제용 schetcnotetcinfo 삭제
	int deleteScheTcNoteTcInfoList(int noteUid) throws Exception;
	
	// TC삭제용 schetcnotefileinfo 삭제
	int deleteScheTcNoteFileInfoList(int noteUid) throws Exception;
	
	/// 스케쥴 보고서 --------------- ///
	// Domain ID 문자값으로 도메인 조회
	List<DomainInfoBean> getDomainInfoListByDomainId(String domain) throws Exception;
	
	// 스케쥴러의 uid 로 활성화된 호선별 필요 정보 불러 오기(보고서에서 사용)
	List<VesselReqInfoDetailBean> getVesselReqInfoDetListBySchedinfoUid(ParamBean bean) throws Exception;
	
	int getVesselReqInfoDetListBySchedinfoUidCnt() throws Exception;
	
	// 스케쥴러의 uid 로 활성화된 호선별 필요 정보 불러오기(보고서에서 사용)
	VesselReqInfoBean getVesselReqInfoBySchedinfoUid(ParamBean bean) throws Exception;
	
	// 호선별 선박 상태 정보
	List<ShipCondBean> getShipCondList(ParamBean bean) throws Exception;
	/// --------------- 스케쥴 보고서 ///
	
	/// 250309 ///
	// 승선 여부 확인.
	List<String> getPerformanceInOutForCrewDay(ScheCrewInOutBean bean) throws Exception;
	
	// 날짜 정보 (오늘, 스케쥴 시작일/종료일).
	SchedulerInfoBean getDateInfoForCrewDay(int uid) throws Exception;
	
	// 연료 추세 정보.
	List<ScheTrialInfoBean> getFuelDateList(int uid) throws Exception;
	
	// 완료 보고 데이터.
	ScheTrialInfoBean getTrialCompData(int uid) throws Exception;
	
	/// 250317 ///
	// 일일 보고서 TC 목록.
	List<SchedulerDetailInfoBean> getDailyReportTcList(int uid) throws Exception;
	
	// 메일링 목록.
	List<ScheMailBean> mailing() throws Exception;
	
	// 메일링 삭제.
	int deleteMailing() throws Exception;
	
	// 메일링 추가.
	int insertMailing(ScheMailBean bean) throws Exception;
	
	// 마지막 메일링 가져오기.
	List<ScheMailBean> getLastMailList(int uid) throws Exception;
	
	// 메일링 목록 가져오기.
	List<ScheMailBean> getMailList() throws Exception; 
	
	// 마지막 메일링 삭제.
	int deleteLastMailList(int uid) throws Exception;
	
	// 기존에 입력된 승하선 실적 삭제.
	int deleteCrewInoutPerformanceList(int scheCrewUid) throws Exception;
	
	// 보고서 스케줄 정보 (출항 시 계획)
	ScheduleBean getScheduleDateTimeDeparture(int uid) throws Exception;
	
	// 보고서 스케줄 정보 (기본 계획)
	ScheduleBean getScheduleDateTimePlan(int uid) throws Exception;
	
	// 보고서 스케줄 정보 (실적)
	ScheduleBean getScheduleDateTimePerformance(int uid) throws Exception;
	
	// 표준코드 1레벨 목록.
	List<ScheduleHierarchyBean> get1LevelCodeList() throws Exception;
}
