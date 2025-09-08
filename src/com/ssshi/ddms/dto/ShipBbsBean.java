package com.ssshi.ddms.dto;

import java.util.List;

import org.springframework.web.multipart.MultipartFile;

public class ShipBbsBean {

	private int uid;
	private String pjt;
	private String kind;
	private String remark;
	private String insertDate;
	private int insertBy;
	
	private String name;
	private List<ShipBbsFileInfoBean> fileList;
	private List<MultipartFile> files;
	
	public int getUid() {
		return uid;
	}
	public void setUid(int uid) {
		this.uid = uid;
	}
	public String getPjt() {
		return pjt;
	}
	public void setPjt(String pjt) {
		this.pjt = pjt;
	}
	public String getKind() {
		return kind;
	}
	public void setKind(String kind) {
		this.kind = kind;
	}
	public String getRemark() {
		return remark;
	}
	public void setRemark(String remark) {
		this.remark = remark;
	}
	public String getInsertDate() {
		return insertDate;
	}
	public void setInsertDate(String insertDate) {
		this.insertDate = insertDate;
	}
	public int getInsertBy() {
		return insertBy;
	}
	public void setInsertBy(int insertBy) {
		this.insertBy = insertBy;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public List<ShipBbsFileInfoBean> getFileList() {
		return fileList;
	}
	public void setFileList(List<ShipBbsFileInfoBean> fileList) {
		this.fileList = fileList;
	}
	public List<MultipartFile> getFiles() {
		return files;
	}
	public void setFiles(List<MultipartFile> files) {
		this.files = files;
	}
}
