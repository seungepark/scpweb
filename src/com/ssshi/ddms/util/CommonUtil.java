package com.ssshi.ddms.util;

import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.Calendar;
import java.util.Date;
import java.util.Locale;

public class CommonUtil {

	public static final int LIST_LIMIT = 10;
	public static final int LIST_LIMIT_FOR_ALL = 300;
	
	public static int getListStart(int page) {
		return LIST_LIMIT * (page - 1);
	}
	
	public static String getDateStr(boolean isYesterday) {
		Calendar cal = Calendar.getInstance();
		
		if(isYesterday) {
			cal.add(Calendar.DATE, -1);
		}
		
		int month = cal.get(Calendar.MONTH) + 1;
		int day = cal.get(Calendar.DAY_OF_MONTH);
		
		return cal.get(Calendar.YEAR) + "-" + (month < 10 ? "0" : "") + month + "-" + (day < 10 ? "0" : "") + day;
	}
	
	public static String getNowStr() {
		return Calendar.getInstance().getTime().toString();
	}
	
	/**
	 * 입력된 두 날짜 사이의 차이값 검사
	 * @param date1
	 * @param date2
	 * @return
	 */
	public static int calculateDateDifference(String date1, String date2) {
		DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
		LocalDate localDate1 = LocalDate.parse(date1, formatter);
		LocalDate localDate2 = LocalDate.parse(date2, formatter);

		return localDate1.until(localDate2).getDays();
	}

	/**
	 * 입력된 버전의 숫자값 추출
	 * @param input
	 * @return
	 */
	public static int extractNumbers(String input) {
		String numberPart = input.replaceAll("\\D+", "");

		if (!numberPart.isEmpty()) {
			return Integer.parseInt(numberPart);
		} else {
			return 0;
		}
	}
	
	/**
	 * 엑셀에서 String으로 변환한 Date 값 포맷 yyyy-MM-dd 로 변환
	 * @param date
	 * @return
	 */
	public static String excelDateStringFormatDate(String dateStr) {
		String formatDate = null;
		Date date = null;
		
		SimpleDateFormat engSdf = new SimpleDateFormat("EEE MMM dd HH:mm:ss z yyyy", Locale.ENGLISH);
		SimpleDateFormat ndsdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		SimpleDateFormat ssdf = new SimpleDateFormat("yy-MM-dd");
		SimpleDateFormat nsdf = new SimpleDateFormat("yyyy-MM-dd");
		
		boolean isError = false;
		
		// EEE MMM dd HH:mm:ss z yyyy 형식 인지 체크
		try {
			date = engSdf.parse(dateStr);
			formatDate = nsdf.format(date);
		} catch(Exception e) {
			isError = true;
		}
		
		// yyyy-MM-dd HH:mm:ss 형식 인지 체크
		if(isError) {
			isError = false;
			try {
				date = ndsdf.parse(dateStr);
				formatDate = nsdf.format(date);
			} catch(Exception e) {
				isError = true;
			}
		}
		
		//yy-MM-dd 형식 인지 체크
		if(isError) {
			isError = false;
			try {
				date = ssdf.parse(dateStr);
				formatDate = nsdf.format(date);
			} catch(Exception e) {
				isError = true;
			}
		}
		
		// 모두 오류가 발생 하거나 해당 하는 건이 없으면 원래 값 그대로 반환
		if(isError || formatDate == null) {
			formatDate = dateStr;
		}
		
		return formatDate;
	}
}
