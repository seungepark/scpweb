<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
{
	"list": [
		<c:forEach var="tmp" items="${list}" varStatus="status">
			{
				"uid": ${tmp.uid},
				"kind": "${tmp.kind}",
				"remark": "${tmp.remark}",
				"insertDate": "${tmp.insertDate}",
				"name": "${tmp.name}",
				"fileList": [
					<c:forEach var="tmp2" items="${tmp.fileList}" varStatus="status2">
						{
							"uid": ${tmp2.uid},
							"fileName": "${tmp2.fileName}"
						}
						<c:if test="${!status2.last}">,</c:if>
					</c:forEach>
				]
			}
			<c:if test="${!status.last}">,</c:if>
		</c:forEach>
	]
}