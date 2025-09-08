<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<div class="header-container">
   	<div class="header-title-area">
   		<span class="header-bread" data-i18n="share:sidebar.main5.sub2"></span>
   		<c:if test="${not empty bean and bean['class'].simpleName == 'SchedulerInfoBean'}">
			<span class="header-title">
				<c:choose>
					<c:when test="${not empty bean.trialKey}">${bean.trialKey}</c:when>
					<c:otherwise>
						<c:if test="${not empty bean.hullnum}">${bean.hullnum}</c:if>
					</c:otherwise>
				</c:choose>
				<c:if test="${not empty bean.shiptype}"> / ${bean.shiptype}</c:if>
				<c:if test="${not empty bean.description}"> / ${bean.description}</c:if>
			</span>
		</c:if>
   	</div>
	<div class="header-avatar-area">
     	<img src="${pageContext.request.contextPath}/getProImgStream.html" class="header-avatar">
   	</div>
   	<div class="header-pos">${sessionScope.userInfo.posCode}</div>
   	<div class="header-divide"></div>
   	<div class="dropdown">
		<div class="dd-btn-wrap cursor-pointer" data-toggle="dropdown" aria-expanded="false">
            <span class="header-name">${sessionScope.userInfo.firstName} ${sessionScope.userInfo.lastName}</span>
            <img src="${pageContext.request.contextPath}/img/new/dropdown_arrow.png">
        </div>
        <ul class="dropdown-menu">
            <li>
            	<a class="dropdown-item" href="javascript:userSetPop();">
            		<img src="${pageContext.request.contextPath}/img/new/setting.png" class="dd-item-icon"><span data-i18n="share:header.setting"></span>
            	</a>
            </li>
            <li>
            	<a class="dropdown-item" href="${pageContext.request.contextPath}/logout.html">
            		<img src="${pageContext.request.contextPath}/img/new/logout.png" class="dd-item-icon"><span data-i18n="share:header.logout"></span>
            	</a>
            </li>
        </ul>
	</div>
</div>