package com.ssshi.ddms.mybatis.dao;

import java.util.List;

import com.ssshi.ddms.dto.*;
import org.apache.ibatis.annotations.Param;

/********************************************************************************
 * 프로그램 개요 : Manager
 * 
 * 최초 작성자 : 김한준
 * 최초 작성일 : 2021-06-07
 * 
 * 최종 수정자 : KHJ
 * 최종 수정일 : 2025-05-12
 * 
 * 메모 : 없음
 * 
 * Copyright 2021 by HLab. Confidential and proprietary information
 * This document contains information, which is the property of HLab, 
 * and is furnished for the sole purpose of the operation and the maintenance.  
 * Copyright © 2021 HLab.  All rights reserved.
 *
 ********************************************************************************/

public interface ManagerDaoI {
	
	/**
	 * 시운전 스케줄 목록 정보 조회
	 * @param bean
	 * @return List-bean
	 * @throws Exception
	 */
	List<SchedulerInfoBean> getSchedulerList(SchedulerInfoBean bean) throws Exception;
	
	/**
	 * 시운전 스케줄 목록 페이징용 갯수 조회
	 * @return count
	 * @throws Exception
	 */
	int getSchedulerListCnt() throws Exception;
	
	/**
	 * 시운전 스케줄 정보 조회
	 * @param bean
	 * @return bean 
	 * @throws Exception
	 */
	SchedulerInfoBean getScheduler(ParamBean bean) throws Exception;
	
	/**
	 * 시운전 스케줄 상세 목록 조회
	 * @param bean
	 * @return list-bean
	 * @throws Exception
	 */
	List<SchedulerDetailInfoBean> getSchedulerRowDataList(SchedulerDetailInfoBean bean) throws Exception;
	
	/**
	 * 시운전 스케줄러 업데이트
	 * @param bean
	 * @return
	 * @throws Exception
	 */
	int updateScheduler(SchedulerInfoBean bean) throws Exception;

	/**
	 * 시운전 스케줄러 상세 추가
	 * @param bean
	 * @return
	 * @throws Exception
	 */
	int insertSchedulerDetail(SchedulerDetailInfoBean bean) throws Exception;
	
	/**
	 * 시운전 스케줄러 상세 변경 
	 * @param bean
	 * @return
	 * @throws Exception
	 */
	int updateSchedulerDetail(SchedulerDetailInfoBean bean) throws Exception;
	
	/**
	 * 시운전 스케줄러 상세 삭제 
	 * @param uid
	 * @return
	 * @throws Exception
	 */
	int deleteSchedulerDetail(int uid) throws Exception;
	
	// 사용 여부 확인 필요 (24.10.29. 계획신규 수정 )
	/**
	 * 시운전 스케줄 TC Num 조회 팝업 목록 조회
	 * @param bean
	 * @return list-bean
	 * @throws Exception
	 */
	List<ScheduleCodeDetailBean> getScheduleTcNumSearchList(ScheduleCodeDetailBean bean) throws Exception;
	
	// 사용 여부 확인 필요 (24.10.29. 계획신규 수정 )
	/**
	 * 시운전 스케줄 TC Num 조회 팝업 갯수 반환 
	 * @return
	 * @throws Exception
	 */
	int getScheduleTcNumSearchListCnt() throws Exception;
	
	/**
	 * 시운전 스케줄 상세 Ship Type 조회 
	 * @return
	 * @throws Exception
	 */
	List<DomainBean> getShipType() throws Exception;
	
	/**
	 * 시운전 스케줄러 마지막 키NO
	 * @param bean
	 * @return
	 * @throws Exception
	 */
	int getLastKeyNo(SchedulerInfoBean bean) throws Exception;
	
	/**
	 * 시운전 스케줄러 추가 
	 * @param bean
	 * @return
	 * @throws Exception
	 */
	int insertScheduler(SchedulerInfoBean bean) throws Exception;
	
	/**
	 * 시운전 스케줄러 삭제
	 * @param uid
	 * @return
	 * @throws Exception
	 */
	int deleteScheduler(int uid) throws Exception;
	
	/**
	 * 시운전 스케줄러 삭제 시 상세 동시 삭제 
	 * @param uid
	 * @return
	 * @throws Exception
	 */
	int deleteSchedulerDetailForList(int uid) throws Exception;
	
	/**
	 * 시운전 스케줄러 상태변경 
	 * @param bean
	 * @return
	 * @throws Exception
	 */
	int changeStatusScheduler(ParamBean bean) throws Exception;
	
	
	/**
	 * 시운전 스케줄 계층 기준 정보 반환 
	 * @param bean
	 * @return
	 * @throws Exception
	 */
	List<ScheduleHierarchyBean> getScheduleHierarchyList(ScheduleHierarchyBean bean) throws Exception;
	
	/**
	 * 시운전 스케줄 계층 기준정보 갯수 반환 
	 * @return
	 * @throws Exception
	 */
	int getScheduleHierarchyListCnt() throws Exception;
	
	
	/**
	 * 시운전 스케줄 계층 상위 조회 정보 반환
	 * @param bean
	 * @return
	 * @throws Exception
	 */
	List<ScheduleHierarchyBean> getScheduleHierarchyParentList(ScheduleHierarchyBean bean) throws Exception;
	
	/**
	 * 시운전 스케줄 계층 상위 조회 팝업 갯수 반환 
	 * @return
	 * @throws Exception
	 */
	int getScheduleHierarchyParentListCnt() throws Exception;
	
	/**
	 * 시운전 스케줄러 계층 정보 추가
	 * @param bean
	 * @return
	 * @throws Exception
	 */
	int insertScheduleHirerarchy(ScheduleHierarchyBean bean) throws Exception;
	
	/**
	 * 시운전 스케줄러 계층 정보 수정
	 * @param bean
	 * @return
	 * @throws Exception
	 */
	int updateScheduleHirerarchy(ScheduleHierarchyBean bean) throws Exception;
	
	/**
	 * 시운전 스케줄러 계층 정보 삭제 
	 * @param uid
	 * @return
	 * @throws Exception
	 */
	int deleteScheduleHirerarchy(int uid) throws Exception;

	/**
	 * 시운전 스케줄러 코드 정보 목록 반환
	 * @param bean
	 * @return
	 * @throws Exception
	 */
	List<ScheduleCodeInfoBean> getScheduleCodeInfoList(ScheduleCodeInfoBean bean) throws Exception;
	
	/**
	 * 시운전 스케줄러 코드 정보 목록 갯수 반환 
	 * @return
	 * @throws Exception
	 */
	int getScheduleCodeInfoListCnt() throws Exception;
	
	/**
	 * 시운전 스케줄러 코드 정보 반환
	 * @param bean
	 * @return
	 * @throws Exception
	 */
	ScheduleCodeInfoBean getScheduleCodeInfo(ParamBean bean) throws Exception;
	
	/**
	 * 시운전 스케줄러 코드 상세 정보 목록 반환 
	 * @param bean
	 * @return
	 * @throws Exception
	 */
	List<ScheduleCodeDetailBean> getScheduleCodeDetList(ParamBean bean) throws Exception;
	
	/**
	 * 시운전 스케줄러 코드 상세 정보 갯수 반환 
	 * @return
	 * @throws Exception
	 */
	int getScheduleCodeDetListCnt() throws Exception;
	
	/**
	 * 시운전 스케줄러 코드 업데이트 
	 * @param bean
	 * @return
	 * @throws Exception
	 */
	int updateScheduleCode(ScheduleCodeInfoBean bean) throws Exception;
	
	/**
	 * 시운전 스케줄러 코드 상세 추가
	 * @param bean
	 * @return
	 * @throws Exception
	 */
	int insertScheduleCodeDetail(ScheduleCodeDetailBean bean) throws Exception;
	
	/**
	 * 시운전 스케줄러 코드 상세 수정
	 * @param bean
	 * @return
	 * @throws Exception
	 */
	int updateScheduleCodeDetail(ScheduleCodeDetailBean bean) throws Exception;
	
	/**
	 * 시운전 스케줄러 코드 상세 삭제 
	 * @param uid
	 * @return
	 * @throws Exception
	 */
	int deleteScheduleCodeDetail(int uid) throws Exception;
	
	/**
	 * 시운전 스케줄러 코드 상태 변경 
	 * @param bean
	 * @return
	 * @throws Exception
	 */
	int changeStatusScheduleCode(ParamBean bean) throws Exception;
	
	/**
	 * 시운전 스케줄러 코드 삭제
	 * @param uid
	 * @return
	 * @throws Exception
	 */
	int deleteScheduleCode(int uid) throws Exception;
	
	/**
	 * 시운전 스케줄러 코드 상세 삭제 
	 * @param uid
	 * @return
	 * @throws Exception
	 */
	int deleteScheduleCodeDetailForList(int uid) throws Exception;
	
	/**
	 * 시운전 스케줄러 코드 확인
	 * @param bean
	 * @return
	 * @throws Exception
	 */
	List<ScheduleCodeInfoBean> selectSameActShiptypeScheduleCode(ScheduleCodeInfoBean bean) throws Exception;
	
	/**
	 * 시운전 스케줄러 코드 추가 
	 * @param bean
	 * @return
	 * @throws Exception
	 */
	int insertScheduleCode(ScheduleCodeInfoBean bean) throws Exception;

	/**
	 * 필요 정보의 표준 구분 목록 조회
	 * @return
	 * @throws Exception
	 */
	List<StandardReqInfoBean> getStandardReqInfoList() throws Exception;

	/**
	 * 필요 정보의 표준 구분 정보 삭제
	 * @param uid
	 * @return
	 * @throws Exception
	 */
	int deleteStandardReqInfo(@Param("uid") int uid) throws Exception;

	/**
	 * 필요 정보의 표준 구분 정보 입력
	 * @param bean
	 * @return
	 * @throws Exception
	 */
	int insertStandardReqInfo(StandardReqInfoBean bean) throws Exception;

	/**
	 * 필요 정보의 표준 구분 정보 수정
	 * @param bean
	 * @return
	 * @throws Exception
	 */
	int updateStandardReqInfo(StandardReqInfoBean bean) throws Exception;

	/**
	 * 호선별 필요 정보 헤더 목록 정보
	 * @param Bean
	 * @return
	 * @throws Exception
	 */
	List<VesselReqInfoBean> getVesselReqInfoList(VesselReqInfoBean Bean) throws Exception;

	/**
	 * 호선별 필요 정보 헤더 목록 정보의 전체 수
	 * @return
	 * @throws Exception
	 */
	int getVesselReqInfoListCnt() throws Exception;

	/**
	 * 호선별 필요 정보 상태 변경
	 * @param request
	 * @param bean
	 * @return
	 * @throws Exception
	 */
	int changeStatusVesselReqInfo(ParamBean bean) throws Exception;

	/**
	 * 호선별 필요 정보 삭제
	 * @param uid
	 * @return
	 * @throws Exception
	 */
	int deleteVesselReqInfo(@Param("uid") int uid) throws Exception;

	/**
	 * 호선별 필요 정보의 키로 필요 정보 상세 삭제
	 * @param vsslreqinfouid
	 * @return
	 * @throws Exception
	 */
	int deleteVesselReqInfoDetailByVsslReqInfoUid(@Param("vsslreqinfouid") int vsslreqinfouid) throws Exception;

	/**
	 * 호선별 필요 정보 수정
	 * @param bean
	 * @return
	 * @throws Exception
	 */
	int updateVesselReqInfo(VesselReqInfoBean bean) throws Exception;

	/**
	 * 호선별 필요 정보 입력
	 * @param bean
	 * @return
	 * @throws Exception
	 */
	int insertVesselReqInfo(VesselReqInfoBean bean) throws Exception;

	/**
	 * 호선별 필요 정보 반환
	 * @param bean
	 * @return
	 * @throws Exception
	 */
	VesselReqInfoBean getVesselReqInfo(ParamBean bean) throws Exception;

	/**
	 * 호선별 필요 정보 반환
	 * @param bean
	 * @return
	 * @throws Exception
	 */
	VesselReqInfoBean getVesselReqInfoByTempUid(ParamBean bean) throws Exception;

	/**
	 * 호선별 필요 정보 상세 정보 목록 반환
	 * @param bean
	 * @return
	 * @throws Exception
	 */
	List<VesselReqInfoDetailBean> getVesselReqInfoDetList(ParamBean bean) throws Exception;

	/**
	 * 호선별 필요 정보 상세 정보 목록 갯수
	 * @return
	 * @throws Exception
	 */
	int getVesselReqInfoDetListCnt() throws Exception;

	/**
	 * 스케쥴러의 uid 로 활성화된 호선별 필요 정보 불러오기(보고서에서 사용)
	 * @param bean
	 * @return
	 * @throws Exception
	 */
	VesselReqInfoBean getVesselReqInfoBySchedinfoUid(ParamBean bean) throws Exception;

	/**
	 * 스케쥴러의 uid 로 활성화된 호선별 필요 정보 불러 오기(보고서에서 사용)
	 * @param bean
	 * @return
	 * @throws Exception
	 */
	List<VesselReqInfoDetailBean> getVesselReqInfoDetListBySchedinfoUid(ParamBean bean) throws Exception;

	/**
	 * hullNum 로 활성화된 호선별 필요 정보 불러 오기(보고서에서 사용)
	 * @return
	 * @throws Exception
	 */
	int getVesselReqInfoDetListBySchedinfoUidCnt() throws Exception;

	/**
	 * 호선별 필요 정보의 삭제
	 * @param uid
	 * @return
	 * @throws Exception
	 */
	int deleteVesselReqInfoDetail(@Param("uid") int uid) throws Exception;

	/**
	 * 호선별 필요 정보 입력
	 * @param bean
	 * @return
	 * @throws Exception
	 */
	int insertVesselReqInfoDetail(VesselReqInfoDetailBean bean) throws Exception;

	/**
	 * 호선별 필요 정보의 수정
	 * @param bean
	 * @return
	 * @throws Exception
	 */
	int updateVesselReqInfoDetail(VesselReqInfoDetailBean bean) throws Exception;

	/**
	 * 호선별 상태 정보 입력
	 * @param bean
	 * @return
	 * @throws Exception
	 */
	int insertShipCond(ShipCondBean bean) throws Exception;

	/**
	 * 호선별 상태 정보 삭제
	 * @param bean
	 * @return
	 * @throws Exception
	 */
	int deleteShipCond(int schedinfouid) throws Exception;

	/**
	 * 호선별 선박 상태 정보
	 * @param bean
	 * @return
	 * @throws Exception
	 */
	List <ShipCondBean> getShipCondList(ParamBean bean) throws Exception;
	
	/**
	 * 스케줄 계획 상태 변경 시 호선 정보 동시 상태 변경
	 * @param bean
	 * @return
	 * @throws Exception
	 */
	int changeStatusVesselReqInfoFromScheduler(ParamBean bean) throws Exception;
	
	/**
	 * 스케줄 계획 삭제 시 호선 정보 동시 삭제
	 * @param uid
	 * @return
	 * @throws Exception
	 */
	int deleteVesselReqInfoFromScheduler(int uid) throws Exception;

	/**
	 * 스케줄 계획 삭제 시 호선 정보 상세 동시 삭제
	 * @param uid
	 * @return
	 * @throws Exception
	 */
	int deleteVesselReqInfoDetailFromScheduler(int uid) throws Exception;

	/**
	 * 승선 시작일과 기간을 입력 함
	 * @param bean
	 * @return
	 * @throws Exception
	 */
	int updateScheCrewDays(SchedulerInfoBean bean) throws Exception;

	/**
	 * 승선 양식 저장
	 * @param bean
	 * @return
	 * @throws Exception
	 */
	int insertSchedulerCrewInfo(SchedulerCrewInfoBean bean) throws Exception;

	/**
	 * 승선 양식 저장
	 * @param bean
	 * @return
	 * @throws Exception
	 */
	int insertSchedulerCrewDetail(SchedulerCrewDetailBean bean) throws Exception;

	/**
	 * 승선자 정보 수정
	 * @param bean
	 * @return
	 * @throws Exception
	 */
	int updateSchedulerCrewInfo(SchedulerCrewInfoBean bean) throws Exception;

	/**
	 * 승선자 정보 삭제
	 * @param uid
	 * @return
	 * @throws Exception
	 */
	int deleteSchedulerCrewInfo(int uid) throws Exception;

	/**
	 * 승선자 정보 삭제
	 * @param schedulerCrewInfoUid
	 * @return
	 * @throws Exception
	 */
	int deleteSchedulerCrewDetailAll(int schedulerCrewInfoUid) throws Exception;

	/**
	 * 승선자 정보 불러오기
	 * @param schedulerInfoUid
	 * @return
	 * @throws Exception
	 */
	List<SchedulerCrewInfoBean> getSchedulerCrewInfoList(int schedulerInfoUid) throws Exception;

	/**
	 * 개정 번호의 정보를 불러온다
	 * @param uid
	 * @return
	 * @throws Exception
	 */
	SchedulerVersionInfoBean getSchedulerVersionInfo(int uid) throws Exception;

	/**
	 * 스케쥴의 개정 번호를 입력 한다.
	 * @param bean
	 * @return
	 * @throws Exception
	 */
	int insertSchedulerVersionInfo(SchedulerVersionInfoBean bean) throws Exception;

	/**
	 * 시운전 계획의 개정 번호를 갱신 한다.
	 * @param bean
	 * @return
	 * @throws Exception
	 */
	int updateSchedulerVersionInfoPlanRevNum(SchedulerVersionInfoBean bean) throws Exception;

	/**
	 * 시운전 실적의 개정 번호를 갱신 한다.
	 * @param bean
	 * @return
	 * @throws Exception
	 */
	int updateSchedulerVersionInfoExecRevNum(SchedulerVersionInfoBean bean) throws Exception;

	/**
	 * 시운전 완료의 개정 번호를 갱신 한다.
	 * @param bean
	 * @return
	 * @throws Exception
	 */
	int updateSchedulerVersionInfoCompRevNum(SchedulerVersionInfoBean bean) throws Exception;

	/**
	 * 개정 번호 업데이트
	 * @param bean
	 * @return
	 * @throws Exception
	 */
	int updateSchdulerRevNum(SchedulerInfoBean bean) throws Exception;

	/**
	 * 이전 스케쥴 저장
	 * @param bean
	 * @return
	 * @throws Exception
	 */
	int insertSchedulerNewVersion(SchedulerInfoBean bean) throws Exception;

	/**
	 * 이전 스케쥴 상세 저장
	 * @param bean
	 * @return
	 * @throws Exception
	 */
	int insertSchedulerDetailNewVersion(SchedulerDetailInfoBean bean) throws Exception;

	/**
	 * 시운전 스케줄 저장된 목록 조회
	 * @param bean
	 * @return List-bean
	 * @throws Exception
	 */
	List<SchedulerInfoBean> getSchedulerVersionList(SchedulerInfoBean bean) throws Exception;

	/**
	 * 시운전 스케줄 목록 페이징용 갯수 조회
	 * @return count
	 * @throws Exception
	 */
	int getSchedulerVersionListCnt() throws Exception;

	// ScheDaoI.getScheList 으로 이동.
	/**
	 * 시운전 스케줄 중 최신 버전이면서 실적 단계로 넘어간 목록 정보 조회
	 * @param bean
	 * @return List-bean
	 * @throws Exception
	 */
	List<SchedulerInfoBean> getSchedulerDepartureList(SchedulerInfoBean bean) throws Exception;

	// ScheDaoI.getScheListCnt 으로 이동.
	/**
	 * 시운전 스케줄 중 최신 버전이면서 실적 단계로 넘어간 목록 페이징용 갯수 조회
	 * @return count
	 * @throws Exception
	 */
	int getSchedulerDepartureListCnt() throws Exception;

	/**
	 *
	 * @param schedulerVersionInfoUid
	 * @param execRevNum
	 * @return
	 * @throws Exception
	 */
	List<SchedulerReportInfoBean> getSchedulerReportInfo(@Param("schedulerVersionInfoUid") int schedulerVersionInfoUid, @Param("execRevNum") String execRevNum) throws Exception;

	/**
	 * 출항 보고, 일일 보고 정보 등록
	 * @param reportKey
	 * @param reportValue
	 * @param schedulerVersionInfoUid
	 * @param execRevNum
	 * @param userUid
	 * @param planRevNum
	 * @return
	 * @throws Exception
	 */
	int insertDepartureReportRegInfo(@Param("schedulerVersionInfoUid") int schedulerVersionInfoUid, @Param("rowIdx") int rowIdx, @Param("planRevNum") String planRevNum, @Param("execRevNum") String execRevNum, @Param("compRevNum") String compRevNum
									 , @Param("reportKey") String reportKey, @Param("reportValue") String reportValue, @Param("reportKeyType") String reportKeyType, @Param("userUid") int userUid) throws Exception;

	/**
	 * 출항 보고, 일일 보고 정보 수정
	 * @param uid
	 * @param reportKey
	 * @param reportValue
	 * @param userUid
	 * @return
	 * @throws Exception
	 */
	int updateDepartureReportRegInfo(@Param("uid") int uid, @Param("reportKey") String reportKey, @Param("reportValue") String reportValue, @Param("rowIdx") int rowIdx, @Param("userUid") int userUid) throws Exception;

	/**
	 * 상세 스케쥴의 가장 빠른 시간 가져오기
	 * @param schedInfoUid
	 * @return
	 * @throws Exception
	 */
	String getSchedulerDetailStartTime(@Param("schedInfoUid") int schedInfoUid) throws Exception;

	/**
	 * 상세 스케쥴의 가장 느린 시간 가져오기
	 * @param schedInfoUid
	 * @return
	 * @throws Exception
	 */
	String getSchedulerDetailEndTime(@Param("schedInfoUid") int schedInfoUid) throws Exception;

	/**
	 *
	 * @param schedulerVersionInfoUid
	 * @param compRevNum
	 * @return
	 * @throws Exception
	 */
	List<SchedulerReportInfoBean> getSchedulerCompReportInfo(@Param("schedulerVersionInfoUid") int schedulerVersionInfoUid, @Param("compRevNum") String compRevNum) throws Exception;

	/**
	 * 보고서 특정 시점의 데이터 불러오기
	 * @param schedulerVersionInfoUid
	 * @param execRevNum
	 * @param reportKey
	 * @return
	 * @throws Exception
	 */
	String getSchedulerReportInfoKey(@Param("schedulerVersionInfoUid") int schedulerVersionInfoUid, @Param("execRevNum") String execRevNum, @Param("reportKey") String reportKey) throws Exception;

	/**
	 * 스케쥴에서 완료된 목록 가져오기
	 * @param bean
	 * @return
	 * @throws Exception
	 */
	List<SchedulerDetailInfoBean> getSchedulerCompRowDataList(SchedulerDetailInfoBean bean) throws Exception;

	/**
	 * 완료 보고서의 목록 데이터 불러오기
	 * @param schedulerVersionInfoUid
	 * @param compRevNum
	 * @param reportKeyType
	 * @return
	 * @throws Exception
	 */
	List<SchedulerReportInfoBean> getSchedulerCompReportList(@Param("schedulerVersionInfoUid") int schedulerVersionInfoUid, @Param("compRevNum") String compRevNum, @Param("reportKeyType") String reportKeyType) throws Exception;
	int getSchedulerCompReportListCnt(@Param("schedulerVersionInfoUid") int schedulerVersionInfoUid, @Param("compRevNum") String compRevNum, @Param("reportKeyType") String reportKeyType) throws Exception;

	int deleteDepartureReportRegInfo(@Param("uid") int uid) throws Exception;
	
	String isOfflineMode(int uid) throws Exception;
	
	// 스케쥴 코드목록 헤더 정보 목록 검색 (계획 신규)
	List<ScheduleCodeInfoBean> getScheduleCodeInfoListForNewSche(ScheduleCodeDetailBean bean) throws Exception;
	
	// 스케쥴 코드목록 상세 정보 목록 검색 (계획 신규)
	List<ScheduleCodeDetailBean> getScheduleCodeDetailListForNewSche(int uid) throws Exception;
	
	// 선종별 코드 멀티 등록 팝업 TC 조회 - 250205.
	List<ScheduleHierarchyBean> getScheCodeDetTcSearchListForMulti(ScheduleHierarchyBean bean) throws Exception;
	
	// 표준코드 1레벨 목록.
	List<ScheduleHierarchyBean> get1LevelCodeList() throws Exception;
}
