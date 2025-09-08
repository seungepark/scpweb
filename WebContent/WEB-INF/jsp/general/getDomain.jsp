<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
{
	"uid": ${bean.uid},
	"cat": "${bean.cat}",
	"domain": "${bean.domain}",
	"desc": "${bean.description}",
	"dataType": "${bean.dataType}",
	"infoList": [
		<c:forEach var="tmp" items="${bean.infoList}" varStatus="status">
			{
				"uid": ${tmp.uid},
				"val": "${tmp.val}",
				"inVal": "${tmp.inVal}",
				"desc": "${tmp.description}"
			}
			<c:if test="${!status.last}">,</c:if>
		</c:forEach>
	]
}