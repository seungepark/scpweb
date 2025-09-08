
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
{
	"list": [
		<c:forEach var="tmp" items="${list}" varStatus="status">
			{
				"uid": ${tmp.uid},
				"code": "${tmp.code}",
				"displaycode": "${tmp.displaycode}",
				"description": "${tmp.description}",
				"codelevel": "${tmp.codelevel}",
				"parentuid": "${tmp.parentuid}",
				"parentcode": "${tmp.parentcode}",
				"lv1code": "${tmp.lv1code}",
				"lv2code": "${tmp.lv2code}",
				"lv3code": "${tmp.lv3code}",
				"lv4code": "${tmp.lv4code}"
			}
			<c:if test="${!status.last}">,</c:if>
		</c:forEach>
	],
	"listCnt": ${listCnt}
}