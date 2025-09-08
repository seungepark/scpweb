<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
<head>
<script type="text/javascript">
	contextPath = "${pageContext.request.contextPath}";
</script>
</head>
<img src="${pageContext.request.contextPath}/img/loading.gif" id="loading" class="loading-img">
<div class="modal fade" id="alertPopLg" tabindex="-10" role="dialog" aria-labelledby="alertPopLg" aria-hidden="true">
	<div class="modal-dialog modal-dialog-centered modal-lg" role="document">
		<div class="modal-content">
	      	<div class="modal-body text-center pop-alert">
	        	<div class="pop-alert-msg" id="alertPopDescLg"></div>
	        	<button class="bt-obj bt-primary" data-dismiss="modal" data-i18n="share:btnOk"></button>
			</div>
		</div>
	</div>
</div>
<div class="modal fade" id="alertPop" tabindex="-10" role="dialog" aria-labelledby="alertPop" aria-hidden="true">
	<div class="modal-dialog modal-dialog-centered" role="document">
		<div class="modal-content">
	      	<div class="modal-body text-center pop-alert">
	        	<div class="pop-alert-msg" id="alertPopDesc"></div>
	        	<button class="bt-obj bt-primary" data-dismiss="modal" data-i18n="share:btnOk"></button>
			</div>
		</div>
	</div>
</div>
<div class="position-fixed bottom-0 right-0 p-3" style="z-index: 200000; right: 0; bottom: 0;">
	<div id="toastPop" class="toast" role="alert" data-delay="1500" aria-live="assertive" aria-atomic="true">
	  <div class="toast-header">
	    <strong class="mr-auto"><span id="toastTitle"></span></strong>
	    <button type="button" class="ml-2 mb-1 close" data-dismiss="toast" aria-label="Close">
	      <span aria-hidden="true">&times;</span>
	    </button>
	  </div>
	</div>
</div>
<div class="modal fade" id="userSetPop" tabindex="-10" role="dialog" aria-labelledby="userSetPop" aria-hidden="true">
	<div class="modal-dialog modal-dialog-centered" role="document">
		<div class="modal-content">
			<div class="modal-header">
				<h5 class="modal-title" data-i18n="share:userSetPop.title"></h5>
				<button type="button" class="close" data-dismiss="modal" aria-label="Close">
					<span aria-hidden="true">&times;</span>
				</button>
			</div>
			<div class="modal-body pop-main-scroll-container">
				<div class="pop-inner-title" data-i18n="share:userSetPop.id"></div>
				<input type="text" id="userSetPopId" value="${sessionScope.userInfo.userId}" class="w-100" disabled>
				<div class="sp-16"></div>
				<div class="pop-inner-title" data-i18n="share:userSetPop.name"></div>
				<input type="text" id="userSetPopName" value="${sessionScope.userInfo.firstName} ${sessionScope.userInfo.lastName}" class="w-100" disabled>
				<div class="sp-16"></div>
				<div class="pop-inner-title" data-i18n="share:userSetPop.craft"></div>
				<input type="text" id="userSetPopPosCode" value="${sessionScope.userInfo.posCode}" class="w-100" disabled>
				<div class="sp-16"></div>
				<div class="pop-inner-title" data-i18n="share:userSetPop.newPw"></div>
				<input type="password" id="userSetPopNewPw" value="" class="w-100">
				<div class="sp-16"></div>
				<div class="pop-inner-title" data-i18n="share:userSetPop.newConfirmPw"></div>
				<input type="password" id="userSetPopNewConfirmPw" value="" class="w-100">
				<div class="sp-16"></div>
				<div class="pop-inner-title" data-i18n="share:userSetPop.profile"></div>
				<div class="file-btn bt-obj bt-primary">
					<img src="${pageContext.request.contextPath}/img/i_btn_addfile.svg" class="bt-icon" height="16px">
					<span data-i18n="share:userSetPop.btnFile"></span>
					<input id="profileFile" onchange="profileFileAdded(this)" type="file" name="file" accept="image/png, image/jpeg" />
				</div>
				<div class="" id="addProfileFile"></div>
			</div>
			<div class="modal-footer">
				<button class="bt-obj bt-secondary" data-i18n="share:userSetPop.btnClose" data-dismiss="modal"></button>
				<button class="bt-obj bt-primary" onClick="changeUserSet()">
					<img src="${pageContext.request.contextPath}/img/i_btn_save.svg" class="bt-icon" height="16px">
					<span data-i18n="share:userSetPop.btnChange"></span>
				</button>
			</div>
		</div>
	</div>
</div>
</html>