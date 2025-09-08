package com.ssshi.ddms.cron.cronRun;

import java.text.SimpleDateFormat;
import java.util.Calendar;

import org.apache.log4j.ConsoleAppender;
import org.apache.log4j.Level;
import org.apache.log4j.Logger;
import org.apache.log4j.PatternLayout;

/**
 * CronRun 공통 함수 사용
 * @author 514474
 *
 */
public class CommonCronRun {
	public void setLogger(Logger logger) {
		String conversionPattern = "[%d{yy/MM/dd HH:mm:ss.SSS}] %-5p %c{2}(%13F:%L) [%t] - ";
		
		PatternLayout layout = new PatternLayout(conversionPattern);
		ConsoleAppender consoleApd = new ConsoleAppender(layout);
		
		logger.removeAllAppenders();
		logger.addAppender(consoleApd);
		logger.setLevel(Level.DEBUG);
	}
	
	/**
	 * Calendar 유형을 날짜 형식 YYYY-MM-DD 혹은 yyyyMMddHHmm 의 문자로 변환 출력 
	 * @param cal
	 * @return
	 */
	public String convertCalToStr(Calendar cal, boolean isParam) {
		String rtnDate="";
		
		String patten = "yyyy-MM-dd";
		
		if(!isParam) {
			patten = "yyyyMMdd";
		}
		
		SimpleDateFormat format = new SimpleDateFormat(patten);
		rtnDate = format.format(cal.getTime());
		
		return rtnDate;
	}
}
