package com.ssshi.ddms.db.service;

import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import com.ssshi.ddms.dto.DomainBean;
import com.ssshi.ddms.dto.DomainInfoBean;
import com.ssshi.ddms.dto.ParamBean;
import com.ssshi.ddms.dto.ShipInfoBean;

public interface DbServiceI {
	
	List<DomainBean> getDomainList(DomainBean bean) throws Exception;
	
	boolean insertDomain(HttpServletRequest request, DomainBean bean) throws Exception;
	
	Map<String, Object> updateDomain(HttpServletRequest request, DomainBean bean) throws Exception;
	
	List<ShipInfoBean> getVesselList(ShipInfoBean bean) throws Exception;
	
	String deleteVessel(HttpServletRequest request, ParamBean bean) throws Exception;
	
	Map<String, Object> newVessel() throws Exception;
	
	String insertVessel(HttpServletRequest request, ShipInfoBean bean) throws Exception;
	
	ShipInfoBean detailVessel(ParamBean bean) throws Exception;
	
	String updateVessel(HttpServletRequest request, ShipInfoBean bean) throws Exception;
	
	Map<String, Object> modifyVessel(ParamBean bean) throws Exception;
	
	Map<String, Object> deleteDomain(HttpServletRequest request, ParamBean bean) throws Exception;
	
	boolean setDefaultVessel(HttpServletRequest request, ParamBean bean) throws Exception;
	
	/**
	 * 스케줄러 팝업에서 선박 목록 조회 
	 * @param bean
	 * @return
	 * @throws Exception
	 */
	Map<String, Object> getVesselListForPop(ShipInfoBean bean) throws Exception;

	List<DomainInfoBean> getDomainInfoList(String domain) throws Exception;
	
	Map<String, Object> getVesselPageList(ShipInfoBean bean) throws Exception;
	
	boolean updateVesselDetail(HttpServletRequest request, ShipInfoBean bean) throws Exception;
}
