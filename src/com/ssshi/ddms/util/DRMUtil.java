package com.ssshi.ddms.util;

import java.io.File;
import java.util.Date;

import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import com.fasoo.adk.packager.*;

@Component
public class DRMUtil {
	private static String cpidfsn;	// 라이선스 명
	private static String confPath;	// conf 파일 경로
	private static String tmpPath;	// 복호화 대상 파일 경로
	private static String decPath;	// 복호화 완료 파일 경로
	
	public void setCpidfsn(String cpidfsn) { DRMUtil.cpidfsn = cpidfsn; }
	public void setConfPath(String confPath) { DRMUtil.confPath = confPath; }
	public void setTmpPath(String tmpPath) { DRMUtil.tmpPath = tmpPath; }
	public void setDecPath(String decPath) { DRMUtil.decPath = decPath; }
	
	/**
	 * 엑셀 파일 디코딩 하여 저장 후 경로 반환(오류 시ERROR: 시작하는 메시지 반환)
	 * @return
	 */
	public static String getDecodingExcel(MultipartFile file) {
		
		/*    각각의 오류 메시지 설명
		20  : 파일을 찾을 수 없습니다. 	
		21  : 파일 사이즈가 0 입니다.	
		22  : 파일을 읽을 수 없습니다.			
		26  : FSD Type의 암호화 파일입니다.	
		29  : 암호화 파일이 아닌 일반파일입니다.
		101 : MarkAny Type의 암호화 파일입니다.	
		103 : FSN Type의 암호화 파일입니다.	
		104 : INCAPS(삼성 PC DRM) Type의 암호화 파일입니다.	
		105 : Wrapsody Type의 암호화 파일입니다.	
		106 : FSN NX Type의 암호화 파일입니다.
		*/
		
		boolean bret = true;
		int retVal = 0;
		
		String fileName = new Date().getTime() + ".xlsx";
		String encFilePath = tmpPath+ fileName;
		String decFilePath = decPath+ fileName;
		
		// 업로드된 파일 임시 폴더에 저장
		try {
			file.transferTo(new File(encFilePath));
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		
		// WorkPackager 객체 생성
		WorkPackager objWorkPackager = new WorkPackager();
		
		//False의 경우, 복호화 된 문서가 암호화된 문서를 덮어쓰지 않음
		objWorkPackager.setOverWriteFlag(false);
		
		// GetFileType 함수를 통해 암호화 할 문서의 확장자를 구함
		retVal = objWorkPackager.GetFileType(encFilePath);
		
		// 103번이 아닌경우FSN 타입이 아닌경우에 아래와 같이 에러 메시지 출력
		if (retVal != 103) {
			System.out.println("GetFileType Failed : ["+ retVal + "]");
			System.out.println("Not Found Encoding Document.");
			
			decFilePath = "ERROR: GetFileType Failed : ["+ retVal + "]";
		}
		//FSN 타입 문서일 경우
		else if (retVal == 103) {
			bret = objWorkPackager.DoExtract(
						confPath,		// conf 파일의 경로
						cpidfsn,
						encFilePath,		// 복호화할 문서의 경로와 파일명
						decFilePath		// 복호화 된 문서의 경로와 파일명
					);
			
			if (!bret) {   //복호화 실패 시  boolean false , 에러 메시지 출력
				System.out.println("@@@ Decoding Failed : ["+ objWorkPackager.getLastErrorNum()+"] "+objWorkPackager.getLastErrorStr());
				
				decFilePath = "ERROR: Failed : ["+ objWorkPackager.getLastErrorNum()+"] "+objWorkPackager.getLastErrorStr();
			}
			else{ // 복호화 성공 시 boolean true, 생성 문서의 경로 출력
				System.out.println("@@@ Decoding Success : "+objWorkPackager.getContainerFilePathName());
			}
		}
		
		return decFilePath;
	}
}
