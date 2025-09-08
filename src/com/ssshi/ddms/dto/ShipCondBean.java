package com.ssshi.ddms.dto;

import java.util.List;

public class ShipCondBean {
    private int uid;
    private int schedinfouid;
    private String cond;
    private String sdate;
    private String stime;
    private String edate;
    private String etime;

    private List<ShipCondBean> shipconds;

    public List<ShipCondBean> getShipconds() {
        return shipconds;
    }

    public void setShipconds(List<ShipCondBean> shipconds) {
        this.shipconds = shipconds;
    }

    public int getUid() {
        return uid;
    }

    public void setUid(int uid) {
        this.uid = uid;
    }

    public int getSchedinfouid() {
        return schedinfouid;
    }

    public void setSchedinfouid(int schedinfouid) {
        this.schedinfouid = schedinfouid;
    }

    public String getCond() {
        return cond;
    }

    public void setCond(String cond) {
        this.cond = cond;
    }

    public String getSdate() {
        return sdate;
    }

    public void setSdate(String sdate) {
        this.sdate = sdate;
    }

    public String getStime() {
        return stime;
    }

    public void setStime(String stime) {
        this.stime = stime;
    }

    public String getEdate() {
        return edate;
    }

    public void setEdate(String edate) {
        this.edate = edate;
    }

    public String getEtime() {
        return etime;
    }

    public void setEtime(String etime) {
        this.etime = etime;
    }
}
