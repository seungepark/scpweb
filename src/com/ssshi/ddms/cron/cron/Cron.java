package com.ssshi.ddms.cron.cron;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import com.ssshi.ddms.cron.service.CronServiceI;

/********************************************************************************
 * 프로그램 개요 : Cron
 * 
 * 최초 작성자 : 김한준
 * 최초 작성일 : 2021-07-11
 * 
 * 최종 수정자 : KHJ
 * 최종 수정일 : 2024-07-16
 * 
 * 메모 : 없음
 * 
 * Copyright 2024 by SiriusB. Confidential and proprietary information
 * This document contains information, which is the property of SiriusB, 
 * and is furnished for the sole purpose of the operation and the maintenance.  
 * Copyright © 2024 SiriusB.  All rights reserved.
 *
 ********************************************************************************/

@Component
public class Cron {

	@Autowired
	private CronServiceI service;
	
	@Scheduled(cron="0 30 1 * * *")		// 매일 1:30 실행
	public void updateShipInfo() throws Exception {
//		service.updateShipInfo();
	}
}