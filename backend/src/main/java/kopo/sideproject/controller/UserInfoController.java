package kopo.sideproject.controller;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import kopo.sideproject.dto.MsgDTO;
import kopo.sideproject.dto.UserInfoDTO;
import kopo.sideproject.service.impl.UserInfoService;
import kopo.sideproject.util.CmmUtil;
import kopo.sideproject.util.EncryptUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.Optional;

@Slf4j
@RequestMapping(value = "/user")
@RequiredArgsConstructor
@Controller
public class UserInfoController {

    private final UserInfoService userInfoService;

    /**
     * 회원가입 화면으로 이동
     * @return
     */
    @GetMapping(value = "userRegForm")
    public String userRegForm() {
        log.info("{}.user/userRegForm Start!", this.getClass().getName());

        log.info("{}.user/userRegForm End!", this.getClass().getName());

        return "user/userRegForm";
    }

    /**
     * 회원 가입 전 아이디 중복체크하기(Ajax를 통해 입력한 아이디 정보 받음)
     * @param request
     * @return
     * @throws Exception
     */
    @ResponseBody
    @PostMapping(value = "getUserEmailExists")
    public UserInfoDTO getUserExists(HttpServletRequest request) throws Exception {
        log.info("{}.getUserExists Start!", this.getClass().getName());

        String email = CmmUtil.nvl(request.getParameter("email")); // 회원 이메일

        log.info("email: {}", email);

        // Builder 통한 값 저장
        UserInfoDTO pDTO = UserInfoDTO.builder().email(email).build();

        // 회원아이디를 통해 중복된 아이디인지 조회
        UserInfoDTO rDTO = Optional.ofNullable(userInfoService.getEmailExists(pDTO))
                .orElseGet(() -> UserInfoDTO.builder().build());

        log.info("{}.getUserExists End!", this.getClass().getName());

        return rDTO;
    }

    /**
     *  회원가입 로직 처리
     * @param request
     * @return
     * @throws Exception
     */

    @ResponseBody
    @PostMapping(value = "insertUserInfo")
    public MsgDTO insertUserInfo(HttpServletRequest request) throws Exception {

        log.info("{}.insertUserInfo Start!", this.getClass().getName());

        String msg; // 회원가입 결과에 대한 메세지를 전달할 변수

        String email = CmmUtil.nvl(request.getParameter("email")); // 이메일
        String password = CmmUtil.nvl(request.getParameter("password")); // 비밀번호

        log.info("email: {}", "password: {}", email, password);

        UserInfoDTO pDTO = UserInfoDTO.builder().email(EncryptUtil.encAES128CBC(email)).password(EncryptUtil.encHashSHA256(password)).build();

        int res = userInfoService.signup(pDTO);

        log.info("회원가입 결과(res) : {}", res);

        if (res == 1) {
            msg = "회원가입되었습니다.";
        } else if (res == 2) {
            msg = "이미 가입된 아이디입니다.";
        } else {
            msg = "오류로 인해 회원가입이 실패하였습니다.";
        }

        MsgDTO dto = MsgDTO.builder().result(res).msg(msg).build();

        log.info("{}.insertUserInfo End!", this.getClass().getName());

        return dto;

    }

    /**
     * 로그인을 위한 입력 화면으로 이동
     * @return
     */
    @GetMapping(value = "login")
    public String login() {
        log.info("{}.login Start!", this.getClass().getName());

        log.info("{}.login End!", this.getClass().getName());

        return "user/login";
    }

    @ResponseBody
    @PostMapping(value = "loginProc")
    public MsgDTO loginProc(HttpServletRequest request, HttpSession session) throws Exception {
        log.info("{}.loginProc Start!", this.getClass().getName());

        String msg;

        String email = CmmUtil.nvl(request.getParameter("email"));
        String password = CmmUtil.nvl(request.getParameter("password"));

        log.info("email: {}", "password: {}", email, password);

        UserInfoDTO pDTO = UserInfoDTO.builder()
                        .email(EncryptUtil.encAES128CBC(email))
                .password(EncryptUtil.encHashSHA256(password)).build();

        int res = userInfoService.getUserLogin(pDTO);

        log.info("res: {}", res);

        if (res == 1) {
            msg = "로그인이 성공했습니다.";
            session.setAttribute("SS_USER_EMAIL", email);
        } else {
            msg = "아이디와 비밀번호가 올바르지 않습니다.";
        }

        MsgDTO dto = MsgDTO.builder().result(res).msg(msg).build();
        log.info("{}.loginProc End!", this.getClass().getName());

        return dto;

    }

    @GetMapping(value = "loginSuccess")
    public String loginSuccess() {
        log.info("{}.loginSuccess Start!", this.getClass().getName());

        log.info("{}.loginSuccess End!", this.getClass().getName());

        return "user/loginSuccess";
    }

    @ResponseBody
    @PostMapping(value = "logout")
    public MsgDTO logout(HttpSession session) throws Exception {

        log.info("{}.logout Start!", this.getClass().getName());

        session.setAttribute("SS_USER_EMAIL", "");
        session.removeAttribute("SS_USER_EMAIL");

        MsgDTO dto = MsgDTO.builder().result(1).msg("로그아웃하였습니다.").build();

        log.info("{}.logout End!", this.getClass().getName());

        return dto;

    }


}
