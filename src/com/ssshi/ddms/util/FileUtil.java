package com.ssshi.ddms.util;

import java.io.File;
import java.io.FileInputStream;
import java.io.InputStream;
import java.net.URLDecoder;
import java.net.URLEncoder;
import java.util.Calendar;

import org.apache.commons.io.FilenameUtils;

import com.itextpdf.text.Image;

/********************************************************************************
 * 프로그램 개요 : File Util
 * 
 * 최초 작성자 : 김한준
 * 최초 작성일 : 2021-07-06
 * 
 * 최종 수정자 : 김한준
 * 최종 수정일 : 2025-05-26
 * 
 * 메모 : 없음
 * 
 * Copyright 2021 by HLab. Confidential and proprietary information
 * This document contains information, which is the property of HLab, 
 * and is furnished for the sole purpose of the operation and the maintenance.  
 * Copyright © 2021 HLab.  All rights reserved.
 *
 ********************************************************************************/

public class FileUtil {
	
	public static final String FILE_DIR_ROOT = "D:\\FILEINFO_SCP";
//	public static final String FILE_DIR_ROOT = "C:\\FILEINFO_SCP";
	public static final String FILE_DIR_BACKUP_ROOT = "E://FILEINFO_SCP";
	public static final String FILE_DIR_FOR_BBS = "\\BBS";
	public static final String FILE_DIR_FOR_NOTE = "\\NOTE";
	public static final String FILE_DIR_FOR_PROFILE = "\\PROFILE";
	public static final String FILE_DIR_FOR_DB_BACKUP = "E://FILEINFO_SCP//DB_BACK";
	public static final String RUNTIME = " C:/Program Files/MySQL/MySQL Server 5.7/bin/mysqldump -hlocalhost -p3306 -uscp -pshi1234 --default-character-set=utf8 scp";
	
	public static final String BBS_FILE = "BBS";
	public static final String NOTE_FILE = "NOTE";
	public static final String PROFILE_FILE = "P";
	public static final String FILE_EXTENSION_PNG = "image/png";
	public static final String FILE_EXTENSION_JPEG = "image/jpeg";
	public static final String FILE_EXTENSION_PDF = "application/pdf";
	public static final String DOC_DEFAULT_FILE_NAME = "doc.png";
	public static final String PROFILE_DEFAULT_FILE_NAME = "profile.png";
	
	public static String getSaveFileName(String kind) {
		return System.currentTimeMillis() + "_" + ((int)(Math.random() * 100) + 1) + "_" + kind;
	}
	
	public static String getSaveFileNameForUser(String kind, String id, int uid) {
		return kind + "_" + id + "_" + uid + "_" + System.currentTimeMillis() + "_" + ((int)(Math.random() * 100) + 1);
	}
	
	public static String getPdfFileName(boolean isYesterday) {
		Calendar cal = Calendar.getInstance();
		
		if(isYesterday) {
			cal.add(Calendar.DATE, -1);
		}
		
		int month = cal.get(Calendar.MONTH) + 1;
		int day = cal.get(Calendar.DAY_OF_MONTH);
		
		return cal.get(Calendar.YEAR) + "-" 
				+ (month < 10 ? "0" : "") + month + "-" 
				+ (day < 10 ? "0" : "") + day + "_" 
				+ System.currentTimeMillis() + "_" 
				+ ((int)(Math.random() * 100) + 1);
	}
	
	public static String getPdfFileName(String date) {
		return date + "_" + System.currentTimeMillis() + "_" + ((int)(Math.random() * 100) + 1);
	}
	
	public static String getSaveFileNameWithExtention(String kind, String orgName) {
		return getSaveFileName(kind) + "." + FilenameUtils.getExtension(orgName);
	}
	
	public static String getContentType(String name) {
		String exe = null;
		String type = null;
		
		if(name == null || name.length() <= 4) {
			exe = FilenameUtils.getExtension(DOC_DEFAULT_FILE_NAME);
		}else {
			exe = FilenameUtils.getExtension(name);
		}
		
		if("png".equals(exe.toLowerCase())) {
			type = FILE_EXTENSION_PNG;
		}else if("jpg".equals(exe.toLowerCase()) || "jpeg".equals(exe.toLowerCase())) {
			type = FILE_EXTENSION_JPEG;
		}else if("pdf".equals(exe.toLowerCase())) {
			type = FILE_EXTENSION_PDF;
		}
		
		return type;
	}
	
	public static String getContentTypeByType(String type) {
		if("png".equals(type.toLowerCase())) {
			type = FILE_EXTENSION_PNG;
		}else if("jpg".equals(type.toLowerCase()) || "jpeg".equals(type.toLowerCase())) {
			type = FILE_EXTENSION_JPEG;
		}else if("pdf".equals(type.toLowerCase())) {
			type = FILE_EXTENSION_PDF;
		}
		
		return type;
	}
	
	public static String getFileType(String name) {
		String exe = null;
		String type = null;
		
		if(name == null || name.length() <= 4) {
			exe = FilenameUtils.getExtension(DOC_DEFAULT_FILE_NAME);
		}else {
			exe = FilenameUtils.getExtension(name);
		}
		
		if("png".equals(exe.toLowerCase())) {
			type = "PNG";
		}else if("jpg".equals(exe.toLowerCase()) || "jpeg".equals(exe.toLowerCase())) {
			type = "JPG";
		}else if("pdf".equals(exe.toLowerCase())) {
			type = "PDF";
		}else {
			type = exe;
		}
		
		return type;
	}
	
	public static InputStream getFile(String path) {
		File file = new File(FILE_DIR_ROOT + path);
		InputStream is = null;
		
		if(file != null) {
			try {
				is = new FileInputStream(file);
			}catch(Exception e) {
				e.printStackTrace();
			}
		}
		
		return is;
	}
	
	public static boolean deleteFile(String path) {
		File file = new File(FILE_DIR_ROOT + path);
		
		if(file.exists()) {
			return file.delete();
		}else {
			return false;
		}
	}
	
	public static String decodeFileName(String name, String agent) {
		try {
			String fileName = URLDecoder.decode(name, "UTF-8");
			
			if(agent.contains("Trident")) {
				fileName = URLEncoder.encode(fileName, "UTF-8").replaceAll("\\+", " ");
			}else if(agent.contains("Edg")) {
				fileName = URLEncoder.encode(fileName, "UTF-8");
			}else if(agent.contains("Chrome")) {
				fileName = URLEncoder.encode(fileName, "UTF-8");
			}else {
				fileName = new String(fileName.getBytes("UTF-8"), "ISO-8859-1");
			}
			
			return fileName;
		}catch(Exception e) {
			return name;
		}
	}
	
	public static Image getPdfImage(String path) {
		try {
			return Image.getInstance(FILE_DIR_ROOT + path);
		}catch(Exception e) {
			return null;
		}
	}
}
