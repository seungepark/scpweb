package com.ssshi.ddms.dto;

import java.util.List;

public class VesselReqInfoDetailBean {

    private String flag;
    private int uid;

    private int vsslreqinfouid;
    private int seq;
    private String reqinfotitle;
    private String item;
    private String unit;
    private String name;
    private String rpm;
    private String loadrate;
    private int userUid;

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

    public int getVsslreqinfouid() {
        return vsslreqinfouid;
    }

    public void setVsslreqinfouid(int vsslreqinfouid) {
        this.vsslreqinfouid = vsslreqinfouid;
    }

    public int getSeq() {
        return seq;
    }

    public void setSeq(int seq) {
        this.seq = seq;
    }

    public String getReqinfotitle() {
        return reqinfotitle;
    }

    public void setReqinfotitle(String reqinfotitle) {
        this.reqinfotitle = reqinfotitle;
    }

    public String getItem() {
        return item;
    }

    public void setItem(String item) {
        this.item = item;
    }

    public String getUnit() {
        return unit;
    }

    public void setUnit(String unit) {
        this.unit = unit;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getRpm() {
        return rpm;
    }

    public void setRpm(String rpm) {
        this.rpm = rpm;
    }

    public String getLoadrate() {
        return loadrate;
    }

    public void setLoadrate(String loadrate) {
        this.loadrate = loadrate;
    }

    public int getUserUid() {
        return userUid;
    }

    public void setUserUid(int userUid) {
        this.userUid = userUid;
    }
}
