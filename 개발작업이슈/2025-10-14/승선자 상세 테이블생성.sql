-- scp.schecrewdetailinfo definition

CREATE TABLE `schecrewdetailinfo` (
  `UID` bigint(20) NOT NULL COMMENT 'UID(schecrew PK)',
  `SCHEDULERINFOUID` bigint(20) NOT NULL COMMENT '스케쥴UID',
  `ROLE1` varchar(20) DEFAULT NULL COMMENT '역할1',
  `ROLE2` varchar(20) DEFAULT NULL COMMENT '역할2',
  `TERMINAL` varchar(1) DEFAULT NULL COMMENT '터미널(Y/N)',
  `NOTEBOOK` varchar(1) DEFAULT NULL COMMENT '노트북(Y/N)',
  `MODEL_NAME` varchar(50) DEFAULT NULL COMMENT '노트북모델명',
  `SERIAL_NUMBER` varchar(50) DEFAULT NULL COMMENT '노트북시리얼번호',
  `ORDER_STATUS` varchar(1) DEFAULT NULL COMMENT '발주여부(Y/N)',
  `ORDER_DATE` datetime DEFAULT NULL COMMENT '발주일자(인가 확정)',
  `ORDER_UID` varchar(255) DEFAULT NULL COMMENT '발주자',
  `DELETE_YN` varchar(1) DEFAULT NULL COMMENT '삭제여부(Y/N)',
  `DELETE_DATE` datetime DEFAULT NULL COMMENT '삭제일자',
  `DELETE_UID` varchar(255) DEFAULT NULL COMMENT '삭제자',
  `QR_YN` varchar(1) DEFAULT NULL COMMENT 'QR발송여부(Y/N)',
  `REG_DATE` datetime DEFAULT NULL COMMENT '등록일자',
  PRIMARY KEY (`UID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='승선자상세정보';