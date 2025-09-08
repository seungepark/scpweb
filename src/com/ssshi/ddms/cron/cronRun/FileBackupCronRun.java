package com.ssshi.ddms.cron.cronRun;

import org.springframework.context.ApplicationContext;
import org.springframework.stereotype.Component;

import com.ssshi.ddms.cron.service.CronServiceI;

@Component
public class FileBackupCronRun extends CommonCronRun implements Runnable{
	
	private ApplicationContext applicationContext = null;
	private String cronId = null;
	
//	static Logger logger = Logger.getLogger(FileBackupCronRun.class);
	
	public FileBackupCronRun(ApplicationContext applicationContext, String cronId) {
		this.applicationContext = applicationContext;
		this.cronId = cronId;
		
//		setLogger(logger);
		
//		logger.debug("@@@ FileBackupCronRun(ApplicationContext, String) Set Logger");
	}

	@Override
	public void run() {
//		logger.debug("@@@ FileBackupCronRun.run() START");
		CronServiceI service = null;
		try {
//			logger.debug("@@@ FileBackupCronRun.run() applicationContext=" + applicationContext);
//			logger.debug("@@@ FileBackupCronRun.run() cronId=" + cronId);
			
			service = (CronServiceI) applicationContext.getBean(CronServiceI.class);
//			logger.debug("@@@ FileBackupCronRun.run() service=" + service);
			
			if(service != null) {
				service.fileBackup();
			}
		} catch (Exception e) {
			e.printStackTrace();
		} finally {
			try {
				service.increaseCronRunCntAndDate(cronId);
			} catch (Exception e) {
				e.printStackTrace();
			} finally {
//				logger.debug("@@@ FileBackupCronRun.run() END");
			}
		}
	}

}
