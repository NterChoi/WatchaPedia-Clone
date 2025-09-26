package kopo.sideproject.service;

import kopo.sideproject.dto.UserInfoDTO;

public interface IUserInfoService {
    /**
     * 이메일 중복 체크
     * @param pDTO 회원가입을 위한 이메일
     * @return 아이디 중복 여부 결과
     */
    UserInfoDTO getEmailExists(UserInfoDTO pDTO) throws Exception;

    /**
     *  회원 가입하기(비밀번호 암호화 로직 포함)
     *
     * @param pDTO 회원 가입을 위한 회원 정보
     * @return 회원가입 결과 (성공 : 1, 이메일 중복: 2, 실패: 0)
     */
    int signup(UserInfoDTO pDTO) throws Exception;

    /**
     *  로그인을 위해 아이디와 비밀번호가 일치하는지 확인하기
     * @param pDTO 로그인을 위한 회원정보
     * @return  로그인에 성공한 회원 정보 (실패 시 null)
     */
    UserInfoDTO getUserLogin(UserInfoDTO pDTO) throws Exception;

    UserInfoDTO getUserInfo(String email) throws Exception;

    UserInfoDTO getUserInfoById(Long id) throws Exception;
}
