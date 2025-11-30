package com.ssshi.ddms.dto;

/**
 * SMS 발송 결과 DTO
 */
public class SmsSendResult {
    
    private String statusDsc;          // STATUSDSC: 발송 상태 설명 (발송완료, 발송실패, 대기 등)
    private Integer status;             // STATUS: 발송 상태 코드 (2: 발송완료 등)
    private String telinfo;            // TELINFO: 통신사 정보 (예: SKT)
    private String umid;                // UMID: 고유 메시지 ID
    private String cmid;                // CMID: 클라이언트 메시지 ID
    private String callStatus;          // CALLSTATUS: 통화 상태 코드 (예: 6600)
    private String callStatusDsc;       // CALLSTATUSDSC: 통화 상태 설명 (예: 전달)
    
    public SmsSendResult() {}
    
    public SmsSendResult(String statusDsc, Integer status, String telinfo, 
                         String umid, String cmid, String callStatus, String callStatusDsc) {
        this.statusDsc = statusDsc;
        this.status = status;
        this.telinfo = telinfo;
        this.umid = umid;
        this.cmid = cmid;
        this.callStatus = callStatus;
        this.callStatusDsc = callStatusDsc;
    }
    
    public String getStatusDsc() {
        return statusDsc;
    }
    
    public void setStatusDsc(String statusDsc) {
        this.statusDsc = statusDsc;
    }
    
    public Integer getStatus() {
        return status;
    }
    
    public void setStatus(Integer status) {
        this.status = status;
    }
    
    public String getTelinfo() {
        return telinfo;
    }
    
    public void setTelinfo(String telinfo) {
        this.telinfo = telinfo;
    }
    
    public String getUmid() {
        return umid;
    }
    
    public void setUmid(String umid) {
        this.umid = umid;
    }
    
    public String getCmid() {
        return cmid;
    }
    
    public void setCmid(String cmid) {
        this.cmid = cmid;
    }
    
    public String getCallStatus() {
        return callStatus;
    }
    
    public void setCallStatus(String callStatus) {
        this.callStatus = callStatus;
    }
    
    public String getCallStatusDsc() {
        return callStatusDsc;
    }
    
    public void setCallStatusDsc(String callStatusDsc) {
        this.callStatusDsc = callStatusDsc;
    }
    
    /**
     * 발송 완료 여부 확인
     * @return STATUSDSC가 "발송완료"이고 STATUS가 2인 경우 true
     */
    public boolean isCompleted() {
        return statusDsc != null && statusDsc.equals("발송완료") 
            && status != null && status == 2;
    }
    
    @Override
    public String toString() {
        return "SmsSendResult{" +
                "statusDsc='" + statusDsc + '\'' +
                ", status=" + status +
                ", telinfo='" + telinfo + '\'' +
                ", umid='" + umid + '\'' +
                ", cmid='" + cmid + '\'' +
                ", callStatus='" + callStatus + '\'' +
                ", callStatusDsc='" + callStatusDsc + '\'' +
                ", isCompleted=" + isCompleted() +
                '}';
    }
}

