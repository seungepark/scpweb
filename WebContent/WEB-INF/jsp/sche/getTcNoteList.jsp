<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
{
	"list": [
		<c:forEach var="tmp" items="${list}" varStatus="status">
			{
				"uid": ${tmp.uid},
				"schedulerDetailUid": ${tmp.schedulerDetailUid},
				"codeKind": "${tmp.codeKind}",
				"code": "${tmp.code}",
				"startDate": "${tmp.startDate}",
				"endDate": "${tmp.endDate}",
				"remark": "${tmp.remark}",
				"isReport": "${tmp.isReport}",
				"tcList": [
					<c:forEach var="tmp2" items="${tmp.tcList}" varStatus="status2">
						{
							"schedulerDetailUid": ${tmp2.schedulerDetailUid}
						}
						<c:if test="${!status2.last}">,</c:if>
					</c:forEach>
				],
				"fileList": [
					<c:forEach var="tmp2" items="${tmp.fileList}" varStatus="status2">
						{
							"uid": ${tmp2.uid},
							"fileName": "${tmp2.fileName}",
							"fileSize": "${tmp2.fileSize}",
							"fileType": "${tmp2.fileType}"
						}
						<c:if test="${!status2.last}">,</c:if>
					</c:forEach>
				]
			}
			<c:if test="${!status.last}">,</c:if>
		</c:forEach>
	]
}