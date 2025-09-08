package com.ssshi.ddms.dto;

public class SchedulerCrewDetailBean {
    private int uid;
    private int schedulerCrewInfoUid;
    private String barkingCode;
    private String barkingDate;
    private int userUid;

    public int getUid() {
        return uid;
    }

    public void setUid(int uid) {
        this.uid = uid;
    }

    public int getSchedulerCrewInfoUid() {
        return schedulerCrewInfoUid;
    }

    public void setSchedulerCrewInfoUid(int schedulerCrewInfoUid) {
        this.schedulerCrewInfoUid = schedulerCrewInfoUid;
    }

    public String getBarkingCode() {
        return barkingCode;
    }

    public void setBarkingCode(String barkingCode) {
        this.barkingCode = barkingCode;
    }

    public String getBarkingDate() {
        return barkingDate;
    }

    public void setBarkingDate(String barkingDate) {
        this.barkingDate = barkingDate;
    }

    public int getUserUid() {
        return userUid;
    }

    public void setUserUid(int userUid) {
        this.userUid = userUid;
    }
}
