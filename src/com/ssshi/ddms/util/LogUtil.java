package com.ssshi.ddms.util;

import com.ssshi.ddms.dto.AuditLogBean;

public class LogUtil {
	
	public static final String APPRLINE = "APPRLINE";
	public static final String AUTHGROUP = "AUTHGROUP";
	public static final String CRONINFO = "CRONTASK";
	public static final String DOMAIN = "DOMAIN";
	public static final String DOMAININFO = "DOMAININFO";
	public static final String FILEINFO = "FILEINFO";
	public static final String SHIPINFO = "SHIPINFO";
	public static final String USERINFO = "USERINFO";
	public static final String SCHEDULERINFO = "SCHEDULERINFO";
	
	public static final String SCHEDULECODE = "SCHEDULECODE";

	public static final String STANDARDREQINFO = "STANDARDREQINFO";

	public static final String VESSELREQINFO = "VSSLREQINFO";

	public static final String VESSELREQINFODETAIL = "VSSLREQINFODET";
	
	public static final String BACKUP_DB = "BACKUPDB";
	public static final String BACKUP_FILE = "BACKUPFILE";
	
	public static final String KIND_C = "C";
	public static final String KIND_U = "U";
	public static final String KIND_D = "D";
	public static final String KIND_S = "S";
	public static final String KIND_E = "E";

	public static AuditLogBean createAudit(int targetUid, String targetTb, int insertBy, String desc, String targetDesc) {
		AuditLogBean bean = new AuditLogBean();
		bean.setTargetUid(targetUid);
		bean.setTargetTb(targetTb);
		bean.setTargetDesc(targetDesc);
		bean.setKind(KIND_C);
		bean.setDescription(desc);
		bean.setInsertBy(insertBy);
		
		return bean;
	}
	
	public static AuditLogBean updateAudit(int targetUid, String targetTb, int insertBy, String desc, String targetDesc) {
		AuditLogBean bean = new AuditLogBean();
		bean.setTargetUid(targetUid);
		bean.setTargetTb(targetTb);
		bean.setTargetDesc(targetDesc);
		bean.setKind(KIND_U);
		bean.setDescription(desc);
		bean.setInsertBy(insertBy);
		
		return bean;
	}
	
	public static AuditLogBean deleteAudit(int targetUid, String targetTb, int insertBy, String desc, String targetDesc) {
		AuditLogBean bean = new AuditLogBean();
		bean.setTargetUid(targetUid);
		bean.setTargetTb(targetTb);
		bean.setTargetDesc(targetDesc);
		bean.setKind(KIND_D);
		bean.setDescription(desc);
		bean.setInsertBy(insertBy);
		
		return bean;
	}
	
	public static AuditLogBean systemAudit(int targetUid, String targetTb, int insertBy, String desc, String targetDesc) {
		AuditLogBean bean = new AuditLogBean();
		bean.setTargetUid(targetUid);
		bean.setTargetTb(targetTb);
		bean.setTargetDesc(targetDesc);
		bean.setKind(KIND_S);
		bean.setDescription(desc);
		bean.setInsertBy(insertBy);
		
		return bean;
	}
	
	public static AuditLogBean errorAudit(int targetUid, String targetTb, int insertBy, String desc, String targetDesc) {
		AuditLogBean bean = new AuditLogBean();
		bean.setTargetUid(targetUid);
		bean.setTargetTb(targetTb);
		bean.setTargetDesc(targetDesc);
		bean.setKind(KIND_E);
		bean.setDescription(desc);
		bean.setInsertBy(insertBy);
		
		return bean;
	}
}
