package com.ssshi.ddms.util;

import java.io.File;
import java.util.Date;
import java.util.Properties;

import javax.mail.Authenticator;
import javax.mail.Message;
import javax.mail.PasswordAuthentication;
import javax.mail.Session;
import javax.mail.Transport;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeBodyPart;
import javax.mail.internet.MimeMessage;
import javax.mail.internet.MimeMultipart;

import com.ssshi.ddms.dto.ScheMailLogBean;

/********************************************************************************
 * 프로그램 개요 : SMTP Util
 * 
 * 최초 작성자 : KHJ
 * 최초 작성일 : 2024-04-01
 * 
 * 최종 수정자 : KHJ
 * 최종 수정일 : 2024-05-19
 * 
 * 메모 : 없음
 * 
 * Copyright 2024 by SiriusB. Confidential and proprietary information
 * This document contains information, which is the property of SiriusB, 
 * and is furnished for the sole purpose of the operation and the maintenance.  
 * Copyright © 2024 SiriusB.  All rights reserved.
 *
 ********************************************************************************/

public class SmtpUtil {

	private static final String USER = "shi.elogbook@gmail.com";
	private static final String PW = "itzl vbym dlka zjpi";
	private static final String FROM_MAIL = "scp@samsung.com";
	
	public static boolean sendEmail(ScheMailLogBean bean) throws Exception {
		boolean result = false;
		Properties prop = new Properties();
		prop.put("mail.transport.protocol", "smtp");
		prop.put("mail.smtp.host", "smtp.gmail.com");
		prop.put("mail.smtp.port", "465");
		prop.put("mail.smtp.auth", true);
		prop.put("mail.smtp.ssl.enable", true);
		prop.put("mail.smtp.ssl.trust", "smtp.gmail.com");
		prop.put("mail.smtp.starttls.required", true);
		prop.put("mail.smtp.starttls.enable", true);
		prop.put("mail.smtp.ssl.protocols", "TLSv1.2");
		prop.put("mail.smtp.quit-wait", "false");
		prop.put("mail.smtp.socketFactory.port", "465");
		prop.put("mail.smtp.socketFactory.class", "javax.net.ssl.SSLSocketFactory");
		prop.put("mail.smtp.socketFactory.fallback", "false");
		
		Session session = Session.getDefaultInstance(prop, new Authenticator() {
			@Override
			protected PasswordAuthentication getPasswordAuthentication() {
				return new PasswordAuthentication(USER, PW);
			}
		});
		
		File tempFile = null;
		
		try {
			MimeMessage msg = new MimeMessage(session);
			MimeMultipart multipart = new MimeMultipart();
			MimeBodyPart bodyPart = new MimeBodyPart();
			
			msg.setFrom(new InternetAddress(FROM_MAIL));
			msg.setSubject(bean.getTitle());
			
			bodyPart.setContent(bean.getDesc(), "text/html; charset=utf-8");
			multipart.addBodyPart(bodyPart);
		
			if(bean.getFile() != null) {
				tempFile = new File(bean.getFileName());
				bean.getFile().transferTo(tempFile.getAbsoluteFile());
				
				MimeBodyPart fileBodyPart = new MimeBodyPart();
				fileBodyPart.attachFile(tempFile.getAbsoluteFile());
				multipart.addBodyPart(fileBodyPart);

			}
			
			msg.setContent(multipart);
			msg.setSentDate(new Date());
			
			if(bean.getToList() != null) {
				for(int i = 0; i < bean.getToList().length; i++) {
					msg.addRecipient(Message.RecipientType.TO, new InternetAddress(bean.getToList()[i]));
				}
			}
			
			if(bean.getCcList() != null) {
				for(int i = 0; i < bean.getCcList().length; i++) {
					msg.addRecipient(Message.RecipientType.CC, new InternetAddress(bean.getCcList()[i]));
				}
			}
			
			if(bean.getBccList() != null) {
				for(int i = 0; i < bean.getBccList().length; i++) {
					msg.addRecipient(Message.RecipientType.BCC, new InternetAddress(bean.getBccList()[i]));
				}
			}
			
			Transport.send(msg);
			result = true;
		}catch(Exception e) {
			result = false;
			e.printStackTrace();
		}finally {
			if(tempFile != null) {
				try {tempFile.delete();}catch(Exception ex) {ex.printStackTrace();}
			}
		}
		
		return result;
	}
}
