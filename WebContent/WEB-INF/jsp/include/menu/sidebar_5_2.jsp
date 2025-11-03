<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<c:forEach var="at" items="${auth}">
	<c:if test="${at eq 'P_PLAN_SCHE_R'}">
		<c:set var="M_P_PLAN_SCHE_R" value="true"/>
	</c:if>
	<c:if test="${at eq 'P_PLAN_SCHE_W'}">
		<c:set var="M_P_PLAN_SCHE_W" value="true"/>
	</c:if>
	<c:if test="${at eq 'P_RESULT_SCHE_R'}">
		<c:set var="M_P_RESULT_SCHE_R" value="true"/>
	</c:if>
	<c:if test="${at eq 'P_RESULT_SCHE_W'}">
		<c:set var="M_P_RESULT_SCHE_W" value="true" />
	</c:if>
	<c:if test="${at eq 'P_RESULT_SCHE_CREW'}">
		<c:set var="M_P_RESULT_SCHE_CREW" value="true" />
	</c:if>
	<c:if test="${at eq 'P_RESULT_SCHE_INFO'}">
		<c:set var="M_P_RESULT_SCHE_INFO" value="true" />
	</c:if>
	<c:if test="${at eq 'P_SHIP_INFO_R'}">
		<c:set var="M_P_SHIP_INFO_R" value="true" />
	</c:if>
	<c:if test="${at eq 'P_SHIP_INFO_W'}">
		<c:set var="M_P_SHIP_INFO_W" value="true" />
	</c:if>
	<c:if test="${at eq 'P_GREEN_SCHE_R'}">
		<c:set var="M_P_GREEN_SCHE_R" value="true" />
	</c:if>
	<c:if test="${at eq 'P_GREEN_SCHE_W'}">
		<c:set var="M_P_GREEN_SCHE_W" value="true" />
	</c:if>
	<c:if test="${at eq 'P_DB_VESSEL_R'}">
		<c:set var="M_P_DB_VESSEL_R" value="true" />
	</c:if>
	<c:if test="${at eq 'P_DB_VESSEL_W'}">
		<c:set var="M_P_DB_VESSEL_W" value="true" />
	</c:if>
	<c:if test="${at eq 'P_DB_INFO_R'}">
		<c:set var="M_P_DB_INFO_R" value="false" />
	</c:if>
	<c:if test="${at eq 'P_DB_INFO_W'}">
		<c:set var="M_P_DB_INFO_W" value="false" />
	</c:if>
	<c:if test="${at eq 'P_DB_CODE_R'}">
		<c:set var="M_P_DB_CODE_R" value="true" />
	</c:if>
	<c:if test="${at eq 'P_DB_CODE_W'}">
		<c:set var="M_P_DB_CODE_W" value="true" />
	</c:if>
	<c:if test="${at eq 'P_DB_PJT_R'}">
		<c:set var="M_P_DB_PJT_R" value="true" />
	</c:if>
	<c:if test="${at eq 'P_DB_PJT_W'}">
		<c:set var="M_P_DB_PJT_W" value="true" />
	</c:if>
	<c:if test="${at eq 'P_DB_DOMAIN_R'}">
		<c:set var="M_P_DB_DOMAIN_R" value="true" />
	</c:if>
	<c:if test="${at eq 'P_DB_DOMAIN_W'}">
		<c:set var="M_P_DB_DOMAIN_W" value="true" />
	</c:if>
	<c:if test="${at eq 'P_DB_MAIL_R'}">
		<c:set var="M_P_DB_MAIL_R" value="true" />
	</c:if>
	<c:if test="${at eq 'P_DB_MAIL_W'}">
		<c:set var="M_P_DB_MAIL_W" value="true" />
	</c:if>
	<c:if test="${at eq 'P_SYS_GROUP_R'}">
		<c:set var="M_P_SYS_GROUP_R" value="true" />
	</c:if>
	<c:if test="${at eq 'P_SYS_GROUP_W'}">
		<c:set var="M_P_SYS_GROUP_W" value="true" />
	</c:if>
	<c:if test="${at eq 'P_SYS_USER_R'}">
		<c:set var="M_P_SYS_USER_R" value="true" />
	</c:if>
	<c:if test="${at eq 'P_SYS_USER_W'}">
		<c:set var="M_P_SYS_USER_W" value="true" />
	</c:if>
	<c:if test="${at eq 'P_SYS_LOG_R'}">
		<c:set var="M_P_SYS_LOG_R" value="true" />
	</c:if>
	<c:if test="${at eq 'P_SYS_CRON_R'}">
		<c:set var="M_P_SYS_CRON_R" value="true" />
	</c:if>
	<c:if test="${at eq 'P_SYS_CRON_W'}">
		<c:set var="M_P_SYS_CRON_W" value="true" />
	</c:if>
	
	<c:if test="${at eq 'P_REG_CREW_R'}">
		<c:set var="M_P_REG_CREW_R" value="true" />
	</c:if>
	<c:if test="${at eq 'P_REG_CREW_W'}">
		<c:set var="M_P_REG_CREW_W" value="true" />
	</c:if>
	<c:if test="${at eq 'P_ANCH_MEAL_R'}">
		<c:set var="M_P_ANCH_MEAL_R" value="true" />
	</c:if>
	<c:if test="${at eq 'P_ANCH_MEAL_W'}">
		<c:set var="M_P_ANCH_MEAL_W" value="true" />
	</c:if>
	<c:if test="${at eq 'P_RESULT_MEAL_R'}">
		<c:set var="M_P_RESULT_MEAL_R" value="true" />
	</c:if>
	<c:if test="${at eq 'P_RESULT_MEAL_W'}">
		<c:set var="M_P_RESULT_MEAL_W" value="true" />
	</c:if>
	
</c:forEach>
<div class="sidebar-wrap">
	<div class="sidebar">
   		<div class="logo-area">
       		<div class="logo-container">
       			<a href="${pageContext.request.contextPath}/index.html"><img src="${pageContext.request.contextPath}/img/new/logo.png"></a>
       		</div>
   		</div>
   		<c:if test="${M_P_PLAN_SCHE_R or M_P_PLAN_SCHE_W or M_P_RESULT_SCHE_R or M_P_RESULT_SCHE_W or M_P_SHIP_INFO_R or M_P_SHIP_INFO_W}">
	   		<div class="main-item" data-toggle="collapse" data-target="#main-1-collapse" aria-expanded="false">
	       		<div class="main-item-icon-area">
	           		<svg class="main-item-icon" width="32" height="33" viewBox="0 0 32 33" fill="none" xmlns="http://www.w3.org/2000/svg">
	               		<path fill-rule="evenodd" clip-rule="evenodd" d="M21.8712 20.1006L24.2779 17.6392C24.8588 17.0451 24.6196 16.0301 23.8366 15.7727L22.4 15.3005V10.375C22.4 9.75368 21.9076 9.25 21.3 9.25H19.1V7.84375C19.1 7.37775 18.7307 7 18.275 7H13.325C12.8694 7 12.5 7.37775 12.5 7.84375V9.25H10.3C9.69253 9.25 9.20004 9.75368 9.20004 10.375V15.3005L7.76344 15.7727C6.98131 16.0298 6.74065 17.0444 7.3222 17.6392L9.72887 20.1006L10.5495 22.9119C11.0452 24.1363 12.2258 25 13.6 25H18C19.3743 25 20.5549 24.1363 21.0505 22.9119L21.8712 20.1006ZM20.2 11.5H11.4V14.5773L15.4634 13.2415C15.6823 13.1695 15.9178 13.1695 16.1366 13.2415L20.2 14.5773V11.5Z"/>
	           		</svg>
	       		</div>
	       		<div class="main-item-title" data-i18n="share:sidebar.main1.title"></div>
	   		</div>
	   		<div id="main-1-collapse" class="collapse hide">
	   			<c:if test="${M_P_PLAN_SCHE_R or M_P_PLAN_SCHE_W}">
		       		<a onclick="delSearchCookie()" href="${pageContext.request.contextPath}/mng/sche/scheduler.html">
		       			<div class="sub-item-wrap sub-item" data-i18n="share:sidebar.main1.sub1"></div>
		       		</a>
		       	</c:if>
		       	<c:if test="${M_P_RESULT_SCHE_R or M_P_RESULT_SCHE_W}">
		       		<a onclick="delSearchCookie()" href="${pageContext.request.contextPath}/mng/sche/departure.html">
			       		<div class="sub-item-wrap sub-item" data-i18n="share:sidebar.main1.sub2"></div>
		       		</a>
		       		<a onclick="delSearchCookie()" href="#">
		       			<div class="sub-item-wrap sub-item" data-i18n="share:sidebar.main1.sub3"></div>
		       		</a>
		       	</c:if>
		       	<c:if test="${M_P_SHIP_INFO_R or M_P_SHIP_INFO_W}">
		       		<a onclick="delSearchCookie()" href="${pageContext.request.contextPath}/mng/vssl/reqInfo.html">
	       				<div class="sub-item-wrap sub-item" data-i18n="share:sidebar.main1.sub4"></div>
	       			</a>
	       		</c:if>
	   		</div>
	   	</c:if>
	   	<c:if test="${M_P_GREEN_SCHE_R or M_P_GREEN_SCHE_W}">
	   		<div class="main-item" data-toggle="collapse" data-target="#main-6-collapse" aria-expanded="false">
	        	<div class="main-item-icon-area">
	            	<svg class="main-item-icon" width="32" height="33" viewBox="0 0 32 33" fill="none" xmlns="http://www.w3.org/2000/svg">
	               		<path d="M20.1815 17.7425C21.8914 17.7425 23.2807 19.1318 23.2807 20.8417C23.2807 22.5516 21.8914 23.9409 20.1815 23.9409C18.4716 23.9409 17.0823 22.5516 17.0823 20.8417C17.0823 19.1318 18.4716 17.7425 20.1815 17.7425ZM20.1815 16.2852C17.6652 16.2852 15.625 18.3254 15.625 20.8417C15.625 23.3579 17.6652 25.3982 20.1815 25.3982C22.6978 25.3982 24.738 23.3579 24.738 20.8417C24.738 18.3254 22.6978 16.2852 20.1815 16.2852Z" fill="#0671E0"/>
						<path d="M23.8173 12.8175V14.8383C23.8173 15.2755 23.3606 15.5378 22.972 15.3435C21.9228 14.8091 20.6889 14.5662 19.3968 14.7314C16.3947 15.1006 14.0728 17.7334 14.0339 20.7646C14.0339 21.3767 14.1116 21.9693 14.2671 22.5328C14.4128 23.038 14.0728 23.5432 13.5481 23.5432C12.0714 23.5432 10.3809 23.5432 8.67104 23.5432C7.74808 23.5432 7 22.7854 7 21.8625V12.8175C7 11.8848 7.74808 11.1367 8.68076 11.1367H22.1559C23.0886 11.1367 23.8367 11.8848 23.8367 12.8175H23.8173Z" fill="#0671E0"/>
						<path d="M11.9453 10V10.34V12.4094" stroke="#0671E0" stroke-width="2.42884" stroke-linecap="round" stroke-linejoin="round"/>
						<path d="M19.2998 10V12.4094" stroke="#0671E0" stroke-width="2.42884" stroke-linecap="round" stroke-linejoin="round"/>
						<path d="M21.5535 21.659L20.1836 20.6874V19.1621" stroke="#0671E0" stroke-width="1.263" stroke-linecap="round" stroke-linejoin="round"/>
	           		</svg>
	        	</div>
				<div class="main-item-title" data-i18n="share:sidebar.main6.title"></div>
	   		</div>
	   		<div id="main-6-collapse" class="collapse hide">
	   			<a onclick="delSearchCookie()" href="${pageContext.request.contextPath}/sched/eventList.html">
       				<div class="sub-item-wrap sub-item" data-i18n="share:sidebar.main6.sub1"></div>
       			</a>
	   			<a onclick="delSearchCookie()" href="${pageContext.request.contextPath}/sched/workStd/workStd.html">
       				<div class="sub-item-wrap sub-item" data-i18n="share:sidebar.main6.sub2"></div>
       			</a>
	   			<a onclick="delSearchCookie()" href="${pageContext.request.contextPath}/sched/scenario/scenarioList.html">
       				<div class="sub-item-wrap sub-item" data-i18n="share:sidebar.main6.sub3"></div>
       			</a>
	   		</div>
	   	</c:if>
   		<c:if test="${M_P_REG_CREW_R or M_P_REG_CREW_W or M_P_ANCH_MEAL_R or M_P_ANCH_MEAL_W or M_P_RESULT_MEAL_R or M_P_RESULT_MEAL_W}">
	   		<div class="main-item" data-toggle="collapse" data-target="#main-2-collapse" aria-expanded="false">
	       		<div class="main-item-icon-area">
	           		<svg class="main-item-icon" width="32" height="33" viewBox="0 0 32 33" fill="none" xmlns="http://www.w3.org/2000/svg">
	               		<path d="M16.0003 16.5C16.9949 16.5 17.9487 16.1049 18.6519 15.4017C19.3552 14.6984 19.7503 13.7446 19.7503 12.75C19.7503 11.7554 19.3552 10.8016 18.6519 10.0983C17.9487 9.39509 16.9949 9 16.0003 9C15.0057 9 14.0519 9.39509 13.3486 10.0983C12.6454 10.8016 12.2503 11.7554 12.2503 12.75C12.2503 13.7446 12.6454 14.6984 13.3486 15.4017C14.0519 16.1049 15.0057 16.5 16.0003 16.5ZM21.919 24C22.6915 24 23.2853 23.2987 23.009 22.5763C22.4671 21.1563 21.5068 19.9345 20.2551 19.0725C19.0034 18.2104 17.5195 17.7489 15.9997 17.7489C14.4799 17.7489 12.9959 18.2104 11.7442 19.0725C10.4925 19.9345 9.53219 21.1563 8.99029 22.5763C8.71529 23.2987 9.30779 24 10.0803 24H21.919Z" fill="#CFCFDC"/>
	           		</svg>
	       		</div>
	       		<div class="main-item-title" data-i18n="share:sidebar.main2.title"></div>
	   		</div>
	   		<div id="main-2-collapse" class="collapse hide">
				<a onclick="delSearchCookie()" href="${pageContext.request.contextPath}/crew/registrationCrew.html">
					<div class="sub-item-wrap sub-item" data-i18n="share:sidebar.main2.sub1"></div>
				</a>
				<a onclick="delSearchCookie()" href="${pageContext.request.contextPath}/crew/anchorageMealRequest.html">
					<div class="sub-item-wrap sub-item" data-i18n="share:sidebar.main2.sub2"></div>
				</a>
				<a onclick="delSearchCookie()" href="${pageContext.request.contextPath}/crew/resultMeal.html">
					<div class="sub-item-wrap sub-item" data-i18n="share:sidebar.main2.sub3"></div>
				</a>
			</div>
	   	</c:if>
   		<c:if test="${M_P_DB_VESSEL_R or M_P_DB_VESSEL_W or M_P_DB_INFO_R or M_P_DB_INFO_W or M_P_DB_CODE_R or M_P_DB_CODE_W or M_P_DB_PJT_R or M_P_DB_PJT_W or M_P_DB_DOMAIN_R or M_P_DB_DOMAIN_W or M_P_DB_MAIL_R or M_P_DB_MAIL_W}">
	   		<div class="main-item" data-toggle="collapse" data-target="#main-3-collapse" aria-expanded="false">
	        	<div class="main-item-icon-area">
	            	<svg class="main-item-icon" width="32" height="33" viewBox="0 0 32 33" fill="none" xmlns="http://www.w3.org/2000/svg">
	                	<path d="M8.44531 10.6627C8.44531 10.1667 8.89469 9.76465 9.44903 9.76465H21.9955C22.5498 9.76465 22.9992 10.1667 22.9992 10.6627V12.4588C22.9992 12.9548 22.5498 13.3569 21.9955 13.3569H9.44903C8.89469 13.3569 8.44531 12.9548 8.44531 12.4588V10.6627Z" fill="#CFCFDC"/>
	                	<path d="M8.44531 15.6022C8.44531 15.1062 8.89469 14.7041 9.44903 14.7041H21.9955C22.5498 14.7041 22.9992 15.1062 22.9992 15.6022V17.3983C22.9992 17.8943 22.5498 18.2964 21.9955 18.2964H9.44903C8.89469 18.2964 8.44531 17.8943 8.44531 17.3983V15.6022Z" fill="#CFCFDC"/>
	                	<path d="M8.44531 20.5416C8.44531 20.0457 8.89469 19.6436 9.44903 19.6436H21.9955C22.5498 19.6436 22.9992 20.0457 22.9992 20.5416V22.3378C22.9992 22.8338 22.5498 23.2358 21.9955 23.2358H9.44903C8.89469 23.2358 8.44531 22.8338 8.44531 22.3378V20.5416Z" fill="#CFCFDC"/>
	            	</svg>
	        	</div>
				<div class="main-item-title" data-i18n="share:sidebar.main3.title"></div>
	   		</div>
	   		<div id="main-3-collapse" class="collapse hide">
	   			<c:if test="${M_P_DB_VESSEL_R or M_P_DB_VESSEL_W}">
	   				<a onclick="delSearchCookie()" href="${pageContext.request.contextPath}/db/vessel/vessel.html">
	       				<div class="sub-item-wrap sub-item" data-i18n="share:sidebar.main3.sub1"></div>
	       			</a>
	       		</c:if>
				<c:if test="${M_P_DB_INFO_R or M_P_DB_INFO_W}">
					<a onclick="delSearchCookie()" href="${pageContext.request.contextPath}/mng/stnd/reqInfo.html">
		       			<div class="sub-item-wrap sub-item" data-i18n="share:sidebar.main3.sub2"></div>
		       		</a>
		       	</c:if>
		       	<c:if test="${M_P_DB_CODE_R or M_P_DB_CODE_W}">
		       		<a onclick="delSearchCookie()" href="${pageContext.request.contextPath}/mng/scheBasic/scheHierarchy.html">
		       			<div class="sub-item-wrap sub-item" data-i18n="share:sidebar.main3.sub3"></div>
		       		</a>
		       	</c:if>
		       	<c:if test="${M_P_DB_PJT_R or M_P_DB_PJT_W}">
		       		<a onclick="delSearchCookie()" href="${pageContext.request.contextPath}/mng/scheBasic/scheduleCode.html">
		       			<div class="sub-item-wrap sub-item" data-i18n="share:sidebar.main3.sub4"></div>
		       		</a>
		       	</c:if>
		       	<c:if test="${M_P_DB_DOMAIN_R or M_P_DB_DOMAIN_W}">
		       		<a href="${pageContext.request.contextPath}/db/domain/domain.html">
		       			<div class="sub-item-wrap sub-item" data-i18n="share:sidebar.main3.sub5"></div>
		       		</a>
		       	</c:if>
		       	<c:if test="${M_P_DB_MAIL_R or M_P_DB_MAIL_W}">
			       	<a href="${pageContext.request.contextPath}/sche/mailing.html">
		       			<div class="sub-item-wrap sub-item" data-i18n="share:sidebar.main3.sub6"></div>
		       		</a>
		       	</c:if>
	   		</div>
	   	</c:if>
	   	<c:if test="${M_P_PLAN_SCHE_R or M_P_PLAN_SCHE_W or M_P_RESULT_SCHE_R or M_P_RESULT_SCHE_W}">
	   		<div class="main-item" data-toggle="collapse" data-target="#main-4-collapse" aria-expanded="false">
	       		<div class="main-item-icon-area">
	           		<svg class="main-item-icon" width="32" height="33" viewBox="0 0 32 33" fill="none" xmlns="http://www.w3.org/2000/svg">
	               		<path d="M12.6667 21.3333L15.2083 18.7917L16.875 20.4583L19.8333 17.5208V18.8333H21.5V14.6667H17.3333V16.3333H18.6458L16.875 18.1042L15.2083 16.4375L11.5 20.1667L12.6667 21.3333ZM10.6667 25.5C10.2083 25.5 9.81611 25.3369 9.49 25.0108C9.16389 24.6847 9.00056 24.2922 9 23.8333V12.1667C9 11.7083 9.16333 11.3161 9.49 10.99C9.81667 10.6639 10.2089 10.5006 10.6667 10.5H22.3333C22.7917 10.5 23.1842 10.6633 23.5108 10.99C23.8375 11.3167 24.0006 11.7089 24 12.1667V23.8333C24 24.2917 23.8369 24.6842 23.5108 25.0108C23.1847 25.3375 22.7922 25.5006 22.3333 25.5H10.6667Z" fill="#CFCFDC"/>
	           		</svg>
	       		</div>
	       		<div class="main-item-title" data-i18n="share:sidebar.main4.title"></div>
	   		</div>
	   		<div id="main-4-collapse" class="collapse hide">
	 			<a onclick="delSearchCookie()" href="#">
	       			<div class="sub-item-wrap sub-item" data-i18n="share:sidebar.main4.sub1"></div>
	       		</a>
	       		<a onclick="delSearchCookie()" href="#">
	       			<div class="sub-item-wrap sub-item" data-i18n="share:sidebar.main4.sub2"></div>
	       		</a>
	       		<a onclick="delSearchCookie()" href="#">
	       			<div class="sub-item-wrap sub-item" data-i18n="share:sidebar.main4.sub3"></div>
	       		</a>
	   		</div>
	   	</c:if>
	   	<c:if test="${M_P_SYS_GROUP_R or M_P_SYS_GROUP_W or M_P_SYS_USER_R or M_P_SYS_USER_W or M_P_SYS_LOG_R or M_P_SYS_CRON_R or M_P_SYS_CRON_W}">
	   		<div class="main-item active" data-toggle="collapse" data-target="#main-5-collapse" aria-expanded="true">
	       		<div class="main-item-icon-area">
	           		<svg class="main-item-icon active" width="32" height="33" viewBox="0 0 32 33" fill="none" xmlns="http://www.w3.org/2000/svg">
	               		<path d="M20.9993 23.333C21.4577 23.333 21.8502 23.17 22.1768 22.8438C22.5035 22.5177 22.6666 22.1252 22.666 21.6663C22.666 21.208 22.503 20.8158 22.1768 20.4897C21.8507 20.1636 21.4582 20.0002 20.9993 19.9997C20.541 19.9997 20.1488 20.163 19.8227 20.4897C19.4966 20.8163 19.3332 21.2086 19.3327 21.6663C19.3327 22.1247 19.496 22.5172 19.8227 22.8438C20.1493 23.1705 20.5416 23.3336 20.9993 23.333ZM20.8327 25.833C20.6382 25.833 20.4682 25.7705 20.3227 25.6455C20.1771 25.5205 20.0832 25.3608 20.041 25.1663L19.916 24.583C19.7493 24.5136 19.5932 24.4408 19.4477 24.3647C19.3021 24.2886 19.1527 24.1947 18.9993 24.083L18.3952 24.2705C18.2146 24.3261 18.0377 24.3191 17.8643 24.2497C17.691 24.1802 17.5555 24.0691 17.4577 23.9163L17.291 23.6247C17.1938 23.458 17.1591 23.2775 17.1868 23.083C17.2146 22.8886 17.3049 22.7288 17.4577 22.6038L17.916 22.208C17.8882 22.0413 17.8743 21.8608 17.8743 21.6663C17.8743 21.4719 17.8882 21.2913 17.916 21.1247L17.4577 20.7288C17.3049 20.6038 17.2146 20.4477 17.1868 20.2605C17.1591 20.0733 17.1938 19.8961 17.291 19.7288L17.4785 19.4163C17.5757 19.2636 17.7077 19.1525 17.8743 19.083C18.041 19.0136 18.2146 19.0066 18.3952 19.0622L18.9993 19.2497C19.1521 19.1386 19.3016 19.045 19.4477 18.9688C19.5938 18.8927 19.7499 18.8197 19.916 18.7497L20.041 18.1455C20.0827 17.9511 20.1763 17.795 20.3218 17.6772C20.4674 17.5594 20.6377 17.5002 20.8327 17.4997H21.166C21.3605 17.4997 21.5307 17.5622 21.6768 17.6872C21.823 17.8122 21.9166 17.9719 21.9577 18.1663L22.0827 18.7497C22.2493 18.8191 22.4055 18.8919 22.551 18.968C22.6966 19.0441 22.846 19.138 22.9993 19.2497L23.6035 19.0622C23.7841 19.0066 23.9613 19.0136 24.1352 19.083C24.3091 19.1525 24.4443 19.2636 24.541 19.4163L24.7077 19.708C24.8049 19.8747 24.8396 20.0552 24.8118 20.2497C24.7841 20.4441 24.6938 20.6038 24.541 20.7288L24.0827 21.1247C24.1105 21.2913 24.1243 21.4719 24.1243 21.6663C24.1243 21.8608 24.1105 22.0413 24.0827 22.208L24.541 22.6038C24.6938 22.7288 24.7841 22.8852 24.8118 23.073C24.8396 23.2608 24.8049 23.4377 24.7077 23.6038L24.5202 23.9163C24.423 24.0691 24.291 24.1802 24.1243 24.2497C23.9577 24.3191 23.7841 24.3261 23.6035 24.2705L22.9993 24.083C22.8466 24.1941 22.6974 24.2877 22.5518 24.3638C22.4063 24.44 22.2499 24.513 22.0827 24.583L21.9577 25.1872C21.916 25.3816 21.8224 25.538 21.6768 25.6563C21.5313 25.7747 21.361 25.8336 21.166 25.833H20.8327ZM9.33268 24.1663C8.87435 24.1663 8.48213 24.0033 8.15602 23.6772C7.8299 23.3511 7.66657 22.9586 7.66602 22.4997V12.4997C7.66602 12.0413 7.82935 11.6491 8.15602 11.323C8.48268 10.9969 8.8749 10.8336 9.33268 10.833H13.6452C13.8674 10.833 14.0793 10.8747 14.281 10.958C14.4827 11.0413 14.6596 11.1594 14.8118 11.3122L15.9993 12.4997H22.666C23.1243 12.4997 23.5168 12.663 23.8435 12.9897C24.1702 13.3163 24.3332 13.7086 24.3327 14.1663V15.7497C24.3327 15.9997 24.2252 16.1872 24.0102 16.3122C23.7952 16.4372 23.5693 16.4441 23.3327 16.333C22.9716 16.1663 22.5896 16.0413 22.1868 15.958C21.7841 15.8747 21.3813 15.833 20.9785 15.833C19.3396 15.833 17.9613 16.4061 16.8435 17.5522C15.7257 18.6983 15.1666 20.0627 15.166 21.6455C15.166 21.9094 15.1835 22.17 15.2185 22.4272C15.2535 22.6844 15.3055 22.9377 15.3743 23.1872C15.4438 23.4372 15.4091 23.663 15.2702 23.8647C15.1313 24.0663 14.9438 24.1669 14.7077 24.1663H9.33268Z" fill="#CFCFDC"/>
	           		</svg>
	       		</div>
	       		<div class="main-item-title active" data-i18n="share:sidebar.main5.title"></div>
	   		</div>
	   		<div id="main-5-collapse" class="collapse show">
	   			<c:if test="${M_P_SYS_GROUP_R or M_P_SYS_GROUP_W}">
	   				<a onclick="delSearchCookie()" href="${pageContext.request.contextPath}/system/group.html">
		       			<div class="sub-item-wrap sub-item" data-i18n="share:sidebar.main5.sub1"></div>
		       		</a>
		       	</c:if>
		       	<c:if test="${M_P_SYS_USER_R or M_P_SYS_USER_W}">
		       		<a onclick="delSearchCookie()" href="${pageContext.request.contextPath}/system/user.html">
		       			<div class="sub-item-wrap sub-item-active">
			           		<span class="sub-item-active-bar"></span>
			           		<span class="sub-item-active-title" data-i18n="share:sidebar.main5.sub2"></span>
			       		</div>
		       		</a>
		       	</c:if>
		       	<c:if test="${M_P_SYS_LINE}">
		       		<a href="${pageContext.request.contextPath}/system/line/line.html">
		       			<div class="sub-item-wrap sub-item" data-i18n="share:sidebar.main5.sub3"></div>
		       		</a>
		       	</c:if>
		       	<c:if test="${M_P_SYS_CODE}">
		       		<a href="${pageContext.request.contextPath}/system/code/codeInfo.html">
		       			<div class="sub-item-wrap sub-item" data-i18n="share:sidebar.main5.sub4"></div>
		       		</a>
		       	</c:if>
		       	<c:if test="${M_P_SYS_LOG_R}">
		       		<a href="${pageContext.request.contextPath}/system/log/audit.html">
		       			<div class="sub-item-wrap sub-item" data-i18n="share:sidebar.main5.sub5"></div>
		       		</a>
		       	</c:if>
		       	<c:if test="${M_P_SYS_CRON_R or M_P_SYS_CRON_W}">
		       		<a onclick="delSearchCookie()" href="${pageContext.request.contextPath}/db/cron/cron.html">
		       			<div class="sub-item-wrap sub-item" data-i18n="share:sidebar.main5.sub6"></div>
		       		</a>
		       	</c:if>
	   		</div>
	   	</c:if>
   	</div>
</div>
<div class="collapsed-sidebar-wrap">
   	<div class="collapsed-sidebar">
       	<div class="collapsed-logo-area">
           	<a href="${pageContext.request.contextPath}/index.html"><img src="${pageContext.request.contextPath}/img/new/logo_s.png"></a>
   		</div>
   		<c:if test="${M_P_PLAN_SCHE_R or M_P_PLAN_SCHE_W or M_P_RESULT_SCHE_R or M_P_RESULT_SCHE_W or M_P_SHIP_INFO_R or M_P_SHIP_INFO_W}">
	   		<div class="collapsed-main-item-icon-area">
	       		<svg class="collapsed-main-item-icon" width="32" height="33" viewBox="0 0 32 33" fill="none" xmlns="http://www.w3.org/2000/svg">
	           		<path fill-rule="evenodd" clip-rule="evenodd" d="M21.8712 20.1006L24.2779 17.6392C24.8588 17.0451 24.6196 16.0301 23.8366 15.7727L22.4 15.3005V10.375C22.4 9.75368 21.9076 9.25 21.3 9.25H19.1V7.84375C19.1 7.37775 18.7307 7 18.275 7H13.325C12.8694 7 12.5 7.37775 12.5 7.84375V9.25H10.3C9.69253 9.25 9.20004 9.75368 9.20004 10.375V15.3005L7.76344 15.7727C6.98131 16.0298 6.74065 17.0444 7.3222 17.6392L9.72887 20.1006L10.5495 22.9119C11.0452 24.1363 12.2258 25 13.6 25H18C19.3743 25 20.5549 24.1363 21.0505 22.9119L21.8712 20.1006ZM20.2 11.5H11.4V14.5773L15.4634 13.2415C15.6823 13.1695 15.9178 13.1695 16.1366 13.2415L20.2 14.5773V11.5Z"/>
	       		</svg>
	   		</div>
	   	</c:if>
   		<c:if test="${M_P_GREEN_SCHE_R or M_P_GREEN_SCHE_W}">
	   		<div class="collapsed-main-item-icon-area">
	       		<svg class="collapsed-main-item-icon" width="32" height="33" viewBox="0 0 32 33" fill="none" xmlns="http://www.w3.org/2000/svg">
	       			<path d="M20.1815 17.7425C21.8914 17.7425 23.2807 19.1318 23.2807 20.8417C23.2807 22.5516 21.8914 23.9409 20.1815 23.9409C18.4716 23.9409 17.0823 22.5516 17.0823 20.8417C17.0823 19.1318 18.4716 17.7425 20.1815 17.7425ZM20.1815 16.2852C17.6652 16.2852 15.625 18.3254 15.625 20.8417C15.625 23.3579 17.6652 25.3982 20.1815 25.3982C22.6978 25.3982 24.738 23.3579 24.738 20.8417C24.738 18.3254 22.6978 16.2852 20.1815 16.2852Z" fill="#0671E0"/>
					<path d="M23.8173 12.8175V14.8383C23.8173 15.2755 23.3606 15.5378 22.972 15.3435C21.9228 14.8091 20.6889 14.5662 19.3968 14.7314C16.3947 15.1006 14.0728 17.7334 14.0339 20.7646C14.0339 21.3767 14.1116 21.9693 14.2671 22.5328C14.4128 23.038 14.0728 23.5432 13.5481 23.5432C12.0714 23.5432 10.3809 23.5432 8.67104 23.5432C7.74808 23.5432 7 22.7854 7 21.8625V12.8175C7 11.8848 7.74808 11.1367 8.68076 11.1367H22.1559C23.0886 11.1367 23.8367 11.8848 23.8367 12.8175H23.8173Z" fill="#0671E0"/>
					<path d="M11.9453 10V10.34V12.4094" stroke="#0671E0" stroke-width="2.42884" stroke-linecap="round" stroke-linejoin="round"/>
					<path d="M19.2998 10V12.4094" stroke="#0671E0" stroke-width="2.42884" stroke-linecap="round" stroke-linejoin="round"/>
					<path d="M21.5535 21.659L20.1836 20.6874V19.1621" stroke="#0671E0" stroke-width="1.263" stroke-linecap="round" stroke-linejoin="round"/>
	       		</svg>
	   		</div>
	   	</c:if>
	   	<c:if test="${M_P_PLAN_SCHE_R or M_P_PLAN_SCHE_W or M_P_RESULT_SCHE_R or M_P_RESULT_SCHE_W}">
	   		<div class="collapsed-main-item-icon-area">
	       		<svg class="collapsed-main-item-icon" width="32" height="33" viewBox="0 0 32 33" fill="none" xmlns="http://www.w3.org/2000/svg">
	           		<path d="M16.0003 16.5C16.9949 16.5 17.9487 16.1049 18.6519 15.4017C19.3552 14.6984 19.7503 13.7446 19.7503 12.75C19.7503 11.7554 19.3552 10.8016 18.6519 10.0983C17.9487 9.39509 16.9949 9 16.0003 9C15.0057 9 14.0519 9.39509 13.3486 10.0983C12.6454 10.8016 12.2503 11.7554 12.2503 12.75C12.2503 13.7446 12.6454 14.6984 13.3486 15.4017C14.0519 16.1049 15.0057 16.5 16.0003 16.5ZM21.919 24C22.6915 24 23.2853 23.2987 23.009 22.5763C22.4671 21.1563 21.5068 19.9345 20.2551 19.0725C19.0034 18.2104 17.5195 17.7489 15.9997 17.7489C14.4799 17.7489 12.9959 18.2104 11.7442 19.0725C10.4925 19.9345 9.53219 21.1563 8.99029 22.5763C8.71529 23.2987 9.30779 24 10.0803 24H21.919Z" fill="#CFCFDC"/>
	       		</svg>
	   		</div>
	   	</c:if>
   		<c:if test="${M_P_DB_VESSEL_R or M_P_DB_VESSEL_W or M_P_DB_INFO_R or M_P_DB_INFO_W or M_P_DB_CODE_R or M_P_DB_CODE_W or M_P_DB_PJT_R or M_P_DB_PJT_W or M_P_DB_DOMAIN_R or M_P_DB_DOMAIN_W or M_P_DB_MAIL_R or M_P_DB_MAIL_W}">
	   		<div class="collapsed-main-item-icon-area">
	       		<svg class="collapsed-main-item-icon" width="32" height="33" viewBox="0 0 32 33" fill="none" xmlns="http://www.w3.org/2000/svg">
	           		<path d="M8.44531 10.6627C8.44531 10.1667 8.89469 9.76465 9.44903 9.76465H21.9955C22.5498 9.76465 22.9992 10.1667 22.9992 10.6627V12.4588C22.9992 12.9548 22.5498 13.3569 21.9955 13.3569H9.44903C8.89469 13.3569 8.44531 12.9548 8.44531 12.4588V10.6627Z" fill="#CFCFDC"/>
	           		<path d="M8.44531 15.6022C8.44531 15.1062 8.89469 14.7041 9.44903 14.7041H21.9955C22.5498 14.7041 22.9992 15.1062 22.9992 15.6022V17.3983C22.9992 17.8943 22.5498 18.2964 21.9955 18.2964H9.44903C8.89469 18.2964 8.44531 17.8943 8.44531 17.3983V15.6022Z" fill="#CFCFDC"/>
	           		<path d="M8.44531 20.5416C8.44531 20.0457 8.89469 19.6436 9.44903 19.6436H21.9955C22.5498 19.6436 22.9992 20.0457 22.9992 20.5416V22.3378C22.9992 22.8338 22.5498 23.2358 21.9955 23.2358H9.44903C8.89469 23.2358 8.44531 22.8338 8.44531 22.3378V20.5416Z" fill="#CFCFDC"/>
	       		</svg>
	   		</div>
	   	</c:if>
	   	<c:if test="${M_P_PLAN_SCHE_R or M_P_PLAN_SCHE_W or M_P_RESULT_SCHE_R or M_P_RESULT_SCHE_W}">
	   		<div class="collapsed-main-item-icon-area">
	       		<svg class="collapsed-main-item-icon" width="32" height="33" viewBox="0 0 32 33" fill="none" xmlns="http://www.w3.org/2000/svg">
	           		<path d="M12.6667 21.3333L15.2083 18.7917L16.875 20.4583L19.8333 17.5208V18.8333H21.5V14.6667H17.3333V16.3333H18.6458L16.875 18.1042L15.2083 16.4375L11.5 20.1667L12.6667 21.3333ZM10.6667 25.5C10.2083 25.5 9.81611 25.3369 9.49 25.0108C9.16389 24.6847 9.00056 24.2922 9 23.8333V12.1667C9 11.7083 9.16333 11.3161 9.49 10.99C9.81667 10.6639 10.2089 10.5006 10.6667 10.5H22.3333C22.7917 10.5 23.1842 10.6633 23.5108 10.99C23.8375 11.3167 24.0006 11.7089 24 12.1667V23.8333C24 24.2917 23.8369 24.6842 23.5108 25.0108C23.1847 25.3375 22.7922 25.5006 22.3333 25.5H10.6667Z" fill="#CFCFDC"/>
	       		</svg>
	   		</div>
	   	</c:if>
	   	<c:if test="${M_P_SYS_GROUP_R or M_P_SYS_GROUP_W or M_P_SYS_USER_R or M_P_SYS_USER_W or M_P_SYS_LOG_R or M_P_SYS_CRON_R or M_P_SYS_CRON_W}">
	   		<div class="collapsed-main-item-icon-area active">
	       		<svg class="collapsed-main-item-icon active" width="32" height="33" viewBox="0 0 32 33" fill="none" xmlns="http://www.w3.org/2000/svg">
	           		<path d="M20.9993 23.333C21.4577 23.333 21.8502 23.17 22.1768 22.8438C22.5035 22.5177 22.6666 22.1252 22.666 21.6663C22.666 21.208 22.503 20.8158 22.1768 20.4897C21.8507 20.1636 21.4582 20.0002 20.9993 19.9997C20.541 19.9997 20.1488 20.163 19.8227 20.4897C19.4966 20.8163 19.3332 21.2086 19.3327 21.6663C19.3327 22.1247 19.496 22.5172 19.8227 22.8438C20.1493 23.1705 20.5416 23.3336 20.9993 23.333ZM20.8327 25.833C20.6382 25.833 20.4682 25.7705 20.3227 25.6455C20.1771 25.5205 20.0832 25.3608 20.041 25.1663L19.916 24.583C19.7493 24.5136 19.5932 24.4408 19.4477 24.3647C19.3021 24.2886 19.1527 24.1947 18.9993 24.083L18.3952 24.2705C18.2146 24.3261 18.0377 24.3191 17.8643 24.2497C17.691 24.1802 17.5555 24.0691 17.4577 23.9163L17.291 23.6247C17.1938 23.458 17.1591 23.2775 17.1868 23.083C17.2146 22.8886 17.3049 22.7288 17.4577 22.6038L17.916 22.208C17.8882 22.0413 17.8743 21.8608 17.8743 21.6663C17.8743 21.4719 17.8882 21.2913 17.916 21.1247L17.4577 20.7288C17.3049 20.6038 17.2146 20.4477 17.1868 20.2605C17.1591 20.0733 17.1938 19.8961 17.291 19.7288L17.4785 19.4163C17.5757 19.2636 17.7077 19.1525 17.8743 19.083C18.041 19.0136 18.2146 19.0066 18.3952 19.0622L18.9993 19.2497C19.1521 19.1386 19.3016 19.045 19.4477 18.9688C19.5938 18.8927 19.7499 18.8197 19.916 18.7497L20.041 18.1455C20.0827 17.9511 20.1763 17.795 20.3218 17.6772C20.4674 17.5594 20.6377 17.5002 20.8327 17.4997H21.166C21.3605 17.4997 21.5307 17.5622 21.6768 17.6872C21.823 17.8122 21.9166 17.9719 21.9577 18.1663L22.0827 18.7497C22.2493 18.8191 22.4055 18.8919 22.551 18.968C22.6966 19.0441 22.846 19.138 22.9993 19.2497L23.6035 19.0622C23.7841 19.0066 23.9613 19.0136 24.1352 19.083C24.3091 19.1525 24.4443 19.2636 24.541 19.4163L24.7077 19.708C24.8049 19.8747 24.8396 20.0552 24.8118 20.2497C24.7841 20.4441 24.6938 20.6038 24.541 20.7288L24.0827 21.1247C24.1105 21.2913 24.1243 21.4719 24.1243 21.6663C24.1243 21.8608 24.1105 22.0413 24.0827 22.208L24.541 22.6038C24.6938 22.7288 24.7841 22.8852 24.8118 23.073C24.8396 23.2608 24.8049 23.4377 24.7077 23.6038L24.5202 23.9163C24.423 24.0691 24.291 24.1802 24.1243 24.2497C23.9577 24.3191 23.7841 24.3261 23.6035 24.2705L22.9993 24.083C22.8466 24.1941 22.6974 24.2877 22.5518 24.3638C22.4063 24.44 22.2499 24.513 22.0827 24.583L21.9577 25.1872C21.916 25.3816 21.8224 25.538 21.6768 25.6563C21.5313 25.7747 21.361 25.8336 21.166 25.833H20.8327ZM9.33268 24.1663C8.87435 24.1663 8.48213 24.0033 8.15602 23.6772C7.8299 23.3511 7.66657 22.9586 7.66602 22.4997V12.4997C7.66602 12.0413 7.82935 11.6491 8.15602 11.323C8.48268 10.9969 8.8749 10.8336 9.33268 10.833H13.6452C13.8674 10.833 14.0793 10.8747 14.281 10.958C14.4827 11.0413 14.6596 11.1594 14.8118 11.3122L15.9993 12.4997H22.666C23.1243 12.4997 23.5168 12.663 23.8435 12.9897C24.1702 13.3163 24.3332 13.7086 24.3327 14.1663V15.7497C24.3327 15.9997 24.2252 16.1872 24.0102 16.3122C23.7952 16.4372 23.5693 16.4441 23.3327 16.333C22.9716 16.1663 22.5896 16.0413 22.1868 15.958C21.7841 15.8747 21.3813 15.833 20.9785 15.833C19.3396 15.833 17.9613 16.4061 16.8435 17.5522C15.7257 18.6983 15.1666 20.0627 15.166 21.6455C15.166 21.9094 15.1835 22.17 15.2185 22.4272C15.2535 22.6844 15.3055 22.9377 15.3743 23.1872C15.4438 23.4372 15.4091 23.663 15.2702 23.8647C15.1313 24.0663 14.9438 24.1669 14.7077 24.1663H9.33268Z" fill="#CFCFDC"/>
	       		</svg>
	   		</div>
	   	</c:if>
   	</div>
</div>