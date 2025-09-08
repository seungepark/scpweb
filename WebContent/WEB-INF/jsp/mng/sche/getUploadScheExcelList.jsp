<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
{
    "list": [
        <c:forEach var="tmp" items="${list}" varStatus="status">
            {
                "uid": ${tmp.uid},
                "seq": ${tmp.seq},
                "category": "${tmp.category}",
                "position": "${tmp.position}",
                "company": "${tmp.company}",
                "departure": "${tmp.departure}",
                "name": "${tmp.name}",
                "rank": "${tmp.rank}",
                "comNum": "${tmp.comNum}",
                "workType": "${tmp.workType}",
                "ssNum": "${tmp.ssNum}",
                "tel": "${tmp.tel}",
                "detail": [
                    <c:forEach var="tmp2" items="${tmp.schedulerCrewDetailList}" varStatus="status2">
                        {
                            "barkingCode": "${tmp2.barkingCode}",
                            "barkingDate": "${tmp2.barkingDate}"
                        }
                        <c:if test="${!status2.last}">,</c:if>
                    </c:forEach>
                ]
            }
            <c:if test="${!status.last}">,</c:if>
        </c:forEach>
    ]
}