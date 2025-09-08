package com.ssshi.ddms.cron.service;

import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import com.ssshi.ddms.dto.CronInfoBean;
import com.ssshi.ddms.dto.ParamBean;

public interface CronServiceI {
	
	void updateShipInfo() throws Exception;
	
	void dbBackup() throws Exception;
	
	void fileBackup() throws Exception;
	
	/**
	 * Cron 1건에 대한 정보 반환
	 * @param bean
	 * @return CronInfoBean
	 * @throws Exception
	 */
	CronInfoBean getCron(ParamBean bean) throws Exception;
	
	/**
	 * Cron 목록에 대한 정보 반환
	 * @param bean
	 * @return List<CronInfoBean>
	 * @throws Exception
	 */
	Map<String, Object> getCronList(CronInfoBean bean) throws Exception;
	
	/**
	 * Cron에 대한 상세 정보 반환
	 * @param bean
	 * @return CronInfoBean
	 * @throws Exception
	 */
	CronInfoBean detailCron(ParamBean bean) throws Exception;
	
	/**
	 * Cron에 대한 상세 정보 반환
	 * @param bean
	 * @return CronInfoBean
	 * @throws Exception
	 */
	CronInfoBean modifyCron(ParamBean bean) throws Exception;
	
	/**
	 * Cron 정보 변경
	 * @param request
	 * @param bean
	 * @return resultString
	 * @throws Exception
	 */
	String updateCron(HttpServletRequest request, CronInfoBean bean) throws Exception;
	
	/**
	 * Cron 상태변경
	 * @param request
	 * @param bean
	 * @return result
	 * @throws Exception
	 */
	boolean changeStatusCron(HttpServletRequest request, ParamBean bean) throws Exception;
	
	/**
	 * Cron 정보 삭제
	 * @param request
	 * @param bean
	 * @return result
	 * @throws Exception
	 */
	boolean deleteCron(HttpServletRequest request, ParamBean bean) throws Exception;
	
	/**
	 * 신규 Cron 정보 생성
	 * @param request
	 * @param bean
	 * @return result
	 * @throws Exception
	 */
	String insertCron(HttpServletRequest request, CronInfoBean bean) throws Exception;
	
	/**
	 * Cron 실행 후 RunCnt, LastRunDate 값 변경
	 * @param bean
	 * @return cnt
	 * @throws Exception
	 */
	boolean increaseCronRunCntAndDate(String cronId) throws Exception;
}
