package kopo.sideproject.service.impl;

import kopo.sideproject.dto.UserInfoDTO;
import kopo.sideproject.repository.UserInfoRepository;
import kopo.sideproject.repository.entity.UserInfoEntity;
import kopo.sideproject.service.IUserInfoService;
import kopo.sideproject.util.CmmUtil;
import kopo.sideproject.util.DateUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Slf4j
@RequiredArgsConstructor
@Service
public class UserInfoService implements IUserInfoService {

    private final UserInfoRepository userInfoRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public UserInfoDTO getEmailExists(UserInfoDTO pDTO) throws Exception {
        log.info("{}.getEmailExists() start!",this.getClass().getName());

        log.info("pDTO : {}", pDTO);

        String email = CmmUtil.nvl(pDTO.email());

        boolean exists = userInfoRepository.findByEmail(email).isPresent();

        UserInfoDTO rDTO = UserInfoDTO.builder()
                .existsYn(exists ? "Y" : "N")
                .build();

        log.info("{}.getUserIdExists End!", this.getClass().getName());
        return rDTO;
    }

    @Override
    public int signup(UserInfoDTO pDTO) throws Exception {
        log.info("{}.insertUserInfo() start!",this.getClass().getName());

        log.info("pDTO : {}", pDTO);

        // 회원가입 성공 : 1, 아이디 중복으로 인한 가입 취소 : 2, 기타 에러 발생 : 0
        int res;




        Optional<UserInfoEntity> user =  userInfoRepository.findByEmail(pDTO.email());

        if (user.isPresent()) {
            res = 2;
            log.info("Email already exists!");
        } else {

            UserInfoEntity userEntity = UserInfoEntity.builder()
                    .email(pDTO.email())
                    .password(passwordEncoder.encode(pDTO.password())) // BCrypt로 비밀번호 암호화
                    .nickname(pDTO.nickname())
                    .regDt(DateUtil.getDateTime("yyyy-MM-dd hh:mm:ss"))
                    .build();

            userInfoRepository.save(userEntity);

            user = userInfoRepository.findByEmail(pDTO.email());

            if (user.isPresent()) {
                res = 1;
                log.info("User signup successfully for email: {}", pDTO.email());
            } else {
                res = 0;
                log.info("User signup failed for email: {}", pDTO.email());
            }
        }

        log.info("{}.insertUserInfo() End!", this.getClass().getName());

        return res;
    }

    @Override
    public UserInfoDTO getUserLogin(UserInfoDTO pDTO) throws Exception {
        log.info("{}.getUserLogin() start!",this.getClass().getName());

        String email = pDTO.email();
        String password = pDTO.password();

        log.info("email : {}",  email);

        Optional<UserInfoEntity> user =  userInfoRepository.findByEmail(email);

        if (user.isPresent()) {
            UserInfoEntity entity = user.get();
            String dbPassword = entity.getPassword();

            // .matches()가 입력된 비밀번호와 DB의 암호화된 비밀번호를 비교
            if (passwordEncoder.matches(password, dbPassword)) {
                log.info("Login successful for email: {}", email);
                // 성공 시, 사용자 정보를 DTO에 담아 반환
                return UserInfoDTO.builder()
                        .email(entity.getEmail())
                        .nickname(entity.getNickname())
                        .build();
            } else {
                log.warn("password mismath for email: {}", email);
            }
        } else {
            log.warn("user not found for email: {}", email);
        }

        log.info("{}.getUserLogin End!", this.getClass().getName());

        return null;
    }

    @Override
    public UserInfoDTO getUserInfo(String email) throws Exception {
        log.info("{}.getUserInfo() start!",this.getClass().getName());
        log.info("email : {}", email);

        UserInfoEntity userInfoEntity = userInfoRepository.findByEmail(email).orElse(null);

        if (userInfoEntity != null) {
            return UserInfoDTO.builder()
                    .email(userInfoEntity.getEmail())
                    .nickname(userInfoEntity.getNickname())
                    .build();
        }

        return null;
    }
}
