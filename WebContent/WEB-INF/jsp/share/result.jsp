<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
{
    "result": ${result}<c:if test="${msg != null}">,
    "msg": "${msg}"</c:if><c:if test="${successCount != null}">,
    "successCount": ${successCount}</c:if><c:if test="${failCount != null}">,
    "failCount": ${failCount}</c:if>
}