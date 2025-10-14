package com.ssshi.ddms.mobile.dto;

import java.io.Serializable;

/**
 * 프로젝트 정보 DTO
 * 스케줄 정보와 호선 정보를 조인한 데이터
 *  
 * @version 1.0
 */

 
public class ProjectInfoBean implements Serializable {
    
    // 쿼리에서 조회되는 필드들
    private String projNo;              // 호선번호 (S.HULLNUM)
    private int schedulerUid;           // 스케줄UID (S.UID)
    private String trialKey;            // 시운전 키 (S.TRIALKEY)
    private String regOwner;            // 등록 소유자 (SI.REGOWNER)
    private String shipType;            // 선박타입 (SI.SHIPTYPE)
    private String projSeq;             // 프로젝트 순번 (SI.PROJSEQ)
    private String status;              // 상태 (S.STATUS)
    
    // 기본 생성자
    public ProjectInfoBean() {}
    
    // Getter/Setter 메서드들
    public String getProjNo() {
        return projNo;
    }
    
    public void setProjNo(String projNo) {
        this.projNo = projNo;
    }
    
    public int getSchedulerUid() {
        return schedulerUid;
    }
    
    public void setSchedulerUid(int schedulerUid) {
        this.schedulerUid = schedulerUid;
    }
    
    public String getTrialKey() {
        return trialKey;
    }
    
    public void setTrialKey(String trialKey) {
        this.trialKey = trialKey;
    }
    
    public String getRegOwner() {
        return regOwner;
    }
    
    public void setRegOwner(String regOwner) {
        this.regOwner = regOwner;
    }
    
    public String getShipType() {
        return shipType;
    }
    
    public void setShipType(String shipType) {
        this.shipType = shipType;
    }
    
    public String getProjSeq() {
        return projSeq;
    }
    
    public void setProjSeq(String projSeq) {
        this.projSeq = projSeq;
    }
    
    public String getStatus() {
        return status;
    }
    
    public void setStatus(String status) {
        this.status = status;
    }
} 