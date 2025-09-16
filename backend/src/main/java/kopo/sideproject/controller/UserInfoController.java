package kopo.sideproject.controller;

import kopo.sideproject.dto.MsgDTO;
import kopo.sideproject.dto.UserInfoDTO;
import kopo.sideproject.service.impl.UserInfoService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RequestMapping(value = "/api/user")
@RequiredArgsConstructor
@RestController
public class UserInfoController {

    private final UserInfoService userInfoService;

    /**
     * 이메일 중복 체크
     *
     * @param email 중복 체크할 이메일
     * @return 중복 여부 dto
     * @throws Exception
     */
    @GetMapping(value = "/exists/{email}")
    public ResponseEntity<UserInfoDTO> getUserExists(@PathVariable("email") String email) throws Exception {
        log.info("{}.getUserExists Start!", this.getClass().getName());
        log.info("email: {}", email);

        // Builder 통한 값 저장
        UserInfoDTO pDTO = UserInfoDTO.builder().email(email).build();

        // 회원아이디를 통해 중복된 아이디인지 조회
        UserInfoDTO rDTO = userInfoService.getEmailExists(pDTO);

        log.info("{}.getUserExists End!", this.getClass().getName());

        return ResponseEntity.ok(rDTO);
    }

    /**
     * 회원가입 API
     *
     * @param pDTO
     * @return
     * @throws Exception
     */

    @ResponseBody
    @PostMapping(value = "signup")
    public ResponseEntity<MsgDTO> signup(@RequestBody UserInfoDTO pDTO) throws Exception {

        log.info("{}.signup Start!", this.getClass().getName());
        log.info("pDTO: {}", pDTO);


        String msg; // 회원가입 결과에 대한 메세지를 전달할 변수
        int res = userInfoService.signup(pDTO);
        log.info("Signup result: {}", res);


        log.info("{}.signup End!", this.getClass().getName());

        if (res == 1) {
            MsgDTO dto = MsgDTO.builder().result(res).msg("회원가입되었습니다").build();
            return ResponseEntity.status(HttpStatus.CREATED).body(dto);
        } else if (res == 2) {
            MsgDTO dto = MsgDTO.builder().result(res).msg("이미 가입된 이메일입니다.").build();
            return ResponseEntity.status(HttpStatus.CONFLICT).body(dto);
        } else {
            MsgDTO dto = MsgDTO.builder().result(res).msg("오류로 인해 회원가입이 실패하였습니다.").build();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(dto);
        }


    }

    @PostMapping(value = "/login")
    public ResponseEntity<MsgDTO> login(@RequestBody UserInfoDTO pDTO) throws Exception {
        log.info("{}.loginProc Start!", this.getClass().getName());
        log.info("pDTO: {}", pDTO);
        String msg;

        int res = userInfoService.getUserLogin(pDTO);
        log.info("Login result: {}", res);


        log.info("{}.loginProc End!", this.getClass().getName());

        if (res == 1) {
            MsgDTO dto = MsgDTO.builder().result(res).msg("로그인 성공").build();
            return ResponseEntity.ok(dto);
        } else {
            MsgDTO dto = MsgDTO.builder().result(res).msg("이메일 또는 비밀번호가 일치하지 않습니다.").build();
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(dto);
        }
    }
}
