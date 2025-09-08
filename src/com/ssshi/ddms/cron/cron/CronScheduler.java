package com.ssshi.ddms.cron.cron;

import java.lang.reflect.Constructor;
import java.lang.reflect.InvocationTargetException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;

import javax.annotation.PostConstruct;
import javax.annotation.PreDestroy;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContext;
import org.springframework.scheduling.Trigger;
import org.springframework.scheduling.concurrent.ThreadPoolTaskScheduler;
import org.springframework.scheduling.support.CronTrigger;
import org.springframework.stereotype.Component;

import com.ssshi.ddms.constant.DBConst;
import com.ssshi.ddms.dto.CronInfoBean;
import com.ssshi.ddms.mybatis.dao.CronDaoI;
import com.ssshi.ddms.util.CommonUtil;
import com.ssshi.ddms.util.ValidUtil;

@Component
public class CronScheduler {
	
	@Autowired
	private CronDaoI dao;
	
	@Autowired 
	private ApplicationContext applicationContext;
	
	private static final Map<String, ThreadPoolTaskScheduler> schedulerMap = new HashMap<String, ThreadPoolTaskScheduler>();
	
	public CronScheduler() {}
	
	public void startScheduler(String cronId, String classNm, String frequency) {
		if(ValidUtil.isEmpty(cronId) || ValidUtil.isEmpty(classNm)) {
			return;
		}
		
		Runnable runnable = getRunnable(cronId, classNm);
		
		if(runnable != null) {
			// 기존에 등록되어 있는 건이면 중지 
			if(schedulerMap.get((cronId + "/" + classNm)) != null) {
				stopScheduler(cronId, classNm);
			}
			
			// Cron 스케줄 설정 
			ThreadPoolTaskScheduler scheduler = new ThreadPoolTaskScheduler();
			scheduler.initialize();
			scheduler.schedule(runnable, getTrigger(frequency));
			
			schedulerMap.put((cronId + "/" + classNm), scheduler);
		}
	}

	public void stopScheduler(String cronId, String classNm) {
		ThreadPoolTaskScheduler scheduler = schedulerMap.get((cronId + "/" + classNm));
		
		if(scheduler != null) {
			scheduler.shutdown();
			schedulerMap.remove(cronId + "/" + classNm);
		}
	}

	private Runnable getRunnable(String cronId, String classNm) {
		// Runnable로 작성된 Class 찾아서 반환 
		Class<?> runnableClass = null;
		Runnable rtnRunnable = null;
		
		try {
			runnableClass = Class.forName(classNm);
			Constructor<?> constructor = runnableClass.getConstructor(ApplicationContext.class, String.class);
			rtnRunnable = (Runnable) constructor.newInstance(applicationContext, cronId);
		} catch (ClassNotFoundException e) {
			e.printStackTrace();
		} catch (InstantiationException e) {
			e.printStackTrace();
		} catch (IllegalAccessException e) {
			e.printStackTrace();
		} catch (NoSuchMethodException e) {
			e.printStackTrace();
		} catch (SecurityException e) {
			e.printStackTrace();
		} catch (IllegalArgumentException e) {
			e.printStackTrace();
		} catch (InvocationTargetException e) {
			e.printStackTrace();
		}
		return rtnRunnable;
	}

	private Trigger getTrigger(String frequency) {
		// 주기 설정 
		return new CronTrigger(frequency);
	}

	@PostConstruct
	public void init() {
		try {
			CronInfoBean parambean = new CronInfoBean();
			parambean.setStart(0);
			parambean.setLimit(CommonUtil.LIST_LIMIT_FOR_ALL);
			
			List<CronInfoBean> cronList = dao.getCronList(parambean);
			for(CronInfoBean bean : cronList) {
				if(!ValidUtil.isEmpty(bean.getCronclass()) && DBConst.STATUS_ACTIVE.equals(bean.getStatus())) {
					startScheduler(bean.getCronid(), bean.getCronclass(), bean.getFrequency());
				}
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
	}

	@PreDestroy
	public void destroy() {
		if(schedulerMap !=null) {
			Set<String> keySet = schedulerMap.keySet();
			for(String classNm : keySet) {
				String[] keyValues = classNm.split("/");
				stopScheduler(keyValues[0], keyValues[1]);
			}
		}
	}

}


