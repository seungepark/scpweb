package com.ssshi.ddms.dto;

/**
 * SMS 전송 요청 DTO
 */
public class SmsRequestBean {
   
    private String receiver;         // 수신 번호 (예: 010-000-0000)
    private String message;        // 전송할 메시지 내용
    private String qrType;    //AC : 앵카링 , SCH : 시운전
    private String content;
    
	public String getReceiver() {
		return receiver;
	}
	public void setReceiver(String receiver) {
		this.receiver = receiver;
	}
	public String getMessage() {
		return message;
	}
	public void setMessage(String message) {
		this.message = message;
	}
	public String getQrType() {
		return qrType;
	}
	public void setQrType(String qrType) {
		this.qrType = qrType;
	}
	public String getContent() {
		return content;
	}
	public void setContent(String content) {
		this.content = content;
	}
    
    
     
}

