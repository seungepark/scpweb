<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
{
	"list": [
		<c:forEach var="tmp" items="${list}" varStatus="status">
			{
				"uid": ${tmp.uid},
				"cat": "${tmp.cat}",
				"domain": "${tmp.domain}",
				"desc": "${tmp.description}",
				"dataType": "${tmp.dataType}",
				"infoList": [
					<c:forEach var="tmp2" items="${tmp.infoList}" varStatus="status2">
						{
							"uid": ${tmp2.uid},
							"val": "${tmp2.val}",
							"inVal": "${tmp2.inVal}",
							"desc": "${tmp2.description}"
						}
						<c:if test="${!status2.last}">,</c:if>
					</c:forEach>
				]
			}
			<c:if test="${!status.last}">,</c:if>
		</c:forEach>
	]
}