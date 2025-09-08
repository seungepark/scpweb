package com.ssshi.ddms.manager.service;

import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import com.ssshi.ddms.dto.*;

public interface ManagerServiceI {
	
	/**
	 * 시운전 스케줄 화면 호출 정보
	 * @return
	 * @throws Exception
	 */
	Map<String, Object> scheduler() throws Exception;
	
	/**
	 * 시운전 스케줄 목록 정보 반환
	 * @param bean
	 * @return list, listCnt
	 * @throws Exception
	 */
	Map<String, Object> getSchedulerList(SchedulerInfoBean bean) throws Exception;
	
	/**
	 * 시운전 스케줄 정보 반환
	 * @param bean
	 * @return bean
	 * @throws Exception
	 */
	SchedulerInfoBean getScheduler(ParamBean bean) throws Exception;
	
	/**
	 * 시운전 스케줄 상세화면 정보 반환
	 * @param bean
	 * @return bean
	 * @throws Exception
	 */
	SchedulerInfoBean detailScheduler(ParamBean bean) throws Exception;
	
	/**
	 * 시운전 스케줄 상세 행데이터 목록 정보 반환
	 * @param bean
	 * @return list, listCnt
	 * @throws Exception
	 */
	Map<String, Object> getSchedulerRowDataList(SchedulerDetailInfoBean bean) throws Exception;
	
	
	/**
	 * 시운전 스케줄 상세 차트 목록 정보 반환
	 * @param bean
	 * @return
	 * @throws Exception
	 */
	Map<String, Object> getSchedulerChartDataList(SchedulerDetailInfoBean bean) throws Exception;
	
	/**
	 * 신규 시운전 스케줄 생성
	 * @param bean
	 * @return
	 * @throws Exception
	 */
	Map<String, Object> newScheduler(HttpServletRequest request, ParamBean bean) throws Exception;
	
	/**
	 * 시운전 스케줄러 수정 화면 이동 
	 * @param request
	 * @param bean
	 * @return
	 * @throws Exception
	 */
	Map<String, Object> modifyScheduler(HttpServletRequest request, ParamBean bean) throws Exception;
	
	/**
	 * 시운전 스케줄러 업데이트 
	 * @param request
	 * @param bean
	 * @return
	 * @throws Exception
	 */
	boolean updateScheduler(HttpServletRequest request, SchedulerInfoBean bean) throws Exception;

	/**
	 * 시운전 스케줄 TC Num 조회 팝업 목록 정보 반환
	 * @param request
	 * @param bean
	 * @return
	 * @throws Exception
	 */
	Map<String, Object> getScheduleTcNumSearchList(HttpServletRequest request, ScheduleCodeDetailBean bean)throws Exception;
	
	/**
	 * 시운전 스케줄러 추가
	 * @param request
	 * @param bean
	 * @return
	 * @throws Exception
	 */
	String insertScheduler(HttpServletRequest request, SchedulerInfoBean bean) throws Exception;
	
	/**
	 * 시운전 스케줄러 삭제 
	 * @param request
	 * @param bean
	 * @return
	 * @throws Exception
	 */
	boolean deleteScheduler(HttpServletRequest request, ParamBean bean) throws Exception;
	
	/**
	 * 시운전 스케줄러 상태 변경 
	 * @param request
	 * @param bean
	 * @return
	 * @throws Exception
	 */
	boolean changeStatusScheduler(HttpServletRequest request, ParamBean bean) throws Exception;
	
	/**
	 * 시운전 스케줄 계층 기준정보 반환 
	 * @param request
	 * @param bean
	 * @return
	 * @throws Exception
	 */
	Map<String, Object> getScheduleHierarchyList(HttpServletRequest request, ScheduleHierarchyBean bean)throws Exception;
	
	/**
	 * 시운전 스케줄러 계층 상위 계증 정보 반환
	 * @param request
	 * @param bean
	 * @return
	 * @throws Exception
	 */
	Map<String, Object> getScheduleHierarchyParentList(HttpServletRequest request, ScheduleHierarchyBean bean)throws Exception;
	
	/**
	 * 시운전 스케줄러 계층 기준정보 수정
	 * @param request
	 * @param bean
	 * @return
	 * @throws Exception
	 */
	boolean updateScheduleHierarchy(HttpServletRequest request, ScheduleHierarchyBean bean) throws Exception;
	
	/**
	 * 시운전 스케줄러 코드 정보 화면 기본 정보 조회 
	 * @param request
	 * @param bean
	 * @return
	 * @throws Exception
	 */
	Map<String, Object> scheduleCode(HttpServletRequest request, ParamBean bean)throws Exception;
	
	/**
	 * 시운전 스케줄러 코드 정보 목록 반환
	 * @param request
	 * @param bean
	 * @return
	 * @throws Exception
	 */
	Map<String, Object> getScheduleCodeInfoList(HttpServletRequest request, ScheduleCodeInfoBean bean)throws Exception;
	
	/**
	 * 시운전 스케줄러 코드 정보 반환
	 * @param request
	 * @param bean
	 * @return
	 * @throws Exception
	 */
	Map<String, Object> getScheduleCodeInfo(HttpServletRequest request, ParamBean bean)throws Exception;

	/**
	 * 시운전 스케줄러 코드 상세 정보 목록 반환
	 * @param bean
	 * @return
	 * @throws Exception
	 */
	Map<String, Object> getSchedulerCodeDetList(ParamBean bean) throws Exception;
	
	/**
	 * 시운전 스케줄러 계층 정보 팝업 입력용 목록 반환
	 * @param request
	 * @param bean
	 * @return
	 * @throws Exception
	 */
	Map<String, Object> getScheduleHierarchyForCodeDetList(HttpServletRequest request, ScheduleHierarchyBean bean)throws Exception;
	
	/**
	 * 시운전 스케줄러 코드 업데이트 
	 * @param request
	 * @param bean
	 * @return
	 * @throws Exception
	 */
	boolean updateScheduleCode(HttpServletRequest request, ScheduleCodeInfoBean bean) throws Exception;
	
	/**
	 * 시운전 스케줄러 코드 상태 변경 
	 * @param request
	 * @param bean
	 * @return
	 * @throws Exception
	 */
	boolean changeStatusScheduleCode(HttpServletRequest request, ParamBean bean) throws Exception;
	
	/**
	 * 시운전 스케줄러 코드 삭제 
	 * @param request
	 * @param bean
	 * @return
	 * @throws Exception
	 */
	boolean deleteScheduleCode(HttpServletRequest request, ParamBean bean) throws Exception;

	/**
	 * 신규 스케줄러 코드 화면 반환 
	 * @param request
	 * @param bean
	 * @return
	 * @throws Exception
	 */
	Map<String, Object> newScheduleCode(HttpServletRequest request, ParamBean bean) throws Exception;

	/**
	 * 신규 스케줄러 코드 추가 
	 * @param request
	 * @param bean
	 * @return
	 * @throws Exception
	 */
	boolean insertScheduleCode(HttpServletRequest request, ScheduleCodeInfoBean bean) throws Exception;

	/**
	 * 필요 정보의 표군 구분 화면 조회
	 * @param request
	 * @param bean
	 * @return
	 * @throws Exception
	 */
	Map<String, Object> getStndReqInfo(HttpServletRequest request, ParamBean bean) throws Exception;

	/**
	 * 필요 정보의 표준 구분 데이터 조회
	 * @return
	 * @throws Exception
	 */
	Map<String, Object> getStandardReqInfoList() throws Exception;

	/**
	 * 필요 정보의 표준 구분 데이터 삭제
	 * @param request
	 * @param bean
	 * @return
	 * @throws Exception
	 */
	boolean deleteStandardReqInfo(HttpServletRequest request, ParamBean bean) throws Exception;

	/**
	 * 필요 정보의 표준 구분 데이터 입력
	 * @param request
	 * @param params
	 * @return
	 * @throws Exception
	 */
	boolean insertStandardReqInfo(HttpServletRequest request, List<StandardReqInfoBean> params) throws Exception;

	/**
	 * 호선별 필요 정보 화면
	 * @return
	 * @throws Exception
	 */
	Map<String, Object> vesselReqInfo() throws Exception;
	
	/**
	 * 호선별 필요 정보 헤더 목록
	 * @param request
	 * @param bean
	 * @return
	 * @throws Exception
	 */
	Map<String, Object> getVessleReqInfoList(HttpServletRequest request, VesselReqInfoBean bean)throws Exception;

	/**
	 * 호선별 필요 정보 상태 변경
	 * @param request
	 * @param bean
	 * @return
	 * @throws Exception
	 */
	boolean changeStatusVesselReqInfo(HttpServletRequest request, ParamBean bean) throws Exception;

	/**
	 * 호선별 필요 정보 삭제
	 * @param request
	 * @param bean
	 * @return
	 * @throws Exception
	 */
	boolean deleteVesselReqInfo(HttpServletRequest request, ParamBean bean) throws Exception;

	/**
	 * 호선별 필요 정보 반환
	 * @param request
	 * @param bean
	 * @return
	 * @throws Exception
	 */
	Map<String, Object> getVesselReqInfo(HttpServletRequest request, ParamBean bean)throws Exception;

	/**
	 * 호선별 필요 정보 상세 정보 목록 반환
	 * @param bean
	 * @return
	 * @throws Exception
	 */
	Map<String, Object> getVesselReqInfoDetList(ParamBean bean) throws Exception;

	/**
	 * hullNum 로 활성화된 호선별 필요 정보 불러 오기
	 * @param bean
	 * @return
	 * @throws Exception
	 */
	Map<String, Object> getVesselReqInfoDetListByHullNum(ParamBean bean) throws Exception;

	/**
	 * 호선별 필요 정보 상세 정보 입력, 수정, 삭제 관리
	 * @param request
	 * @param param
	 * @return
	 * @throws Exception
	 */
	boolean insertVesselReqInfoDet(HttpServletRequest request, VesselReqInfoBean param) throws Exception;

	/**
	 * 호선별 필요 정보 신규 입력 화면 반환
	 * @param request
	 * @param bean
	 * @return
	 * @throws Exception
	 */
	Map<String, Object> newVesselReqInfo(HttpServletRequest request, ParamBean bean) throws Exception;

	/**
	 * 호선별 필요 정보 입력
	 * @param request
	 * @param param
	 * @return
	 * @throws Exception
	 */
	boolean insertVesselReqInfo(HttpServletRequest request, VesselReqInfoBean param) throws Exception;

	/**
	 * 스케쥴 팝업 차트에서 필요한 정보 호출
	 * @param request
	 * @return
	 * @throws Exception
	 */
	Map<String, Object> popModifyScheChart(HttpServletRequest request) throws Exception;
	
	/**
	 * 스케줄 생성 시 호선 정보 입력 팝업 상세 조회 
	 * @param request
	 * @return
	 * @throws Exception
	 */
	Map<String, Object> getCurReqInfoDetList(HttpServletRequest request, ParamBean bean) throws Exception;

	/**
	 * 호선별 상태 정보 입력
	 * @param request
	 * @param param
	 * @return
	 * @throws Exception
	 */
	boolean insertShipCond(HttpServletRequest request, ShipCondBean param) throws Exception;

	/**
	 * 호선별 선박 상태 불러오기
	 * @return
	 * @throws Exception
	 */
	Map<String, Object> getShipCondList(ParamBean bean) throws Exception;

	/**
	 * 스케쥴러의 리포트 화면에서 사용할 데이터 불러오기(선박상태 도메인)
	 * @param request
	 * @return
	 * @throws Exception
	 */
	Map<String, Object> reportSchedule(HttpServletRequest request) throws Exception;

	/**
	 * 시운전 계획 Dashboard 화면 이동
	 * @param request
	 * @param bean
	 * @return
	 * @throws Exception
	 */
	Map<String, Object> departureDashboard(HttpServletRequest request, ParamBean bean) throws Exception;
	
	/**
	 * 시운전 계획 - 출항보고 화면 이동
	 * @param request
	 * @param bean
	 * @return
	 * @throws Exception
	 */
	Map<String, Object> departureReport(HttpServletRequest request, ParamBean bean) throws Exception;

	/**
	 * 시운전 계획 - 출항보고 화면
	 * @param request
	 * @param bean
	 * @return
	 * @throws Exception
	 */
	Map<String, Object> departureReportRegInfo(HttpServletRequest request, ParamBean bean) throws Exception;

	/**
	 * 승선 시작일과 기간을 저장 함
	 * @param request
	 * @param bean
	 * @return
	 * @throws Exception
	 */
	boolean updateScheCrewDays(HttpServletRequest request, SchedulerInfoBean bean) throws Exception;

	/**
	 * 시운전 승선자 업데이트
	 * @param request
	 * @param bean
	 * @return
	 * @throws Exception
	 */
	boolean updateSchedulerCrew(HttpServletRequest request, SchedulerInfoBean bean) throws Exception;

	/**
	 * 승선자 정보 불러오기
	 * @param request
	 * @param schedulerInfoUid
	 * @return
	 * @throws Exception
	 */
	Map<String, Object> getSchedulerCrewInfoList(HttpServletRequest request, int schedulerInfoUid) throws Exception;

	/**
	 * 시운전 스케줄러 업데이트
	 * @param request
	 * @param bean
	 * @return
	 * @throws Exception
	 */
	boolean updateScheNewRevNum(HttpServletRequest request, SchedulerInfoBean bean) throws Exception;

	/**
	 * 시운전 스케줄 목록 페이징용 갯수 조회
	 * @param bean
	 * @return
	 * @throws Exception
	 */
	Map<String, Object> getSchedulerVersionList(SchedulerInfoBean bean) throws Exception;

	/**
	 * 출항 보고 화면 차트 데이터 불러오기
	 * @param request
	 * @param bean
	 * @return
	 * @throws Exception
	 */
	Map<String, Object> departureReportScheduleChart(HttpServletRequest request, ParamBean bean) throws Exception;

	/**
	 * 시운전 스케쥴의 실적 버전 정보 입력
	 * @param request
	 * @param bean
	 * @return
	 * @throws Exception
	 */
	boolean updateDepartureReport(HttpServletRequest request, ParamBean bean) throws Exception;

	/**
	 * 시운전 스케줄 중 최신 버전이면서 실적 단계로 넘어간 목록 정보 반환
	 * @param bean
	 * @return list, listCnt
	 * @throws Exception
	 */
	Map<String, Object> getSchedulerDepartureList(SchedulerInfoBean bean) throws Exception;

	/**
	 * 출항 보고, 일일 보고 정보 등록
	 * @param request
	 * @param bean
	 * @return
	 * @throws Exception
	 */
	Map<String, Object> insertDepartureReportRegInfo(HttpServletRequest request, SchedulerReportInfoBean bean) throws Exception;

	/**
	 * 출항 보고, 출항 보고 제출
	 * @param request
	 * @param paramBean
	 * @return
	 * @throws Exception
	 */
	boolean submitDepartureReportInfo(HttpServletRequest request, ParamBean paramBean) throws Exception;

	/**
	 * 시운전 계획 - 일일보고 정보 등록 화면
	 * @param request
	 * @param bean
	 * @return
	 * @throws Exception
	 */
	Map<String, Object> departureReportRegDailyInfo(HttpServletRequest request, ParamBean bean) throws Exception;

	/**
	 * 시운전 계획 - 완료보고 정보 등록 화면
	 * @param request
	 * @param bean
	 * @return
	 * @throws Exception
	 */
	Map<String, Object> departureReportRegCompleteInfo(HttpServletRequest request, ParamBean bean) throws Exception;

	List<ScheduleCodeInfoBean> getScheduleCodeInfoListForNewSche(ScheduleCodeDetailBean bean) throws Exception;
	
	List<ScheduleCodeDetailBean> getScheduleCodeDetailListForNewSche(ParamBean bean) throws Exception;
	
	// 선종별 코드 멀티 등록 팝업 TC 조회 - 250205.
	List<ScheduleHierarchyBean> getScheCodeDetTcSearchListForMulti(ScheduleHierarchyBean bean)throws Exception;
}
