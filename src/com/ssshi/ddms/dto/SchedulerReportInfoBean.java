package com.ssshi.ddms.dto;

import java.util.List;

public class SchedulerReportInfoBean {
    private int uid;
    private int rowIdx;
    private int schedulerVersionInfoUid;
    private String execRevNum;
    private String reportKey;
    private String reportValue;
    private String reportKeyType;
    private String planRevNum;
    private String flag;

    private List<SchedulerReportInfoBean> reportInfoBeanList;

    public int getUid() {
        return uid;
    }

    public void setUid(int uid) {
        this.uid = uid;
    }

    public int getRowIdx() { return rowIdx; }

    public void setRowIdx(int rowIdx) { this.rowIdx = rowIdx; }

    public int getSchedulerVersionInfoUid() {
        return schedulerVersionInfoUid;
    }

    public void setSchedulerVersionInfoUid(int schedulerVersionInfoUid) {
        this.schedulerVersionInfoUid = schedulerVersionInfoUid;
    }

    public String getExecRevNum() {
        return execRevNum;
    }

    public void setExecRevNum(String execRevNum) {
        this.execRevNum = execRevNum;
    }

    public String getReportKey() {
        return reportKey;
    }

    public void setReportKey(String reportKey) {
        this.reportKey = reportKey;
    }

    public String getReportValue() {
        return reportValue;
    }

    public void setReportValue(String reportValue) {
        this.reportValue = reportValue;
    }

    public String getReportKeyType() {
        return reportKeyType;
    }

    public void setReportKeyType(String reportKeyType) {
        this.reportKeyType = reportKeyType;
    }

    public String getPlanRevNum() {
        return planRevNum;
    }

    public void setPlanRevNum(String planRevNum) {
        this.planRevNum = planRevNum;
    }

    public String getFlag() { return flag; }

    public void setFlag(String flag) { this.flag = flag; }

    public List<SchedulerReportInfoBean> getReportInfoBeanList() {
        return reportInfoBeanList;
    }

    public void setReportInfoBeanList(List<SchedulerReportInfoBean> reportInfoBeanList) { this.reportInfoBeanList = reportInfoBeanList; }
}
