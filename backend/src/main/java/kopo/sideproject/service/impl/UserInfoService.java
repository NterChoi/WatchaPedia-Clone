package kopo.sideproject.service.impl;

import kopo.sideproject.dto.UserInfoDTO;
import kopo.sideproject.repository.UserInfoRepository;
import kopo.sideproject.repository.entity.UserInfoEntity;
import kopo.sideproject.service.IUserInfoService;
import kopo.sideproject.util.CmmUtil;
import kopo.sideproject.util.DateUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Slf4j
@RequiredArgsConstructor
@Service
public class UserInfoService implements IUserInfoService {

    private final UserInfoRepository userInfoRepository;

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
        log.info("{}.signup() start!",this.getClass().getName());

        log.info("pDTO : {}", pDTO);

        // 회원가입 성공 : 1, 아이디 중복으로 인한 가입 취소 : 2, 기타 에러 발생 : 0
        int res;

        String email = CmmUtil.nvl(pDTO.email());
        String password = CmmUtil.nvl(pDTO.password());

        Optional<UserInfoEntity> user =  userInfoRepository.findByEmail(email);

        if (user.isPresent()) {
            res = 2;
        } else {

            UserInfoEntity userEntity = UserInfoEntity.builder()
                    .email(email)
                    .password(password)
                    .regDt(DateUtil.getDateTime("yyyy-MM-dd hh:mm:ss"))
                    .build();

            userInfoRepository.save(userEntity);

            res = userInfoRepository.findByEmail(email).isPresent() ? 1 : 0;
        }
        log.info("{}.signup() End!", this.getClass().getName());

        return res;
    }

    @Override
    public int getUserLogin(UserInfoDTO pDTO) throws Exception {
        log.info("{}.getUserLogin() start!",this.getClass().getName());

        String email = CmmUtil.nvl(pDTO.email());
        String password = CmmUtil.nvl(pDTO.password());

        log.info("email : {}, password : {}",  email, password);

        boolean exists = userInfoRepository.findByEmailAndPassword(email, password).isPresent();

        log.info("{}.getUserLogin End!", this.getClass().getName());

        return exists ? 1 : 0;
    }
}
