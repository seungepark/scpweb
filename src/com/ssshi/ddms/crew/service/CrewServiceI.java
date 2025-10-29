package com.ssshi.ddms.crew.service;

import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.ssshi.ddms.dto.ParamBean;

import com.ssshi.ddms.dto.RegistrationCrewBean;
import com.ssshi.ddms.dto.RegistrationCrewListBean;

import com.ssshi.ddms.dto.AnchorageMealRequestBean;
import com.ssshi.ddms.dto.AnchorageMealQtyBean;
import com.ssshi.ddms.dto.AnchorageMealListBean;

public interface CrewServiceI {
	
	//시운전 승선신청
	Map<String, Object> registrationCrew(HttpServletRequest request, RegistrationCrewBean bean) throws Exception;
	
	Map<String, Object> getRegistrationCrewList(HttpServletRequest request, RegistrationCrewBean bean) throws Exception;
	
	Map<String, Object> registrationCrewSave(HttpServletRequest request, RegistrationCrewListBean bean) throws Exception;
	
	Map<String, Object> registrationCrewRemove(HttpServletRequest request, ParamBean bean) throws Exception;
	
	Map<String, Object> crewOrderUpdate(HttpServletRequest request, ParamBean bean) throws Exception;
	
	void downCrewExcel(HttpServletResponse response) throws Exception;
	
	//앵카링 식사신청
	Map<String, Object> anchorageMealRequest(HttpServletRequest request, AnchorageMealRequestBean bean) throws Exception;
	
	Map<String, Object> getAnchorageMealList(HttpServletRequest request, AnchorageMealRequestBean bean) throws Exception;
	
	Map<String, Object> anchorageMealSave(HttpServletRequest request, AnchorageMealListBean bean) throws Exception;
	
	Map<String, Object> anchorageMealRemove(HttpServletRequest request, ParamBean bean) throws Exception;
	
	Map<String, Object> anchOrderUpdate(HttpServletRequest request, ParamBean bean) throws Exception;
	
	void downAnchExcel(HttpServletResponse response) throws Exception;
}
