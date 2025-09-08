<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!-- 상태 변경 modal-->
<div class="modal fade" id="changeStatusPop" tabindex="-1" role="dialog" aria-labelledby="change_modal" aria-hidden="true">
	<div class="modal-dialog modal-dialog-centered" role="document">
   		<div class="modal-content">
   			<div class="modal-body text-center pop-alert">
	        	<div class="pop-alert-title" data-i18n="share:changeStatusPop.title"></div>
	        	<div class="pop-alert-msg" data-i18n="[html]share:changeStatusPop.msg"></div>
       			<button class="bt-obj bt-secondary" data-dismiss="modal" data-i18n="share:changeStatusPop.btnClose"></button>
	        	<button class="bt-obj bt-primary" onClick="changeStatus()" data-i18n="share:changeStatusPop.btnChange"></button>
			</div>
   		</div>
   	</div>
</div>