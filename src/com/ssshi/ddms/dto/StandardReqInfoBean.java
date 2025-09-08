package com.ssshi.ddms.dto;

import java.util.List;

public class StandardReqInfoBean {

    private String flag;
    private int uid;
    private int seq;
    private String reqinfotitle;
    private String item;
    private String unit;
    private int userUid;

    private List<StandardReqInfoBean> params;

    public List<StandardReqInfoBean> getParams() {
        return params;
    }

    public String getFlag() {
        return flag;
    }

    public void setFlag(String flag) {
        this.flag = flag;
    }

    public void setParams(List<StandardReqInfoBean> params) {
        this.params = params;
    }

    public int getUid() {
        return uid;
    }

    public void setUid(int uid) {
        this.uid = uid;
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

    public int getUserUid() {
        return userUid;
    }

    public void setUserUid(int userUid) {
        this.userUid = userUid;
    }
}
