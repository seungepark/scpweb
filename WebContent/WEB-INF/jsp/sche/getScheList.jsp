<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
{
	"list": [
		<c:forEach var="tmp" items="${list}" varStatus="status">
			{
				"uid": ${tmp.uid},
				"hullnum": "${tmp.hullnum}",
				"shiptype": "${tmp.shiptype}",
				"desc": "${tmp.description}",
				"pic": "${tmp.owner}",
				"ownerName": "${tmp.ownerName}",
				"department": "${tmp.department}",
				"sdate": "${tmp.sdate}",
				"edate": "${tmp.edate}",
				"status": "${tmp.status}",
				"isOff": "${tmp.isOff}",
				"trialStatus": "${tmp.trialStatus}",
				"regOwner": "${tmp.regOwner}",
				"schedtype": "${tmp.schedtype}",
				"revnum": "${tmp.revnum}",
				"trialKey": "${tmp.trialKey}",
				"projSeq": "${tmp.projSeq}",
				"insertName": "${tmp.insertName}",
				"insertdate": "${tmp.insertdate}"
			}
			<c:if test="${!status.last}">,</c:if>
		</c:forEach>
	],
	"listCnt": ${listCnt}
}