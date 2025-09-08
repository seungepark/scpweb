<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
{
	"list": [
		<c:forEach var="tmp" items="${list}" varStatus="status">
			{
				"table": "${tmp.targetTb}",
				"info": "${tmp.targetDesc}",
				"kind": "${tmp.kind}",
				"desc": "${tmp.description}",
				"by": "${tmp.insertBy}",
				"date": "${tmp.insertDate}",
				"code": "${tmp.codeName}",
				"first": "${tmp.firstName}",
				"last": "${tmp.lastName}"
			}
			<c:if test="${!status.last}">,</c:if>
		</c:forEach>
	],
	"listCnt": ${listCnt}
}