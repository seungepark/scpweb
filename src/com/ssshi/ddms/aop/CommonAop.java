package com.ssshi.ddms.aop;

import javax.servlet.http.HttpServletRequest;

import org.apache.log4j.ConsoleAppender;
import org.apache.log4j.DailyRollingFileAppender;
import org.apache.log4j.Level;
import org.apache.log4j.Logger;
import org.apache.log4j.PatternLayout;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.AfterThrowing;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;

import com.ssshi.ddms.constant.Const;

/********************************************************************************
 * 프로그램 개요 : AOP
 * 
 * 최초 작성자 : 김한준
 * 최초 작성일 : 2021-06-07
 * 
 * 최종 수정자 : 김한준
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

@Aspect
public class CommonAop {
	
	static Logger logger = Logger.getLogger(CommonAop.class);
	
	public CommonAop() {
		try {
			String file = "D:/FILEINFO_SCP/Log/System.out.error.log";
			String datePattern = "'.'yy-MM-dd'.'HH";
			String conversionPattern = "[%d{yy/MM/dd HH:mm:ss.SSS}] %-5p %c{2}(%13F:%L) [%t] %3x - %m%n";
			
			PatternLayout layout = new PatternLayout(conversionPattern);
			ConsoleAppender consoleApd = new ConsoleAppender(layout);
			DailyRollingFileAppender fileApd = new DailyRollingFileAppender(layout, file, datePattern);
		
			fileApd.setThreshold(Level.ERROR);
			fileApd.setAppend(true);
			
			logger.addAppender(consoleApd);
			logger.addAppender(fileApd);
			logger.setLevel(Level.ERROR);
		}catch(Exception e) {
			e.printStackTrace();
		}
	}
	
	/**
	 * throwingLogging
	 * @param joinPoint : 
	 * @param ex		: 
	 */
	@AfterThrowing(pointcut="execution(* com.ssshi.ddms.*..*.*(..))", throwing="ex")
	public void throwingLogging(JoinPoint joinPoint, Throwable ex) {
		StringBuffer msg = new StringBuffer();
		
		msg.append("\n================= [Exception Info] ==================");
		msg.append("\nMethod Name : " + joinPoint.getSignature().getName());
		msg.append("\nMessage : -------------------------------------------");
		
		for(int i = 0; i < ex.getStackTrace().length; i++) {
			msg.append("\n" + ex.getStackTrace()[i].toString());
		}
		
		msg.append("\n-----------------------------------------------------");
		
		logger.error(msg.toString());
	}
	
	/**
	 * requestCheck
	 * @param joinPoint  : 
	 * @return modelAndView : 
	 * @throws Throwable
	 */
	@Around("within(@org.springframework.stereotype.Controller *) && execution(* *(..))")
	public String requestCheck(ProceedingJoinPoint joinPoint) throws Throwable {
		HttpServletRequest request = (HttpServletRequest) joinPoint.getArgs()[0];
		String path = request.getServletPath();
		String mav = "redirect:/index.html";
		
		if("/index.html".equals(path) || "/login.html".equals(path) || "/logout.html".equals(path) || "/getDocSignImg.html".equals(path) || "/api/up/files.html".equals(path)) {
			mav = (String) joinPoint.proceed();
		}else {
			if((request.getSession().getAttribute(Const.SS_USERINFO)) != null) {
				mav = (String) joinPoint.proceed();
			}
		}
		
		return mav;
	}
}
