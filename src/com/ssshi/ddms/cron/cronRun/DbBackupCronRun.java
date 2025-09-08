package com.ssshi.ddms.cron.cronRun;

import org.springframework.context.ApplicationContext;
import org.springframework.stereotype.Component;

import com.ssshi.ddms.cron.service.CronServiceI;

@Component
public class DbBackupCronRun extends CommonCronRun implements Runnable{
	
	private ApplicationContext applicationContext = null;
	private String cronId = null;
	
//	static Logger logger = Logger.getLogger(DbBackupCronRun.class);
	
	public DbBackupCronRun(ApplicationContext applicationContext, String cronId) {
		this.applicationContext = applicationContext;
		this.cronId = cronId;
		
//		setLogger(logger);
		
//		logger.debug("@@@ DbBackupCronRun(ApplicationContext, String) Set Logger");
	}

	@Override
	public void run() {
//		logger.debug("@@@ DbBackupCronRun.run() START");
		CronServiceI service = null;
		try {
//			logger.debug("@@@ DbBackupCronRun.run() applicationContext=" + applicationContext);
//			logger.debug("@@@ DbBackupCronRun.run() cronId=" + cronId);
			
			service = (CronServiceI) applicationContext.getBean(CronServiceI.class);
//			logger.debug("@@@ DbBackupCronRun.run() service=" + service);
			
			if(service != null) {
				service.dbBackup();
			}
		} catch (Exception e) {
			e.printStackTrace();
		} finally {
			try {
				service.increaseCronRunCntAndDate(cronId);
			} catch (Exception e) {
				e.printStackTrace();
			} finally {
//				logger.debug("@@@ DbBackupCronRun.run() END");
			}
		}
	}

}
