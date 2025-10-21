package com.ssshi.ddms.crew.service;

import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.ssshi.ddms.dto.ParamBean;

import com.ssshi.ddms.dto.RegistrationCrewBean;
import com.ssshi.ddms.dto.RegistrationCrewListBean;

public interface CrewServiceI {
	
	Map<String, Object> registrationCrew(HttpServletRequest request, RegistrationCrewBean bean) throws Exception;
	
	Map<String, Object> getRegistrationCrewList(HttpServletRequest request, RegistrationCrewBean bean) throws Exception;
	
	Map<String, Object> registrationCrewSave(HttpServletRequest request, RegistrationCrewListBean bean) throws Exception;
	
	Map<String, Object> registrationCrewRemove(HttpServletRequest request, ParamBean bean) throws Exception;
	
	Map<String, Object> crewOrderUpdate(HttpServletRequest request, ParamBean bean) throws Exception;
	
	void downCrewExcel(HttpServletResponse response) throws Exception;
}
