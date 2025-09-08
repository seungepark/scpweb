package com.ssshi.ddms.dto;

public class FileInfoBean {

	private int uid;
	private String fileName;
	private String saveName;
	private long fileSize;
	private String fileType;
	private String ownerTb;
	private int ownerUid;
	private int userUid;
	
	public int getUid() {
		return uid;
	}
	public void setUid(int uid) {
		this.uid = uid;
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
	public String getOwnerTb() {
		return ownerTb;
	}
	public void setOwnerTb(String ownerTb) {
		this.ownerTb = ownerTb;
	}
	public int getOwnerUid() {
		return ownerUid;
	}
	public void setOwnerUid(int ownerUid) {
		this.ownerUid = ownerUid;
	}
	public int getUserUid() {
		return userUid;
	}
	public void setUserUid(int userUid) {
		this.userUid = userUid;
	}
}
