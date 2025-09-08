<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
{
	"list": [
		<c:forEach var="tmp" items="${list}" varStatus="status">
			{
				"uid": ${tmp.uid},
				"shipNum": "${tmp.shipNum}",
				"regOwner": "${tmp.regOwner}",
				"shipClass": "${tmp.shipClass}",
				"shipType": "${tmp.shipType}",
				"typeModel": "${tmp.typeModel}",
				"dock": "${tmp.dock}",
				"loc": "${tmp.loc}",
				"isSg": "${tmp.isSg}",
				"isLoad": "${tmp.isLoad}",
				"isUnload": "${tmp.isUnload}",
				"isCold": "${tmp.isCold}",
				"isTrial": "${tmp.isTrial}",
				"fuel": "${tmp.fuel}",
				"lc": "${tmp.lc}",
				"workFinish": "${tmp.workFinish}",
				"crew1Pro": "${tmp.crew1Pro}",
				"crew1Lead": "${tmp.crew1Lead}",
				"crew2Pro": "${tmp.crew2Pro}",
				"crew2Lead": "${tmp.crew2Lead}",
				"crew3Pro": "${tmp.crew3Pro}",
				"crew3Lead": "${tmp.crew3Lead}",
				"comMain": "${tmp.comMain}",
				"comSub": "${tmp.comSub}",
				"operate": "${tmp.operate}",
				"projSeq": "${tmp.projSeq}"
			}
			<c:if test="${!status.last}">,</c:if>
		</c:forEach>
	],
	"listCnt": ${listCnt}
}