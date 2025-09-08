package com.ssshi.ddms.mybatis.dao;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

import com.ssshi.ddms.dto.ShipInfoBean;

/********************************************************************************
 * 프로그램 개요 : Cron
 * 
 * 최초 작성자 : KHJ
 * 최초 작성일 : 2024-07-16
 * 
 * 최종 수정자 : KHJ
 * 최종 수정일 : 2024-07-17
 * 
 * 메모 : 없음
 * 
 * Copyright 2024 by SiriusB. Confidential and proprietary information
 * This document contains information, which is the property of SiriusB, 
 * and is furnished for the sole purpose of the operation and the maintenance.  
 * Copyright © 2024 SiriusB.  All rights reserved.
 *
 ********************************************************************************/

public class CronDao {

	private static final String URL = "jdbc:mysql://localhost:3306/scdvw";
	private static final String USER = "scp";
	private static final String PW = "shi1234";
	
	public static List<ShipInfoBean> getProjList() throws Exception {
		List<ShipInfoBean> list = new ArrayList<ShipInfoBean>();
		Connection conn = null;
		PreparedStatement stmt = null;
		ResultSet rs = null;
		
		try {
			String sql = "SELECT DISTINCT PROJ_NO, DOCK_NO, SERS_NO, PROJ_SEQ, OWN, SKND, NEW_SKND" +
						" FROM SCDVW_EVNT_SCH_DAEJOEN" + 
						" WHERE PROJ_NO = 'IN0058' OR PROJ_NO LIKE 'SN%'" + 
						" ORDER BY PROJ_NO, OWN";
			
			conn = DriverManager.getConnection(URL, USER, PW);
			stmt = conn.prepareStatement(sql);
			rs = stmt.executeQuery();
			
			while(rs.next()) {
				int idx = 1;
				ShipInfoBean event = new ShipInfoBean();
				event.setShipNum(rs.getString(idx++));
				event.setDock(rs.getString(idx++));
				event.setMainHullNum(rs.getString(idx++));
				event.setProjSeq(rs.getString(idx++));
				event.setRegOwner(rs.getString(idx++));
				event.setShipType(rs.getString(idx++));
				event.setTypeModel(rs.getString(idx++));
				list.add(event);
			}
		}catch(Exception e) {
			e.printStackTrace();
		}finally {
			try {
				if(rs != null) rs.close();
				if(stmt != null) stmt.close();
				if(conn != null) conn.close();
			}catch(SQLException e) {}
		}
		
		return list;
	}
}
