package com.ssshi.ddms.dto;

public class ShipBbsFileInfoBean {

	private int uid;
	private int shipBbsUid;
	private String fileName;
	private String saveName;
	private long fileSize;
	private String fileType;
	private int insertBy;
	
	public int getUid() {
		return uid;
	}
	public void setUid(int uid) {
		this.uid = uid;
	}
	public int getShipBbsUid() {
		return shipBbsUid;
	}
	public void setShipBbsUid(int shipBbsUid) {
		this.shipBbsUid = shipBbsUid;
	}
	public String getFileName() {
		return fileName;
	}
	public void setFileName(String fileName) {
		this.fileName = fileName;
	}
	public String getSaveName() {
		return saveName;
	}
	public void setSaveName(String saveName) {
		this.saveName = saveName;
	}
	public long getFileSize() {
		return fileSize;
	}
	public void setFileSize(long fileSize) {
		this.fileSize = fileSize;
	}
	public String getFileType() {
		return fileType;
	}
	public void setFileType(String fileType) {
		this.fileType = fileType;
	}
	public int getInsertBy() {
		return insertBy;
	}
	public void setInsertBy(int insertBy) {
		this.insertBy = insertBy;
	}
}
