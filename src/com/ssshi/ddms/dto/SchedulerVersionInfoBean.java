package com.ssshi.ddms.dto;

public class SchedulerVersionInfoBean {
	
    private int uid;
    private String planRevNum;
    private String execRevNum;
    private String compRevNum;
    private int userUid;
    
    private int insertBy;
    private String insertDate;
	private int updateBy;
	private String updateDate;
	
	private int orgUid;
	private String revKind;
	private String revDay;

    public int getUid() {
        return uid;
    }
    public void setUid(int uid) {
        this.uid = uid;
    }
    public String getPlanRevNum() {
        return planRevNum;
    }
    public void setPlanRevNum(String planRevNum) {
        this.planRevNum = planRevNum;
    }
    public String getExecRevNum() {
        return execRevNum;
    }
    public void setExecRevNum(String execRevNum) {
        this.execRevNum = execRevNum;
    }
    public String getCompRevNum() {
        return compRevNum;
    }
    public void setCompRevNum(String compRevNum) {
        this.compRevNum = compRevNum;
    }
    public int getUserUid() {
        return userUid;
    }
    public void setUserUid(int userUid) {
        this.userUid = userUid;
    }
	public int getInsertBy() {
		return insertBy;
	}
	public void setInsertBy(int insertBy) {
		this.insertBy = insertBy;
	}
	public String getInsertDate() {
		return insertDate;
	}
	public void setInsertDate(String insertDate) {
		this.insertDate = insertDate;
	}
	public int getUpdateBy() {
		return updateBy;
	}
	public void setUpdateBy(int updateBy) {
		this.updateBy = updateBy;
	}
	public String getUpdateDate() {
		return updateDate;
	}
	public void setUpdateDate(String updateDate) {
		this.updateDate = updateDate;
	}
	public int getOrgUid() {
		return orgUid;
	}
	public void setOrgUid(int orgUid) {
		this.orgUid = orgUid;
	}
	public String getRevKind() {
		return revKind;
	}
	public void setRevKind(String revKind) {
		this.revKind = revKind;
	}
	public String getRevDay() {
		return revDay;
	}
	public void setRevDay(String revDay) {
		this.revDay = revDay;
	}
}
