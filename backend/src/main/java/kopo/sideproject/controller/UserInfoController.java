package kopo.sideproject.controller;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import kopo.sideproject.dto.MsgDTO;
import kopo.sideproject.dto.UserInfoDTO;
import kopo.sideproject.service.impl.UserInfoService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.context.HttpSessionSecurityContextRepository;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;

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
    public ResponseEntity<UserInfoDTO> login(@RequestBody UserInfoDTO pDTO, HttpServletRequest request) throws Exception {
        log.info("{}.loginProc Start!", this.getClass().getName());
        log.info("pDTO: {}", pDTO);


        UserInfoDTO rDTO = userInfoService.getUserLogin(pDTO);
        log.info("Login result: {}", rDTO);


        log.info("{}.loginProc End!", this.getClass().getName());

        if (rDTO != null) {

            // 세션이 없으면 새로 생성
            HttpSession session = request.getSession(true);

            // Spring Security가 인식할 Authentication 객체 생성
            Authentication authentication = new UsernamePasswordAuthenticationToken(
                    rDTO.email(), // principal (사용자 식별 정보, 여기서는 이메일)
                    null, // crendentials (비밀번호, 인증 후에는 불필요)
                    Collections.singletonList(new SimpleGrantedAuthority("ROLE_USER"))
            ); // authorities

            // SecurityContext를 가져와 Authentication 객체 설정
            SecurityContext securityContext = SecurityContextHolder.getContext();
            securityContext.setAuthentication(authentication);

            // 세션에 SecurityContext를 저장
            session.setAttribute(HttpSessionSecurityContextRepository.SPRING_SECURITY_CONTEXT_KEY, securityContext);

            return ResponseEntity.ok(rDTO);
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
        }
    }

    @GetMapping("/{userId}")
    public ResponseEntity<UserInfoDTO> getUserInfo(@PathVariable("userId") Long userId) throws Exception {
        log.info("{}.getUserInfo Start!", this.getClass().getName());
        log.info("userId: {}", userId);

        UserInfoDTO rDTO = userInfoService.getUserInfoById(userId);

        if (rDTO != null) {
            return ResponseEntity.ok(rDTO);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }

    }
}
