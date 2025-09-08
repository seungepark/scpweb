<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ include file="/WEB-INF/jsp/share/conf.jsp" %>
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <!-- Meta, title, CSS, favicons, etc. -->
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <title>Smart Commissioning Platform</title>

    <!-- Bootstrap -->
    <link href="${pageContext.request.contextPath}/vendors/bootstrap/css/bootstrap.min.css" rel="stylesheet">
    <!-- Font Awesome -->
	<link href="${pageContext.request.contextPath}/vendors/fontawesome/css/all.min.css" rel="stylesheet">
	<link href="${pageContext.request.contextPath}/vendors/fontawesome/css/v4-shims.min.css" rel="stylesheet">
    <!-- Custom Theme Style -->
    <link href="${pageContext.request.contextPath}/css/custom.min.css" rel="stylesheet">
    <link href="${pageContext.request.contextPath}/css/common.css" rel="stylesheet">
  </head>

  <body>
  	<div class="h-100">
  		<div  class="d-flex align-items-center login-header">
  			<img src="${pageContext.request.contextPath}/img/new/logo_main.png">
  		</div>
  		<div  class="d-flex justify-content-end align-items-center login-body">
  			<div class="login-form">
  				<img src="${pageContext.request.contextPath}/img/new/logo_login.png">
  				<div class="sp-16"></div>
  				<div class="login-form-title">Smart Commissioning Platform</div>
  				<div class="sp-40"></div>
  				<div class="login-form-label" data-i18n="id"></div>
  				<div class="login-form-input-wrap">
  					<img class="left" src="${pageContext.request.contextPath}/img/new/mail.png">
  					<input type="text" id="uuid" oninput="resetMsg()" data-i18n="[placeholder]idHint"/>
  				</div>
  				<div class="sp-16"></div>
  				<div class="login-form-label" data-i18n="pw"></div>
  				<div class="login-form-input-wrap">
  					<img class="left" src="${pageContext.request.contextPath}/img/new/lock.png">
  					<input type="password" id="pw" oninput="resetMsg()" data-i18n="[placeholder]pwHint"/>
  					<img id="btnPw" class="right" onclick="togglePw()" src="${pageContext.request.contextPath}/img/new/view_off.png">
  				</div>
  				<div id="loginMsg" class="login-msg d-none"></div>
  				<div class="sp-48"></div>     
  				<select id="selLang" class=" w-100">
					<option value="ko" data-i18n="langKo"></option>
					<option value="en" data-i18n="langEn"></option>
				</select>    
				<div class="sp-48"></div>
				<button id="btnLogin" class="bt-obj bt-primary bt-lg w-100" onClick="login()" data-i18n="btnLogin"></button>                    
  			</div>
  		</div>
  	</div>
    <script src="${pageContext.request.contextPath}/vendors/jquery/jquery.min.js"></script>
    <!-- Font Awesome -->
    <script src="${pageContext.request.contextPath}/vendors/fontawesome/js/all.min.js"></script>
    <script src="${pageContext.request.contextPath}/vendors/fontawesome/js/v4-shims.min.js"></script>
    <script src="${pageContext.request.contextPath}/vendors/i18n/i18next-1.11.2.min.js"></script>
  	<script src="${pageContext.request.contextPath}/vendors/i18n/lang.js"></script>
    <script src="${pageContext.request.contextPath}/js/common.js"></script>
    <script src="${pageContext.request.contextPath}/js/general/login.js"></script>
  </body>
</html>
