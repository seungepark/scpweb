package com.ssshi.ddms.general.service;

import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.ssshi.ddms.dto.DomainBean;
import com.ssshi.ddms.dto.ParamBean;

public interface GeneralServiceI {
	
	boolean isLogined(HttpServletRequest request) throws Exception;
	
	Map<String, Object> login(HttpServletRequest request, ParamBean bean) throws Exception;
	
	boolean changeUserSet(HttpServletRequest request, ParamBean bean) throws Exception;
	
	void getProImgStream(HttpServletRequest request, HttpServletResponse response) throws Exception;
	
	void getProImg(HttpServletRequest request, HttpServletResponse response, ParamBean bean) throws Exception;
	
	List<DomainBean> getDomainList(ParamBean bean) throws Exception;
	
	Map<String, Object> getDashboardData(HttpServletRequest request) throws Exception;
	
	boolean apiUploadFiles(ParamBean bean) throws Exception;
}
