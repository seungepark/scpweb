<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
{
	"bean": {
		"title": "${bean.title}",
		"desc": "${bean.description}",
		"shipType": "${bean.shipType}",
		"projEvent": "${bean.projEvent}",
		"workTime": "${bean.workTime}",
		"lngTotal": "${bean.lngTotal}",
		"ln2Total": "${bean.ln2Total}",
		"margin": "${bean.margin}",
		"marginCur": "${bean.marginCurrency}",
		"revenue": "${bean.revenue}",
		"revenueCur": "${bean.revenueCurrency}",
		"cost": "${bean.cost}",
		"costCur": "${bean.costCurrency}",
		"exRate": "${bean.exRate}"
	},
	"list": [
		<c:forEach var="tmp" items="${list}" varStatus="status">
			{
				"uid": "${tmp.uid}",
				"seq": "${tmp.seq}",
				"desc": "${tmp.description}",
				"color": "${tmp.color}",
				"isOption": "${tmp.isOption}",
				"option": "${tmp.optionData}",
				"workTime": "${tmp.workTime}",
				"lng": "${tmp.lng}",
				"ln2": "${tmp.ln2}"
			}
			<c:if test="${!status.last}">,</c:if>
		</c:forEach>
	]
}