package com.ssshi.ddms.dto;

import java.util.List;

public class SchedulerCrewInfoBean {
    private String flag;
    private int uid;
    private int schedulerInfoUid;
    private String category;
    private String position;
    private String company;
    private String departure;
    private String name;
    private String workType;
    private String rank;
    private String comNum;
    private String ssNum;
    private String tel;
    private int userUid;
    private int seq;

    private List<SchedulerCrewDetailBean> schedulerCrewDetailList;


    public String getFlag() {
        return flag;
    }

    public void setFlag(String flag) {
        this.flag = flag;
    }

    public int getUid() {
        return uid;
    }

    public void setUid(int uid) {
        this.uid = uid;
    }

    public int getSchedulerInfoUid() {
        return schedulerInfoUid;
    }

    public void setSchedulerInfoUid(int schedulerInfoUid) {
        this.schedulerInfoUid = schedulerInfoUid;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getPosition() {
        return position;
    }

    public void setPosition(String position) {
        this.position = position;
    }

    public String getCompany() {
        return company;
    }

    public void setCompany(String company) {
        this.company = company;
    }

    public String getDeparture() {
        return departure;
    }

    public void setDeparture(String departure) {
        this.departure = departure;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getWorkType() {
        return workType;
    }

    public void setWorkType(String workType) {
        this.workType = workType;
    }

    public String getRank() {
        return rank;
    }

    public void setRank(String rank) {
        this.rank = rank;
    }

    public String getComNum() {
        return comNum;
    }

    public void setComNum(String comNum) {
        this.comNum = comNum;
    }

    public String getSsNum() {
        return ssNum;
    }

    public void setSsNum(String ssNum) {
        this.ssNum = ssNum;
    }

    public String getTel() {
        return tel;
    }

    public void setTel(String tel) {
        this.tel = tel;
    }

    public int getUserUid() {
        return userUid;
    }

    public void setUserUid(int userUid) {
        this.userUid = userUid;
    }

    public int getSeq() {
        return seq;
    }

    public void setSeq(int seq) {
        this.seq = seq;
    }

    public List<SchedulerCrewDetailBean> getSchedulerCrewDetailList() {
        return schedulerCrewDetailList;
    }

    public void setSchedulerCrewDetailList(List<SchedulerCrewDetailBean> schedulerCrewDetailList) {
        this.schedulerCrewDetailList = schedulerCrewDetailList;
    }
}
